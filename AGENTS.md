# Agent 向けメモ (ForgOS + Stratum)

このリポジトリは **ForgOS**（AI 工程 OS スターター）および **Stratum**（V-Model 品質・地層密度分析プラットフォーム）が共存する環境です。

作業開始前に [CONTEXT.md](./CONTEXT.md) と [docs/SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md) を読む。

どのモード／スキルを使うか迷ったら **`agents/ask-me.md`**（ルーター）。Cursor では `/ask-me`。

## モードで開始する

開始時はスキル名ではなく **モード** を選ぶ。**入口（Mode）とフロー（Pipeline）は別軸。** 第一分岐は Spike or Specify。

| やりたいこと | モード | 起動 | セッション完了の目安 |
|--------------|--------|------|----------------------|
| あいまい要件を触って減らす | Spike | `/spike` | 粗いプロトタイプ／学習メモ |
| 規範を `docs/` に書く | Specify | `/specify` | 仕様記録と整合性、必要なら V-Model リンク |
| 仕様に従い実装（TDD） | Implement | `/implement`（TDD: `/tdd`） | TDD と単体・結合緑。客観的レポート生成 |
| 乖離・充足度・地層チェック | Audit | `/audit` | 指摘リストと Stratum 地層分析レポート |
| FW / 構成のメンテ | Steward | `/steward` | ルールや構成変更と記録 |

### モード選択（早見）

- 要件が曖昧で触って学びたい → **Spike**（第一分岐）
- 規範として書ける → **Specify**（第一分岐）
- 仕様があり実装する → **Implement**（TDD: `/tdd`）。`npm test` でグリーンを確認。
- 「仕様どおりか」「テストピラミッドが健全か」を点検 → **Audit** (`./bin/stratum check`, `./bin/stratum report`)
- どれを起動すべきか迷う → `/ask-me`（ルーター）


Promote（仕様昇格）は独立モードではない。`specs/source` の PRD（仮仕様）を L2/L3 へ取り込むときは `/promote`（Audit 必須・人間ゲート）。取り込み完了直後に Source を削除。ゲート定義は `specs/L1/promote-gate.md`。

**モード外スキル:** Implement の TDD は `/tdd`。Coverage（仕様→保証）と Discovery（specs 外保証）の実現点検は `/assure`（正本 `agents/engineering/assure/`）。Assure の **Specify 候補（Discovery → Specify 直書き）** は終わりの型（実装学習を What に結晶化。Source 非経由）。Implement 中の仕様更新はユーザー明示の Specify（Implement↔Specify）。

スタック未決で default example からプロダクトリポへ仕立てる場合（モード外）: `/bootstrap-product`（破壊的・ユーザー起動のみ）。

### モード選択（早見）

- 要件が曖昧で触って学びたい → **Spike**（第一分岐）
- 規範として書ける → **Specify**（第一分岐）
- L2/L3 があり実装する → Implement（TDD: `/tdd`）。draft でも `product/` 可。`done` は stable 以上。仕様を直すならユーザー明示で Specify に入り戻る（Implement ↔ Specify）
- 「仕様どおりか」「やりすぎていないか」を点検 → Audit
- 「仕様が保証に載っているか／保証が実現されているか」を点検 → `/assure`（モード外。Discovery→Specify 直書き＝終わりの型（Source 非経由））
- どれを起動すべきか迷う → `/ask-me`（ルーター）
- `specs/source` の PRD を L2/L3 に取り込む → `/promote`（モード外・人間ゲート・完了後 Source 削除）
- default example でプロダクト用に仕立てる → `/bootstrap-product`
- この FW 自体を直す → Steward

### パイプライン（成果物の流れ）

```text
source(+sandbox) → L2/L3 → pbl → issues → product → audit（→ assure）
 （Source・試し）   （決め事） （hub） （同一セッション可）
                     ↑_______________________|
                     Implement ↔ Specify（ユーザー明示）
```

Source へ書く起動は `/spec-source`。取り込むのは `/promote`（直後に Source 削除）。旧起動名 `/draft` は使わない。Implement 中の仕様更新はユーザー明示の Specify（Implement ↔ Specify。Source／promote 非経由）。

| 起動 | 正本 |
|------|------|
| `/spec-source` | `agents/pipeline/spec-source/` → `specs/source/` |
| `/promote` | `agents/pipeline/promote/` |
| `/map` | `agents/pipeline/map/`（issue 規約: `issue-tracker.md`） |
| `/cut` | `gents/pipeline/cut/`（map と同セッション可） |
| `/assure` | `agents/engineering/assure/` → `specs/`（Coverage）+ `quality/`（catalog／実現）+ Discovery→Specify 候補 |
| `/ask-me` | `agents/ask-me.md`（ルーター。モード・パイプライン案内） |

hub の説明: `pbl/README.md`

## 編集制約（要約）

- **L1 は編集しない**（Steward で提案のみ）
- **決め事は What**（How・内部構造・手順は書かない。憲法 §2.8）。定常の「決め事 > コード」は What の正本
- **`product/`** は L2/L3 に紐づける（draft 可）。**`done` は stable 以上**。向きは **仕様 → 実装**。How の正本はここ
- **`sandbox/`** は Source の試し場（L2/L3 本実装は置かない）
- **L2/L3 からソースも Source も参照しない**（関連コードは hub＝PBI / issue。L1 憲法 §2.5）
- 定常の第一ページは **対象決め事＋PBI 対応表**（無ければ決め事＋欠落明示）
- **issue は原則 PBI から切る**（Issue 先行可。後から PBI に対応だけ載せる）
- 秘密情報をログ・コミット・仕様に出さない
- Implement 完了に単体テスト緑が必須
- **`docs/` にガイドを増やさない** — 領域 README、または `agents/`（手順正本）／ツール adapter（framework ルール 9 / L1 憲法 §10）

## ディレクトリ

| パス | 役割 |
|------|------|
| `specs/` | 仕様（L1/L2/L3）と `source/`（仮の機能 PRD＝Source。Promote 後削除） |
| `quality/` | 実装後に保証する挙動・品質（単体／内部結合が FW 保証。システムは任意。機能・非機能） |
| `issues/` | 実装イシュー（`backlog` / `active` / `pending_sync` / `completed`） |
| `adr/` | 任意の経緯（必須ではない。重要なら推奨→ユーザー確認） |
| `pbl/` | PBI / Epic（**hub**: `specs/` ↔ `product/`。マップ正本は対応表） |
| `product/` | プロダクト実装（L2/L3 紐づけ。内部構成は任意） |
| `agents/` | 工程手順の正本（Mode / Pipeline / policy）。ツール入口は adapter |
| `tools/` | 機械ゲート（不変条件。`python -m tools.check`。Approve しない） |
| `sandbox/` | Source の試しコード（Spike） |
| `examples/` | 参考実装（Bootstrap 前の default。コア規約はスタック非依存） |
| `docs/` | **ガイド置き場にしない**（framework ルール 9）。運用記録が必要なら人間が最小限 |

テンプレのプロダクト置き場は `product/` 配下。L3 の第一軸はアプリ関心ドメイン（例: `specs/L3/tasks/`）。技術横断は L2。`examples/` 内部のレイアウトはテンプレ地図と意図的に別形でよい。

詳細: `specs/README.md` / `quality/README.md` / `pbl/README.md`（PBI マップ＝規範 ID 対応表）。モード手順は上記および `agents/modes/`。迷いどころは `gentsgentsgents/ask-me.md（Cursor: /ask-me）.md（Cursor: gents/ask-me.md（Cursor: /ask-me））.md（Cursor では gentsgents/ask-me.md（Cursor: /ask-me）.md（Cursor: gents/ask-me.md（Cursor: /ask-me）））`。

### Domain（調査時）

- 読む: `CONTEXT.md`、規範は `specs/**/decisions/`、導線は `specs/**/usecases/`
- 欠如しても黙って続行。先回り作成を提案しない
- 用語は `CONTEXT.md` / `specs/**/glossary/` に合わせる
