# Audit

主成果物は **人間判断用の指摘リスト**。修正の自動適用より、採否を委ねる。

## ステップ

1. **範囲を固定する。** 必須コンテキストは対象 PBI（あれば）・仕様パス・コード範囲（ブランチ/パス）だけに絞る。source／quality 全層／無関係 issue は読まない。完了条件: 範囲が一文で書ける。
2. **Gap（乖離）を洗う。**  
   - 仕様にあるが実装にない  
   - 実装にあるが仕様にない  
   各指摘に仕様引用とコード箇所を付ける。完了条件: Gap リスト（空でも明示）。
3. **Conform（拡大解釈）を洗う。** 仕様の文言を超える実装・過剰な抽象・スコープ外機能を指摘する。完了条件: Conform リスト（空でも明示）。
4. **L1 工学ラインを洗う。** 範囲内の実装・変更について `specs/L1/engineering-baseline.md` の **E1–E12** 違反を指摘する（該当なしも明示）。**E12（構造衛生）** は入り口の過多・責務重複・曖昧分岐を必ず洗う。詳細が L2 draft のみの項目は「L2 未整備」と分けて書いてよい。完了条件: Baseline 節がある。
5. **Assure を誘導する。** 範囲に製品仕様（L2/L3）または `quality/**` の `active` があれば `agents/engineering/assure/playbook.md`（`/assure`）に従う（Coverage + 実現）。どちらも無ければ「Assure: 対象なし」。完了条件: Assure 結果または対象なしがセッションに残る。
6. **次アクションを付ける。** 各指摘に「仕様変更 / 実装修正 / 無視（理由）」の選択肢を付ける。完了条件: 指摘ごとに次アクション候補がある。
7. **PBI を更新する。** 状態を audit → review 等へ。完了条件: PBI またはセッション要約に結果が残っている。

## 出力フォーマット

```markdown
## Gap
- [ ] ...

## Conform
- [ ] ...

## Baseline（L1 E1–E12）
- [ ] ...（E12 構造衛生を含む）

## Assure
- 対象なし | （/assure の出力をここに要約または添付）

## 次アクション
- ...
```

## セッション完了

指摘リストと次アクションがある。

## リファレンス

- L1 工学: `specs/L1/engineering-baseline.md`
- L2 詳細（draft）: `specs/L2/decisions/application-engineering.md`, `infrastructure-engineering.md`
- Assure（Coverage + quality 実現）: `agents/engineering/assure/playbook.md`
- モード索引: `AGENTS.md`
