# Argument Altitude — Product Spec v4

## North Star

**論考本文を読むサイトではなく、複数の論考の「骨格」を収集し、比較可能な形で保存するArchive。**

実際の文章は表示せず、各Paragraphを次の要素へ抽象化する。

- L1〜L5：主要な抽象度
- Role：論証上の役割
- Structural Summary：その段落が論証の中で何をしているか
- Why：なぜそのLevelと判断したか
- Confidence：判定確信度

## Information architecture

```text
Analysis Library
└ Article
   ├ Thesis
   ├ Structural Review
   └ Section
      └ Paragraph
```

Libraryをホームとし、単記事ページを最上位に置かない。

## Library

一覧はカードギャラリーではなく縦型Archive。

各Articleに表示するもの：

- Title
- Subtitle
- Section / Paragraph Unit数
- Structural Signature
- Structural Note
- Tags
- 原文リンク
- 「分析を見る」導線

Structural Signatureは内容要約ではなく、論証の進行そのものを一行で表す。

例：

`現在の常識 → 逆の過去 → 複線的因果 → 理論化 → 現在 → 規範判断`

## Article

記事詳細では次を表示する。

1. Analysis Libraryへ戻る導線
2. Title / Subtitle
3. 原文CTA
4. Thesis
5. Structural Review
6. Level Guide
7. Section
8. Paragraph Reverse Outline

## Level orientation

Levelの定義自体は従来どおり。

- L1 GROUND — 証拠・個別事実
- L2 SCENE — 具体説明・背景
- L3 BRIDGE — 解釈・橋渡し
- L4 CLAIM — 部分主張・論点
- L5 HORIZON — 理論・広い含意

ただし空間表現を次に統一する。

```text
抽象                                      具体
L5 HORIZON → L4 CLAIM → L3 BRIDGE → L2 SCENE → L1 GROUND
```

**L5が最も左、L1が最も右。**

Paragraphの表示depthは：

`depth = 5 - level`

とする。

Level番号そのものを反転・変換してはいけない。

## Movement

Paragraph順は維持する。

- Levelが上がる：より抽象へ移動 → UI上は左方向
- Levelが下がる：より具体へ移動 → UI上は右方向
- 同じLevel：HOLD

Movement表示も位置の意味と矛盾させない。

## Paragraph Reverse Outline

各Paragraphを1つの構造要素として表示する。

通常表示：

- Paragraph ID
- Level
- Role
- Structural Summary
- Movement

Details on demand：

- WHY Lx
- Confidence

原文本文は表示しない。

## Structural Review

点数化しない。

表示項目：

- 全体構造
- 強いところ
- 弱いところ
- 特徴的な転換
- 改善余地
- 盗める構成技法

目的は文章の良し悪しを採点することではなく、骨格の説得戦略を評価すること。

## Data architecture

### Library manifest

`data/index.json`

一覧に必要な軽量情報だけを持つ。

- id
- slug
- dataPath
- title
- subtitle
- source
- analyzedAt
- sectionCount
- paragraphCount
- structuralSignature
- structuralNote
- tags

### Article data

各記事JSONはSection / Paragraphの構造分析を保持する。

外部著作物全文は保存しない。

## Routing

GitHub Pages互換性を優先しHash Routingを採用。

- `#/` — Library
- `#/article/<slug>` — Article

Browser Back / Forwardで正常に遷移できること。

## Source / copyright

external sourceでは原文本文をpublic dataへ保存しない。

保持するのは：

- URL
- 書誌情報
- Thesis
- Structural Signature
- Structural Review
- Paragraph構造分析

のみ。

## Import / Export

ImportはArticle JSONを対象とする。

Import後はArticle Viewとして確認できる。

Exportは現在表示中のArticle JSONのみ。

Library manifest編集は別責務とし、ブラウザからGitHubへ直接書き込まない。

## Mobile

Desktopのインデントをそのまま縮小しない。

- Desktop indent step：約50px
- Mobile：12〜16px程度

ただし必ずL5が左、L1が右という順序は維持する。

L1でも本文幅が潰れないこと。

## Favicon

抽象へ向かう方向を新しい空間モデルへ合わせる。

**右下 → 左上**へ上がる階段として表現する。

## Forbidden

- 上部の全文折れ線
- Sentence単位表示
- 原文全文表示
- Paragraph Wave
- U字一致率
- 平均抽象度
- 100点満点
- L5を良いとみなす評価
- Libraryを画像中心カードギャラリーにすること

## Acceptance criteria

- 5秒以内に「論証構造の分析一覧」だと理解できる
- LibraryからArticleへ1クリック
- ArticleからLibraryへ迷わず戻れる
- L5=左・L1=右がGuideとParagraph位置で一致する
- Structural Signatureだけで記事同士の骨格差を想像できる
- Structural Summaryだけで原文なしでも論の進行を追える
- Structural Reviewが内容要約ではなく骨格評価になっている
- 原文CTAを見失わない
- MobileでもL1段落の可読幅が維持される
- Browser Back / Forwardが動作する

## Next milestone

次に追加すべきものは検索ではなく **2本目の実データ**。

Libraryが複数記事で本当に機能するかを確認し、Structural Signatureの粒度を校正する。
