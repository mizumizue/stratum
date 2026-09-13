# テキストエンコーディング

日本語テキストの正本は **UTF-8（BOM なし）・改行 LF**。`.editorconfig` / `.gitattributes` に従う。

Windows で作業ツリーが CRLF のままになる場合は、ユーザー側で当該リポジトリの `core.autocrlf=false` を検討（エージェントは `git config` を変えない）。

## 書いてよい／ダメ

- **使う:** エディタ／エージェントのファイル書き込み API。シェル経由なら **Python** で `Path.write_text(..., encoding="utf-8", newline="\n")`。
- **使わない（日本語を壊す）:** PowerShell の `Set-Content` / `Out-File` / `>` / `>>`、およびエンコーディング未指定のリダイレクト・パイプ経由の丸ごと書き換え。
- **Cursor adapter 固有:** `Write` / `StrReplace` を使う（`.cursor/rules/utf8-text.mdc`）。

## 文字化け判定

- コンソールやツール表示の `å` `ã` `?` だけでは破損と断定しない。
- 疑うときは Python で確認する（例: 先頭の codepoint、`\ufffd` の有無、期待する日本語リテラルの包含）。
- **表示が怪しいだけでファイル全体を書き直さない。** 実バイトが壊れていると判明したときだけ、`git checkout -- <path>` で復元するか、壊れた箇所だけ直す。
