# Spike

あいまいな要件を **触って減らす**（要件スパイク）。粗い **Source** を持ち、試し実装は **`sandbox/`**。正は一時的に sandbox。L2/L3 への自動昇格はしない。`product/` には書かない。

## ステップ

1. **疑問を1つに絞る。** ユーザーの目的・制約を確認し、このセッションで答える疑問を一文で書く。完了条件: 疑問が1文で書けている。
2. **粗い Source を置く。** `specs/source/<feature-slug>/spec.md` が無ければ作る（仮説・問いで可。粒度は粗くてよい）。既存があれば更新する。手順の詳細は `/spec-source`。完了条件: Source パスがあり、疑問と紐づいている。
3. **置き場を sandbox にする。** `sandbox/<topic>/` に実装する。`product/` に混ぜない。完了条件: パスが `sandbox/` 配下。
4. **最小スパイクを作る。** テストは任意。仕上げ・永続化・抽象化は疑問に答える分だけ。完了条件: 1コマンドで動く、または学習メモだけで十分ならメモがある。
5. **学習を残す。** 仮説・観測・次アクションを `sandbox/<topic>/LEARNINGS.md` および／または Source 補足・関連 PBI に書く。完了条件: 学習メモが更新されている。
6. **Promote を提案する（強制しない）。** 仕様化すべき知見があれば草案を提示する。取り込みは人間が `/promote` で行う（ゲート: `specs/L1/promote-gate.md`）。規範が最初から書けるなら `/specify` への切替も可。完了条件: 昇格／保留／Specify 切替のいずれかが明示されている。

## セッション完了

粗い Sourceと sandbox／学習メモ／仮説が更新されている。

## リファレンス

- モード索引: `AGENTS.md`
- Source 作成: `/spec-source`
- PBI 状態が exploring ならリンクを更新する
- 経緯: `adr/0001-maturity-locus-and-entry-split.md`
