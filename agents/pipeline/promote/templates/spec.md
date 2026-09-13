---
layer: L2 # or L3
# domain: example   # L3 のとき
kind: glossary # or actors | decisions | usecases
maturity: draft # draft | stable | confirmed
---

# タイトル

## 本文

（用語定義 / アクター責務 / 決め事の条文）

**決め事に書いてよい:** ドメイン規則、受入／拒否境界、公開インターフェース上の契約、短い Why。
**書かない:** モジュール分割・配置、アルゴリズム、作業手順、コードを読めば分かる詳細（憲法 §2.8）。

ユースケース（`kind: usecases`）を書くときは本ファイルではなく **同フォルダの `usecase.md`** を使う。`actors`（1つ以上）が必須。

## 関連

（`specs/` から実装ソース・`product/` パス・Source パスは参照しない。L1 憲法 §2.5）

- PBI:       # または Issue:
- 決め事:    # 他仕様のみ
- 用語:
