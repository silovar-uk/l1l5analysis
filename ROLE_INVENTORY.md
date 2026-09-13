# Role Inventory — Calibration v1

4論考・130 paragraph units を横断してRole体系を校正した。

## Core Roles

記事間比較に使う `role` は次の12種類に固定する。

| Role | 役割 | Count |
|---|---|---:|
| ENTRY | 読者を論点へ入れる | 5 |
| QUESTION | 論考を駆動する問いを置く | 5 |
| EVIDENCE | 事例・史料・データ・仕様を置く | 25 |
| INTERPRETATION | 具体から意味を取り出す | 17 |
| BRIDGE | 異なる概念・証拠・議論を接続する | 9 |
| CLAIM | 部分命題・上位原理を提示する | 20 |
| TURN | 論の向き・前提・時代を切り替える | 6 |
| QUALIFICATION | 主張の適用範囲を限定する | 6 |
| APPLICATION | 原理を具体ケース・操作へ落とす | 11 |
| SYNTHESIS | 複数の材料を一つのモデルへまとめる | 15 |
| RETURN | 冒頭の問い・事例へ戻る | 7 |
| CONCLUSION | 読者が持ち帰る最終命題で閉じる | 4 |

合計 130 units。

## roleDetail

テーマ固有・文章固有のニュアンスは `role` を増やさず、任意の `roleDetail` に置く。

例：

- `role: EVIDENCE` / `roleDetail: COUNTEREXAMPLE`
- `role: EVIDENCE` / `roleDetail: HISTORICAL_DETAIL`
- `role: TURN` / `roleDetail: RESET`
- `role: CLAIM` / `roleDetail: THEORY`
- `role: APPLICATION` / `roleDetail: TEMPLATE`

## 判断ルール

1. まずCore Roleだけで表現できないか考える。
2. `roleDetail` は、その段落の特徴を残す価値がある場合だけ使う。
3. 1記事でしか登場しない概念をCore Roleへ昇格させない。
4. Roleは「何について書いているか」ではなく「論証上なにをしているか」で決める。
5. LevelとRoleは独立。`EVIDENCE=L1`、`CLAIM=L5` のように固定しない。

## Calibration result

旧Cinemaデータにあった `HISTORICAL_DETAIL / INFRASTRUCTURE / PRESENT_SYMPTOM / ETHICAL_CLAIM` 等は、比較軸として細かすぎた。

複数記事を入れた結果、Core Roleを少数に保ち、固有差を `roleDetail` に逃がす方がLibraryの目的に合うと判断した。