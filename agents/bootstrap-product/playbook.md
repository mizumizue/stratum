# Bootstrap Product

公式5モードの外。**一度きり**のリポジトリ仕立て。default example を `product/` へ展開し、examples / デモ成果物を削除してプロダクト入口にする。

破壊的。ユーザーが明示起動したときだけ実行する。

## ステップ

1. **不可逆であることとプロダクト名を確認する。** 次をユーザーに明示し、合意を得る: `examples/` 削除、デモ L3/PBI/Epic 削除、README 差し替え、`product/` への展開。プロダクト名（package / README 用）を1つ決める。ドメイン名は任意（未定ならデモ概念を残さずプレースホルダ）。完了条件: ユーザー合意とプロダクト名がある。
2. **default example を特定する。** `examples/README.md` の default（未記載なら唯一の example ディレクトリ）。展開元が無い場合は中止する。完了条件: ソースパスが一文で固定されている、または実行不可と明示。
3. **`product/` へ展開する。** 詳細マップは [reference.md](./reference.md) の「展開マップ」。既存の空 `product/apps` README は上書きしてよい。ルートの `sandbox/` は残す。モノレポ根（`package.json` / `pnpm-workspace.yaml` 等）は **`product/` 直下**に置く。`infra/` は example に含まれる場合のみ展開し、空スタブは作らない。完了条件: `product/` にアプリ実装と `product/package.json` が存在する（`product/infra` は必須ではない）。
4. **example 固有名を剥がす。** example スラッグ / パッケージ名 / デモ仕様パス参照を、プロダクト名ベースに置換する。決め事・PBI へのデモリンクは残さない（次ステップでデモ自体を消す）。完了条件: `product/` 配下を検索して example 固有スラッグがゼロ。
5. **examples とデモ成果物を削除する。** 削除リストは [reference.md](./reference.md) の「削除リスト」。`specs/L3/_template`・空の `pbl` 構造は残す。すでにアプリ関心ドメインがある場合は残す。L3 に `infrastructure` 等の技術ドメインは置かない（L1 憲法 §1.4）。完了条件: 削除リストのパスが存在しない。
6. **プロダクト README に差し替える。** プロダクト名をタイトルに、Quickstart は `cd product && pnpm install && pnpm test` 系。ForgOS への言及は一行（工程 OS として残している旨）まで。完了条件: ルート README がプロダクト入口であり、examples 案内がない。
7. **案内を同期する。** `AGENTS.md` の `examples/` 行を削除または「Bootstrap 済み／example 無し」。Directory 説明を `product/` モノレポ前提に更新。CI があれば `product/` 向けに直すか削除。完了条件: 壊れたパス参照が残っていない。
8. **煙テストする。** `cd product && pnpm install && pnpm test && pnpm typecheck`（example に準ずるコマンド）。失敗したら直してから完了とする。完了条件: 単体と typecheck が緑。
9. **次モードを提示して終了する。** 例: 要件が曖昧 → `/spike`、仕様から実装 → `/implement`。完了条件: 次アクションが一文である。

## リファレンス

- 展開・削除の詳細: [reference.md](./reference.md)
- 工程の正本: `specs/L1/`（本スキルは L1 を編集しない）
- L3 レイアウト: `specs/L1/constitution.md` §1.4、`specs/README.md`
