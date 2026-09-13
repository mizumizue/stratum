# Specify

コードを書かず、**L2/L3** に決め事・用語・アクター・ユースケース（必要なら PBI）を残す。Source を経由しない入口（`/spec-source` はフロー側・PRD 用）。Implement 中の仕様更新でも入る（ユーザー明示の Implement ↔ Specify。完了後は Implement に戻る。Source／`/promote` は使わない）。経緯（`adr/`）は必須ではない（重要なら推奨し、作成はユーザー確認後）。

## ステップ

1. **レイヤと種別を決める。** L2 横断か L3 ドメインか、glossary / actors / decisions / usecases かを選ぶ。完了条件: 書き込みパスが決まっている。
2. **ドメイン概念を提案する（勝手に増やさない）。** テーマや対象が既知のプロダクト種別・業界名を含む、または新規ドメインを立てるときは、その領域で当然視されそうな概念・状態・導線の候補を短くユーザーに提示し、採用／見送りを確認してから決め事に書く。見送りは無理に規範化しない（対象外にするなら理由付き）。**仕様を意図的に膨らませない。** 該当しなければ「提案不要」と明示してよい。完了条件: 候補提示とユーザー意向がセッション上明らか、または提案不要と明示。
3. **テンプレで書く。** 仕様は `agents/pipeline/promote/templates/spec.md`（ユースケースは同フォルダの `usecase.md`）。PBI は `agents/pipeline/map/templates/pbi.md`。決め事は What（ドメイン規則・受入境界・契約・Why）に留め、How・内部構造・手順は書かない（憲法 §2.8）。成熟度を明示する。ユースケースは `actors`（1つ以上）も必須。完了条件: front matter に maturity があり、書く／書かないに反する条がない。
4. **矛盾を列挙する。** 既存決め事との衝突を書き、未解決なら草案のまま止める。confirmed と競合する場合は仕様を変えずユーザーに検討を求める（L1 §4）。完了条件: 衝突が本文またはメモに載っている。
5. **PBI を更新する（任意）。** 仕様のみ完了なら状態を `specified` にする。実装 `done` と混同しない。完了条件: 状態が正しい、または PBI 不要と明示。
6. **経緯記録を提案する（任意）。** 代替案の却下理由を残す価値がある判断なら `adr/` への記録を推奨し、作成するかユーザーに確認する。承認なしに新規作成しない。完了条件: 推奨しない／見送り／作成のいずれかが明示。

## セッション完了

仕様記録と成熟度があり、必要なら PBI が `specified`。L2/L3 に書いたら `product/` 実装は成熟度 draft でも可（`done` は stable 以上）。Implement から入った場合は Implement に戻る旨を明示する。

## リファレンス

- `specs/README.md`
- 仕様テンプレ: `agents/pipeline/promote/templates/`
- 経緯テンプレ（任意）: `agents/modes/steward/templates/adr.md`
- PBI テンプレ: `agents/pipeline/map/templates/pbi.md`
- モード索引: `AGENTS.md`
- Implement（同一セッション可）: `agents/modes/implement.md`
- 機能 PRD を取り込むなら `/promote`（`specs/L1/promote-gate.md`）
- 粗い Source から試すなら `/spike`（＋ `/spec-source`）
