# Map

PBI は **hub** — 正本ではなく `specs/` ↔ `product/` のマップ。issue は原則 hub から `/cut` で切る。マップの正は **対応表**。**`/cut` とは同一セッションで続けてよい**（段の削除ではない）。

## ステップ

1. **枝を決める。** 次のいずれか一つに限定する: `map`（PBI 新規／更新）/ `epic` / `reconcile`（issue 先行の後付け）。issue 切出しは `/cut`（同セッション可）。完了条件: 枝名と対象パス（PBI / Epic）が一文で揃っている。
2. **hub 規則を読む。** 作業前に `pbl/README.md` を読む。完了条件: 対応表の列・アンカー規約と `done` 条件を把握している。
3. **枝を実行する。** 手順は同フォルダの `reference.md` の該当節。完了条件: その節末の完了条件を満たす（対応表必須）。
4. **マップを示す。** 対象 PBI（または Epic）について対応表の要約（行数、`gap`/`partial` の有無）と、補助の仕様／証拠／issue を報告する。完了条件: 対応表が空でなく、報告に `gap`/`partial` の扱いが含まれる（無ければその旨）。
5. **（任意）続けて `/cut`。** ユーザーが同一セッションで issue 切出しを望むなら `/cut` の手順に進む。完了条件: cut しない／した、が明示。

## リファレンス

- hub 定義・対応表・`done`: `pbl/README.md`
- 枝手順（map / epic / reconcile）: 同フォルダの `reference.md`（ステップ 3 の直前）
- issue 公開先・ファイル名・トリアージ: 同フォルダの `issue-tracker.md`
- テンプレ: 同フォルダの `templates/pbi.md` / `templates/epic.md`
- issue 切出し: `/cut`
