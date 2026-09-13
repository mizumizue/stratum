# Stratum アーキテクチャ設計書

本書は、AI工程OS（ForgOSモード駆動開発）とV字トレーサビリティ・品質地層（厚み・薄み）分析基盤の「両軸」を提供する **Stratum**（地層 / 旧称: TraceWeave）のアーキテクチャおよび技術仕様をまとめた文書である。

---

## 1. アーキテクチャ設計原則

1. **製品（Product: `src/`）本位と「製品のための機能」としてのトレーサビリティ**:
   - リポジトリにおける開発の本尊は `src/` 配下の製品コードである。トレーサビリティ（Stratum）や可視化ダッシュボードは製品そのものではなく、製品の仕様契約・品質地層・充足度を客観的に保証するための「製品のための機能」として位置づけられる。
2. **開発フレームワーク（ForgOS）× 品質地層分析（Stratum）の二重両軸 (Dual Backbone)**:
   - モード駆動開発（Spike, Specify, Implement, Audit, Steward）による自律的・決定論的な開発サイクル（開発FW）と、V-Model 仕様・テスト地層密度分析（品質機能）を両輪として統合する。
3. **Pure TypeScript Core (Zero External Dependencies)**:
   - 地層分析・グラフ探索・スコアリング等のコアロジックは外部ライブラリに一切依存しない純粋な TypeScript で実装し、ミリ秒で完了する決定性と高保守性を担保する。
4. **Ports & Adapters (ヘキサゴナルアーキテクチャ)**:
   - Application 層がユースケースをオーケストレーションし、Infrastructure（ファイルI/O, SQLiteキャッシュ）および Entrypoints（CLI, React Web, MCP）を完全に分離する。
5. **オプショナルな可視化 & 拡張**:
   - Web ダッシュボードや MCP サーバーはオプショナルな拡張機能（薄いプレゼンテーション/アダプター層）とし、製品コードやリポジトリの自然な保守性を束縛しない。可視化ツールの都合で製品開発プロセスが歪められることを防ぐ。

---

## 2. システム構造図

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Entrypoints / Presentation                      │
│   CLI (Commander)  │  Web Dashboard (React)  │  MCP Server (Optional)  │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼──────────────────────────────────────┐
│                        Application (Use Cases)                         │
│  - checkDocs (CI用バリデーション)                                      │
│  - buildStratumReport (統合集計)                                       │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼──────────────────────────────────────┐
│                       Domain Core (純粋なロジック)                     │
│  - Models (Need, Req, Spec, TestCase, Phase, Method)                  │
│  - TraceGraph (有向グラフ構築, 循環検知, 孤立ノード検出)                │
│  - SufficiencyScorer (品質充足度計算)                                  │
│  - BalanceAnalyzer (工程の厚み・薄み・テストピラミッド健全性診断)       │
│  - MatrixBuilder (マトリクスおよび総合レポート構造化)                  │
└─────────────────────────────────▲──────────────────────────────────────┘
                                  │ (Ports & Adapters)
┌─────────────────────────────────┴──────────────────────────────────────┐
│                       Infrastructure (外部接続層)                      │
│  - DocParser (gray-matter による Markdown 解析)                        │
│  - SQLiteCache (better-sqlite3 による mtime 差分インデックス)          │
│  - ConsoleReporter / MarkdownReporter (各種フォーマット出力)           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. レイヤー構成と責務

| レイヤー | ディレクトリ | 主なクラス/モジュール | 責務 |
|---|---|---|---|
| **Core** | `src/core/` | `TraceGraph`, `SufficiencyScorer`, `BalanceAnalyzer`, `MatrixBuilder` | ビジネスルール、グラフ構造、スコアリング、地層診断。外部依存ゼロ。 |
| **Application** | `src/application/` | `checkDocs`, `buildStratumReport`, `adoptProject` | 業務ユースケースの実行・オーケストレーション。 |
| **Infrastructure** | `src/infrastructure/`| `DocParser`, `SQLiteCache`, `ConsoleReporter`, `MarkdownReporter` | ファイルI/O、Markdownパース、SQLiteキャッシュ管理、フォーマット整形。 |
| **CLI** | `src/cli/` | `index.ts` | Commander.js によるコマンドライン受付（check, matrix, report, build, serve, mcp, adopt）。 |
| **Web** | `src/web/` | `index.html`, `vite.config.ts`, `App.tsx` | React 19 + Vite によるインタラクティブなダッシュボードUI（開発資材を完全カプセル化）。 |
| **MCP** | `src/mcp/` | `server.ts` | Model Context Protocol による Cursor / AI エージェント連携。 |

---

## 4. リポジトリ構成とクリーンルート規約

lucid 思想（ADR-0005）に厳格に準拠し、リポジトリルートには製品のガバナンス・全体構成マップ（`README.md`, `USER_GUIDE.md`, `ARCHITECTURE.md`, `DEVELOPER_GUIDE.md`）、除外設定（`.gitignore`）、および実行用ラッパー（`bin/`）のみを最前面に配置する。

`package.json`, `tsconfig.json`、依存パッケージ群（`node_modules/`）、およびビルド成果物（`dist/`）を含むすべての実装資産は `src/` 配下に完全カプセル化する（Web ダッシュボード開発資材・成果物は `src/web/` 内）。ルート直下に個別の開発資材、ビルド成果物、依存キャッシュディレクトリを一切露出させない。すべての CLI コマンドは `bin/stratum`（または `bin/traceweave`）ラッパーが `NODE_PATH` を自動解決して透過実行する。
