# ForgOS + Stratum (Context)

リポジトリ規約と Cursor 第一の AI 工程 OS（**ForgOS**）に、V-Model トレーサビリティ・品質地層分析プラットフォーム（**Stratum**）を統合した環境。工程手順の正本は `agents/`、仕様・設計・検証の正本は `docs/`。

## Language

**Mode（モード）**:
Spike / Specify / Implement / Audit / Steward。作業の公式入口。第一分岐は Spike or Specify。フロー（Pipeline）とは別軸。

**Spike**:
あいまいな要件を触って減らす。粗いプロトタイプや検証コード。

**Specify**:
`docs/` に仕様（NEED, REQ, SPEC, DSN）を記述する入口。

**Implement**:
TDD に従い、単体・結合テストが緑になるまで実装を推進する。

**Audit**:
仕様（`docs/`）と実装の乖離、および Stratum によるトレーサビリティ・テストピラミッド充足度を点検する。

**決め事（Decision / ADR）**:
守るべき規範・アーキテクチャ意思決定の正本（`docs/decisions/`）。

**Stratum**:
要求からテストまでの双方向追跡（マトリクス・有向グラフ）と、工程別地層密度（Unit / ITa / ITb / ST / UAT）を分析・診断するツール。ツールの都合を開発コードに強制しない。

## Relationships

- **決め事（What）> コード**: 仕様や設計契約が正本。
- **実用性とコード配置の共存**: Stratum の可視化のために TypeScript コードの自由度や保守性を損なわない。
- **客観的エビデンス**: テスト実行ログ・レポート（`reports/test-results.json`）を唯一の合否証跡とする。

- 検証・品質の保証は `quality/`（`specs` と分離）。`/assure` は Coverage（specs↔保証）と実現を洗う。Discovery の製品 What 格上げは Specify 直書き（終わりの型）。初回 Source→L2/L3 のみ Promote（直後に Source 削除）。Implement 中の仕様更新はユーザー明示の Specify（Implement↔Specify）
- 起動先に迷ったら `/ask-me`（第一問は Spike or Specify）
- PBI は hub（`specs/` ↔ `product/`）。定義は `pbl/README.md`。マップの正は規範 ID 対応表。`done` と `specified` を区別する。関連コード/PR は PBI・issue 側
- issue は原則 PBI から切る。Issue 先行後は仕様化して PBI に対応だけ載せる
- Implement は TDD 必須。`product/` は L2/L3（draft 可）に紐づけ可。`done` は stable 以上。人間は仕様意図レビュー
- `examples/` は参考。コア規約はスタック非依存
- FW 保証は単体・内部結合まで（`quality/README.md`）。システム／UAT は任意記録。hub への追記は `pbl/README.md`
- `docs/` にガイド・エージェント文書を増やさない（L1 憲法 §10）

## Flagged ambiguities

- 「仕様」— 決め事を指すことが多い。PBI と混同しない。品質保証は `quality/`、Coverage／実現点検は Assure
- 「完了」— モードにより意味が違う。PBI `done` は stable 以上。draft の `product/` 作業は WIP
- 「レビュー」— コードレビューではなく仕様意図・整合
- 「ビルド」— アプリ／CI のビルド。モード名は Implement
- 「Audit」— specs↔実装。Assure — Coverage（specs→保証）＋ Discovery（specs 外保証）＋ Evidence/Run
- 「draft」— **成熟度**（L2/L3 の凍結前）。スキル `/spec-source`・旧名 `/draft` `/inbox`・「下書き」一般と混同しない
- 「ソース」— 実装ソースコードではなく、文脈によって **Source（機能 PRD）** を指す
