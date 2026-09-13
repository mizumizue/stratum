# Claude Code — ForgOS + Stratum adapter

このリポジトリは、開発フレームワーク（**ForgOS**: AI 工程 OS）と品質地層・トレーサビリティ機能（**Stratum**）の「両軸」で、**製品（`src/`）**を開発・品質保証する環境です。
トレーサビリティやダッシュボードは製品そのものではなく、製品のための機能です。工程手順の正本はツール非依存の [`agents/`](./agents/)、仕様正本は [`docs/`](./docs/) です。

## 作業前

1. [`CONTEXT.md`](./CONTEXT.md)
2. [`docs/SYSTEM_OVERVIEW.md`](./docs/SYSTEM_OVERVIEW.md)
3. 索引: [`AGENTS.md`](./AGENTS.md)
4. 常時ポリシー: [`agents/policy/framework.md`](./agents/policy/framework.md)

迷子なら [`agents/ask-me.md`](./agents/ask-me.md)（ルーター。代理実行しない）。

## 手順の正本（Mode）

| やりたいこと | 読む正本 |
|--------------|----------|
| Spike | `agents/modes/spike.md` |
| Specify | `agents/modes/specify.md` |
| Implement（TDD） | `agents/modes/implement.md` → `agents/engineering/tdd/playbook.md` |
| Audit | `agents/modes/audit.md` |
| Steward | `agents/modes/steward.md` |

## Stratum コマンド（品質・トレーサビリティ検証）

```bash
./bin/stratum check      # 仕様・リンク整合性の検査
./bin/stratum report     # 地層密度・ピラミッド診断
./bin/stratum matrix     # トレーサビリティマトリクス表示
./bin/stratum serve      # Web ダッシュボードのローカル起動
```

## 編集の注意

日本語は UTF-8（BOM なし）・LF。詳細は `agents/policy/utf8-text.md`。

