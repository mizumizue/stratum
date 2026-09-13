# スキル案内（ForgOS + Stratum）

手順の正本は `agents/`（Cursor の slash は `.cursor/skills` adapter の起動名）。索引は `AGENTS.md` / `CLAUDE.md`。

モードとスキルをすべて覚えなくてよい。ここで経路を選ぶ。

このスキルは**ルーター**である: 到達先の名前とタイミングを示す。

作業開始前の共通前提: [CONTEXT.md](./CONTEXT.md) と [docs/SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md)。索引の正本は [AGENTS.md](./AGENTS.md)。

**入口（Mode）とフロー（Pipeline）は別軸。** 迷ったらまず入口の第一分岐へ。

## 第一分岐（入口）

| 状況 | 起動 | 乗るもの |
|------|------|----------|
| あいまい → 触って減らす | `/spike` | 粗いプロトタイプや検証コード・学習メモ |
| 規範として書ける | `/specify` | `docs/` 直書き（V-Model: NEED, REQ, SPEC, DSN） |

## 第二段（入口）

| やりたいこと | 起動 | メモ |
|--------------|------|------|
| `docs/` に従い実装 | `/implement` | TDD は `/tdd`。単体・結合緑。客観的レポート（`reports/test-results.json`）生成 |
| 仕様どおりか・地層密度は健全か | `/audit` | `./bin/stratum check`, `./bin/stratum report` による客観診断 |
| FW（リポジトリ規約・ルール・骨組み）を直す | `/steward` | 規約や設定の変更と記録（ADR 推奨） |

## メインフロー: 仕様記述 → 実装 → 点検

1. **仕様化（Specify）**（起動 `/specify`）— `docs/` 配下に V-Model（NEED, REQ, SPEC, DSN）と TC を記述。
2. **実装（Implement）**（起動 `/implement`）— 仕様・設計に紐づけて TDD（テストファースト）で実装。
3. **監査（Audit）**（起動 `/audit`）— 仕様と実装の乖離点検、および Stratum による地層健全性・充足度分析。

## 置き場の早見

| 種別 | パス | 説明 |
|------|------|------|
| 製品（Product）の実装領域 | `src/` | 製品アプリケーション実装（Clean-Root アーキテクチャ） |
| 製品のための機能: 仕様・設計正本 | `docs/` | V-Model（NEED, REQ, SPEC, DSN, ADR, QA, TC） |
| テストコード | `tests/` | 単体・結合テストスイート（Vitest） |
| 開発・品質実行ラッパー | `bin/` | `bin/stratum`, `bin/traceweave` |
| 開発FW: 工程手順の正本 | `agents/` | Mode, Engineering, Policy |
| テスト結果・客観エビデンス | `reports/` | `test-results.json`（ADR-0006） |

## 迷ったら

1. 要件が曖昧 → `/spike`
2. 規範が書ける → `/specify`
3. 実装する → `/implement`（`/tdd`）
4. 仕様と実装、地層の点検 → `/audit`
5. FW・規約自体 → `/steward`
