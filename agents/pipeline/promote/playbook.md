# Promote

`specs/source/<feature-slug>/spec.md`（機能 PRD・仮仕様）を **Audit 済み**のうえで `specs/` の glossary / actors / decisions / usecases に取り込む。成熟度の上げは人間ゲート。PRD の再生成はしない。インタビューしない — 既知の PRD・既存 L3・（Audit 用の）関連実装観測を統合するだけ。**書き込む L2/L3 にソースパスも Source リンクも載せない**（L1 憲法 §2.5）。取り込み完了直後に当該 Source を削除する。

## ステップ

1. **Source を固定する。** 取り込み元を `specs/source/<feature-slug>/spec.md` に決め、対象アプリ関心ドメイン（L3）または横断（L2）を一文で書く。完了条件: Source パス・Feature・書き込み先レイヤ／ドメインが一文で揃っている。
2. **Audit する。** 取り込み前に Audit を完了する。手順は `agents/modes/audit.md` に従う。範囲は「当該 PRD ＋ 既存の対象 L2/L3 ＋ 関連 sandbox／実装」。完了条件: Gap / Conform / Baseline リストがあり、各指摘に次アクションがあり、未解決の取り込みブロッカーがゼロ（または人間が「先送りで取り込み可」と明示済み）。
3. **PRD を分解する。** Source の各節を L2/L3 種別に対応付け、既存ファイルとの差分草案を作る（この時点では L2/L3 未書込でよい）。テスト可能な **公開インターフェース／アプリケーション境界** は実装上の決定から拾い、既存の高い境界を新規より優先する。対応表は分解に入る直前に `reference.md` を読む。完了条件: 種別ごとの草案と、既存決め事との衝突一覧がある。
4. **Promote ゲートを埋める。** `specs/L1/promote-gate.md` の完了条件 7 項をチェック表にし、各項を OK / 不足 / 人間判断待ち のいずれかにする。完了条件: 7 項すべてに状態がある。
5. **人間承認を取る（承認カード）。** L2/L3 へ書く前に、同フォルダの `reference.md` の **「承認カード」** 節どおり提示する。各選択肢の差分を具体的に書き、比較したうえで **推奨と次点とその理由** を必ず付ける。成熟度の変更は承認前に反映しない。完了条件: 承認カード（比較・推奨・次点・理由・返信例）を出し、ユーザー返信で書き込み範囲と成熟度が明示されている。未承認・曖昧ならここで止める。
6. **L2/L3 に反映する。** 承認範囲だけを同フォルダの `templates/spec.md`（ユースケースは `templates/usecase.md`）で書く。新規ドメインは `specs/L3/_template/` をコピーしてから埋める。**関連に `product/`・実装ファイルパス・Source パスを書かない。** 決め事本文は What のみ（How・内部構造・手順は書かない。憲法 §2.8）。完了条件: 書いたパス一覧があり、front matter の layer / kind / maturity（L3 は domain、usecases は actors）が揃っている。
7. **Source を削除する。** ステップ 6 完了直後に、ステップ 1 で固定した Source（および空になった親ディレクトリ）を削除する。hub／L2/L3 に Source 由来の痕跡を残さない。`sandbox/` は触らない。確認: `python -m tools.check --promoted <feature-slug>`。完了条件: 当該 Source パスが存在しない。

## リファレンス

- 分解対応・PRD 節の読み方: 同フォルダの `reference.md`（ステップ 3 の直前）
- テンプレ: 同フォルダの `templates/spec.md` / `templates/usecase.md`（ステップ 6）
- Audit: `agents/modes/audit.md`
- Promote ゲート: `specs/L1/promote-gate.md`
- 機械ゲート（Source 残り）: `tools/check/`（`python -m tools.check --promoted <slug>`）
- 仕様モデル: `specs/README.md`
- イシュー公開先: `agents/pipeline/map/issue-tracker.md`
