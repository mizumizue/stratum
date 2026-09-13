# Demo UX ルーブリック（実証ループ・開示参照）

ForgOS 本体には書かない。検証オーバーレイの **調査分析／仕様深度／デザイン／デモ操作** の正本。  
指揮者と作業者は該当工程の Verifier でここを Yes/No する。

**Leading words:** **sector brief** · **spec depth** · **actor-split** · **demo-seeded** · **surface budget** · **attention stack** · **design call**

深さの専用スキル（工程2–4）:

| 工程 | スキル | 成果 | ゲート |
|------|--------|------|--------|
| 2 | `sector-research-loop` | `sector-brief.md` | V1–V6 |
| 3 | `spec-depth-loop` | `spec-depth.md` | D1–D6 |
| 4 | `mock-design-loop` | `design-call.md` | C1–C9（画面遷移含む） |

スキル側ルーブリックが正。ここは統合・後工程用の要約と Scope／Source／Implement／Audit の Yes/No。

## ねらい

テーマ語の連想や汎用 CRUD では仕様が甘い。業務アプリでは調査→仕様深度→design call を先に行い、その帰結として scope／Source／実装を進める。  
人間に確認せず **AI が調べて決める**。薄い作文はゲート不合格。

## demo-grade（方針）

- **原則（実装の網羅）:** 工程2–4の採用事項・L3 の決め事／UC／design call のジャーニーは **すべて実装対象**。調査で **明示的に見送り／スコープ外** と記録したものだけ実装しない。
- **非目標（本番以外）:** 認証本番・決済本番・外部配信本番・ブランド最終仕上げ・マルチテナント等は不要。これらを理由に **調査で採用した機能** を落とすのは No。
- **黙って落とす禁止:** 未実装が許されるのは manifest で `deferred` と根拠パス（`scope.md` スコープ外／spec-depth 見送り／L3 out-of-scope 等）がある場合のみ。根拠なしの未実装は工程9不合格。
- **翻訳の正本:** 工程5 `scope.md` の `## implementation manifest`（工程8–9・Audit が参照する契約の **中心**）。ただし **唯一の契約ではない** — `scope.md` §demo-seeded の「起動直後に見える状態」も demo-grade の契約（下記 **demo-seeded visibility**）。
- **シード調整は本番デモ範囲:** 固定マスタ編集 UI を `deferred` にした場合でも、§demo-seeded／visibility で約束した **cold start の見え方** は `createDemoStudioState` 等のシード調整で満たす（Implement の正式作業）。「コードはあるが初期データに無い」は未到達。

## sector brief（工程2）

業務・業界・顧客対応・社内オペなどがテーマに含まれる（または業務アプリと読める）とき必須。非業務と明示できるテーマだけ「非該当＋理由」で免除（その場合も工程2で免除理由を `sector-brief.md` または gate-log に残す）。

### 調査のやり方（甘さを止める）

- 公開情報・業界通例・典型オペを **当たる**（Web 検索可）。事実と推測を **分けて書く**
- 業種・提供形態・規模を **当該システム向けに1つに絞る**。「サービス業」「一般的な業務」止まりは No
- 推測だけで「この領域では必ず〜」と断定したら不合格。根拠または「通例としての仮説」ラベルが必要
- actors・骨格・design call・demo-seeded は **sector brief の帰結**として書く

### brief に最低限そろえる欄（欠けると No）

| 欄 | 合格の目安 |
|----|------------|
| **領域／形態** | 何のシステムか具体。抽象カテゴリ単独は不可 |
| **利用者属性** | 誰が主に使い、何を重視するか ≥2 |
| **現場／業務オペ** | 一日の流れ・ボトルネック ≥2 |
| **差別化しない通例** | 当たり前なこと ≥3（table stakes の種） |
| **スコープに落とす帰結** | actors・主ジョブ・骨格候補への対応表 |

作文チェック: 抽象語だけで固有オペに触れなければ再起草。詳細合否はスキル V1–V6。

## spec depth（工程3）

`spec-depth.md` が D1–D6 を満たすこと。要点:

- 役 ≥2・権限差の表
- 可変境界を **当該システム向けに命名**（外部ラベルの決め打ち禁止）
- 主WFの決定項目・状態遷移 ≥2
- 概念 ≥5・採用／見送り

## design call（工程4）

`design-call.md` が C1–C9 を満たすこと。要点:

- 主表面ごとの attention／情報主従
- 通例 UI 参照 ≥2・見た目要素 ≥3
- actor-split 反映・汎用スキン禁止
- **主要ジョブの画面遷移列**（分岐・戻る含む）

L2/L3 には usability／行為の **What のみ**。見た目 How は design-call／issue／Implement。

## Scope（工程5・統合）

`scope.md` に次がすべて載っていること。中身は工程2–4から統合し、矛盾させない。

| ID | 条件 |
|----|------|
| S0 | **sector brief** が工程2成果として辿れる（または非業務で非該当＋理由）。薄い一般論のみなら No |
| S1 | **利用者（actors）** が2役以上。各役の主ジョブ1文。brief／depth の帰結であること |
| S2 | **actor-split:** 役ごとに主表面が別 |
| S3 | **surface budget:** 主要ハッピーパスは **表面 ≤3** |
| S4 | **demo-seeded:** 当該システムに即した事前選択肢／初期選択の方針が具体 |
| S4a | **`## demo-seeded visibility`**（または §demo-seeded 内の「起動直後に見える」表）が存在し、**起動直後（cold start）にユーザーが目にする状態**を1行1状態で列挙（例: S2 に申請中1件＋処理済1件、期限後欠席ブロック表示）。抽象値だけの羅列は No |
| S4b | visibility の各行が **manifest の `implement` 行**に ID で辿れる、または **visibility 専用 ID**（`V-` 等）で `RUN/demo-seeded-check.md` に分解される。書いたのに manifest／check 無しは No |
| S5 | **attention stack:** 各主表面の視線優先1行以上（主タスクが先頭） |
| S6 | **品質 What 候補** ≥3（行為・結果の What。ピクセル How 禁止） |
| S7 | **design call** が工程4成果として辿れる（方針要約で可）。遷移方針が1行以上。汎用「クリーンな管理画面」だけは No |
| S8 | **`## implementation manifest`** が存在し、下記 A–D の4表が揃う（詳細は同節） |
| S8a | manifest の **デフォルトは `implement`**。`deferred` は調査で明示見送りした行のみ（根拠パス必須） |
| S8b | A の actor 行数 ≥ S1 の役数。各行 `implement` |
| S8c | B に L3 `usecases/*.md` が **1 UC 1 行**（`implement`）。design-call ジャーニー ID と紐づく |
| S8d | C に spec-depth の主 WF・決め事の **例外分岐・状態** が漏れなく列挙（`implement` が原則） |
| S8e | D に spec-depth D3 可変境界の **採用行** が漏れなく列挙。講師が変更できる境界は画面到達を `implement` とする（シード固定のみ `deferred`＋理由可） |
| S8f | sector-brief table stakes の **採用** 行が B／C／D のいずれかに辿れる。採用なのに manifest 無しは No |
| S8g | `deferred` 行に **見送り根拠パス**（`scope.md` §スコープ外／spec-depth 見送り／L3 out-of-scope 等）が1行以上 |
| S8h | §demo-seeded／design-call で **起動時に見せる** と読める記述が、visibility 表または manifest に **漏れなく**落ちている。落ちていないのに scope に残すだけは No（削るか `deferred`＋根拠） |

### demo-seeded visibility（S4a 正本）

`scope.md` 統合版に `## demo-seeded visibility` を置く（§demo-seeded 内のサブ表でも可）。列の最低限:

| 列 | 内容 |
|----|------|
| ID | `V-` プレフィックス推奨 |
| 起動直後の見え方（1文） | どの表面で何が見えるか |
| 主表面 | S1/S2/S3 |
| manifest 紐づけ | 関連 manifest ID（B/C/D/A）。UI 到達の根拠行 |
| cold start | `Yes` 固定（本表に載せる行はすべて起動直後に見える約束） |

**工程5で visibility 行を書いたら、工程9でシード＋UI が cold start を満たす。** manifest に載っているが visibility／シードに無い「隠れ実装」は demo-grade 不足。

### implementation manifest（S8 正本）

`scope.md` 統合版に置く。工程2–4＋採用 L3 から **機械的に抽出**し、hands-off で確定する。

| 表 | 列（最低限） | 抽出元 | デフォルト status |
|----|-------------|--------|-------------------|
| **A Actor 到達** | ID・actor・demo-seeded ペルソナ・主表面・到達方法 | S1／design-call actors | `implement` |
| **B UC／WF** | ID・L3 UC または WF・ジャーニー ID・完結表面・操作1文 | L3 usecases・spec-depth WF | `implement` |
| **C 例外フロー** | ID・決め事 ID・状態／分岐・操作する役・主表面 | scheduling-rules 等・spec-depth | `implement` |
| **D 可変境界** | ID・境界名・変更する役・主表面・操作1文 | spec-depth D3 採用行 | `implement`（シード固定のみ `deferred`可） |

`status` は `implement` または `deferred` のみ。`deferred` には **見送り根拠パス** 列を必須とする。

ドメイン骨格は S0／spec-depth と整合する概念 ≥5・WF/状態 ≥2。

## Source（工程6 Spike）

| ID | 条件 |
|----|------|
| U0 | `## sector brief` — 工程2を深化または引用。事実／仮説を分離 |
| U1 | `## actors` — brief／depth と整合 |
| U2 | `## surface map` — 主表面 ≤3、主要 UC の完結場所、**遷移の要約** |
| U3 | `## demo-seeded` — システム固有の初期データ／選択肢。**§demo-seeded visibility** と整合 |
| U3a | visibility 表の各行が Source または manifest に辿れる |
| U4 | `## attention stack` |
| U5 | `## usability what` ≥3。オペに根ざす。入力属性羅列のみ不可 |
| U6 | `## design call`／genre look — 工程4と整合。要素 ≥3＋attention。**未決禁止**。遷移列が辿れる |
| U7 | `## implementation manifest` — 工程5 `scope.md` と整合。`implement` 行が Source の UC／骨格に漏れなく落ちている |

table stakes／domain skeleton も brief／depth から採る。連想だけの骨格は再起草。

## Promote（工程7）

| ID | 条件 |
|----|------|
| P0 | 領域・actors に関わる採用事項が glossary／actors／決め事／UC のいずれかに辿れる |
| P1 | usability what → 決め事／UC |
| P2 | actors と主表面分担が残る |
| P3 | 採用 usability が決め事／UC／対象外へ辿れる |
| P4 | design call の見た目 How は L2/L3 に上げない。issue／Implement へ辿れる旨を promote-check に1行 |
| P5 | L3 usecases の件数が manifest B の `implement` 行数と一致（または Promote 前に manifest へ反映済み） |

## Map／Cut（工程8）

hands-off では cut の人間承認は不要。**manifest への分解完了** が承認代わり。分解不能なら工程5へ巻き戻し（Stop 内）。

| ID | 条件 |
|----|------|
| M1 | PBI 受入条件が manifest の **`implement` 行をすべて** カバー（1 AC が複数行を束ねてよい） |
| M2 | L3 `usecases/*.md` 1 件につき、**issue 1 件以上** または PBI AC に明示（`implement` のみ） |
| M3 | 各 issue に **`Manifest:`** 行で manifest ID を列挙（例 `B-uc-report-absence, C-late-review`） |
| M4 | manifest A の全 actor が、いずれかの issue AC または PBI AC に「demo-seeded で主表面到達」と書かれている |
| M5 | manifest C・D の `implement` 行が、issue AC または PBI AC に **すべて** 分解されている |
| M6 | PBI 対応表に **証拠 tier** 列（`ui`／`domain`／`seed`）。manifest `implement` 行は tier=`ui` を要求（工程9までに満たす旨を AC に書いてよい） |
| M7 | `scope.md` §demo-seeded visibility の **全行**が PBI AC または issue AC に「cold start で見える」と分解されている（manifest 行と束ねてよい） |

issue は **垂直スライス**（`agents/pipeline/cut/playbook.md`）。同一表面・同一 actor でまとめられる場合のみ統合可（gate-log に理由1行）。

## Implement（工程9）

| ID | 条件 |
|----|------|
| I1 | actor-split |
| I2 | demo-seeded（当該システムの典型値が選択肢に出る）。**シード調整は demo-grade の本番デモ範囲**（初期状態関数・デモ定数等） |
| I2a | `scope.md` §demo-seeded visibility の **全行**が cold start（シード直後の画面）で満たされている |
| I3 | surface budget ≤3 |
| I4 | attention stack（主タスクが先頭） |
| I5 | design call 実行（汎用スキン逃げは No）。対応 ≥3 を完了報告 |
| I6 | 単体緑・manifest `implement` 行のドメイン条件をテストで担保 |
| I7 | design-call の **ジャーニー ID 全件**について、完了報告に操作手順（5ステップ以内）が1つずつある。勝手な省略は No |
| I8 | manifest A の **全 actor** が demo-seeded ペルソナで主表面に到達可能（認証なしタブ可） |
| I9 | manifest B・C の **`implement` 行すべて**について、主表面からの操作パスを `RUN/implement-reachability.md` に1行（domain API のみは No） |
| I9a | reachability の各行に **`cold_start` 列（Yes/No）** と **シード根拠**（初期状態の関数名・キー）がある。`implement` 行は **cold_start=Yes 必須** |
| I10 | manifest D の **`implement` 行すべて**について、同上（設定・可変境界の画面到達） |
| I11 | PBI 対応表で manifest `implement` 行の証拠 tier が **ui**。domain のみは No |
| I12 | `RUN/demo-seeded-check.md` が存在し、visibility **全行**について「役→表面→起動直後に見えるもの→シード根拠」が1行。コードに実装があるだけで **画面に出ない**行は No |

### implement-reachability.md（工程9 必須出力）

`RUN/implement-reachability.md` に manifest の **`implement` 行をすべて**埋める。

```markdown
## Manifest 到達証明
| Manifest ID | status | cold_start | 操作パス（役→表面→操作→結果） | 証拠（UI 手順） | シード根拠 |
|-------------|--------|------------|------------------------------|-----------------|------------|
```

指揮者は **行数＝manifest `implement` 行数**・tier=ui・**cold_start 列がすべて Yes（implement 行）** をゲートする。`App.tsx` 等の存在だけで cold_start=Yes は不可。

### demo-seeded-check.md（工程9 必須出力）

`RUN/demo-seeded-check.md` に visibility **全行**を埋める。

```markdown
## Visibility cold start 証明
| V-ID | 起動直後の見え方 | 主表面 | manifest 紐づけ | 確認手順（≤5ステップ） | シード根拠 |
|------|------------------|--------|-----------------|------------------------|------------|
```

**作業者はブラウザまたは dev 起動で確認**し、見えない行があれば Implement 継続（シード調整含む）。指揮者は自己申告のみで Pass しない。

## Audit（工程10）— 重大 Gap 候補

- sector brief／spec-depth／design-call が無い／一般論のみなのに業務テーマを通している
- actors・文言・選択肢が brief／depth の帰結と不一致
- actor-split 破れ、demo-seeded 欠落、surface >3 必須、attention 逆転
- **manifest `implement` 行の UI 未到達**（`implement-reachability.md` 欠落・domain のみ・手順不能・**cold_start=No**）→ **重大**（工程9へ戻す）
- **`scope.md` §demo-seeded visibility の行が cold start で見えない**（`demo-seeded-check.md` 欠落・手順不能・シード未調整）→ **重大**（工程9へ。シード調整は本番デモ範囲）
- **scope／design-call に「起動時に見える」と読める記述が visibility／check に無い** → **Conform**（工程5で visibility 追加または記述削除）
- manifest に無い spec-depth 能力の欠落 → **無視**（工程5で `deferred` 化または visibility から削るべきだった）
- manifest `deferred` なのに実装を要求 → Conform（過剰）
- usability what／design call／**画面遷移**無視（manifest `implement` 行または visibility 行に紐づくもの）
- どの領域にも見える汎用フォームだけで、brief の通例 **採用** が UI に無い

軽微: ブランド最終仕上げ、認証本番、外部連携本番（manifest で見送り済みの範囲）
