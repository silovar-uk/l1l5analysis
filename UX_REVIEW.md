# UX Review — Multi-Article Calibration

## Library

### Keep

**Structural Signature**

記事選択に最も効く。テーマではなく「論がどう進むか」を直接比較できる。

**Structural Note**

Signatureだけでは出にくい「この骨格の妙」を一文で補える。

**Section / Paragraph Unit count**

優先度は低いが、構造の大きさを一瞬で把握できるため小さく残す。

**Original source link**

分析から原文へ戻る導線として残す。

### Remove from visible Library

**Topic Tags**

4本並べると、内容カテゴリへ注意を戻し、構造選択にはほぼ効かなかった。データには保持するが表示しない。

### Do not add yet

- Search
- Filter
- Sort
- Compare
- Archetype badge
- Graph

4件では必要性よりUIノイズの方が大きい。

## Article

### Keep

**Thesis**

何についての論考かを最低限固定する。

**Structural Signature**

Libraryで選んだ理由をArticle内でも保持するため追加。

**Structural Review**

骨格を眺めた後の「評価・転用」に必要。

**L5-left / L1-right guide**

直リンクでArticleへ入るケースがあるため、現時点では毎記事表示する。

**WHY Lx / Confidence**

通常は閉じるDetails on Demandのまま維持。判定の権威化を防ぐ役割がある。

### Role display

Core Roleを主表示し、`roleDetail` を補助表示する。

例：

`EVIDENCE / COUNTEREXAMPLE`

これにより記事間比較可能性と固有ニュアンスを両立する。

## Next-feature ranking

| Candidate | Frequency | Impact | Complexity | Concept fit | Decision |
|---|---:|---:|---:|---:|---|
| Structure Recipe / Use this structure | 5 | 5 | 3 | 5 | NEXT |
| Compare two structures | 3 | 4 | 4 | 5 | WAIT |
| Archetype classification | 2 | 4 | 3 | 5 | WAIT FOR 8–10 ARTICLES |
| Search | 1 | 2 | 2 | 3 | NOT YET |
| Tag filter | 1 | 1 | 2 | 2 | NOT YET |
| Auto-analysis API | 2 | 4 | 5 | 3 | LATER |

数字は優先順位の補助であり、合計点では決めない。

## Product decision

現在の最も強いNorth Star：

**読むためのArchiveから、書くときに構造を盗めるToolへ。**

次フェーズでは新しい一覧機能より、1記事から「テーマを抜いた再利用可能な構成手順」を取り出せるかを検証する。