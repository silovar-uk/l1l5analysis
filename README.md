# Argument Altitude — Analysis Library

Eric Hayot の **The Uneven U / Five Levels of Abstraction** を参考に、論考を「本文」ではなく **段落単位の論証構造** として保存し、書くときに構造を再利用するための静的Webツール。

## 現在地

- 4論考 / 130 paragraph units を校正済み
- ホームは **Analysis Library**
- Library → Article → Section → Paragraph
- 原文本文は表示しない
- **L5が左、L1が右**。左ほど抽象、右ほど具体
- Roleは12種類のCore Roleへ正規化し、固有差は `roleDetail` に保持

## UI v5

UX優先で「説明してから読ませる」構造から、**全体像を先に掴み、必要な場所へ移動する**構造へ変更。

### Library

- 巨大Heroを廃止
- 最近分析した記事を最新順で即表示
- Title + Structural Signatureを主役にした縦型リスト
- Topic Tags / Structural Noteは一覧UIから外す
- Import / Exportは `•••` メニューへ退避

### Article

表示順：

1. Title / 原文CTA
2. **Structure Map**
3. Structural Signature + 短い骨格評価
4. Section / Paragraph Reverse Outline
5. Full Structural Review

Structure Mapはグラフではなく、`Section × L5〜L1` のHTML/CSS Grid。各Paragraphはクリック可能で、そのParagraphへ直接移動できる。

旧UIの以下は削除済み：

- 独立Level Guide
- Sectionの `Lx → Lx` sequence
- Paragraphの `ABSTRACT / CONCRETE / HOLD` Movement文字列
- `enhancements.css` の二重CSS管理

## Core Role

`ENTRY / QUESTION / EVIDENCE / INTERPRETATION / BRIDGE / CLAIM / TURN / QUALIFICATION / APPLICATION / SYNTHESIS / RETURN / CONCLUSION`

## Data

- `data/index.json` — Library manifest
- `data/demo.json` — Cinema analysis
- `data/articles/attention-economy-one-minute-190-years.json`
- `data/articles/outcome-before-task-issue-setting.json`
- `data/articles/duck-hunt-choose-your-game.json`

UI v5ではschema変更なし。既存Article JSONからStructure Mapを生成する。

## Routing

- `#/` — Analysis Library
- `#/article/<slug>` — Article

## Level orientation

```text
抽象                                      具体
L5 HORIZON → L4 CLAIM → L3 BRIDGE → L2 SCENE → L1 GROUND
```

## Product direction

最も強い方向は **「読むためのArchive」より「書くときに構造を盗めるTool」**。

ただし次機能を先に増やすのではなく、まずStructure Mapが「全体把握 + Navigation」として機能するかを評価する。`QUICK TRACE` や `USE THIS STRUCTURE` はその後の候補。

外部著作物の原文本文はpublic repoへ保存せず、URLと構造分析のみ保持する。

## Deploy

静的ファイルのみ。GitHub Pagesで配信。
