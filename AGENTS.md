# Agent 向けメモ (ForgOS + Stratum)

このリポジトリは、開発フレームワーク（**ForgOS**: AI 工程 OS）と品質地層・トレーサビリティ機能（**Stratum**）の「両軸」で、**製品（`src/`）**を開発・品質保証する環境です。
トレーサビリティやダッシュボードは製品そのものではなく、製品のための機能です。

作業開始前に [CONTEXT.md](./CONTEXT.md) と [docs/SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md) を読む。

どのモード／スキルを使うか迷ったら **`agents/ask-me.md`**（ルーター）。Cursor では `/ask-me`。

## モードで開始する

開始時はスキル名ではなく **モード** を選ぶ。**入口（Mode）とフローは別軸。** 第一分岐は Spike or Specify。

| やりたいこと | モード | 起動 | セッション完了の目安 |
|--------------|--------|------|----------------------|
| あいまい要件を触って減らす | Spike | `/spike` | 粗いプロトタイプ／学習メモ |
| 規範を `docs/` に書く | Specify | `/specify` | 仕様記録と整合性、V-Model リンク整合 |
| 仕様に従い実装（TDD） | Implement | `/implement`（TDD: `/tdd`） | TDD と単体・結合緑。客観的レポート生成 |
| 乖離・充足度・地層チェック | Audit | `/audit` | 指摘リストと Stratum 地層分析レポート |
| FW / 構成のメンテ | Steward | `/steward` | ルールや構成変更と記録（ADR 推奨） |

### モード選択（早見）

- 要件が曖昧で触って学びたい → **Spike**（第一分岐）
- 規範として書ける → **Specify**（第一分岐）
- 仕様があり実装する → **Implement**（TDD: `/tdd`）。`npm --prefix src test` でグリーンを確認。
- 「仕様どおりか」「テストピラミッドが健全か」を点検 → **Audit** (`./bin/stratum check`, `./bin/stratum report`)
- どれを起動すべきか迷う → `/ask-me`（ルーター）
- この FW 自体を直す → **Steward**

### メインフロー（成果物の流れ）

```text
Spike (プロトタイプ/仮説) 
       ↓
docs/ (NEED → REQ → SPEC → DSN → TC)  [Specify]
       ↓
src/ + tests/ (TDD: Red → Green → Refactor)  [Implement]
       ↓
reports/test-results.json + Stratum 診断  [Audit]
```

## 編集制約（要約）

- **src/ は製品、トレーサビリティは製品のための機能**: 開発の本尊は製品コード。トレーサビリティやダッシュボードは製品の品質・契約を支える機能。
- **特定アーキテクチャ・設計指針に不干渉 (ADR-0008)**: `src/` 配下は特定のアーキテクチャに限定せず、プロダクト自体の内部設計指針には関わらない。言語や設計パターンは自由。
- **仕様・決め事の正本は `docs/`**: 要求（NEED）→ 要件（REQ）→ 仕様（SPEC）→ 設計（DSN）→ テストケース（TC）の V-Model 体系を維持する。
- **決め事は What**: How・内部構造・手順は書かない。
- **ツールの都合で実装構造を歪めない**: Stratum の可視化・分析のために製品実装の自由度や自然な保守性を妨げない（特定言語・アーキテクチャ前提に縛られない）。
- **実装は TDD**: 単体・結合が緑になるまで完了と言わない。`npm --prefix src test` による決定論的レポートを証跡とする。
- **客観的事実の検証（ADR-0006）**: `docs/test-cases/` に LLM や人間による作文エビデンスを書き込まない。テスト実行プロセスが出力する `reports/test-results.json` を唯一の合否証拠とする。
- **秘密情報をログ・コミット・仕様に出さない**。

## ディレクトリ

| パス | 役割 |
|------|------|
| `src/` | 製品（Product）の実装領域（特定のアーキテクチャ・設計指針に限定しない） |
| `docs/` | 製品のための機能: 仕様・設計・決め事・テスト仕様の正本（NEED, REQ, SPEC, DSN, ADR, QA, TC） |
| `tests/` | テストコード（Vitest スイート） |
| `bin/` | 開発・品質実行用 CLI ラッパー（`bin/stratum`, `bin/traceweave`） |
| `agents/` | 開発FW: 工程手順の正本（Mode, Engineering, Policy）。ツール入口は adapter |
| `reports/` | 機械生成されたテスト実行結果・客観エビデンス（`reports/test-results.json`） |
| `.cursor/` | Cursor 向けルール（`.cursor/rules/`）およびスキル（`.cursor/skills/`） |
