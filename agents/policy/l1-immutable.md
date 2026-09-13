# L1 編集制約

`specs/L1/` は Agent が直接編集しない。ユーザーが Steward を明示し承認した場合のみ変更する。変更時は `VERSION` と各ファイルの version を揃える。経緯（`adr/`）／chore PBI は必須ではない — 判断が重いとき Agent が推奨し、作成はユーザー確認後。
