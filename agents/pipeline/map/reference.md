# map 枝手順

ステップ 3 で読む。各節は一つの枝。issue 切出しは `/cut`。

## map — PBI 新規／更新

1. ユーザー価値の一塊を一文で固定する。既存 PBI があればそれを更新し、なければ `pbl/` に同フォルダの `templates/pbi.md` で新規作成する（id は既存最大＋1）。
2. **対応表を埋める（必須）。** 各関連決め事の Dn・関連ユースケース・受入条件 AC を行にする。列は規範・証拠・issue・状態（`covered` / `partial` / `gap`）。アンカーは `<decision-slug>#D<n>` / `usecases/<slug>` / `AC-<n>`。
3. **補助一覧を整える。** 表から辿れる仕様パス・コード/PR・issue を重複なく列挙（フォルダ列挙のみは不可）。
4. `status` を置く（仕様のみなら `specified`。実装完了と混同しない）。
5. Epic 配下なら Epic の「配下 PBI」にリンクを足す。

完了条件: 対応表に対象規範の行があり、テンプレ必須欄が埋まっており、`specs/` 側の L2/L3 に `product/` パスを書いていない。

## epic — Epic 管理

1. テーマが複数 PBI にまたがるときだけ `pbl/epics/` に薄い Epic を置く（同フォルダの `templates/epic.md`）。単一 PBI なら Epic を作らない。
2. 「意図」と「配下 PBI」だけを持つ。受入条件・対応表・コードパスは配下 PBI に置く（Epic にマップを二重化しない）。
3. 閉じるときは配下 PBI がすべて `done` または `specified`（意図どおり）であることを確認し、`status: closed` にする。

完了条件: Epic から全配下 PBI へ辿れ、各 PBI から Epic id へ戻れる。

## reconcile — issue 先行の後付け

Issue 先行で実装され、のちに L2/L3 化されたあとに hub を閉じる枝。

1. 対象 issue（複数可）と、対応する `specs/` パス（Promote 済み）を列挙する。
2. ユーザー価値の一塊として PBI を新規または更新する。**対応表**に規範・証拠・issue・状態を載せる。受入条件は決め事／ユースケースから転記する（issue 本文を正本にしない）。
3. issue 側コメントまたはメタに親 PBI パスを追記する。

完了条件: 対応表から specs・証拠・issue が辿れ、L2/L3 本文に実装パスが増えていない。
