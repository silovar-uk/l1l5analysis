# Argument Altitude — Product Spec v3

## North Star

**論考本文を読むページではなく、論考の設計図を見るページ。**

実際の文章は表示せず、各段落を次の4要素へ抽象化する。

- L1〜L5：主要な抽象度
- Role：論証上の役割
- Structural Summary：その段落が論証の中で何をしているか
- Why：なぜそのLevelと判断したか

## Core model

分析単位はParagraphのみ。

```text
Document
└ Section
   └ Paragraph
```

Sentence-level analysis、Document Terrain、Paragraph Wave、Sentence Inspectorはv3では使用しない。

## Level

- L1 GROUND — 証拠・個別事実
- L2 SCENE — 具体説明・背景
- L3 BRIDGE — 解釈・橋渡し
- L4 CLAIM — 部分主張・論点
- L5 HORIZON — 理論・広い含意

Levelは精密な測定値ではなく相対的な仮説。

## Main UX

### 1. Hero

- タイトル
- 原文URL
- 論考全体の中心命題
- Section数 / Paragraph Unit数

### 2. Level Guide

`L1 具体 → L5 抽象` を一度だけ説明。

折れ線グラフは置かない。

### 3. Section

各Sectionに：

- 構造的タイトル
- Section全体の役割要約
- Paragraph Level Sequence（文字列）

### 4. Paragraph Reverse Outline

各Paragraphを1行の構造要素として表示。

Levelが上がるほど右へインデントする。

```text
P01 L2 ENTRY
  現在の問題を身近な入口として置く

        P02 L4 QUESTION
        問題を個人のマナーから規範の成立条件へ移す

             P03 L5 HORIZON
             公共空間における他者共存の問題へ広げる
```

色ではなく**位置**を主要な符号にする。

### 5. Details on demand

Paragraphを選択したときだけ：

- WHY Lx
- Confidence

を開く。

通常時はStructural Summaryだけで全体を読める。

## 守破離

### 守
段落を順番に並べ、L1〜L5の基本的な抽象度だけを見せる。

### 破
段落内容ではなく、ENTRY / QUESTION / TURN / INTERPRETATION / SYNTHESISなどの論証機能を見る。

### 離
原文を読まずにReverse Outlineだけを眺めても、論考がどこで具体へ降り、どこで上位命題へ上がり、どこで現在の問いへ戻るかを把握できる状態を目指す。

## Source / copyright

external sourceでは原文本文をpublic dataへ保存しない。

保持するのは：

- URL
- 書誌情報
- 段落の構造分析

のみ。

## Import / Export

schemaVersion 3.0 のJSONをImport / Exportできる。

## Forbidden

- 上部の全文折れ線
- Sentence単位表示
- 原文全文表示
- Paragraph Wave
- U字一致率
- 平均抽象度
- 100点満点
- L5を良いとみなす評価

## Acceptance criteria

- 5秒以内にL1=具体、L5=抽象を理解できる。
- 文章を読まなくてもSectionごとの論証の役割が分かる。
- Paragraphのインデントを見るだけで抽象度の上下が分かる。
- `structuralSummary` が内容要約ではなく構造要約になっている。
- 原文本文をpublic repoへ保存しない。
- MobileでもL5のインデントで本文幅が潰れない。
