const DATA_URL = './data/demo.json';
const state = { doc: null };

const hero = document.querySelector('#hero');
const sectionsRoot = document.querySelector('#sections');
const levelGuide = document.querySelector('#levelGuide');
const importBtn = document.querySelector('#importBtn');
const exportBtn = document.querySelector('#exportBtn');
const importFile = document.querySelector('#importFile');

const LEVELS = [
  { level: 1, name: 'GROUND', ja: '証拠・個別事実' },
  { level: 2, name: 'SCENE', ja: '具体説明・背景' },
  { level: 3, name: 'BRIDGE', ja: '解釈・橋渡し' },
  { level: 4, name: 'CLAIM', ja: '部分主張・論点' },
  { level: 5, name: 'HORIZON', ja: '理論・広い含意' }
];

init();

async function init() {
  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.json();
    validateDoc(data);
    state.doc = data;
    render();
    bind();
  } catch (error) {
    hero.innerHTML = `<div class="error-state"><strong>データを読み込めませんでした。</strong><span>${esc(error.message)}</span></div>`;
  }
}

function bind() {
  importBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', importAnalysis);
  exportBtn.addEventListener('click', exportAnalysis);
}

function render() {
  renderHero();
  renderGuide();
  renderSections();
}

function renderHero() {
  const d = state.doc;
  const paragraphCount = d.sections.reduce((sum, section) => sum + section.paragraphs.length, 0);
  hero.innerHTML = `
    <header class="doc-head">
      <p class="eyebrow">PARAGRAPH REVERSE OUTLINE</p>
      <h1>${esc(d.title)}</h1>
      ${d.subtitle ? `<p class="subtitle">${esc(d.subtitle)}</p>` : ''}
      <div class="meta">
        <a href="${attr(d.source.url)}" target="_blank" rel="noreferrer">原文 ↗</a>
        <span>${esc(d.source.publisher || '')}</span>
        <span>${d.sections.length} sections</span>
        <span>${paragraphCount} paragraph units</span>
      </div>
      <p class="thesis">${esc(d.thesis || '')}</p>
      <p class="method-note">原文本文は表示しません。各段落を「そこで何が書かれているか」ではなく、<strong>その段落が論証の中で何をしているか</strong>へ抽象化しています。L1ほど具体、L5ほど抽象です。</p>
    </header>`;
}

function renderGuide() {
  levelGuide.innerHTML = `
    <div class="guide-copy"><span>具体</span><span>抽象</span></div>
    <div class="guide-levels">
      ${LEVELS.map(item => `<div class="guide-level"><strong>L${item.level}</strong><span>${esc(item.ja)}</span></div>`).join('')}
    </div>`;
}

function renderSections() {
  sectionsRoot.innerHTML = state.doc.sections.map(renderSection).join('');
}

function renderSection(section) {
  let previousLevel = null;
  const sequence = section.paragraphs.map(p => `L${p.level}`).join(' → ');
  const paragraphs = section.paragraphs.map(paragraph => {
    const movement = movementLabel(previousLevel, paragraph.level);
    previousLevel = paragraph.level;
    return renderParagraph(paragraph, movement);
  }).join('');

  return `
    <section class="section-block" id="${attr(section.id)}">
      <header class="section-head">
        <div class="section-index">SECTION ${esc(section.index)}</div>
        <h2>${esc(section.title)}</h2>
        <p>${esc(section.summary)}</p>
        <div class="section-sequence" aria-label="段落ごとの抽象度推移">${esc(sequence)}</div>
      </header>
      <div class="paragraph-list">${paragraphs}</div>
    </section>`;
}

function renderParagraph(paragraph, movement) {
  return `
    <details class="paragraph-item level-${paragraph.level}" style="--level:${paragraph.level}">
      <summary>
        <div class="paragraph-meta">
          <span class="paragraph-id">${esc(paragraph.id.toUpperCase())}</span>
          <span class="level-chip">L${paragraph.level}</span>
          <span class="role">${esc(paragraph.role)}</span>
        </div>
        <p class="structural-summary">${esc(paragraph.structuralSummary)}</p>
        <span class="movement ${movement.className}">${esc(movement.label)}</span>
        <span class="expand-hint" aria-hidden="true">＋</span>
      </summary>
      <div class="paragraph-detail">
        <div><span>WHY L${paragraph.level}</span><p>${esc(paragraph.reason)}</p></div>
        <div><span>CONFIDENCE</span><p>${esc((paragraph.confidence || '—').toUpperCase())}</p></div>
      </div>
    </details>`;
}

function movementLabel(previous, current) {
  if (previous == null) return { label: 'START', className: 'hold' };
  const delta = current - previous;
  if (delta > 0) return { label: `↑ ABSTRACT +${delta}`, className: 'up' };
  if (delta < 0) return { label: `↓ CONCRETE ${delta}`, className: 'down' };
  return { label: '→ HOLD', className: 'hold' };
}

async function importAnalysis() {
  const file = importFile.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    validateDoc(data);
    state.doc = data;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    alert(`Importできません: ${error.message}`);
  } finally {
    importFile.value = '';
  }
}

function exportAnalysis() {
  const blob = new Blob([JSON.stringify(state.doc, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.doc.id || 'argument-altitude-outline'}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function validateDoc(data) {
  if (!data || !Array.isArray(data.sections)) throw new Error('sections がありません');
  for (const section of data.sections) {
    if (!Array.isArray(section.paragraphs)) throw new Error(`${section.id || 'section'} の paragraphs が不正です`);
    for (const paragraph of section.paragraphs) {
      if (!paragraph.id) throw new Error('paragraph id がありません');
      if (!Number.isInteger(paragraph.level) || paragraph.level < 1 || paragraph.level > 5) {
        throw new Error(`${paragraph.id} の level は1〜5で指定してください`);
      }
      if (!paragraph.structuralSummary) throw new Error(`${paragraph.id} の structuralSummary がありません`);
    }
  }
}

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function attr(value = '') {
  return esc(value);
}
