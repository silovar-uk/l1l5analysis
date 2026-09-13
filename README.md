# Argument Altitude — Analysis Library

Eric Hayot の **The Uneven U / Five Levels of Abstraction** を参考に、論考を「本文」ではなく **段落単位の論証構造** として保存・閲覧する静的Webツール。

## 現在の思想

- ホームは **Analysis Library**
- Library → Article → Section → Paragraph の階層
- 分析単位は Sentence ではなく **Paragraph**
- 原文本文は表示しない
- 各段落を `L1〜L5 / Role / Structural Summary / Why` に抽象化する
- **L5が左、L1が右**
- 左ほど抽象、右ほど具体
- 折れ線グラフではなく、インデントそのものを抽象度として使う
- 記事一覧では内容要約より `Structural Signature` を重視する
- 記事ページでは `Structural Review` で骨格の強み・弱み・転換・改善余地・盗める構成技法を見る

## Information architecture

```text
Analysis Library
└ Article
   ├ Structural Review
   └ Section
      └ Paragraph
         ├ level: 1..5
         ├ role
         ├ structuralSummary
         ├ reason
         └ confidence
```

## Data

- `data/index.json` — Library用の軽量manifest
- `data/demo.json` — 現在のseed article

Libraryはmanifestだけを先に読み、記事を開いたときだけ各article JSONを取得する。

## Routing

- `#/` — Analysis Library
- `#/article/<slug>` — Article view

GitHub Pagesでリロード問題を起こしにくいHash Routingを採用。

## Level orientation

```text
抽象                                      具体
L5 HORIZON → L4 CLAIM → L3 BRIDGE → L2 SCENE → L1 GROUND
```

Level番号の意味は変えず、表示位置だけをこの向きで統一する。

外部著作物の原文本文はpublic repoへ保存せず、URLと構造分析だけを保持する。

## Deploy

静的ファイルのみ。GitHub Pagesで配信。
