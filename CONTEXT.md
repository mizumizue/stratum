# ForgOS + Stratum (Context)

リポジトリ規約と Cursor 第一の AI 工程 OS（**ForgOS**）に、V-Model トレーサビリティ・品質地層分析プラットフォーム（**Stratum**）を統合した環境。工程手順の正本は `agents/`、仕様・設計・検証の正本は `docs/`。

## Language

**Mode（モード）**:
Spike / Specify / Implement / Audit / Steward。作業の公式入口。第一分岐は Spike or Specify。

**Spike**:
あいまいな要件を触って減らす。粗いプロトタイプや検証コード。

**Specify**:
`docs/` に仕様（NEED, REQ, SPEC, DSN, QA, TC）を記述する入口。

**Implement**:
TDD に従い、単体・結合テストが緑になるまで実装を推進する。

**Audit**:
仕様（`docs/`）と実装の乖離、および Stratum によるトレーサビリティ・テストピラミッド充足度を点検する。

**Steward**:
リポジトリ全体のガバナンス、開発規約、Cursor スキル・ルール、アーキテクチャ方針の維持・改善を行う。

**決め事（Decision / ADR）**:
守るべき規範・アーキテクチャ意思決定の正本（`docs/decisions/`）。

**Stratum**:
要求からテストまでの双方向追跡（マトリクス・有向グラフ）と、工程別地層密度（Unit / ITa / ITb / ST / UAT）を分析・診断する機能。製品（`src/`）のための品質保証機能であり、製品そのものではない。ツールの都合を開発コードに強制しない。

## Relationships

- **`src/` 配下は製品（プロダクト）**: 開発の本尊は製品コード。トレーサビリティやダッシュボードは製品のための機能。
- **決め事（What）> コード**: 仕様や設計契約が正本。
- **実用性とコード配置の共存**: Stratum の可視化のために TypeScript コードの自由度や保守性を損なわない。
- **客観的エビデンス（ADR-0006）**: テスト実行ログ・レポート（`reports/test-results.json`）を唯一の合否証跡とし、Markdown への作文エビデンス混入を排除する。
- **起動先に迷ったら `/ask-me`**: 第一問は Spike or Specify。
- **Implement は TDD 必須**: 単体・結合が緑になるまで完了と言わない。
- **`docs/` にガイド・エージェント文書を増やさない**: ガイドは `README.md`, `DEVELOPER_GUIDE.md` 等に集約し、`docs/` は純粋な要求・仕様・設計・テスト仕様に保つ。

## Flagged ambiguities

- 「仕様」— `docs/`（REQ, SPEC, DSN）の決め事を指す。
- 「完了」— モードにより意味が違う。Specify の完了は仕様定義とリンク整合。Implement の完了は全テスト緑とレポート生成。
- 「レビュー」— コードレビューではなく仕様意図・整合性および地層充足度の点検。
- 「テスト結果」— Markdown の静的記述ではなく、`reports/test-results.json` の実測値。
