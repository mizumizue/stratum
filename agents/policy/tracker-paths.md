# トラッカー／パイプライン経路

公開先正本: `agents/pipeline/map/issue-tracker.md`（cut の配置規約）。

- spec-source → `specs/source/<feature-slug>/spec.md`（仮仕様。L2/L3 に PRD 丸ごと禁止）
- promote → Audit 後 `specs/` L2/L3 へ取り込み。完了直後に Source を削除。手順: `agents/pipeline/promote/`
- map → `pbl/`。手順: `agents/pipeline/map/`。issue は原則 PBI から cut
- cut → `issues/backlog/<feature-slug>-<NN>-<slug>.md`。PBI から切る。`Status: backlog`
- 公開トラッカーと同期するときは **公開側が正**。`Status:` など公開フィールドをリポジトリ側の独自値で上書きしない。`Triage:` などリポジトリ専用フィールドは公開へ送らない

Cursor での起動名: `/spec-source` `/promote` `/map` `/cut`。
