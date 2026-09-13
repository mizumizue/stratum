# Assure (Stratum 品質保証点検)

Stratum における品質保証（Assure）は、仕様（`docs/`）に対するテストケース（`TC-xxxx.md`）の網羅性、テスト地層密度（Unit / ITa / ITb / ST / UAT）の健全性、および実測テスト実行結果（`reports/test-results.json`）の整合性を客観的に監査する。

## 点検の観点

1. **V-Model カバレッジ (Coverage)**:
   - 要件（REQ）、仕様（SPEC）、設計（DSN）に対して、対応するテストケース（TC）が存在するか。
   - 孤立ノード（親を持たない TC や、TC を持たない SPEC）がないか。
2. **テスト地層密度 (Stratum Density)**:
   - 5大テスト層（Unit / ITa / ITb / ST / UAT）のバランスが健全か。
   - ピラミッド充足度スコアが基準を満たしているか。
3. **実測実行検証 (Run & Evidence)**:
   - 全てのテストが自動実行され、緑（Pass）であるか。
   - ADR-0006 に従い、静的文書ではなく `reports/test-results.json` に客観的エビデンスが存在するか。

## ステップ

1. **ドキュメントリンク検査 & 製品コード静的解析**:
   ```bash
   npm --prefix src run lint       # FW仕様ドキュメント検証
   ./bin/stratum lint-product      # 多言語製品コード静的解析
   ```
2. **Stratum 地層健全性診断**:
   ```bash
   ./bin/stratum report
   ```
3. **トレーサビリティマトリクス確認**:
   ```bash
   ./bin/stratum matrix
   ```
4. **テストスイート実行とレポート検証**:
   ```bash
   npm --prefix src test
   ```

## 出力フォーマット

```markdown
## 地層健全性評価 (Stratum Report)
- 全体充足度スコア: ...
- ピラミッド判定: ...

## 追跡性網羅状況 (Traceability)
- 孤立ノード: ...
- 未カバー仕様: ...

## テスト実行結果 (Test Evidence)
- 合格: N / 失敗: 0 / 保留: 0

## 次のアクション
- ...
```
