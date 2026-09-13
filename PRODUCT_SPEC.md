# Argument Altitude — Product Spec v4.1

## North Star

**論考の骨格を収集するArchiveを土台に、書くときに構造を再利用できるToolへ育てる。**

原文本文は表示せず、Paragraphを抽象化する。

- L1〜L5：主要な抽象度
- Core Role：論証上の役割
- roleDetail：テーマ・文章固有の補助ラベル
- Structural Summary：その段落が論証の中で何をしているか
- Why：Level判定理由
- Confidence：判定確信度

## Calibration state

2026-09-13時点：4論考・130 paragraph units。

異なる型を投入して、Library / Role / Levelを校正済み。

詳細：

- `ROLE_INVENTORY.md`
- `LEVEL_CALIBRATION.md`
- `CALIBRATION_NOTES.md`
- `UX_REVIEW.md`

## Information architecture

```text
Analysis Library
└ Article
   ├ Thesis
   ├ Structural Signature
   ├ Structural Review
   └ Section
      └ Paragraph Unit
```

Libraryをホームとする。

## Library

縦型Archive。

主表示：

- Title / Subtitle
- Section / Paragraph Unit数
- Structural Signature
- Structural Note
- 原文リンク
- 「分析を見る」

Topic Tagsはdataには保持するが、構造選択に寄与しなかったため現在のUIでは非表示。

Structural Signatureは内容要約ではなく、論証の運動を表す。

## Article

表示順：

1. Analysis Libraryへ戻る
2. Title / Subtitle / 原文CTA
3. Thesis
4. Structural Signature
5. Structural Review
6. Level Guide
7. Section
8. Paragraph Reverse Outline

## Level orientation

```text
抽象                                      具体
L5 HORIZON → L4 CLAIM → L3 BRIDGE → L2 SCENE → L1 GROUND
```

**L5が最も左、L1が最も右。**

`depth = 5 - level`

Level番号自体は反転しない。

### Calibration

- L3：具体と抽象の接続・意味づけ
- L4：Sectionや局所論証を支配する命題
- L5：複数SectionまたはDocument全体を束ねる原理

語彙の難しさではなく「束ねる範囲」で判断する。

## Core Roles

比較可能性を守るため `role` は次の12種類へ固定する。

- ENTRY
- QUESTION
- EVIDENCE
- INTERPRETATION
- BRIDGE
- CLAIM
- TURN
- QUALIFICATION
- APPLICATION
- SYNTHESIS
- RETURN
- CONCLUSION

固有ニュアンスは `roleDetail`。

例：`EVIDENCE / COUNTEREXAMPLE`、`TURN / RESET`。

## Paragraph Reverse Outline

通常表示：

- Paragraph ID
- Level
- Core Role
- roleDetail（ある場合のみ）
- Structural Summary
- Movement

Details on demand：

- WHY Lx
- Confidence

原文本文は表示しない。

## Structural Review

点数化しない。

- 全体構造
- 強いところ
- 弱いところ
- 特徴的な転換
- 改善余地
- 盗める構成技法

## Data architecture

`data/index.json` はLibrary用manifest。

各Article JSONは `schemaVersion: 4.1` を基準とし、Section / Paragraph分析とStructural Reviewを保持する。

外部著作物全文は保存しない。

## Routing

- `#/` — Library
- `#/article/<slug>` — Article

GitHub Pages互換のHash Routing。

## Movement

- Levelが上がる：抽象化 → UI上は左 `← ABSTRACT`
- Levelが下がる：具体化 → UI上は右 `CONCRETE →`
- 同Level：HOLD

## Source / copyright

External sourceでは原文本文をpublic dataへ保存しない。

保持：URL / 書誌情報 / Thesis / Signature / Review / 構造分析。

Owned sourceでもArgument Altitude側には原則として本文を複製せず、構造分析と原文リンクを分離する。

## Forbidden

- 上部折れ線
- Sentence単位表示
- 原文全文表示
- Paragraph Wave
- 平均抽象度
- U字一致率
- 点数
- L5を良いと扱う評価
- Topic TagsをLibraryの主軸にする
- 4件時点でArchetypeを固定する
- 実需なしの検索・比較・フィルター

## Acceptance criteria

- LibraryでSignatureだけを見ても4記事の構造差が分かる
- Library→Article、Article→Libraryが1操作
- L5=左 / L1=右がGuideとParagraph位置で一致
- Core Roleだけで異なるテーマの分析を共通表現できる
- roleDetailなしでも大筋を理解できる
- Structural Summaryだけで論の進行を追える
- Structural Reviewが採点ではなく説得戦略の評価になっている
- 原文CTAを見失わない
- MobileでもL1の可読幅が維持される

## Product decision

複数記事を入れた結果、現時点の方向性は：

1. **文章を書くために構造を再利用するTool**
2. 論証パターンを発見するArchive
3. 論考を保存するArchive

Archiveは最終目的ではなく、再利用できる説得構造を蓄積する基盤。

## Next milestone

**STRUCTURE RECIPE / USE THIS STRUCTURE** を検証する。

Structural Signature + Reverse Outlineから、固有テーマを除いた5〜10段階の再利用可能な執筆手順を作る。

ただしArchetype分類、比較、検索はまだ実装しない。