# Argument Altitude — Product Spec v5

## North Star

**論考の骨格を収集するArchiveを土台に、書くときに構造を再利用できるToolへ育てる。**

今回のUI原則は明確に：

**便利 > 楽しさ。**

ユーザーが「どこを見れば文章の構造が分かるか」を考える時間を減らす。

## UX priority

ユーザー優先順位：

1. Libraryでは最近追加した分析をすぐ読みたい
2. Articleでは最初に文章全体の構造を把握したい
3. 驚きより速度と迷いの少なさ

したがって、UIは「説明 → 詳細」ではなく、**全体把握 → 必要箇所へ移動 → 詳細**の順にする。

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

表示：

- Title
- Subtitle（補助）
- Section / Paragraph Unit数
- Structural Signature
- 原文リンク（補助）

表示しない：

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
- MobileではMap部分だけ横スクロール

禁止：

- 折れ線
- SVG path
- Chart library
- 上下グラフの再導入

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

- Level
- Core Role
- Paragraph ID（弱く）
- Structural Summary

Details on demand：

- roleDetail
- WHY Lx
- Confidence

旧Movement文字列は表示しない。

理由：Paragraph位置とStructure Mapがすでに抽象度移動を表現するため。

## Removed redundancy

v5で削除：

- 独立Level Guide
- Section sequence (`L2 → L4 → ...`)
- `ABSTRACT / CONCRETE / HOLD` Movement表示
- Hero内のmethod note
- Article冒頭のFull Structural Review
- `enhancements.css`

同じ意味を複数箇所で説明しない。

## Structural Review

Article上部では短評のみ：

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

点数化しない。

## Data architecture

UI v5ではschema変更なし。

既存の：

- `sections[]`
- `section.id`
- `section.index`
- `section.title`
- `paragraphs[]`
- `paragraph.id`
- `paragraph.level`
- `paragraph.role`
- `paragraph.structuralSummary`

からStructure Mapを生成する。

UI都合でArticle JSONへ不要なfieldを追加しない。

## Core Roles

`ENTRY / QUESTION / EVIDENCE / INTERPRETATION / BRIDGE / CLAIM / TURN / QUALIFICATION / APPLICATION / SYNTHESIS / RETURN / CONCLUSION`

固有ニュアンスは `roleDetail`。

## Mobile

- Structure Mapのみ横スクロール可
- body/page全体は横スクロールさせない
- Paragraph indentationは約10px step
- L1でも十分な可読幅を残す
- Libraryは1記事を縦方向で読みやすくする

## Accessibility

Structure Map Pointは `button`。

必須：

- keyboard操作可能
- `aria-label` にLevel / Role / Structural Summaryを含む
- Tooltipだけに意味を依存しない
- `prefers-reduced-motion` 時はsmooth scrollを止める

## Acceptance criteria

Library：

- 3秒以内に最新分析が分かる
- Above the foldで記事一覧が始まる
- Title + Signatureだけで記事を選べる

Article：

- 5秒以内に文章全体の構造がおおまかに分かる
- Structure MapからParagraphへ1操作
- L5左 / L1右がMapとParagraph位置で一致
- Sectionの現在位置がMapで分かる
- 原文CTAを見失わない

Information reduction：

- Guide / Sequence / Movementの重複がない
- roleDetailは通常表示を圧迫しない
- Full Reviewが本文読解の前に割り込まない

## Current product decision

Archiveは最終目的ではなく、再利用できる説得構造を蓄積する基盤。

ただし次フェーズは新機能を増やす前に、Structure Mapの利用感を評価する。

次候補：

1. QUICK TRACE
2. STRUCTURE RECIPE / USE THIS STRUCTURE

検索・比較・Archetype分類は、実需が確認できるまで実装しない。
