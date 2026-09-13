# Argument Altitude — Analysis Library

Eric Hayot の **The Uneven U / Five Levels of Abstraction** を参考に、論考を「本文」ではなく **段落単位の論証構造** として保存し、最終的には書くときに構造を再利用するための静的Webツール。

## 現在地

- 4論考 / 130 paragraph units を校正済み
- ホームは **Analysis Library**
- Library → Article → Section → Paragraph
- 原文本文は表示しない
- **L5が左、L1が右**。左ほど抽象、右ほど具体
- 一覧では `Structural Signature` と `Structural Note` を主役にする
- Topic Tagsはdataには残すが、構造選択に効かなかったためLibraryでは非表示
- Articleでは `Structural Review` とParagraph Reverse Outlineを見る
- Roleは12種類のCore Roleへ正規化し、固有差は `roleDetail` に保持する

## Core Role

`ENTRY / QUESTION / EVIDENCE / INTERPRETATION / BRIDGE / CLAIM / TURN / QUALIFICATION / APPLICATION / SYNTHESIS / RETURN / CONCLUSION`

詳細は `ROLE_INVENTORY.md`。

## Data

- `data/index.json` — Library manifest
- `data/demo.json` — Cinema analysis
- `data/articles/attention-economy-one-minute-190-years.json`
- `data/articles/outcome-before-task-issue-setting.json`
- `data/articles/duck-hunt-choose-your-game.json`

## Calibration docs

- `ROLE_INVENTORY.md` — Core Role体系と頻度
- `LEVEL_CALIBRATION.md` — L1〜L5の境界ルール
- `CALIBRATION_NOTES.md` — 4論考を入れて分かったこと
- `UX_REVIEW.md` — Library / Article UIの実測レビュー

## Routing

- `#/` — Analysis Library
- `#/article/<slug>` — Article

## Level orientation

```text
抽象                                      具体
L5 HORIZON → L4 CLAIM → L3 BRIDGE → L2 SCENE → L1 GROUND
```

## Product direction

実データを増やした結果、最も強い方向は **「読むためのArchive」より「書くときに構造を盗めるTool」**。

次候補は `STRUCTURE RECIPE / USE THIS STRUCTURE`。検索・比較・Archetype分類より先に、1本の論考からテーマを抜いた再利用可能な構成手順を取り出せるかを検証する。

外部著作物の原文本文はpublic repoへ保存せず、URLと構造分析のみ保持する。

## Deploy

静的ファイルのみ。GitHub Pagesで配信。