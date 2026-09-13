# Argument Altitude — L1–L5

Eric Hayot の **The Uneven U / Five Levels of Abstraction** を参考に、文章を「論証の高度変化」として読むためのワークベンチ。

## v2 の思想

- L1〜L5は点数ではなく、証拠からの距離についての編集可能な仮説
- 主役は原文。グラフは原文へ戻るために使う
- Sentence → Paragraph → Document の3スケールを連動
- READ / LEVELS / MAP の3モード
- AI判定を確定扱いせず、人間が1〜5キーで修正可能
- 修正するとParagraph Wave / Document Terrainが即更新
- 低確信度や大ジャンプだけReview Queueへ送る

## Seed data

`data/demo.json` は外部記事の短い導入部と、自作の校正用段落を収録。外部著作物全文はpublic repoへ保存しない方針。

## Deploy

静的ファイルのみ。GitHub Pagesでそのまま配信可能。
