# ForgOS + Stratum — 常時ルール（正本）

ツール固有の自動適用は `.cursor/rules/framework.mdc`（Cursor adapter）。手順の正本は `agents/`。

1. 作業開始時はモードを明示する（Spike / Specify / Implement / Audit / Steward）。
2. 仕様・決め事の正本は `docs/`（NEED, REQ, SPEC, DSN, ADR, QA, TC）の V-Model 体系とする。
3. Stratum の可視化や分析の都合で開発コードや TypeScript の配置・自由度を束縛しない。コードは自然に保守・テストしやすい構造を保つ。
4. 秘密情報をログ・コミット・仕様・出力に出さない。
5. Implement では TDD。単体・結合が緑になるまで完了と言わない。`npm test` による決定論的レポートを証跡とする。
6. ユーザー向け説明では **「継ぎ目」「シーム」を使わない**。公開インターフェース／アプリケーション境界／テスト境界／API など、平易またはシステム開発で一般的な語を使う。
7. **文書の置き場:** エージェント向け手順の正本は `agents/`。ツール固有の起動・常時ガードは adapter（`.cursor/skills/`・`.cursor/rules/`、`CLAUDE.md` 等）。
8. **品質と地層の可視化:** `bin/stratum check`、`bin/stratum report`、`bin/stratum matrix` による客観的フィードバックを活用する。

