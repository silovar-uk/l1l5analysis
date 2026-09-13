import { escapeHtml, escapeAttr, formatText } from './utils.js';

export function renderLibraryPage(analyses) {
  return `
    <div class="page-shell">
      <section class="library-hero">
        <p class="eyebrow">THINKING PATTERN ARCHIVE</p>
        <h1>読んだ文章ではなく、<br>手に入れた思考構造を残す。</h1>
        <p>論考をL1〜L5で分解し、何が書かれているかだけでなく、結論がどう作られたかまで保存するためのアーカイブ。</p>
      </section>
      <section class="library-grid" aria-label="分析一覧">
        ${analyses.length ? analyses.map(renderCard).join("") : `<div class="empty-state">分析データがありません。</div>`}
      </section>
    </div>`;
}

function renderCard(item, index) {
  const completeLayers = Object.keys(item.layers || {}).length;
  const dots = Array.from({ length: 5 }, (_, i) => `<i class="layer-dot" style="opacity:${i < completeLayers ? .86 : .14}"></i>`).join("");
  return `
    <a class="analysis-card" href="#/analysis/${escapeAttr(item.slug)}">
      <div class="card-index">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <p class="eyebrow">${escapeHtml(item.type || "ANALYSIS")}</p>
        <h2>${escapeHtml(item.title)}</h2>
        <p class="card-source">${escapeHtml(item.source?.publisher || item.source?.title || "Source")}</p>
        <p class="deep-thesis">${escapeHtml(item.deepThesis)}</p>
      </div>
      <div class="card-meta">
        <span>${escapeHtml(item.analyzedAt)}</span>
        <span>L1–L${completeLayers}</span>
        <span class="layer-dots" aria-label="${completeLayers} layers complete">${dots}</span>
      </div>
    </a>`;
}

export function renderDetailPage(item) {
  const layerEntries = Object.entries(item.layers);
  return `
    <div class="page-shell">
      <div class="detail-layout">
        <nav class="article-rail" aria-label="分析レイヤー">
          ${renderLayerLinks(layerEntries)}
        </nav>
        <article class="article-main">
          ${renderHero(item)}
          ${renderQuick(item.quick)}
          ${layerEntries.map(([key, layer]) => renderLayer(key, layer)).join("")}
          ${renderDna(item.dna)}
          ${renderAudit(item.audit)}
        </article>
        <aside class="article-side" aria-label="読み方">
          <div class="side-note"><strong>READ</strong><p>まずは普通に読む。L1〜L5は章ではなく、同じ論考を違う深度から見るレンズ。</p></div>
          <div class="side-note"><strong>X-RAY</strong><p>右上でONにすると、CLAIM / EVIDENCE / WARRANTなど文章の役割が浮かぶ。</p></div>
          <div class="side-note"><strong>ARGUMENT MRI</strong><p>「論証トレース」を押すと、ひとつの考えがL1〜L5をどう貫くか確認できる。</p></div>
        </aside>
      </div>
    </div>
    <nav class="mobile-nav" aria-label="分析レイヤー モバイル">
      ${renderLayerLinks(layerEntries, true)}
    </nav>`;
}

function renderLayerLinks(entries, mobile = false) {
  const links = entries.map(([key, layer]) => `<a href="#${key}" data-layer-link="${key}">${mobile ? key.toUpperCase() : escapeHtml(layer.short || key.toUpperCase())}</a>`).join("");
  return `${links}<a href="#dna" data-layer-link="dna">DNA</a>`;
}

function renderHero(item) {
  return `<header class="article-hero">
    <a class="back-link" href="#/">← Analysis Library</a>
    <p class="eyebrow">${escapeHtml(item.type || "ANALYSIS")}</p>
    <h1>${escapeHtml(item.title)}</h1>
    <div class="article-meta">
      <span>分析 ${escapeHtml(item.analyzedAt)}</span>
      <a href="${escapeAttr(item.source.url)}" target="_blank" rel="noreferrer">原文 ↗</a>
      <span>${escapeHtml(item.source.publisher || "")}</span>
    </div>
    <div class="tags">${(item.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
  </header>`;
}

function renderQuick(quick) {
  const entries = [
    ["QUESTION", quick.question], ["THESIS", quick.thesis], ["TYPE", quick.type],
    ["SHIFT", quick.shift], ["KEY MOVE", quick.keyMove]
  ];
  return `<section class="quick-structure">
    <p class="eyebrow">30秒でわかる構造</p>
    <div class="quick-grid">${entries.map(([label, value]) => `<div class="quick-item"><span class="quick-label">${label}</span><p>${escapeHtml(value)}</p></div>`).join("")}</div>
  </section>`;
}

function renderLayer(key, layer) {
  return `<section class="layer-section" id="${key}" data-layer-section="${key}">
    <header class="layer-head">
      <div class="layer-number">${escapeHtml(layer.short || key.toUpperCase())}</div>
      <div><p class="eyebrow">${escapeHtml(layer.question || "")}</p><h2>${escapeHtml(layer.title)}</h2><p class="layer-summary">${escapeHtml(layer.summary)}</p></div>
    </header>
    ${(layer.blocks || []).map(renderBlock).join("")}
  </section>`;
}

function renderBlock(block) {
  const sources = (block.sourceIds || []).map(id => `<button type="button" class="source-chip" data-source-id="${escapeAttr(id)}">SOURCE</button>`).join("");
  const trace = block.traceId ? `<button type="button" class="trace-trigger" data-trace-id="${escapeAttr(block.traceId)}">論証トレース →</button>` : "";
  return `<div class="analysis-block" data-xray-type="${escapeAttr(block.xrayType || "NOTE")}">
    ${block.title ? `<h3 class="block-title">${escapeHtml(block.title)}</h3>` : ""}
    <p>${formatText(block.text)}</p>
    ${sources || trace ? `<div class="block-actions">${sources}${trace}</div>` : ""}
  </div>`;
}

function renderDna(dna) {
  return `<section class="layer-section" id="dna" data-layer-section="dna">
    <header class="layer-head"><div class="layer-number">DNA</div><div><p class="eyebrow">REUSABLE WRITING ALGORITHM</p><h2>論考DNA</h2><p class="layer-summary">テーマ固有の情報を外し、再利用できる思考手順だけを残す。</p></div></header>
    <div class="dna-card"><p class="deep-thesis">${escapeHtml(dna.oneLine)}</p><div class="dna-flow">${(dna.steps || []).map((step, i) => `<div class="dna-step"><span>${String(i + 1).padStart(2, "0")}</span><span>${escapeHtml(step)}</span></div>`).join("")}</div></div>
  </section>`;
}

function renderAudit(audit) {
  return `<section class="layer-section" id="audit">
    <header class="layer-head"><div class="layer-number">✓</div><div><p class="eyebrow">CRITICAL REVIEW</p><h2>強さと弱さ</h2><p class="layer-summary">美しい説明と、証明された説明を分けて見る。</p></div></header>
    <div class="analysis-block" data-xray-type="STRENGTH"><h3 class="block-title">強いところ</h3><p>${escapeHtml(audit.strength)}</p></div>
    <div class="analysis-block" data-xray-type="WEAKNESS"><h3 class="block-title">弱いところ</h3><p>${escapeHtml(audit.weakness)}</p></div>
    <div class="analysis-block" data-xray-type="NEXT"><h3 class="block-title">次に足すなら</h3><p>${escapeHtml(audit.next)}</p></div>
  </section>`;
}