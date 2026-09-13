# Argument Altitude — Product Spec v2

## North Star

文章を「L1〜L5に分類する」ことが目的ではない。

**証拠がどのように意味へ変換され、主張や含意へ上昇するかを見えるようにする。**

L1〜L5は精密な測定値ではなく、証拠からの距離についての編集可能な仮説として扱う。

---

## Core model

分析スケールは3つ。

1. Sentence — Levelを判断する最小単位
2. Paragraph — Sentenceの高度変化を読む単位
3. Document — Paragraphを越えた論証リズムを見る単位

Levelとは別に、各Sentenceへ以下を持たせる。

- Function
- Movement
- Confidence
- Reason
- Provenance
- Alternative Level

### Level

- L1 GROUND — 直接的な証拠・個別事実
- L2 SCENE — 具体説明・背景・描写
- L3 BRIDGE — 解釈・統合・具体と抽象の橋
- L4 CLAIM — 部分命題・段落の主要主張
- L5 HORIZON — 広い含意・理論・全体命題

LevelとFunctionを固定対応させない。

---

## UX modes

モードは3つのみ。

### READ

原文を普通に読む。

分析がなくても読み物として成立させる。

### LEVELS

本文を壊さず、SentenceごとのL1〜L5を表示する。

Sentence hover / select時に、Paragraph WaveとDocument Terrainを同期する。

### MAP

全Paragraphを同じL1〜L5固定軸で比較する。

U字に近いかを評価するのではなく、段落同士の形の違いを見る。

---

## 守破離

### 守

本文 + Level + Paragraph Wave。

L1=具体、L5=抽象という基本文法を理解する。

### 破

Levelそのものではなく Movement を見る。

- DESCENT
- FLOOR
- ASCENT
- PLATEAU

問いを「この文はL3か？」から「なぜここでL3を通るのか？」へ変える。

### 離

Document Terrainで文章全体を論証地形として見る。

将来的にはRevision Ghostで改稿前後のTerrainを重ね、文章の修正を「地形の再設計」として扱う。

---

## Main screen

PCでは次の3領域を同一ページに置く。

1. Sticky Document Terrain
2. Reader + Paragraph Wave
3. Sentence Inspector

ページを切り替えてOverviewとTextを往復させない。

MAPだけ表示重点を変えるが、同じDocument stateを維持する。

---

## Document Terrain

- X = Sentence order
- Y = L1〜L5固定
- L5を上、L1を下
- Paragraph境界を表示
- Sentence pointから本文へ1操作で移動
- 本文Sentenceと双方向にhover連動
- Confidence=lowは形でも識別

Terrainを「評価グラフ」にしない。

---

## Paragraph Wave

各ParagraphのSentence Sequenceを固定L1〜L5軸で表示する。

例：

`4 → 3 → 2 → 1 → 3 → 4 → 5`

Waveと本文Sentenceは双方向リンク。

ParagraphをSentence cardへ分解しない。

---

## Sentence Inspector

選択Sentenceについて表示する。

- Level
- Function
- Movement
- Confidence
- Previous / Next
- Reason
- Provenance
- Review Cue

人間がL1〜L5を即時変更できる。

変更すると以下を即再計算する。

- Terrain
- Paragraph Wave
- MAP
- Pattern
- Review Queue

Keyboard `1`〜`5` でも変更可能。

変更はlocalStorageへ保持する。

---

## Review Queue

全判定を逐一レビューさせない。

読み直し価値の高いSentenceだけを集める。

v2 seedで扱うもの：

- LOW CONFIDENCE
- ABSTRACTION LEAP（同一段落内の2Level以上の移動）

将来追加：

- UNBRIDGED ASCENT
- EVIDENCE STACK
- ABSTRACT PLATEAU
- RETURN NOT OBSERVED
- MIXED SENTENCE

Review Cueはエラーではない。

---

## Pattern

Patternは表示用の記述であり採点ではない。

Level編集後にSequenceから再計算する。

- FLAT
- ASCENDING
- DESCENDING
- UNEVEN U
- ZIGZAG

将来は診断精度を上げるが、PRODUCTIVE_Uを正解扱いしない。

---

## Data-first rule

UI設計前にGold Datasetを作る。

最終的には最低3種類の文章でCalibrationする。

1. 歴史・理論を往復する文章
2. 証拠中心の文章
3. 理論中心の文章

すべての文章をUneven Uへ寄せるUIになっていないことを確認する。

現在の公開seedは、著作権上の理由から外部記事の短い導入部と、自作の校正用Paragraphのみを収録する。

---

## Source / copyright

外部著作物全文をpublic GitHubへ保存する設計にしない。

将来的には：

- owned / licensed → publish可
- external → local paste / IndexedDBを標準

公開データには分析メタデータと必要最小限のexcerptだけを残す。

---

## Forbidden metrics

以下を作らない。

- 平均抽象度
- U字一致率
- 100点満点
- Grounding Score
- L5比率を良さとして扱う指標

代わりに、Sequence / Transition / Review Cueを使う。

---

## Mobile

PCレイアウトを縮小しない。

- Terrainを上部に固定
- Readerは1カラム
- Paragraph Waveは段落上部
- InspectorはBottom Sheet
- MAPは縦Small Multiples

---

## Accessibility

グラフだけを唯一の情報源にしない。

必ずSequenceを文字でも保持する。

Levelは位置 + `L1`〜`L5` で識別。

Confidenceは色だけに依存しない。

`prefers-reduced-motion`対応。

---

## v2 acceptance criteria

- READだけでも文章を快適に読める
- 10秒以内にParagraphの「具体へ降りた場所」を説明できる
- TerrainからSentenceへ1操作で移動できる
- SentenceとWaveがhover連動する
- L判定を5秒以内に修正できる
- 修正直後に地形が変化する
- 段落境界をまたぐLevel差を飛躍扱いしない
- MAPの全Waveが同じL1〜L5軸を使用する
- AI判定を確定事実として見せない

---

## Next milestones

1. Gold Datasetを3文書・150Sentence以上へ拡張
2. Mixed-level Sentenceのsegments対応
3. Import / Export JSON
4. Local full-text workspace
5. Skeleton / reverse outline
6. Revision Ghost

優先順位は常に、**Sentence ↔ Paragraph ↔ Terrain の往復速度**を最上位とする。
