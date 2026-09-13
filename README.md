# Stratum (ストラータム / 地層)

> **AI Engineering OS & Quality Stratum Framework**  
> 確固たる開発プロセス規律（ForgOS モード駆動）と、客観的な品質地層保証（V-Model トレーサビリティ）の「両軸」で製品開発を推進するエンジニアリング・フレームワーク。

---

## 1. コンセプト：製品開発を支える「開発フレームワーク」×「品質地層機能」の両軸

当リポジトリの主役は **`src/` に配置される「製品（プロダクト）」** です。  
トレーサビリティやダッシュボードは製品そのものではなく、**「製品を正しく・高品質に作るための機能（品質保証エンジン）」** として位置づけられています。

AIエージェントと人間が協調して製品を開発するために、本フレームワークは以下の**「両軸」**を提供します。

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        【製品 (Product)】 src/                         │
│                  アプリケーション本体・ビジネスロジック                │
└───────────────────▲────────────────────────────────▲───────────────────┘
                    │                                │
    ┌───────────────┴──────────────┐ ┌───────────────┴──────────────┐
    │  【軸1: 開発フレームワーク】  │ │   【軸2: 品質地層・追跡機能】   │
    │      AI 工程 OS (ForgOS)     │ │    V-Model エンジン (Stratum)    │
    │  - 5大開発モード (Spike/...) │ │  - 要求〜テスト追跡 (docs/)  │
    │  - What vs How の分離        │ │  - 5大工程の地層密度診断     │
    │  - TDD (テスト駆動開発)      │ │  - 客観的テストエビデンス    │
    └──────────────────────────────┘ └──────────────────────────────┘
```

### 軸1: 開発フレームワーク（AI 工程 OS / ForgOS）
- **モード駆動開発（Mode-Driven）**:
  `Spike`（仮説検証）→ `Specify`（仕様先行）→ `Implement`（TDD実装）→ `Audit`（乖離・地層点検）→ `Steward`（規約保守）の5大公式入口により、AIエージェントと開発者の責務境界・開発リズムを統制。
- **What vs How の厳格分離**:
  仕様（`docs/`）にビジネスルール・受入基準（What）を定め、実装（`src/`）に内部構造（How）を閉じる。
- **TDD（テスト駆動開発）**:
  単体・結合テストが緑になるまで完了とみなさない規律を徹底。

### 軸2: 品質地層・トレーサビリティ機能（Stratum Quality Engine）
- **縦糸（V-Model トレーサビリティ）**:
  要求（NEED）→ 要件（REQ）→ 詳細仕様（SPEC）→ 設計（DSN）→ テストケース（TC）の双方向チェーンを Git ネイティブな Markdown から自動構築。
- **横糸（工程地層密度 & ピラミッド健全性診断）**:
  テストを 5 大工程（単体・内結・外結・総合・受入）に分類し、どの層が厚く・薄いか、結合テストの空洞化や E2E 過剰偏重が起きていないかを機械判定。
- **客観的事実の検証（ADR-0006）**:
  LLMの作文による形骸化エビデンスを排除し、決定論的なテストレポート（`reports/test-results.json`）を唯一の合格証跡とする。
- **非侵襲 & 多言語・アーキテクチャ中立な観測性 (ADR-0008)**:
  `src/` 配下の製品コードは**特定のアーキテクチャ（MVC、レイヤード、DDD、ヘキサゴナル等）やプログラミング言語に限定されず、プロダクト自体の設計指針には一切関わらない**。ツールの都合で製品コードの構成や設計を縛ることなく、あらゆる技術スタック・設計パターンの製品開発において客観的な品質状態を保証可能。

---

## 2. リポジトリ全体配置マップ

製品（`src/`）、開発FW（`agents/`）、品質機能（`docs/`, `bin/`）がクリーンルート規約（lucid 思想）に沿って分離・配置されています。ダッシュボード等の特定 UI に開発全体が引っ張られることはありません。

```text
stratum/
├── README.md               # プロジェクト概要、全体構成マップ、クイックスタート
├── DEVELOPER_GUIDE.md      # 開発者ガイド: モード駆動開発の流れ・規約・文書先行プロセス
├── ARCHITECTURE.md         # アーキテクチャ設計原則、レイヤー責務、システム構造図
├── CONTEXT.md              # プロジェクト文脈 & ForgOS 統合コンテキスト
├── AGENTS.md               # AI エージェント向け運用ガイダンス・モード早見
├── CLAUDE.md               # Claude Code アダプター
├── INSTALL_GUIDE.md        # インストール & 導入ガイド: 初期セットアップ・外部プロジェクト適用
├── USER_GUIDE.md           # ユーザーガイド: CLI・MCP連携・機能マニュアル
├── .gitignore              # Git 除外設定（src/node_modules/, src/dist/, .cache/ 等）
│
├── agents/                 # 【開発FW: AI 工程 OS の正本】
│   ├── modes/              # 5大開発モード (Spike, Specify, Implement, Audit, Steward)
│   ├── engineering/        # エンジニアリング指針 (TDD, Assure)
│   └── policy/             # 共通規約 (framework.md, governance-immutable.md 等)
│
├── docs/                   # 【品質機能: V-Model 仕様・設計・決め事の正本】
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
│   ├── stratum             # 統合 CLI ラッパー (check, report, matrix, adopt 等)
│   ├── stratum.cmd         # Windows cmd ラッパー
│   ├── stratum.ps1         # Windows PowerShell ラッパー
│   └── traceweave*         # 後方互換性エイリアスラッパー
│
├── tests/                  # テストスイート（単体・結合・E2E）
├── fixtures/               # テスト用静的フィクスチャ
├── scripts/                # 運用・検証スクリプト (validate-docs.ts, adopt-stratum.ts 等)
├── reports/                # 機械生成された客観テストレポート (test-results.json)
│
└── src/                    # 【製品（Product）の実装領域】
    ├── (各言語・フレームワーク固有の依存・設定・ソースファイル)
    └── ...                 # 製品アプリケーション実装（特定のアーキテクチャ・設計指針に限定しない）
```

---

## 3. クイックスタート

### 開発ワークフローの基本サイクル

1. **仕様定義（Specify モード / `/specify`）**:
   `docs/` 配下に要求・要件・仕様・テストケースを記述し、リンク整合性を検証。
   ```bash
   npm --prefix src run lint
   ```
2. **テスト駆動実装（Implement モード / `/implement`）**:
   仕様に基づき `tests/` にテストを作成（Red）し、`src/` に最小限の実装を行って緑（Green）にする。
   ```bash
   npm --prefix src test
   ```
3. **品質・地層の監査（Audit モード / `/audit`）**:
   CLI を通じて仕様と実装の乖離、およびテスト地層の厚み・薄みを客観診断。
   ```bash
   ./bin/stratum report
   ./bin/stratum matrix
   ```

---

### CLI コマンド（製品のための品質機能）

`bin/stratum`（または `bin/traceweave`）ラッパーを通じて、リポジトリルートから直接コマンドを実行できます。

```bash
# CI 用の静的チェック（リンク切れや未テスト要件があれば exit code 1）
./bin/stratum check

# 品質充足度および工程地層密度のサマリーレポート
./bin/stratum report

# トレーサビリティマトリクスの表示
./bin/stratum matrix

# アプリケーションの決め事カタログ（全種別の横断探索）
./bin/stratum catalog

# アーキテクチャ意思決定（ADR）と設計（DSN）の相互リンク一覧
./bin/stratum decisions

# 外部プロジェクトへの Stratum 導入（解析一時適用 or 完全再構成）
./bin/stratum adopt /path/to/project --mode overlay
./bin/stratum adopt /path/to/project --mode restructure

# （オプショナル）ローカル可視化プレビューサーバーの起動
./bin/stratum serve --port 3000
```

---

## 4. ドキュメント体系 (docs/)

`docs/` 配下に以下のディレクトリを配置し、1ファイル1成果物の Markdown を作成します。

| ディレクトリ | 種別 (`kind`) | ID 接頭辞 | 説明 |
|---|---|---|---|
| `docs/needs/` | `need` | `NEED-xxxx` | 背景・課題・期待する成果（Why） |
| `docs/requirements/` | `requirement` | `REQ-xxxx` | 観測可能な成果・受入条件（What / AC）、重要度（criticality） |
| `docs/specifications/` | `specification` | `SPEC-xxxx` | 入出力契約・インターフェース・異常系制約 |
| `docs/design/` | `design` | `DSN-xxxx` | モジュール構造・データフロー・トレードオフ |
| `docs/quality/` | `quality_assurance` | `QA-xxxx` | 品質基準・検証方針・完了判定 |
| `docs/test-cases/` | `test_case` | `TC-xxxx` | 個別検証手順、工程（test_level）、手法（test_method） |
| `docs/decisions/` | `decision` | `ADR-xxxx` | 設計・アーキテクチャの意思決定ログ |

---

## 5. 品質充足度の算出基準 (Sufficiency Scoring)

各要件（REQ）の重要度（`criticality`）と紐づくテストケース（TC）の工程に基づき、0〜100% の品質充足度スコアが決定論的に算出されます。

| 重要度 (`criticality`) | 必須テスト工程と配点 | 完全充足の基準 |
|---|---|---|
| **High** | 単体(30点) + 内結(25点) + 外結/ST(25点) + 受入(20点) | スコア 80% 以上 |
| **Medium** | 単体(50点) + 結合/ST(50点) ※受入ボーナス+10点 | スコア 80% 以上 |
| **Low** | いずれか1つのテスト工程が存在すれば 100点 | スコア 100% |

- **充足（緑）**: 80% 以上
- **一部充足（黄）**: 50% 以上 80% 未満
- **未充足（赤）**: 50% 未満（未テスト等）
