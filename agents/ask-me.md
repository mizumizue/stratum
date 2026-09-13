# スキル案内（ForgOS）

手順の正本は gents/（Cursor の slash は .cursor/skills adapter の起動名）。索引は AGENTS.md / CLAUDE.md。

モードとスキルをすべて覚えなくてよい。ここで経路を選ぶ。

このスキルは**ルーター**である: 到達先の名前とタイミングを示すだけ。ユーザー起動スキルを代理実行はできない — 案内後、ユーザーが該当名を入力する（またはモデル起動スキルならエージェントが続く）。

作業開始前の共通前提: [CONTEXT.md](../../../CONTEXT.md) と [specs/L1/constitution.md](../../../specs/L1/constitution.md)。索引の正本は [AGENTS.md](../../../AGENTS.md)。

**入口（Mode）とフロー（Pipeline）は別軸。** 迷ったらまず入口の第一分岐へ。

## 第一分岐（入口）

| 状況 | 起動 | 乗るもの |
|------|------|----------|
| あいまい → 触って減らす | `/spike` | 粗い Source ＋ `sandbox/`。Source 作成は `/spec-source` |
| 規範として書ける | `/specify` | L2/L3 直書き（Source を経由しない） |

## 第二段（入口）

| やりたいこと | 起動 | メモ |
|--------------|------|------|
| L2/L3 に従い `product/` 実装 | `/implement` | TDD は `/tdd`。draft 可。`done` は stable 以上。仕様更新はユーザー明示で `/specify` に入り戻る（Implement ↔ Specify） |
| 仕様どおりか・やりすぎていないか | `/audit` | 品質実現は `/assure` |
| FW（L1・スキル・骨組み）を直す | `/steward` | L1 は提案→人間承認 |

## メインフロー: 機能 PRD → 実装 → 点検

成果物が流れる経路。入口 Spike から乗ることが多い。`/map` と `/cut` は同一セッション可。パイプラインは **置き場** で示す。

1. **Source**（起動 `/spec-source`）— `specs/source/<feature-slug>/spec.md` に書く（Spike と併用可。粒度は粗くてよい）。試し実装は **`sandbox/`**。L2/L3 に PRD を丸ごと置かない。
2. **L2/L3**（`/promote`）— Audit 後、Source を取り込む。人間ゲート。取り込み完了直後に Source を削除。ここから `product/` 可。
3. **pbl**（`/map`）— PBI／Epic を載せる（hub）。マップは規範 ID 対応表必須。
4. **issues**（`/cut`）— PBI から切る（map と同セッション可）。
5. **product**（`/implement`）— L2/L3 に紐づけて実装。内部で **`/tdd`**。`done` は stable 以上。仕様更新が必要なら **ユーザー明示** で `/specify` に入り、決め事を更新してから Implement に戻る（Implement ↔ Specify）。Source／`/promote` は使わない。
6. **点検**（`/audit` → 必要なら `/assure`）— specs ↔ 実装。active 保証があれば Assure。

```text
source(+sandbox) → L2/L3 → pbl → issues → product → audit（→ assure）
                     ↑_______________________|
                     Implement ↔ Specify（ユーザー明示）
```

## モード外スキル

公式5モードではないが、メインフローから到達する。

| 起動 | いつ |
|------|------|
| `/tdd` | Implement 中のテストファースト手順 |
| `/assure` | Coverage（L2/L3→保証）と Discovery（specs 外）の証拠・実行 |
| `/promote` | source → L2/L3（上記メインフロー。完了直後に Source 削除） |
| `/spec-source` `/map` `/cut` | パイプライン各段 |
| `/bootstrap-product` | default example でプロダクト用に仕立てる（破壊的・一度きり） |

## 置き場の早見

| 正本 | パス |
|------|------|
| 仕様 | `specs/`（source / L2 / L3） |
| 品質保証 | `quality/`（FW 保証は単体・内部結合。合格条件: `<layer>/catalog.md`。点検は `/assure`） |
| hub | `pbl/`（説明: `pbl/README.md`） |
| issue | `issues/` |
| 本実装 | `product/`（L2/L3 紐づけ） |
| Source の試し | `sandbox/` |
| 参考実装 | `examples/`（Bootstrap 前） |
| 経緯（任意） | `adr/`（必須ではない。推奨→ユーザー確認） |

## 使わない／旧名

- `draft` / `inbox`（スキル）— 旧。正は `/spec-source`（置き場 `specs/source/`。ADR-0001）
- `explore` / `build` / `spec-only` / `maintain-fw` / `verify` / `to-pbl` / `extract` — 旧名または別名残骸。正は Spike / Implement / Specify / Steward / Audit / map・spec-source・promote 系
- 「draft 成熟度だから sandbox」— **旧。** L2/L3 draft は `product/`。sandbox は Source 試し専用（L1 0.8.x / ADR-0001）

## 迷ったら

1. 要件が曖昧 → `/spike`（必要なら `/spec-source`）
2. 規範が書ける → `/specify`
3. 実装する → `/implement`（`/tdd`）。仕様を直すならユーザー明示で `/specify` に入り戻る
4. 仕様と実装の点検 → `/audit`
5. 仕様の保証 Coverage／品質実現 → `/assure`
6. example からプロダクト化 → `/bootstrap-product`
7. FW 自体 → `/steward`
8. どれか不明 → このスキルの第一分岐をユーザーに見せ、一文で目的を聞き直す
