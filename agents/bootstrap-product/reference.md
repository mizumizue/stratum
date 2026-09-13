# bootstrap-product リファレンス

## Default example

- 正本: `examples/README.md` が指す default。未記載かつ1本だけならそのディレクトリ。
- 既定: `examples/taskboard`（React / Hono / Vitest / Playwright / Prisma schema / Terraform 最小）

## 展開マップ

ソース: `examples/<default>/` → 宛先: `product/`

| ソース | 宛先 |
|--------|------|
| `apps/` | `product/apps/` |
| `packages/` | `product/packages/` |
| `infra/` | `product/infra/`（example に含まれる場合のみ。空スタブは作らない。L1 憲法 §1.3） |
| `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig*.json`, `.npmrc`, `.env.example`, `docker-compose.yml` 等のモノレポ根 | `product/` 直下 |
| （なし） | ルートの `sandbox/` は既存のまま残す |

コピー後、ソース側の README で「example / 参考実装」と書いている文言はプロダクト向けに直すか削除する。

## 削除リスト

セットアップ完了時に存在してはならないもの（デモ系）:

- `examples/` 配下の default example ディレクトリ
- デモ L3 ドメイン（例: `specs/L3/tasks/`）
- デモ Epic / PBI（例: EPIC-0001-taskboard / PBI-0001-create-task）
- `examples/taskboard` 向けのデモ検証メモ（あれば）

残す:

- `specs/L1/`
- `specs/L2/`
- `specs/L3/_template/`
- すでに存在するアプリ関心ドメイン（技術ドメイン名は置かない。L1 憲法 §1.4）
- `AGENTS.md` / `README.md` 等の工程ガイド
- `agents/`（手順正本）と各ツール adapter（`.cursor/skills/`、`CLAUDE.md` 等）
- `sandbox/`
- `product/` 配下のアプリ実装（`infra/` は必須ではない。L1 憲法 §1.3）

## 検索チェック（剥がし確認）

`product/` とルート案内から、次が残っていないこと:

- 旧 example 固有スラッグ（パッケージ名・パス・文言）
- `@taskboard/` 等の旧パッケージ scope
- `examples/taskboard`
- デモ決め事パス `specs/L3/tasks/`

許容: 本スキル内の「かつて example だった」という経緯記述。
