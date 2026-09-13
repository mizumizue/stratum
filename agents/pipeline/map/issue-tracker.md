# イシュートラッカー / 公開先（本リポ正本）

本リポの `/spec-source`・`/cut`・`/map` の公開先・ファイル名・ライフサイクルは本ファイルが正。常時ガードの要約は `.cursor/rules/tracker-paths.mdc`。

`/cut` の直前に読む。

## 機能 PRD（`/spec-source`）

| 項目 | 規約 |
|------|------|
| 置き場 | `specs/source/<feature-slug>/spec.md` |
| トリアージ | 先頭付近に `Status: ready-for-agent`（または更新後の状態） |
| L2/L3 | **PRD を丸ごと置かない。** L2/L3 は glossary / actors / decisions / usecases 専用 |

L2/L3 への取り込みは `/promote`（Audit → Promote ゲート）。取り込み完了直後に当該 Source を削除する（由来トレースなし）。

## 実装イシュー（`/cut`）

**原則:** issue は **PBI（hub）から切る**。手順は `agents/pipeline/cut/playbook.md`。親 PBI をメタまたは本文に残す。

**Issue 先行:** 仕様化前に `issues/` で着手してよい。仕様化後は `/map` の枝 `reconcile` で PBI に対応リンクだけ載せる（`pbl/README.md`）。

承認後、次のディレクトリに **1 チケット 1 ファイル**で作成する。結合ファイルは作らない。

```text
issues/
├── backlog/        # 未着手（cut の公開先）
├── active/         # 作業中
├── pending_sync/   # 同期・人間ゲート待ちなど一時保留
└── completed/      # 完了（削除しない）
```

### ファイル名

`<feature-slug>-<NN>-<slug>.md`  
例: `feature-slug-01-short-name.md`  
番号は `01` から、依存順（ブロッカー優先）。

### 必須メタ（先頭付近）

```markdown
# <NN> — <チケットタイトル>

**Feature:** <feature-slug>

**PBI:** <PBI id または `pbl/...` パス>（issue 先行で未作成なら `pending-reconcile`）

**作るもの:** …

**Blocked by:** なし | <他チケットのファイル名または NN — タイトル>

**Status:** backlog

**Triage:** ready-for-agent
```

- `Status:` は次のいずれかのみ: `backlog` / `active` / `pending_sync` / `completed`
- `Status:` とファイルの親ディレクトリは**常に一致**させる
- `Triage:` は下表のラベル文字列

### トリアージラベル

| ラベル | 意味 |
|--------|------|
| `needs-triage` | メンテナ評価待ち |
| `needs-info` | 報告者からの追加情報待ち |
| `ready-for-agent` | 仕様が揃い、AFK エージェント向け |
| `ready-for-human` | 人間による実装が必要 |
| `wontfix` | 対応しない |

### ライフサイクル（削除禁止）

イシューファイルは**削除しない**。状態が変わったら:

1. 本文の `Status:` を新しい値に更新する
2. 対応する `issues/<status>/` へ **移動**する（`git mv` 推奨）

| 遷移の目安 | 操作 |
|------------|------|
| `/cut` で新規 | `issues/backlog/` に作成、`Status: backlog` |
| `/implement` 等で着手 | `active/` へ移動、`Status: active` |
| 外部同期・人間ゲート待ち | `pending_sync/` へ移動、`Status: pending_sync` |
| 受け入れ完了 / wontfix | `completed/` へ移動、`Status: completed`（コメントに理由） |

トリアージ変更は `Triage:` 行のみ。フォルダ移動の代わりにしない。

### フロンティア

`issues/backlog/`（およびブロッカーがすべて `completed` の票）のうち、`Triage: ready-for-agent` で番号の若いものから着手する。  
`Blocked by` が指すチケットは、ファイル名または `Feature` + `NN` で解決し、その票が `issues/completed/` にあるかで完了判定する。

### コメント

会話履歴は各ファイル末尾の `## Comments` 下に追記する。

## スキルが「イシュートラッカーに公開する」と言ったとき

- **仕様（仮・Source）** → `specs/source/<feature-slug>/spec.md`（Promote 後に削除）
- **取り込み（promote）** → `specs/L2|L3/...`（PRD を丸ごと置かない。Audit → ゲート後 → Source 削除）
- **hub（map）** → `pbl/`（PBI/Epic。`specs/` ↔ `product/` マップ）
- **チケット（cut）** → `issues/backlog/<feature-slug>-<NN>-<slug>.md`（原則は親 PBI から）

## スキルが「関連チケットを取得する」と言ったとき

`issues/{backlog,active,pending_sync,completed}/` を走査する（削除済みは存在しない前提）。
