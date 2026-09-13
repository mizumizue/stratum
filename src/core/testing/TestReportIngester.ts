import fs from 'node:fs';
import path from 'node:path';
import {
  TestExecutionStatus,
  TestCaseExecutionReport,
  TestResultsReport,
} from '../models/types.js';

export type SupportedReportFormat = 'auto' | 'junit' | 'tap' | 'go' | 'generic';

export interface IngestOptions {
  format?: SupportedReportFormat;
  mergeWithExisting?: boolean;
  existingReportPath?: string;
  outputPath?: string;
  targetTestCases?: string[]; // Optional filter or known list of TC IDs
}

export interface IngestResult {
  report: TestResultsReport;
  parsedCount: number;
  detectedFormat: SupportedReportFormat;
  outputPath?: string;
}

/**
 * TestReportIngester
 * 
 * 外部依存ゼロの多言語テストレポート解析・インジェストエンジン。
 * Python (pytest), Go (go test), Rust (cargo test), Java (JUnit), C/C++ 等の
 * 多様なテストランナーが出力するレポート（JUnit XML, TAP, Go JSON, 汎用JSON）を解析し、
 * Stratum 互換の客観的テスト結果レポート（reports/test-results.json）を生成・更新する。
 */
export class TestReportIngester {
  /**
   * テスト結果ファイルまたは生の文字列を解析して TestResultsReport を生成する
   */
  public static ingest(
    contentOrPath: string,
    options: IngestOptions = {}
  ): IngestResult {
    let rawContent = contentOrPath;
    let filePath: string | undefined;

    // ファイルパスか直接のコンテンツかを判別
    if (fs.existsSync(contentOrPath) && fs.statSync(contentOrPath).isFile()) {
      filePath = path.resolve(contentOrPath);
      rawContent = fs.readFileSync(filePath, 'utf-8');
    }

    const format = options.format && options.format !== 'auto'
      ? options.format
      : this.detectFormat(rawContent);

    let parsedResults: Record<string, TestCaseExecutionReport> = {};

    switch (format) {
      case 'junit':
        parsedResults = this.parseJUnitXml(rawContent);
        break;
      case 'tap':
        parsedResults = this.parseTap(rawContent);
        break;
      case 'go':
        parsedResults = this.parseGoTestJson(rawContent);
        break;
      case 'generic':
      default:
        parsedResults = this.parseGenericJson(rawContent);
        break;
    }

    const executedAt = new Date().toISOString();
    let finalResults: Record<string, TestCaseExecutionReport> = { ...parsedResults };

    // 既存レポートとのマージ処理
    if (options.mergeWithExisting) {
      const existingPath = options.existingReportPath || 'reports/test-results.json';
      if (fs.existsSync(existingPath)) {
        try {
          const existingRaw = fs.readFileSync(existingPath, 'utf-8');
          const existing = JSON.parse(existingRaw) as TestResultsReport;
          if (existing && existing.results) {
            finalResults = {
              ...existing.results,
              ...parsedResults,
            };
          }
        } catch {
          // ignore existing read error
        }
      }
    }

    const testCaseList = Object.values(finalResults);
    const passedCount = testCaseList.filter(t => t.status === 'passed').length;
    const failedCount = testCaseList.filter(t => t.status === 'failed').length;
    const skippedCount = testCaseList.filter(t => t.status === 'skipped').length;

    const report: TestResultsReport = {
      generatedAt: executedAt,
      totalTests: testCaseList.length,
      passedCount,
      failedCount,
      skippedCount,
      results: finalResults,
    };

    if (options.outputPath) {
      const dir = path.dirname(options.outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(options.outputPath, JSON.stringify(report, null, 2), 'utf-8');
    }

    return {
      report,
      parsedCount: Object.keys(parsedResults).length,
      detectedFormat: format,
      outputPath: options.outputPath,
    };
  }

  /**
   * テキスト内容からフォーマットを自動検出
   */
  public static detectFormat(content: string): SupportedReportFormat {
    const trimmed = content.trim();

    // 1. XML Check (JUnit XML)
    if (trimmed.startsWith('<?xml') || trimmed.includes('<testsuites') || trimmed.includes('<testsuite')) {
      return 'junit';
    }

    // 2. TAP Check (TAP version 13, 14, or ok/not ok patterns)
    if (
      trimmed.startsWith('TAP version') ||
      /^1\.\.\d+/m.test(trimmed) ||
      (/^(?:ok|not ok)\s+\d+/m.test(trimmed) && !trimmed.startsWith('{'))
    ) {
      return 'tap';
    }

    // 3. Go Test JSON Check (stream of JSON objects with {"Action":...)
    if (/^{\s*"Time"\s*:\s*".*?",\s*"Action"\s*:\s*"/m.test(trimmed) || /^{\s*"Action"\s*:\s*"/m.test(trimmed)) {
      return 'go';
    }

    // 4. Default to Generic JSON
    return 'generic';
  }

  /**
   * JUnit XML パーサー（外部依存なし）
   * Python (pytest --junitxml), Java (Surefire/Gradle), Go (go-junit-report), Rust 等
   */
  public static parseJUnitXml(xml: string): Record<string, TestCaseExecutionReport> {
    const results: Record<string, TestCaseExecutionReport> = {};
    const executedAt = new Date().toISOString();

    // <testcase ...> ... </testcase> または <testcase ... /> にマッチ
    const testcaseRegex = /<testcase\b([^>]*?)(?:\/>|>(.*?)<\/testcase>)/gs;
    let match: RegExpExecArray | null;

    while ((match = testcaseRegex.exec(xml)) !== null) {
      const attrsStr = match[1];
      const body = match[2] || '';

      const nameMatch = attrsStr.match(/\bname=["']([^"']+)["']/);
      const classnameMatch = attrsStr.match(/\bclassname=["']([^"']+)["']/);
      const timeMatch = attrsStr.match(/\btime=["']([^"']+)["']/);

      const name = nameMatch ? nameMatch[1] : '';
      const classname = classnameMatch ? classnameMatch[1] : '';
      const seconds = timeMatch ? parseFloat(timeMatch[1]) : 0;
      const durationMs = Math.round((isNaN(seconds) ? 0 : seconds) * 1000 * 100) / 100;

      const fullTitle = classname ? `${classname}: ${name}` : name;
      const tcId = this.extractTestCaseId(fullTitle) || this.extractTestCaseId(body);

      if (!tcId) continue;

      let status: TestExecutionStatus = 'passed';
      let errorMessage: string | undefined;

      if (/<failure\b|<error\b/i.test(body)) {
        status = 'failed';
        const msgMatch = body.match(/message=["']([^"']+)["']/i) || body.match(/<(?:failure|error)[^>]*>([\s\S]*?)<\/(?:failure|error)>/i);
        errorMessage = msgMatch ? msgMatch[1].trim() : 'Test failed according to JUnit XML';
      } else if (/<skipped\b/i.test(body)) {
        status = 'skipped';
        const msgMatch = body.match(/message=["']([^"']+)["']/i);
        errorMessage = msgMatch ? msgMatch[1].trim() : 'Test skipped';
      }

      results[tcId] = {
        testCaseId: tcId,
        status,
        durationMs,
        testTitle: fullTitle,
        errorMessage,
        outputLog: body.trim() || undefined,
        executedAt,
      };
    }

    return results;
  }

  /**
   * TAP (Test Anything Protocol) パーサー
   * Node.js, Perl, Python (pytest-tap), C (libtap) 等
   */
  public static parseTap(tap: string): Record<string, TestCaseExecutionReport> {
    const results: Record<string, TestCaseExecutionReport> = {};
    const executedAt = new Date().toISOString();
    const lines = tap.split(/\r?\n/);

    let currentTcId: string | null = null;
    let currentLogLines: string[] = [];
    let currentDuration = 0;
    let currentStatus: TestExecutionStatus = 'passed';
    let currentTitle = '';
    let currentError: string | undefined;

    const finalizeCurrent = () => {
      if (currentTcId) {
        results[currentTcId] = {
          testCaseId: currentTcId,
          status: currentStatus,
          durationMs: currentDuration,
          testTitle: currentTitle || currentTcId,
          errorMessage: currentStatus === 'failed' ? (currentError || 'Test assertion failed') : undefined,
          outputLog: currentLogLines.join('\n'),
          executedAt,
        };
      }
      currentTcId = null;
      currentLogLines = [];
      currentDuration = 0;
      currentStatus = 'passed';
      currentTitle = '';
      currentError = undefined;
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (line.startsWith('# Subtest:') || line.startsWith('ok ') || line.startsWith('not ok ')) {
        const isResultLine = line.startsWith('ok ') || line.startsWith('not ok ');

        if (isResultLine) {
          const isOk = line.startsWith('ok ');
          const isSkipped = line.includes('# SKIP') || line.includes('# TODO');
          const title = line.replace(/^(?:ok|not ok)\s+\d+\s*-?\s*/, '').trim();

          const tcId = this.extractTestCaseId(title);
          if (tcId) {
            finalizeCurrent();
            currentTcId = tcId;
            currentTitle = title;
            currentStatus = isSkipped ? 'skipped' : isOk ? 'passed' : 'failed';
            currentLogLines = [line];
            continue;
          }
        }
      }

      if (currentTcId) {
        currentLogLines.push(line);
        if (line.startsWith('duration_ms:')) {
          const d = parseFloat(line.replace('duration_ms:', '').trim());
          if (!isNaN(d)) currentDuration = d;
        } else if (line.startsWith('error:')) {
          currentError = line.replace('error:', '').trim();
        }
      }
    }

    finalizeCurrent();
    return results;
  }

  /**
   * Go Test JSON パーサー (`go test -json ./...`)
   */
  public static parseGoTestJson(jsonStream: string): Record<string, TestCaseExecutionReport> {
    const results: Record<string, TestCaseExecutionReport> = {};
    const executedAt = new Date().toISOString();
    const lines = jsonStream.split(/\r?\n/);

    const testLogs: Record<string, string[]> = {};
    const testDurations: Record<string, number> = {};
    const testStatuses: Record<string, TestExecutionStatus> = {};

    for (const line of lines) {
      if (!line.trim().startsWith('{')) continue;
      try {
        const ev = JSON.parse(line.trim());
        if (!ev.Test) continue;

        const testName = ev.Test;
        if (!testLogs[testName]) testLogs[testName] = [];

        if (ev.Output) {
          testLogs[testName].push(ev.Output.trimEnd());
        }

        if (ev.Action === 'pass') {
          testStatuses[testName] = 'passed';
          if (typeof ev.Elapsed === 'number') {
            testDurations[testName] = Math.round(ev.Elapsed * 1000 * 100) / 100;
          }
        } else if (ev.Action === 'fail') {
          testStatuses[testName] = 'failed';
          if (typeof ev.Elapsed === 'number') {
            testDurations[testName] = Math.round(ev.Elapsed * 1000 * 100) / 100;
          }
        } else if (ev.Action === 'skip') {
          testStatuses[testName] = 'skipped';
        }
      } catch {
        // ignore malformed line
      }
    }

    for (const [testName, status] of Object.entries(testStatuses)) {
      const logs = testLogs[testName] || [];
      const joinedLogs = logs.join('\n');
      const tcId = this.extractTestCaseId(testName) || this.extractTestCaseId(joinedLogs);

      if (tcId) {
        results[tcId] = {
          testCaseId: tcId,
          status,
          durationMs: testDurations[testName] || 0,
          testTitle: testName,
          errorMessage: status === 'failed' ? (logs.slice(-3).join('\n') || 'Go test failed') : undefined,
          outputLog: joinedLogs,
          executedAt,
        };
      }
    }

    return results;
  }

  /**
   * 汎用 JSON パーサー (Generic JSON / pytest-json / Stratum Report 互換)
   */
  public static parseGenericJson(rawJson: string): Record<string, TestCaseExecutionReport> {
    const results: Record<string, TestCaseExecutionReport> = {};
    const executedAt = new Date().toISOString();

    try {
      const data = JSON.parse(rawJson);

      // パターン 1: Stratum レポート形式直接 { results: { "TC-0001": { ... } } }
      if (data && data.results && typeof data.results === 'object') {
        for (const [key, val] of Object.entries(data.results)) {
          const tcId = this.extractTestCaseId(key) || (val as any)?.testCaseId;
          if (tcId && val && typeof val === 'object') {
            const item = val as any;
            results[tcId] = {
              testCaseId: tcId,
              status: item.status || 'passed',
              durationMs: Number(item.durationMs ?? item.duration_ms ?? 0),
              testTitle: item.testTitle || item.title || tcId,
              errorMessage: item.errorMessage || item.error,
              outputLog: item.outputLog || item.log,
              executedAt: item.executedAt || executedAt,
            };
          }
        }
        return results;
      }

      // パターン 2: 配列形式 [ { id / name: "TC-0001", status: "passed", duration: 10 } ]
      const list = Array.isArray(data) ? data : Array.isArray(data.tests) ? data.tests : null;
      if (list) {
        for (const item of list) {
          const title = item.name || item.title || item.testTitle || '';
          const tcId = this.extractTestCaseId(item.id || item.testCaseId || '') || this.extractTestCaseId(title);
          if (tcId) {
            const rawStatus = String(item.status || item.outcome || '').toLowerCase();
            const status: TestExecutionStatus =
              rawStatus === 'passed' || rawStatus === 'pass' || rawStatus === 'success' || rawStatus === 'ok'
                ? 'passed'
                : rawStatus === 'skipped' || rawStatus === 'skip' || rawStatus === 'ignored'
                ? 'skipped'
                : 'failed';

            results[tcId] = {
              testCaseId: tcId,
              status,
              durationMs: Number(item.durationMs ?? item.duration_ms ?? (item.duration ? item.duration * 1000 : 0)),
              testTitle: title || tcId,
              errorMessage: item.errorMessage || item.error || item.message,
              outputLog: item.outputLog || item.log || item.stdout,
              executedAt,
            };
          }
        }
      }
    } catch {
      // JSON パースエラー
    }

    return results;
  }

  /**
   * 文字列から TC-xxxx 形式の識別子を抽出する
   * (例: "TC-0001", "TC0001", "TC_0001")
   */
  public static extractTestCaseId(str: string): string | null {
    if (!str) return null;
    const match = str.match(/(TC[-_]?\d{4,})/i);
    if (!match) return null;

    const raw = match[1].toUpperCase();
    if (raw.startsWith('TC-')) return raw;
    if (raw.startsWith('TC_')) return raw.replace('TC_', 'TC-');
    if (raw.startsWith('TC')) return `TC-${raw.slice(2)}`;
    return raw;
  }
}
