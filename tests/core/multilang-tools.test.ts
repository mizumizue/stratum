import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { TestReportIngester } from '../../src/core/testing/TestReportIngester.js';
import { ProductLinter } from '../../src/application/lint-product.js';

test('TC-0032: TestReportIngester - JUnit XML を正しく解析し TestResultsReport を生成できること', () => {
  const sampleXml = `<?xml version="1.0" encoding="utf-8"?>
<testsuites>
  <testsuite name="pytest" tests="3" errors="0" failures="1" skipped="1">
    <testcase classname="tests.test_auth" name="test_login_TC_0001" time="0.045" />
    <testcase classname="tests.test_order" name="test_create_order_TC-0002" time="0.120">
      <failure message="AssertionError: 500 != 200">Traceback: assertion failed</failure>
    </testcase>
    <testcase classname="tests.test_payment" name="test_stripe_TC-0003" time="0.001">
      <skipped message="network disabled" />
    </testcase>
  </testsuite>
</testsuites>`;

  const result = TestReportIngester.ingest(sampleXml, { format: 'junit' });
  assert.equal(result.detectedFormat, 'junit');
  assert.equal(result.parsedCount, 3);
  assert.equal(result.report.totalTests, 3);
  assert.equal(result.report.passedCount, 1);
  assert.equal(result.report.failedCount, 1);
  assert.equal(result.report.skippedCount, 1);

  assert.equal(result.report.results['TC-0001']?.status, 'passed');
  assert.equal(result.report.results['TC-0001']?.durationMs, 45);

  assert.equal(result.report.results['TC-0002']?.status, 'failed');
  assert.ok(result.report.results['TC-0002']?.errorMessage?.includes('AssertionError'));

  assert.equal(result.report.results['TC-0003']?.status, 'skipped');
});

test('TestReportIngester - Go test JSON ストリームを正しく解析できること', () => {
  const sampleGoJson = `
{"Time":"2026-09-13T06:00:00Z","Action":"run","Package":"app/order","Test":"TestCreateOrder_TC_0010"}
{"Time":"2026-09-13T06:00:00.05Z","Action":"output","Package":"app/order","Test":"TestCreateOrder_TC_0010","Output":"=== RUN   TestCreateOrder_TC_0010\\n"}
{"Time":"2026-09-13T06:00:00.10Z","Action":"output","Package":"app/order","Test":"TestCreateOrder_TC_0010","Output":"--- PASS: TestCreateOrder_TC_0010 (0.05s)\\n"}
{"Time":"2026-09-13T06:00:00.10Z","Action":"pass","Package":"app/order","Test":"TestCreateOrder_TC_0010","Elapsed":0.05}
`;

  const result = TestReportIngester.ingest(sampleGoJson, { format: 'go' });
  assert.equal(result.detectedFormat, 'go');
  assert.equal(result.parsedCount, 1);
  assert.equal(result.report.results['TC-0010']?.status, 'passed');
  assert.equal(result.report.results['TC-0010']?.durationMs, 50);
});

test('TestReportIngester - 汎用 JSON レポートを正しく解析できること', () => {
  const sampleJson = JSON.stringify({
    tests: [
      { id: 'TC-0020', status: 'passed', duration: 0.03, title: 'User profile test' },
      { id: 'TC-0021', status: 'failed', duration: 0.15, title: 'Checkout test', error: 'Database timeout' }
    ]
  });

  const result = TestReportIngester.ingest(sampleJson, { format: 'generic' });
  assert.equal(result.detectedFormat, 'generic');
  assert.equal(result.parsedCount, 2);
  assert.equal(result.report.results['TC-0020']?.status, 'passed');
  assert.equal(result.report.results['TC-0021']?.status, 'failed');
  assert.equal(result.report.results['TC-0021']?.errorMessage, 'Database timeout');
});

test('TC-0033: ProductLinter - 各言語のディレクトリ構成から言語を正確に判定できること', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stratum-linter-test-'));

  try {
    // 1. Python プロジェクト
    const pyDir = path.join(tempDir, 'py-proj');
    fs.mkdirSync(pyDir, { recursive: true });
    fs.writeFileSync(path.join(pyDir, 'pyproject.toml'), '[project]\nname = "test"');
    assert.equal(ProductLinter.detectLanguage(pyDir), 'python');

    // 2. Go プロジェクト
    const goDir = path.join(tempDir, 'go-proj');
    fs.mkdirSync(goDir, { recursive: true });
    fs.writeFileSync(path.join(goDir, 'go.mod'), 'module example.com/test');
    assert.equal(ProductLinter.detectLanguage(goDir), 'go');

    // 3. Rust プロジェクト
    const rsDir = path.join(tempDir, 'rs-proj');
    fs.mkdirSync(rsDir, { recursive: true });
    fs.writeFileSync(path.join(rsDir, 'Cargo.toml'), '[package]\nname = "test"');
    assert.equal(ProductLinter.detectLanguage(rsDir), 'rust');

    // 4. C++ プロジェクト
    const cppDir = path.join(tempDir, 'cpp-proj');
    fs.mkdirSync(cppDir, { recursive: true });
    fs.writeFileSync(path.join(cppDir, 'CMakeLists.txt'), 'cmake_minimum_required(VERSION 3.10)');
    assert.equal(ProductLinter.detectLanguage(cppDir), 'cpp');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('ProductLinter - dry-run 実行時に解決されたコマンド情報を返却すること', () => {
  const res = ProductLinter.run({
    productDir: './src',
    language: 'python',
    dryRun: true,
  });

  assert.equal(res.success, true);
  assert.equal(res.language, 'python');
  assert.ok(res.stdout.includes('[DRY-RUN] Would execute:'));
});
