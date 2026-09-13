# L1–L5 Analysis Archive

論考を「何が書かれているか」ではなく、「結論がどのように作られたか」まで保存するための静的Webアーカイブです。

## Concept

- L1: 文面構造 — 何がどこに置かれているか
- L2: 論証構造 — 何を何によって納得させているか
- L3: 説明構造 — 何が何を動かすモデルなのか
- L4: 検証構造 — どこまで確かめられるか
- L5: 思想構造 — 世界の見方をどう変えるか

通常のReading Viewに加え、X-RAYでCLAIM / EVIDENCE / WARRANT等を表示し、Argument MRIで一つの命題がL1〜L5をどう横断するか追跡できます。

## Structure

```text
index.html
styles.css
app.js
lib/
  render.js
  drawers.js
  utils.js
data/
  cinema-manners.json
.github/workflows/
  pages.yml
```

1分析=1 JSONを基本単位とし、将来の比較・DNA Viewに拡張できるようにしています。

## Local preview

ES Modules / fetch を使うため、ローカルでは簡易HTTPサーバー経由で開いてください。

```bash
python -m http.server 8000
```

その後 `http://localhost:8000/` を開きます。

## GitHub Pages

`.github/workflows/pages.yml` を含みます。GitHubの `Settings > Pages > Build and deployment > Source` で `GitHub Actions` を選択すると、mainへのpushで公開されます。