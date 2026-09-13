# UX Review — v5.1 Structure Map Audit

## Scope

今回の対象は新機能ではなく、v5で導入したStructure Mapを「本当に使える地図」にすること。

優先順位は：

1. 迷わない
2. 読みにくくない
3. 移動が速い
4. 見た目

実装コードと4論考・130 paragraph unitsを使ったヒューリスティック監査を実施した。

## Findings

### 1. Mobile orientation — FIXED

問題：

Structure Mapを横スクロールすると、Section名まで画面外へ消え、どの行を見ているか分かりにくい。

修正：

- MobileのみSection列をsticky leftにした
- L5〜L1の列だけ横スクロールする
- 現在Sectionではsticky列も背景を変える
- `横に見る →` の小さなaffordanceを追加

判断：

MobileでAccordion形式へ別UIを作るより、PCと同じ構造を保ったまま方向感だけ補う方が認知コストが低い。

### 2. Map density — FIXED

問題：

Map Point内で `P12 + INTERPRETATION` のようにIDとRoleを同時表示すると、小さいセルで情報密度が高すぎる。

修正：

- Map上ではParagraph IDを非表示
- Core Roleを短縮表示
- Paragraph ID / full Role / Structural Summaryはaria-labelとtitleへ保持
- Section titleはMap内だけ短縮表示

情報優先度：

`位置 > Role > Paragraph ID`

### 3. Library hierarchy — FIXED

問題：

「最近分析した文章」が主目的なのに、連番・Unit数・Subtitleが目立ち、更新時期が分からない。

修正：

Libraryの主表示を：

- analyzed date
- title
- Structural Signature

へ寄せた。

Section数は小さく残し、Paragraph Unit数・連番・Subtitleは一覧から削除した。

原文リンクは補助導線として残す。

### 4. Return to Map — FIXED

問題：

Mapから深いParagraphへ移動したあと、30〜35 unitsある長文では次の移動のためにMapへ戻るコストが高い。

修正：

- Structure Mapを上方向へ通過した後だけ `MAP ↑` を表示
- Mapが画面内、またはまだ下にあるときは表示しない
- IntersectionObserverで制御
- 1クリックでStructure Mapへ戻る

常時sticky navigationは避け、必要な状態だけ表示する。

### 5. Paragraph hierarchy — FIXED

問題：

黒塗りのLevel chipがStructural Summaryより強く見える可能性があった。

修正：

- Level chipをoutlineへ変更
- Structural Summaryを最も強い本文情報として維持
- Role / Paragraph IDは補助情報のまま

## Kept

- Structure Map = Section × L5〜L1
- L5 left / L1 right
- Map Point / Sectionのclick navigation
- active Section indication
- Structural Signature
- Short Review
- Thesis details
- Paragraph indentation
- WHY Lx / Confidence / roleDetail
- Full Structural Review
- 原文CTA

## Not changed yet

### Full Review duplication

Short ReviewとFull Reviewには `強み / 転換 / 弱み` の重複がある。

ただしShort Reviewはpreview、Full Reviewは記事末尾の評価という役割差があるため、現段階では削らない。

### Details usage

WHY Lx / Confidence / roleDetailがどれだけ実際に開かれるかは、コード監査では判断できない。

利用観察までは保持する。

### Same-day ordering

現データは複数記事が同じ `analyzedAt` 日付を持つ。

同日内の順序が実際に問題になった場合のみtimestamp化する。UI都合だけでschema変更しない。

## Current UX decision

現時点では **Quick Traceを追加しない**。

理由：

Quick Traceが解決する「重要Paragraphが分からない」という問題より先に、Mapの方向感・密度・戻りコストが明確な摩擦だったため。

これらはv5.1で修正した。

次は実際に数本の記事を読む運用を行い、以下が繰り返し発生するかを見る：

- Map Pointが多すぎて読む場所を決められない
- 重要Paragraphが判別できない
- Mapは分かるが読む順番が決まらない

これが繰り返し起きた場合のみQuick Traceを実装候補へ上げる。

## Next-feature decision

現時点：**E. 何も追加しない。v5.1を使う。**

次の進歩は機能数ではなく、

**「Structure Mapだけで、考えずに移動できるか」**

を実利用で確認すること。
