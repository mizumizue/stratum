# Specify (Stratum / V-Model)

コードを書く前に、**`docs/` 配下に V-Model 体系に基づいた仕様・決め事** を記述する。
実装の How や内部構造ではなく、**What（ドメイン規則・契約・要件・受入基準）** を明確に規定する。

## ドキュメント体系と配置

| 種別 | 配置先 | プレフィックス | 説明・主な項目 |
|------|--------|----------------|----------------|
| 要求 | `docs/needs/` | `NEED-xxxx.md` | ユーザー・ステークホルダーの生の声・ビジネス上の欲求 |
| 要件 | `docs/requirements/` | `REQ-xxxx.md` | システムが満たすべき機能要件・非機能要件、受入基準 |
| 仕様 | `docs/specifications/` | `SPEC-xxxx.md` | 業務ルール、データモデル、契約、API仕様 |
| 設計 | `docs/design/` | `DSN-xxxx.md` | システムアーキテクチャ、レイヤー責務、コンポーネント設計 |
| 決定 | `docs/decisions/` | `ADR-xxxx.md` | アーキテクチャ意思決定記録（文脈、決定事項、結果） |
| 品質 | `docs/quality/` | `QA-xxxx.md` | 品質特性（信頼性、性能、移植性等）の目標と評価基準 |
| 検証 | `docs/test-cases/` | `TC-xxxx.md` | テスト仕様（Objective, Preconditions, Steps, Expected Results） |

※ 各ドキュメントのヘッダー形式・スキーマは `.cursor/rules/docs-document-schema.mdc` を厳格に遵守すること。

## ステップ

1. **対象レイヤと種別を決める**:
   - 変更・追加する内容が「要求（NEED）」「要件（REQ）」「仕様（SPEC）」「設計（DSN）」「決定（ADR）」のどこに属するかを特定する。
2. **仕様を What に留めて記述する**:
   - コードの内部実装手順（How）ではなく、システムが保証すべき振る舞いや契約（What）を記述する。
   - ADR-0006 に従い、テストケース（`TC-xxxx.md`）には仕様のみを記述し、実行結果やエビデンス（動的ログ）を Markdown に書き込まない。
3. **トレーサビリティリンク（`links`）を正しく繋ぐ**:
   - `NEED` → `REQ` → `SPEC` / `DSN` → `TC` の V-Model 参照リンク（YAML front matter の `links` 配列）を網羅する。
4. **ドキュメントの構文・整合性を機械検証する**:
   - ドキュメント検証スクリプトを実行し、エラーやリンク切れがないことを確認する。
   ```bash
   npm --prefix src run lint
   # または
   ./bin/stratum check
   ```
5. **Implement（実装）へ引き渡す**:
   - 仕様が固まったら、テスト駆動開発（**`/implement`**）へ進む。

## セッション完了

対象ドキュメントが追加・更新され、`npm --prefix src run lint`（ドキュメント検証）でリンク整合性が証明されている。
