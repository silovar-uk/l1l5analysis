import { escapeHtml, escapeAttr } from './utils.js';

export function createDrawers({ sourceDrawer, sourceBody, mriDrawer, mriBody, getAnalysis }) {
  function openSource(sourceId) {
    const analysis = getAnalysis();
    const source = analysis?.sources?.find(item => item.id === sourceId);
    if (!source) return;
    sourceBody.innerHTML = `<article class="source-card">
      <p class="eyebrow">${escapeHtml(source.kind || "SOURCE")}</p>
      <h3>${escapeHtml(source.title)}</h3>
      <p>${escapeHtml(source.note)}</p>
      <div class="source-meta">${escapeHtml(source.publisher || "")} ${source.year ? `· ${escapeHtml(String(source.year))}` : ""}</div>
      <div class="confidence">証拠強度：${escapeHtml(source.confidence || "未評価")}</div><br>
      <a href="${escapeAttr(source.url)}" target="_blank" rel="noreferrer">原資料を開く ↗</a>
    </article>`;
    sourceDrawer.setAttribute("aria-hidden", "false");
    lock();
  }

  function openMri(traceId) {
    const analysis = getAnalysis();
    const trace = analysis?.traces?.find(item => item.id === traceId);
    if (!trace) return;
    mriBody.innerHTML = `<p class="mri-intro">${escapeHtml(trace.description)}</p><div class="mri-trace">
      ${trace.nodes.map(node => `<div class="mri-node" data-level="${escapeAttr(node.level)}"><h3>${escapeHtml(node.title)}</h3><p>${escapeHtml(node.text)}</p></div>`).join("")}
    </div>`;
    mriDrawer.setAttribute("aria-hidden", "false");
    lock();
  }

  function closeSource() { sourceDrawer.setAttribute("aria-hidden", "true"); unlockIfClear(); }
  function closeMri() { mriDrawer.setAttribute("aria-hidden", "true"); unlockIfClear(); }
  function closeAll() { closeSource(); closeMri(); }
  function lock() { document.body.style.overflow = "hidden"; }
  function unlockIfClear() {
    if (sourceDrawer.getAttribute("aria-hidden") === "true" && mriDrawer.getAttribute("aria-hidden") === "true") document.body.style.overflow = "";
  }
  return { openSource, openMri, closeSource, closeMri, closeAll };
}