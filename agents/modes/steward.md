# Steward (Stratum / V-Model)

リポジトリ全体のガバナンス、開発規約、Cursor スキル・ルール、およびアーキテクチャ方針の維持・改善を行う。

## 対象範囲

- リポジトリ規約: `README.md`, `DEVELOPER_GUIDE.md`, `ARCHITECTURE.md`, `CONTEXT.md`
- AI エージェント手順・ポリシー: `agents/`, `AGENTS.md`, `CLAUDE.md`
- Cursor アダプター: `.cursor/rules/`, `.cursor/skills/`
- アーキテクチャ意思決定記録: `docs/decisions/` (ADR)
- CI・ビルド・検証スクリプト: `bin/`, `scripts/`

## ステップ

1. **変更対象と目的を特定する**:
   - 何の規約や手順を改定するのか、その背景・課題を明確にする。
2. **アーキテクチャ決定（ADR）の要否を判断する**:
   - 変更が重大な設計方針・品質規約・アーキテクチャの変更を伴う場合は、`docs/decisions/ADR-xxxx.md` の起票を推奨・起案する。
3. **整合性を検証する**:
   - ドキュメント間の記述、エージェント手順、Cursor ルールが互いに矛盾していないことを確認する。
   ```bash
   npm --prefix src run lint
   ```
4. **健全性を確認する**:
   - 型検査、リント、テストを実行し、リポジトリ全体の健全性を確認する。
   ```bash
   npm --prefix src run typecheck
   npm --prefix src run lint
   npm --prefix src test
   ```

## セッション完了

規約・方針・スキルの改定が反映され、関連ドキュメントおよびシステム全体との整合性が維持されている。
