import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';

export type ProductLanguage =
  | 'python'
  | 'go'
  | 'rust'
  | 'typescript'
  | 'javascript'
  | 'cpp'
  | 'java'
  | 'unknown';

export interface LinterToolCandidate {
  name: string;
  command: string;
  args: string[];
  fixArgs?: string[];
  checkBinary: string;
  description: string;
}

export interface ProductLintConfig {
  language?: ProductLanguage;
  lintCommand?: string;
  typecheckCommand?: string;
  fixCommand?: string;
  excludePaths?: string[];
}

export interface LintProductOptions {
  productDir?: string;
  language?: ProductLanguage;
  fix?: boolean;
  strict?: boolean;
  dryRun?: boolean;
  configPath?: string;
}

export interface LintExecutionResult {
  success: boolean;
  language: ProductLanguage;
  command: string;
  args: string[];
  stdout: string;
  stderr: string;
  exitCode: number;
  toolsDetected: string[];
}

/**
 * ProductLinter
 * 
 * 製品コード（src/配下）に対する多言語対応のリンター・静的解析ランナー。
 * FW自身のドキュメントスキーマチェック（validate-docs.ts）とは明確に分離され、
 * Python (ruff/flake8/mypy), Go (golangci-lint/go vet), Rust (clippy/check),
 * TypeScript/JavaScript (eslint/biome/tsc), C/C++ 等のプロダクトコードの静的品質を担保する。
 */
export class ProductLinter {
  /**
   * 言語別の標準的なリンター候補定義
   */
  public static readonly LINTER_CANDIDATES: Record<ProductLanguage, LinterToolCandidate[]> = {
    python: [
      {
        name: 'ruff',
        command: 'ruff',
        args: ['check', '.'],
        fixArgs: ['check', '--fix', '.'],
        checkBinary: 'ruff',
        description: 'Ruff linter (extremely fast Python linter)',
      },
      {
        name: 'flake8',
        command: 'flake8',
        args: ['.'],
        checkBinary: 'flake8',
        description: 'Flake8 Python linter',
      },
      {
        name: 'mypy',
        command: 'mypy',
        args: ['.'],
        checkBinary: 'mypy',
        description: 'Mypy static type checker',
      },
      {
        name: 'pylint',
        command: 'pylint',
        args: ['src'],
        checkBinary: 'pylint',
        description: 'Pylint Python analyzer',
      },
    ],
    go: [
      {
        name: 'golangci-lint',
        command: 'golangci-lint',
        args: ['run', './...'],
        fixArgs: ['run', '--fix', './...'],
        checkBinary: 'golangci-lint',
        description: 'golangci-lint (fast Go linters runner)',
      },
      {
        name: 'go-vet',
        command: 'go',
        args: ['vet', './...'],
        checkBinary: 'go',
        description: 'Go vet official static analyzer',
      },
    ],
    rust: [
      {
        name: 'cargo-clippy',
        command: 'cargo',
        args: ['clippy', '--', '-D', 'warnings'],
        fixArgs: ['clippy', '--fix', '--allow-dirty', '--', '-D', 'warnings'],
        checkBinary: 'cargo',
        description: 'Rust official clippy linter',
      },
      {
        name: 'cargo-check',
        command: 'cargo',
        args: ['check'],
        checkBinary: 'cargo',
        description: 'Rust compiler check',
      },
    ],
    typescript: [
      {
        name: 'eslint',
        command: 'npx',
        args: ['eslint', '.'],
        fixArgs: ['eslint', '--fix', '.'],
        checkBinary: 'eslint',
        description: 'ESLint static code analyzer',
      },
      {
        name: 'biome',
        command: 'npx',
        args: ['biome', 'check', '.'],
        fixArgs: ['biome', 'check', '--write', '.'],
        checkBinary: 'biome',
        description: 'Biome modern linter & formatter',
      },
      {
        name: 'tsc',
        command: 'npx',
        args: ['tsc', '--noEmit'],
        checkBinary: 'tsc',
        description: 'TypeScript compiler typecheck',
      },
    ],
    javascript: [
      {
        name: 'eslint',
        command: 'npx',
        args: ['eslint', '.'],
        fixArgs: ['eslint', '--fix', '.'],
        checkBinary: 'eslint',
        description: 'ESLint static code analyzer',
      },
      {
        name: 'biome',
        command: 'npx',
        args: ['biome', 'check', '.'],
        fixArgs: ['biome', 'check', '--write', '.'],
        checkBinary: 'biome',
        description: 'Biome modern linter & formatter',
      },
    ],
    cpp: [
      {
        name: 'clang-tidy',
        command: 'clang-tidy',
        args: ['src/**/*.cpp'],
        checkBinary: 'clang-tidy',
        description: 'LLVM Clang-Tidy linter',
      },
      {
        name: 'cppcheck',
        command: 'cppcheck',
        args: ['--enable=all', 'src'],
        checkBinary: 'cppcheck',
        description: 'Cppcheck static analysis tool',
      },
    ],
    java: [
      {
        name: 'checkstyle',
        command: 'mvn',
        args: ['checkstyle:check'],
        checkBinary: 'mvn',
        description: 'Maven Checkstyle plugin',
      },
      {
        name: 'gradle-check',
        command: 'gradle',
        args: ['check'],
        checkBinary: 'gradle',
        description: 'Gradle check task',
      },
    ],
    unknown: [],
  };

  /**
   * 製品ディレクトリ（src/ など）の言語を自動検出する
   */
  public static detectLanguage(productDir: string): ProductLanguage {
    const resolved = path.resolve(productDir);
    if (!fs.existsSync(resolved)) return 'unknown';

    const rootEntries = fs.readdirSync(resolved);

    // 1. Python Detection
    if (
      rootEntries.includes('pyproject.toml') ||
      rootEntries.includes('requirements.txt') ||
      rootEntries.includes('setup.py') ||
      rootEntries.includes('Pipfile')
    ) {
      return 'python';
    }

    // 2. Go Detection
    if (rootEntries.includes('go.mod') || rootEntries.includes('go.sum')) {
      return 'go';
    }

    // 3. Rust Detection
    if (rootEntries.includes('Cargo.toml') || rootEntries.includes('Cargo.lock')) {
      return 'rust';
    }

    // 4. C / C++ Detection
    if (
      rootEntries.includes('CMakeLists.txt') ||
      rootEntries.includes('Makefile') ||
      rootEntries.some(f => f.endsWith('.c') || f.endsWith('.cpp') || f.endsWith('.h'))
    ) {
      return 'cpp';
    }

    // 5. JavaScript / TypeScript Detection
    if (rootEntries.includes('tsconfig.json')) {
      return 'typescript';
    }
    if (rootEntries.includes('package.json')) {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(resolved, 'package.json'), 'utf-8'));
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        if (deps.typescript) return 'typescript';
      } catch {
        // ignore parse error
      }
      return 'javascript';
    }

    // 拡張子ベースの探索
    const files = this.collectFileExtensions(resolved, 2);
    if (files.has('.py')) return 'python';
    if (files.has('.go')) return 'go';
    if (files.has('.rs')) return 'rust';
    if (files.has('.ts') || files.has('.tsx')) return 'typescript';
    if (files.has('.js') || files.has('.jsx')) return 'javascript';
    if (files.has('.cpp') || files.has('.c') || files.has('.hpp')) return 'cpp';
    if (files.has('.java')) return 'java';

    return 'unknown';
  }

  /**
   * 設定ファイル（.stratum-lint.json 等）をロードする
   */
  public static loadConfig(configPath?: string, cwd: string = process.cwd()): ProductLintConfig | null {
    const candidatePaths = configPath
      ? [path.resolve(configPath)]
      : [
          path.resolve(cwd, '.stratum-lint.json'),
          path.resolve(cwd, 'stratum.config.json'),
          path.resolve(cwd, 'src/.stratum-lint.json'),
        ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        try {
          return JSON.parse(fs.readFileSync(p, 'utf-8'));
        } catch {
          // parse error
        }
      }
    }
    return null;
  }

  /**
   * 実行すべきリンターコマンドを解決する
   */
  public static resolveCommand(options: LintProductOptions = {}): {
    language: ProductLanguage;
    command: string;
    args: string[];
    isCustom: boolean;
  } {
    const productDir = path.resolve(options.productDir || './src');
    const config = this.loadConfig(options.configPath, process.cwd());

    // 1. カスタム設定コマンドがある場合
    if (config?.lintCommand) {
      const parts = config.lintCommand.trim().split(/\s+/);
      const command = parts[0];
      const args = parts.slice(1);
      return {
        language: config.language || 'unknown',
        command,
        args,
        isCustom: true,
      };
    }

    // 2. 言語判定
    const language = options.language || config?.language || this.detectLanguage(productDir);
    const candidates = this.LINTER_CANDIDATES[language] || [];

    // 利用可能なバイナリを探す
    for (const c of candidates) {
      if (this.isCommandAvailable(c.checkBinary, productDir)) {
        const args = options.fix && c.fixArgs ? c.fixArgs : c.args;
        return {
          language,
          command: c.command,
          args,
          isCustom: false,
        };
      }
    }

    // 候補の先頭をデフォルトとして返す
    const fallback = candidates[0] || {
      command: 'echo',
      args: ['[ProductLinter] No suitable linter found for language:', language],
    };

    return {
      language,
      command: fallback.command,
      args: fallback.args,
      isCustom: false,
    };
  }

  /**
   * リンターを実行する
   */
  public static run(options: LintProductOptions = {}): LintExecutionResult {
    const productDir = path.resolve(options.productDir || './src');
    const { language, command, args } = this.resolveCommand(options);

    if (options.dryRun) {
      return {
        success: true,
        language,
        command,
        args,
        stdout: `[DRY-RUN] Would execute: ${command} ${args.join(' ')} (cwd: ${productDir})`,
        stderr: '',
        exitCode: 0,
        toolsDetected: [command],
      };
    }

    if (command === 'echo') {
      const msg = args.join(' ');
      return {
        success: true,
        language,
        command,
        args,
        stdout: `${msg}\n`,
        stderr: '',
        exitCode: 0,
        toolsDetected: [],
      };
    }

    try {
      const proc = spawnSync(command, args, {
        cwd: productDir,
        encoding: 'utf-8',
        stdio: 'pipe',
        shell: process.platform === 'win32',
        env: {
          ...process.env,
        },
      });

      return {
        success: proc.status === 0,
        language,
        command,
        args,
        stdout: proc.stdout || '',
        stderr: proc.stderr || '',
        exitCode: proc.status ?? (proc.error ? 1 : 0),
        toolsDetected: [command],
      };
    } catch (err: any) {
      return {
        success: false,
        language,
        command,
        args,
        stdout: '',
        stderr: err.message,
        exitCode: 1,
        toolsDetected: [command],
      };
    }
  }

  /**
   * システム上で指定されたコマンドが利用可能かチェックする
   */
  private static isCommandAvailable(bin: string, cwd: string): boolean {
    // 1. check node_modules/.bin in cwd or parent
    const localBin = path.join(cwd, 'node_modules', '.bin', bin);
    if (fs.existsSync(localBin)) return true;

    // 2. check package.json dependencies
    const pkgPath = path.join(cwd, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        if (allDeps[bin]) return true;
      } catch {
        // ignore
      }
    }

    try {
      const isWin = process.platform === 'win32';
      const checkCmd = isWin ? `where ${bin}` : `command -v ${bin}`;
      execSync(checkCmd, { cwd, stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * ディレクトリ内のファイル拡張子を浅く収集する
   */
  private static collectFileExtensions(dir: string, depth: number): Set<string> {
    const exts = new Set<string>();
    if (depth <= 0 || !fs.existsSync(dir)) return exts;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
        if (entry.isDirectory()) {
          const sub = this.collectFileExtensions(path.join(dir, entry.name), depth - 1);
          for (const ext of sub) exts.add(ext);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (ext) exts.add(ext);
        }
      }
    } catch {
      // ignore
    }
    return exts;
  }
}
