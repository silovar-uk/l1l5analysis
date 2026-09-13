# Calibration Notes — 2026-09-13

## Dataset

現在のLibraryは4論考・130 paragraph units。

1. Cinema manners — 系譜・歴史型 / 28 units
2. Attention economy — 調査・自己訂正型 / 35 units
3. Outcome before task — 問題設定・実務提言型 / 32 units
4. Duck Hunt — 体験から戦略原理へ上がる実践型 / 35 units

## 1. Structural Signature は機能する

4本をタイトルなしで見ても、論証の進み方に差が残る。

- Cinema: 現在の常識 → 逆の過去 → 複線的因果 → 理論化 → 規範判断
- Attention: 思考実験 → 概念起源 → 通説 → 訂正 → 反証 → 反対側の効用 → 判断基準
- Outcome: 失敗 → 仮説 → 支持 → 反証 → 概念分解 → 再適用 → テンプレ → 一般化
- Duck Hunt: 使用感 → 道具の再定義 → 操作訂正 → 外部理論 → メタ戦略 → 練習行動

つまりSignatureは「要約」ではなく、Libraryで記事を区別する情報として残す価値が高い。

## 2. まだArchetypeを作る段階ではない

4本には部分的な共通点がある。

- Attention / Outcome は自分の初期仮説を反証で修正する
- Outcome / Duck Hunt は最後に実践行動へ戻る
- Cinema / Attention は現在の常識を一度相対化する

しかし、同じ型として束ねるには差の方が大きい。

現時点で `GENEALOGY / CORRECTIVE_INQUIRY / LADDER` のようなArchetypeラベルを固定すると、分類を先に作って文章を押し込む危険がある。

結論：最低8〜10本まではArchetype機能を実装しない。

## 3. Roleは細かすぎた

初期Cinema分析では、テーマ固有のRoleが増殖した。

例：

- HISTORICAL_DETAIL
- INFRASTRUCTURE
- PRESENT_SYMPTOM
- ETHICAL_CLAIM

複数記事を入れると比較軸として弱いことが分かった。

対応：12 Core Rolesへ正規化し、固有情報は `roleDetail` へ移動。

詳細は `ROLE_INVENTORY.md`。

## 4. Level境界は「範囲」で見ると安定する

L3/L4/L5の迷いは、文章の難しさではなく「どこまでの範囲を束ねるか」を見ると減った。

- L3: 材料間を接続
- L4: Sectionまたは局所論証を支配
- L5: 複数SectionまたはDocument全体を束ねる

詳細は `LEVEL_CALIBRATION.md`。

## 5. LibraryでTopic Tagsは弱かった

4記事を並べると、タグは「何についての記事か」を思い出すには便利だが、「どの骨格を見たいか」の判断にはほぼ寄与しない。

Argument Altitudeの目的はテーマ検索より構造探索にあるため、タグはdataには残しつつLibrary UIから非表示にした。

## 6. Section / Paragraph Countは弱いが残す

件数は記事選択の主理由にはならない。

ただし「5 sections / 28 units」と「10 sections / 35 units」では構造の密度感を素早く把握できるため、低優先度メタデータとして残す。

## 7. Structural ReviewはArticle側に必要

LibraryではSignature + Noteで十分。

詳細画面へ入った後は、単なる骨格表示だけでなく、

- どこが効いているか
- どこが弱いか
- 何を盗めるか

まで欲しくなる。

よってStructural ReviewはArticleに維持する。

## 8. ArticleにもStructural Signatureを表示する

LibraryでSignatureを見て記事へ入った後、Article側でそれが消えると「何を見に来たか」が切れる。

対応：Article HeroにもSignatureを表示。

## 9. Product identity

4本を入れた結果、最も強い方向は次の順。

1. **文章を書くために構造を再利用するTool**
2. 論証パターンを発見するArchive
3. 論考を保存するArchive

理由：単なる保存より、「この構造は別テーマでも使える」という価値がStructural Signatureと`steal`に強く現れたため。

Archiveは目的ではなく、再利用可能な構造を貯めるための基盤と捉える方が強い。

## 10. Next feature candidate

次に最も価値が高い候補は **STRUCTURE RECIPE / USE THIS STRUCTURE**。

ArticleのStructural SignatureとParagraph Reverse Outlineから、固有テーマを抜いた5〜10段階の「書くための骨組み」を生成・表示する。

例：

1. 身近な違和感を置く
2. 暫定仮説を立てる
3. 証拠で支える
4. 都合の悪い反証を入れる
5. 仮説を条件付きへ修正する
6. 別ケースへ再適用する
7. 実践可能な型へ圧縮する
8. 冒頭へ戻って意味を更新する

まだ比較画面・検索・Archetype分類を作るより、この「読む→盗む→書く」の接続を先に試す価値が高い。