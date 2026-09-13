# 開発者ガイド (Developer Guide)

本書は、**Stratum**（ストラータム）環境下で開発・機能追加・保守を行う開発者（人間のエンジニアおよび AI エージェント）向けの実装ガイドラインです。

当プロジェクトにおいて、**主役は `src/` 配下に配置される「製品（プロダクト）」**です。トレーサビリティや可視化ダッシュボードは製品そのものではなく、**「製品を正しく・高品質に作るための開発・品質保証機能」**として位置づけられています。

リポジトリは**「AI 工程 OS (ForgOS モード駆動開発)」**と**「V-Model 品質地層分析 (Stratum)」**の**両軸**で構成されており、コードファーストで場当たり的に実装を始めるのではなく、指示の抽象度に応じた文書（要求・要件・仕様・設計）を起点として精緻化・検証を経てからテスト駆動開発（TDD）に着手する**文書駆動・仕様先行開発（Doc-First / Spec-Driven）**、ならびに**リポジトリトップレベル（Root）のクリーン維持**を徹底しています。

---

## 1. リポジトリ全体配置マップとクリーンルート規約

ルート直下は製品のガバナンス・開発規約・全体構成マップ・実行ラッパー（`bin/`）のみを最前面に配置し、言語・ツール固有の実装コードや依存関係は `src/` 配下に完全カプセル化します。ルート直下にフロントエンド設定やビルド出力、依存パッケージを散乱させることは厳禁です。

また、**ForgOS の工程手順（`agents/`、各モード）**に則り、作業時は指示の抽象度に応じて `Spike` / `Specify` / `Implement` / `Audit` / `Steward` を意識して進めます。特定の可視化画面（Web ダッシュボード等）に開発全体が引っ張られることはありません。

```text
stratum/
├── README.md               # プロジェクト概要、全体構成マップ、クイックスタート
├── DEVELOPER_GUIDE.md      # 本ファイル: 開発者ガイド、モード駆動開発・文書先行プロセス・リポジトリ規約
├── ARCHITECTURE.md         # アーキテクチャ設計原則、レイヤー責務、システム構造図
├── CONTEXT.md              # プロジェクト文脈 & ForgOS 統合コンテキスト
├── AGENTS.md               # AI エージェント向けガイダンス・モード早見
├── CLAUDE.md               # Claude Code アダプター
├── INSTALL_GUIDE.md        # インストール & 導入ガイド: 初期セットアップ・外部プロジェクト適用
├── USER_GUIDE.md           # ユーザーガイド: CLI・Web画面・MCP連携の完全利用マニュアル
├── .gitignore              # Git 除外設定（src/node_modules/, src/dist/, .cache/ 等）
│
├── agents/                 # 【開発FW: AI 工程 OS 手順の正本】
│   ├── modes/              # 5大開発モード (Spike, Specify, Implement, Audit, Steward)
│   ├── engineering/        # エンジニアリング指針 (TDD, Assure)
│   └── policy/             # 共通規約 (framework.md, governance-immutable.md 等)
│
├── docs/                   # 【製品のための機能: V-Model 仕様・設計・決め事の正本】
│   ├── needs/              # 要求定義 (NEED-*)
│   ├── requirements/       # 要件定義 (REQ-*)
│   ├── specifications/     # 詳細仕様・外部契約 (SPEC-*)
│   ├── design/             # アーキテクチャ・詳細設計 (DSN-*)
│   ├── decisions/          # 意思決定ログ / ADR (ADR-*)
│   ├── actors/             # アクター定義 (ACT-*)
│   ├── usecases/           # ユースケース (UC-*)
│   ├── quality/            # 品質基準・検証方針 (QA-*)
│   └── test-cases/         # 個別テストケース仕様 (TC-*)
│
├── bin/                    # 【開発・品質実行ラッパースクリプト】
│   ├── stratum             # POSIX bash ラッパー (主コマンド)
│   ├── stratum.cmd         # Windows cmd ラッパー
│   ├── stratum.ps1         # Windows PowerShell ラッパー
│   ├── traceweave          # 後方互換性 bash ラッパー (エイリアス)
│   ├── traceweave.cmd      # 後方互換性 cmd ラッパー
│   └── traceweave.ps1      # 後方互換性 PowerShell ラッパー
│
├── tests/                  # テストスイート（単体・結合・E2E）
├── fixtures/               # テスト用静的フィクスチャ
├── scripts/                # 運用・検証スクリプト (validate-docs.ts, adopt-stratum.ts 等)
│
└── src/                    # 【製品（Product）の実装領域】
    ├── package.json        # プロジェクト基盤メタデータ・依存関係・スクリプト
    ├── package-lock.json   # 依存関係ロックファイル
    ├── tsconfig.json       # TypeScript プロジェクト設定
    ├── node_modules/       # 依存パッケージ群（.gitignore 対象）
    ├── dist/               # コンパイル済み成果物（.gitignore 対象）
    └── ...                 # 製品アプリケーション実装（Clean-Root アーキテクチャ）
```

---

## 2. 実装プロセスの全体フロー（ForgOS モード × V-Model）

すべての機能追加・変更・改善作業は、ForgOS のモード駆動サイクルに沿って進行します。

```text
[開発タスク・機能要望]
       │
       ▼
【1. Spike モード】（曖昧な要求・技術検証がある場合）
  ・プロトタイプや検証コードで触って不確実性を解消
       │
       ▼
【2. Specify モード】（仕様先行・V-Model 起票）
  ・起点の判定:
    - 動機・課題・抽象指示 ──> パスA: 要求起点 (docs/needs/)
    - 具体的成果・受入条件 ──> パスB: 要件起点 (docs/requirements/)
    - アーキテクチャ決定 ──> パスC: 決定起点 (docs/decisions/ ADR)
  ・仕様 (SPEC-*)、設計 (DSN-*)、テスト仕様 (TC-*) を What に純化して起票
  ・スキーマ検証: npm --prefix src run lint でエラー 0 件を確認
       │
       ▼
【3. Implement モード】（TDD 実装）
  ・受入条件（AC）および公開インターフェースに基づきテストコード作成（Red）
  ・src/ 配下へのプロダクションコード最小実装（Green）
  ・構造衛生とリファクタリング、全テスト合格（Pass）
       │
       ▼
【4. Audit モード】（仕様・実装の乖離点検 & 地層健全性診断）
  ・仕様と実装の乖離（Gap / Conform）を監査
  ・./bin/stratum report による地層密度（Unit/ITa/ITb/ST/UAT）診断
  ・客観的テストレポート（reports/test-results.json）の確認
       │
       ▼
【5. Steward モード】（ガバナンス・規約保守）
  ・開発規約、ルール、ADR の整合性を維持・更新
```

---

## 3. 起点の判定 (Entrypoint Decision)

| 起点 | 指示の特徴 | 記録先ファイル | 依存関係 (`depends_on`) |
|---|---|---|---|
| **要求起点** (`need`) | 背景、動機、課題、大まかな要望（例:「〜したい」「〜で困っている」）、または複数成果に分解される抽象指示 | `docs/needs/NEED-xxxx.md` | `depends_on: []` |
| **要件起点** (`requirement`) | 観測可能な成果、具体的な振る舞い、受け入れ条件（AC）など、単一の成果として閉じた具体的指示 | `docs/requirements/REQ-xxxx.md` | `depends_on: []`（要求から分解された場合は親 NEED を指定） |

---

## 4. 文書の起票ルールと検証ゲート

すべての文書は `docs-document-schema.mdc` に厳格に準拠して作成します。

- 必須見出し構成を守る（例: need は `Background`, `Problem`, `Desired Outcome`、requirement は `Statement`, `Acceptance Criteria`）。
- コミットやコード実装着手前に必ず以下を実行し、エラーが 0 件であることを確認します。

```bash
./src/node_modules/.bin/tsx scripts/validate-docs.ts
```

---

## 5. テスト・ビルド・実行コマンド

```bash
# ドキュメントスキーマの検証
./src/node_modules/.bin/tsx scripts/validate-docs.ts

# 全テストの実行（Web ビルドおよび全テストスイート）
./scripts/test.sh
# または Windows: .\scripts\test.cmd

# CLI の実行（ルートから透過実行）
./bin/stratum check
./bin/stratum report
./bin/stratum matrix
./bin/stratum serve --port 3000

# src/ 配下での直接ビルド・テスト
npm --prefix src run build
npm --prefix src test
```
