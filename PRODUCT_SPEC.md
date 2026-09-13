# Argument Altitude — Product Spec v5.1

## North Star

**論考の骨格を収集するArchiveを土台に、書くときに構造を再利用できるToolへ育てる。**

UI原則：

**便利 > 楽しさ。**

ユーザーが「どこを見れば文章の構造が分かるか」を考える時間を減らす。

## UX priority

1. Libraryでは最近追加した分析をすぐ読みたい
2. Articleでは最初に文章全体の構造を把握したい
3. 驚きより速度と迷いの少なさ

UIは **全体把握 → 必要箇所へ移動 → 詳細** の順にする。

## Information architecture

```text
Analysis Library
└ Article
   ├ Structure Map
   ├ Structural Signature / Short Review
   ├ Section
   │  └ Paragraph Unit
   └ Full Structural Review
```

## Library

ホームは最新分析を主役にする。

主表示：

- analyzed date
- Title
- Structural Signature

補助：

- Section count
- 原文リンク

一覧から削除：

- 連番
- Paragraph Unit count
- Subtitle
- Topic Tags
- Structural Note全文
- 大きなコンセプトHero

Import / Exportは `•••` メニューへ退避する。

## Article order

1. Libraryへ戻る
2. Title / Subtitle / 原文CTA
3. **Structure Map**
4. Structural Signature
5. Short Structural Review
6. Thesis（details on demand）
7. Sections / Paragraph Reverse Outline
8. Full Structural Review

## Structure Map

Structure Mapはグラフではない。

**目次 + 全体構造 + Navigation** を一体化したUI。

```text
Section | L5 | L4 | L3 | L2 | L1
```

- L5が左、L1が右
- Sectionが行
- Paragraph Unitが各Level列のclickable item
- Paragraphをクリックすると該当Unitへ移動
- SectionをクリックするとSectionへ移動
- 現在読んでいるSectionをIntersectionObserverでMap側へ反映
- Map上ではParagraph IDよりRoleを優先する
- Core RoleはMap用に短縮表示してよい
- Section titleはMap内のみ短縮してよい

禁止：

- 折れ線
- SVG path
- Chart library
- 上下グラフの再導入

## Mobile Structure Map

MobileではPCと別構造へ変換せず、同じGridを維持する。

ただし：

- Section列はsticky left
- L5〜L1だけ横スクロール
- Mapだけ横スクロール可
- body/page全体は横スクロールさせない
- `横に見る →` のaffordanceを表示
- active Sectionではsticky列も強調

これにより「どのSectionを見ているか」を失わない。

## Return to Map

長いArticleでは、Structure Mapを上方向へ通過した後のみ小さな `MAP ↑` を表示する。

- Mapが画面内なら表示しない
- Mapがまだ下にある場合も表示しない
- IntersectionObserverで制御
- 1操作でMapへ戻る

常時表示のsticky navigationは避ける。

## Level orientation

```text
抽象                                      具体
L5 HORIZON → L4 CLAIM → L3 BRIDGE → L2 SCENE → L1 GROUND
```

Level番号自体は反転しない。

Paragraph indentation：

`depth = 5 - level`

## Paragraph Reverse Outline

通常表示：

- Level（補助）
- Core Role（補助）
- Paragraph ID（弱く）
- **Structural Summary（主役）**

Level chipは塗りつぶしではなくoutlineとし、Structural Summaryより視覚的に強くしない。

Details on demand：

- roleDetail
- WHY Lx
- Confidence

旧Movement文字列は表示しない。

## Removed redundancy

v5〜v5.1で削除：

- 独立Level Guide
- Section sequence (`L2 → L4 → ...`)
- `ABSTRACT / CONCRETE / HOLD` Movement表示
- Hero内のmethod note
- Article冒頭のFull Structural Review
- Libraryの連番 / Unit count / Subtitle
- Map PointのParagraph ID表示
- `enhancements.css`

同じ意味を複数箇所で説明しない。

## Structural Review

Article上部では短評：

- 強み
- 特徴的な転換
- 弱点

Full ReviewはArticle末尾：

- 全体構造
- 強いところ
- 弱いところ
- 特徴的な転換
- 改善余地
- 盗める構成技法

現状はpreview / detailの役割差を優先して重複を許容する。

## Data architecture

UI v5.1でもschema変更なし。

既存のArticle JSONからStructure Mapを生成する。

UI都合だけで不要なfieldを追加しない。

## Core Roles

`ENTRY / QUESTION / EVIDENCE / INTERPRETATION / BRIDGE / CLAIM / TURN / QUALIFICATION / APPLICATION / SYNTHESIS / RETURN / CONCLUSION`

固有ニュアンスは `roleDetail`。

## Accessibility

Structure Map Pointは `button`。

必須：

- keyboard操作可能
- `aria-label` にParagraph ID / Level / Role / Structural Summaryを含む
- Tooltipだけに意味を依存しない
- `prefers-reduced-motion` 時はsmooth scrollを止める
- Mobileのsticky Section列でもfocus targetが隠れない

## Acceptance criteria

Library：

- 3秒以内に最近の分析が分かる
- Title + Signature中心で記事を選べる
- 更新日を一覧で確認できる

Article：

- 5秒以内に文章全体の構造がおおまかに分かる
- Structure MapからParagraphへ1操作
- L5左 / L1右がMapとParagraph位置で一致
- Mobileで横スクロールしてもSectionを見失わない
- 深いParagraphからMapへ1操作で戻れる
- 原文CTAを見失わない

Information reduction：

- Guide / Sequence / Movementの重複がない
- Map PointでP番号とRoleを同時に詰め込まない
- Structural SummaryがParagraphの最重要情報として見える

## Current product decision

Archiveは最終目的ではなく、再利用できる説得構造を蓄積する基盤。

ただしv5.1では新機能を増やさない。

**次の判断は実利用後。**

Quick Traceは、以下が繰り返し発生した場合のみ候補へ上げる：

- Map Pointが多すぎて読む場所を決められない
- 重要Paragraphが判別できない
- Mapは理解できるが読む順番を決められない

現時点では `UX_REVIEW.md` の判断どおり、追加機能よりStructure Mapの実利用を優先する。
