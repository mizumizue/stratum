---
name: forgos-validation-loop-workflow
description: ForgOS パイプラインでテーマ開発を回し、FW 実証の累積ログと改善バックログを残す（人間承認なしの正式アプリ経路）。
disable-model-invocation: true
---

# ForgOS 実証ループ（validation）

適当なテーマで ForgOS の正規パイプラインを通し、**シリーズ全体の累積ログ＋改善バックログ**を育てる。  
「モック」は人間承認を外した運用名であり、成果物は ForgOS 定義の正式アプリ経路（`specs/` → `pbl/` → `issues/` → `product/` 等）に置く。

**オーケストレータ（本スキル）:** 検証ループ固有の要件・Verifier・呼称・ブランチ終了フローは **ここにだけ**置く。ForgOS 本体（`forgos/agents/` の modes／pipeline／policy）へ **検証の概念を書き込まない**。作業者は `skill:*` の正本手順に加え、指揮者が渡す **本スキルの工程 Verifier／オーバーレイ**に従う。

### hands-off（途中承認なし）

本スキルは **hands-off** を既定とする。`../loop-workflow/ORCHESTRATION.md` のヒアリング／工程表一言承認／巻き戻し一言承認は **本スキルが上書き**する。

- 起動時にテーマが無くても、指揮者がテーマを **自ら選定**し工程1の入力に選定理由を載せる（途中でユーザーに聞かない）
- テーマが指定済みならそれを使い、確認質問を挟まない
- 工程表・**sector brief**・**spec depth**・**design call**・ドメイン骨格・actor・usability の採否は **AI が調査したうえで決定**し成果物に理由を残す（ユーザー採否・好みヒアリングなし）
- テーマ語連想や汎用 CRUD で止めない。業務アプリは調査分析が先、決め事は後。深さは工程2–4の専用スキルに任せる
- 色・レイアウトを人間に聞かない（工程4が design call を決める）
- 前提崩れの巻き戻しは Stop 上限内で指揮者が **自動決定**しゲートログに1行残す
- ユーザー向けに出すのは **起動時の任意テーマ**と **最終工程後の結果報告**（および明示停止）だけ

### ループ・オーバーレイ（ForgOS 本体には書かない）

詳細ルーブリック: [`DEMO-UX.md`](DEMO-UX.md)（工程 Verifier から必ず参照。**甘い一般論は不合格**）。

前段の深さスキル（正本: `.cursor/skills/loop/`）:

- `sector-research-loop` → `…/sector-brief.md`（V1–V6）
- `spec-depth-loop` → `…/spec-depth.md`（D1–D6）
- `mock-design-loop` → `…/design-call.md`（C1–C9・画面遷移含む）

指示書ではスキルの **絶対パス**（例: `<repo>/.cursor/skills/loop/<name>/SKILL.md`）を渡し、`STATE_DIR` を `quality/fw-validation/runs/<run-id>/` に固定する。

- **sector brief / spec depth / design call:** 工程2–4の成果が正。工程5の scope はそれらを統合するだけ。調査なしの連想はゲート No
- **demo-grade:** 調査で **明示見送り** したもの以外は **すべて実装**（manifest の `implement` 行）。本番認証・決済・外部配信・ブランド完璧は非目標。黙って落とす禁止（`deferred` は根拠パス必須）
- **implementation manifest:** 工程5 `scope.md` の翻訳契約（中心）。工程8–10が参照。詳細は [`DEMO-UX.md`](DEMO-UX.md)
- **demo-seeded visibility:** `scope.md` の **起動直後に見える状態**の契約。manifest だけ Pass しても visibility／cold start 未達は工程9不合格。シード調整は本番デモ範囲
- **通常利用形態 / 画面:** `scope.md` に明示。画面なら主要 UC を画面で完遂
- **actor-split / demo-seeded / surface budget / attention stack:** [`DEMO-UX.md`](DEMO-UX.md)。いずれも brief／depth／design の帰結
- **genre look:** design call の一部。通例根拠＋要素3点以上。**attention** と整合
- **table stakes:** ドメイン通例3件以上（採用／見送り＋理由、採用≥1、WF/状態≥1）。brief 通例欄と紐づける
- **ドメイン骨格:** 概念 ≥5・WF/状態 ≥2。depth と整合。単一フォーム CRUD＋付帯1本は骨格不足
- **usability what:** オペに根ざす品質 What を早期化し Promote
- **検証ホーム／ブランチ:** ForgOS 本体。`validation/<run-id>`。`agents/` に検証要件を書かない

ループが止まらない範囲で、manifest の `implement` 行を実装まで通す（`deferred` のみ除外）。

対象リポジトリ: ForgOS 本体。工程スキルは同リポの `.cursor/skills/`（`modes/`・`pipeline/`）および `agents/`（`spike` / `promote` / `map` / `cut` / `implement` / `audit`）を優先。深さ3スキル（`sector-research-loop` / `spec-depth-loop` / `mock-design-loop`）と指揮基盤は `.cursor/skills/loop/` を正本とする。

主エージェントは **指揮者**。実作業は工程ごとの SubAgent。  
- 指揮: [`../loop-workflow/ORCHESTRATION.md`](../loop-workflow/ORCHESTRATION.md)（**hands-off 上書きあり**）  
- 実行手段: [`../loop-workflow/STAGE-EXEC.md`](../loop-workflow/STAGE-EXEC.md)（工程表は本スキル既定で確定済み。実行手段の再承認は取らない）  
- スキル利用不可時は `STAGE-EXEC.md` に従い **loop-eng 代用**

ペルソナ既定は空（工程表は `—`）。

## 工程表

`RUN = quality/fw-validation/runs/<run-id>`

| # | 工程 | 入力 | 出力 | 実行手段 | 型 | フォールバック型 | ペルソナ | Verifier（ゲート） | Stop（上限つき） |
|---|------|------|------|----------|----|------------------|----------|--------------------|------------------|
| 1 | テーマ／ブランチ枠 | 指定テーマ、または指揮者選定テーマ。前回 `quality/fw-validation/`（参照のみ可） | `RUN/scope.md`（テーマ・スコープ外・通常利用形態・システム狙い。**深い brief／depth／design はまだ必須にしない**）、`validation/<run-id>` ブランチ、`RUN/` 枠 | `loop-eng` | `EO` | — | — | (1) scope 存在 (2) テーマ1文 (3) スコープ外≥1 (4) 通常利用形態 (5) システム狙い1文以上 (6) main 由来 `validation/<run-id>` (7) `STATE_DIR=RUN` を gate-log に記録 — すべて Yes | 再起草上限 3 |
| 2 | 業種調査 | 工程1のテーマ／システム狙い | `RUN/sector-brief.md`、`RUN/loop-log.md` | `skill:sector-research-loop` | — | `EO` | — | `sector-research-loop` 完了＝ゲート（V1–V6 全 Yes）。打ち切り未達なら本ループ Stop | スキル Stop（改稿上限 3）／指揮巻き戻しは工程1へ上限 1 |
| 3 | 仕様深度 | `sector-brief.md`＋システム狙い | `RUN/spec-depth.md` | `skill:spec-depth-loop` | — | `EO` | — | `spec-depth-loop` 完了＝ゲート（D1–D6 全 Yes）。brief 欠落打ち切りなら工程2へ戻す | スキル Stop（改稿上限 3）／戻し上限 1 |
| 4 | モックデザイン | `sector-brief.md`＋`spec-depth.md` | `RUN/design-call.md` | `skill:mock-design-loop` | — | `EO` | — | `mock-design-loop` 完了＝ゲート（C1–C9 全 Yes・遷移含む） | スキル Stop（改稿上限 3）／戻し上限 1 |
| 5 | スコープ統合 | brief／depth／design-call＋工程1 scope | `RUN/scope.md`（統合版・**`## implementation manifest`**・**`## demo-seeded visibility`** 含む） | `loop-eng` | `EO` | — | — | [`DEMO-UX.md`](DEMO-UX.md) Scope **S0–S8**（S4a/b・S8h 含む）すべて Yes。S0–S8 は工程2–4成果から辿れること。矛盾・欠落は No | 再起草上限 3 |
| 6 | Spike（Source） | 統合 scope＋manifest＋工程2–4成果 | `specs/source/<feature-slug>/spec.md`（sandbox 任意） | `skill:spike` | — | `EO` | — | `spike` 完了＋ (1)テーマ (2)要求根拠 (3)table stakes（brief 通例と紐づけ） (4)demo-grade＝manifest `implement` 方針 (5)design call／genre look／遷移 (6)domain skeleton (7) [`DEMO-UX.md`](DEMO-UX.md) Source **U0–U7** すべて Yes — すべて Yes。調査なしの連想骨格はやり直し | Spike やり直し上限 2／Source 改稿上限 3 |
| 7 | Promote | `specs/source/<feature-slug>/` | L2/L3、Source 削除、`RUN/promote-check.md` | `skill:promote` | — | `EO` | — | `promote` 完了＋ (1)promote-check (2)L2/L3 (3)Source 削除 (4)骨格辿れる (5) [`DEMO-UX.md`](DEMO-UX.md) Promote **P0–P4** — すべて Yes | 点検やり直し上限 2／取り込み上限 2 |
| 8 | map／cut | L2/L3＋manifest＋visibility | `pbl/` PBI、`issues/` issue、対応が辿れる | `skill:map`（同一セッションで `skill:cut`） | — | `EO` | — | map＋cut 完了＋ [`DEMO-UX.md`](DEMO-UX.md) Map/Cut **M1–M7** すべて Yes。cut は manifest 分解で hands-off 承認代替 | map 上限 2／cut 上限 2 |
| 9 | Implement | issue＋L2/L3＋design-call＋manifest＋visibility | `product/`、`RUN/implement-reachability.md`、`RUN/demo-seeded-check.md`、単体緑 | `skill:implement` | — | `RGR` | — | `implement` 完了＋ (1)単体緑 (2)genre≥3 (3)WF/状態≥2 (4) [`DEMO-UX.md`](DEMO-UX.md) Implement **I1–I12** すべて Yes (5) reachability・demo-seeded-check が行数要件を満たす | 赤緑サイクル上限 8／フルテスト実行上限 2 |
| 10 | Audit | 決め事＋manifest＋visibility＋`product/` | 指摘リスト；重大は Implement 戻し＋`adr/` | `skill:audit` | — | `EO` | — | `audit` 完了。かつ (A) 重大なし、または (B) Stop 内で Implement 戻し修正済みかつ当該 ADR が `adr/` にあり。(A)(B) の切替は指揮者が自動決定。重大 Gap は [`DEMO-UX.md`](DEMO-UX.md) Audit 節（**manifest 未到達・visibility cold start 未到達は重大**） | Audit 上限 2／戻し修復ラウンド上限 1（自動） |
| 11 | 実証ログ | 工程1–10 | `RUN/run-log.md`、改善あれば `quality/fw-validation/backlog.md` | `loop-eng` | `EO` | — | — | (1) run-log にテーマ・工程・詰まり・所見 (2) 改善あれば backlog、無ければ「改善なし」明記 — すべて Yes | 追記上限 2 |
| 12 | ログのみ main へ | 工程11、作業ブランチ | main の `quality/fw-validation/` のみ。ブランチ remote push 済み | `loop-eng` | `EO` | — | — | (1) validation ブランチ push (2) main 変更が `quality/fw-validation/` のみ (3) run-log にブランチ名と反映手順 — すべて Yes | 反映やり直し上限 2 |

- 実行手段: `skill:<name>` または `loop-eng`  
- 型: loop-eng のとき必須。スキル時は `—`  
- フォールバック型: skill のとき必須扱い  
- ペルソナ: 既定 `—`  
- Verifier: 曖昧な「品質確認」禁止。スキル時は「skill 完了＝ゲート」＋上表＋`DEMO-UX.md`  

### シリーズ成果（複数 run）

- ホームは **ForgOS 本体**。各 run は `main` から `validation/<run-id>` を新規に切る  
- アプリ経路は **run ブランチに残す**（main へ混ぜない）  
- 累積ログの正本は **main** の `quality/fw-validation/runs/*/run-log.md` と `backlog.md`  
- 工程12でログのみ main に戻したあと run 終了  

## つなぎ

- 前工程の Verifier 通過まで次へ進まない  
- 引き継ぎは成果物パス＋短いメモ  
- 前提崩れ時は戻る工程を **自動決定**（Stop 内）しゲートログに1行。ユーザー承認待ちにしない  
- スキル利用不可時はゲートログに理由1行＋フォールバック型で loop-eng 代用  
- **cut（hands-off）:** 人間承認の代わりに **manifest への issue 分解完了** をもって承認とする。M1–M5 を満たせないときは工程5へ巻き戻し（Stop 内）

## 手順（指揮者）

1. 最終成果の形を内部で固定する（main の累積ログ＋backlog；アプリは run ブランチの正式経路・manifest `implement` 完遂・DEMO-UX まで）。ユーザーへの事前確認はしない  
2. **テーマ:** 指定があればそれを使う。無ければ指揮者が選定し、工程1入力に「選定テーマ＋理由」を載せる。ヒアリングしない  
3. 工程表は本スキル既定で確定。実行手段の再提案・承認はしない  
4. ForgOS 本体で `main` から `validation/<run-id>` を切る。`RUN/` とゲートログ枠を用意。`agents/` は検証要件で編集しない  
5. 各工程: 指示書を書く（工程名、入出力、実行手段、Verifier、Stop、Leash、オーバーレイ、**`DEMO-UX.md` の該当節**）。工程2–4では対象スキルの絶対パス・`STATE_DIR=RUN`・hands-off（人間接点なし）を明示。**作業者 SubAgent のみ**が実作業。ForgOS `skill:*` 正本および深さ3スキルの Verifier は改変しない  
6. 指揮者は成果物の中身を書かない。ゲート判定・次へ／戻る／停止のみ。**ForgOS 本体へ検証の概念を書き戻さない**  
7. 工程のやり直しは同一ブランチ可。別テーマの次 run は再び `main` から新ブランチ（ユーザーがスキルを再起動したとき）  
8. 工程12まで通したら、main のログ・backlog・run ブランチのパス／URL を報告して終了。次テーマへの継続確認はしない（必要ならユーザーが再起動）  

## 完了基準

- [ ] 指揮者が実作業をしていない  
- [ ] 途中でユーザー承認を求めていない（hands-off）  
- [ ] 本 run が `validation/<run-id>` 上で行われた  
- [ ] 全工程のゲートを記録した（DEMO-UX および工程2–4の V/D/C 含む）  
- [ ] 工程12により `quality/fw-validation/` のみが main に反映され、run ブランチが push 済みである  
- [ ] 最終成果物パスを報告した  
