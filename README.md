# Argument Altitude — Paragraph Reverse Outline

Eric Hayot の **The Uneven U / Five Levels of Abstraction** を参考に、論考の各段落を「主要な抽象度」と「論証上の役割」で再構成するための静的Webツール。

## v3 の思想

- 分析単位は **SentenceではなくParagraph**
- 原文本文は表示しない
- 各段落を `L1〜L5 / Role / Structural Summary / Why` に抽象化する
- L1ほど具体、L5ほど抽象
- 抽象度はグラフではなく **左→右のインデント** で見せる
- 段落をクリックしたときだけ判定理由を開く
- 「何が書いてあるか」ではなく「その段落が論証の中で何をしているか」を残す

## Data schema

`data/demo.json` は schemaVersion 3.0。

```text
Document
└ Section
   └ Paragraph
      ├ level: 1..5
      ├ role
      ├ structuralSummary
      ├ reason
      └ confidence
```

外部著作物の原文本文はpublic repoへ保存せず、URLと構造分析だけを保持する。

## Deploy

静的ファイルのみ。GitHub Pagesで配信。
