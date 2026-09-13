# Cut

計画・仕様・会話を **tracer bullet** の垂直スライスに分解し、`issues/backlog/` へ切る。**原則は PBI（hub）から切る。** `/map` と同一セッションで続けてよい。公開先・メタは `agents/pipeline/map/issue-tracker.md`。

## ステップ

1. **コンテキストを固定する。** 親 PBI（または issue 先行ならその旨）と、参照する仕様／PRD を一文で書く。PBI が `ready` 未満なら人間承認を取る。完了条件: 親と Source／決め事が明示されている。
2. **公開規約を読む。** `issue-tracker.md` を読む。完了条件: ファイル名・Status・Triage を把握している。
3. **垂直スライスを下書きする。** 各スライスは全レイヤーを通る狭い完全パス。完了したスライスは単独でデモ／検証可能。各票に **Blocked by** を付ける。広範リファクタは expand–contract で順序付ける（垂直に無理に入れない）。完了条件: 番号付き分解案がある。
4. **ユーザーに確認する。** 粒度・ブロック辺・分割／統合を承認するまで反復する。完了条件: 分解が明示承認されている。
5. **公開する。** 承認済み票を `issues/backlog/<feature-slug>-<NN>-<slug>.md` に 1 票 1 ファイルで書く（テンプレは下）。親 PBI の「関連 issue」にパスを列挙する。親イシューをクローズしない。完了条件: 全票が backlog にあり、PBI ↔ issue が辿れる（issue 先行なら PBI は `pending-reconcile`）。

### 垂直スライス

- 各スライスはスキーマ・API・UI・テストなど必要な層を通る狭いが完全なパス
- 1 スライスは単一の新鮮なコンテキストに収まるサイズ
- プリファクタリングは最初の票で行う

### チケットファイル（ローカル）

```markdown
# <NN> — <チケットタイトル>

**Feature:** <feature-slug>

**PBI:** <PBI id またはパス>

**作るもの:** このチケットが動かすエンドツーエンドの振る舞い（ユーザー視点）

**Blocked by:** なし | <他チケット>

**Status:** backlog

**Triage:** ready-for-agent

- [ ] 受け入れ基準 1
- [ ] 受け入れ基準 2
```

ファイルパスやコードスニペットは避ける。プロトタイプ由来の形だけ要点インライン可。

## セッション完了

承認済み票が `issues/backlog/` にあり、フロンティア（ブロッカーなし）が分かる。

## リファレンス

- 公開先・ライフサイクル: `agents/pipeline/map/issue-tracker.md`
- hub: `/map`・`pbl/README.md`
- 実装: `/implement`
