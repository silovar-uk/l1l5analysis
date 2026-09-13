const INDEX_URL = './data/index.json';

const state = {
  manifest: null,
  doc: null,
  route: 'library',
  activeSectionId: null,
  activeParagraphId: null,
  sectionObserver: null
};

const hero = document.querySelector('#hero');
const structureMapRoot = document.querySelector('#structureMap');
const structureSummaryRoot = document.querySelector('#structureSummary');
const sectionsRoot = document.querySelector('#sections');
const evaluationRoot = document.querySelector('#evaluation');
const importBtn = document.querySelector('#importBtn');
const exportBtn = document.querySelector('#exportBtn');
const importFile = document.querySelector('#importFile');
const toolsMenu = document.querySelector('.tools-menu');

const LEVELS = [
  { level: 5, name: 'HORIZON', ja: '理論・広い含意' },
  { level: 4, name: 'CLAIM', ja: '部分主張・論点' },
  { level: 3, name: 'BRIDGE', ja: '解釈・橋渡し' },
  { level: 2, name: 'SCENE', ja: '具体説明・背景' },
  { level: 1, name: 'GROUND', ja: '証拠・個別事実' }
];

init();

async function init() {
  try {
    const response = await fetch(INDEX_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    state.manifest = await response.json();
    validateManifest(state.manifest);
    bindGlobal();
    await route();
  } catch (error) {
    showError(error);
  }
}

function bindGlobal() {
  importBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', importAnalysis);
  exportBtn.addEventListener('click', exportAnalysis);
  window.addEventListener('hashchange', route);
}

async function route() {
  disconnectArticleObserver();
  const match = location.hash.match(/^#\/article\/([^/?#]+)/);

  if (!match) {
    state.route = 'library';
    state.doc = null;
    renderLibrary();
    window.scrollTo({ top: 0 });
    return;
  }

  const slug = decodeURIComponent(match[1]);
  const entry = state.manifest.articles.find(article => article.slug === slug);
  if (!entry) {
    showError(new Error('指定された分析が見つかりません。'), true);
    return;
  }

  try {
    const response = await fetch(entry.dataPath, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.json();
    validateDoc(data);
    state.route = 'article';
    state.doc = data;
    renderArticle();
    window.scrollTo({ top: 0 });
  } catch (error) {
    showError(error, true);
  }
}

function renderLibrary() {
  document.title = 'Argument Altitude — Analysis Library';
  document.body.dataset.view = 'library';
  state.activeSectionId = null;
  state.activeParagraphId = null;
  exportBtn.hidden = true;
  structureMapRoot.hidden = true;
  structureSummaryRoot.hidden = true;
  evaluationRoot.hidden = true;

  hero.innerHTML = `
    <header class="library-head compact">
      <div>
        <p class="eyebrow">ANALYSIS LIBRARY · ${state.manifest.articles.length} STRUCTURES</p>
        <h1>最近分析した文章</h1>
      </div>
      <p class="library-description">文章の「何を言ったか」ではなく、「どう組み立てたか」を読む。</p>
    </header>`;

  const articles = getSortedArticles();
  sectionsRoot.innerHTML = `
    <section class="library-list" aria-label="最近の分析">
      ${articles.map((article, index) => renderLibraryItem(article, index)).join('')}
    </section>`;
}

function getSortedArticles() {
  return [...state.manifest.articles].sort((a, b) => {
    return String(b.analyzedAt || '').localeCompare(String(a.analyzedAt || ''));
  });
}

function renderLibraryItem(article, index) {
  const number = String(index + 1).padStart(2, '0');
  return `
    <article class="library-row">
      <a class="library-row-main" href="#/article/${encodeURIComponent(article.slug)}">
        <span class="library-row-index">${number}</span>
        <span class="library-row-copy">
          <span class="library-row-kicker">${esc(article.sectionCount)} SECTIONS · ${esc(article.paragraphCount)} UNITS</span>
          <strong class="library-row-title">${esc(article.title)}</strong>
          ${article.subtitle ? `<span class="library-row-subtitle">${esc(article.subtitle)}</span>` : ''}
          <span class="library-row-signature">${esc(article.structuralSignature || '')}</span>
        </span>
        <span class="library-row-arrow" aria-hidden="true">→</span>
      </a>
      ${article.source?.url ? `<a class="library-row-source" href="${attr(article.source.url)}" target="_blank" rel="noreferrer">原文 ↗</a>` : ''}
    </article>`;
}

function renderArticle() {
  document.title = `${state.doc.title} — Argument Altitude`;
  document.body.dataset.view = 'article';
  exportBtn.hidden = false;
  structureMapRoot.hidden = false;
  structureSummaryRoot.hidden = false;
  evaluationRoot.hidden = false;

  renderHero();
  renderStructureMap();
  renderStructureSummary();
  renderSections();
  renderEvaluation();
  bindArticleInteractions();
  observeSections();
}

function renderHero() {
  const d = state.doc;
  const paragraphCount = d.sections.reduce((sum, section) => sum + section.paragraphs.length, 0);
  hero.innerHTML = `
    <header class="doc-head">
      <a class="back-link" href="#/">← Library</a>
      <div class="title-row">
        <div class="title-copy">
          <p class="eyebrow">STRUCTURE ANALYSIS</p>
          <h1>${esc(d.title)}</h1>
          ${d.subtitle ? `<p class="subtitle">${esc(d.subtitle)}</p>` : ''}
        </div>
        ${d.source?.url ? `<a class="source-cta" href="${attr(d.source.url)}" target="_blank" rel="noreferrer"><span>原文を読む</span><b aria-hidden="true">↗</b></a>` : ''}
      </div>
      <div class="meta">
        ${d.source?.publisher ? `<span>${esc(d.source.publisher)}</span>` : ''}
        <span>${d.sections.length} sections</span>
        <span>${paragraphCount} paragraph units</span>
      </div>
    </header>`;
}

function renderStructureMap() {
  const levelHeader = LEVELS.map(item => `
    <div class="map-level-label">
      <strong>L${item.level}</strong>
      <span>${esc(item.name)}</span>
    </div>`).join('');

  structureMapRoot.innerHTML = `
    <header class="map-head">
      <div>
        <p class="eyebrow">STRUCTURE MAP</p>
        <h2>文章全体の動き</h2>
      </div>
      <div class="map-axis" aria-label="左が抽象、右が具体"><span>抽象</span><span>具体</span></div>
    </header>
    <div class="map-scroll" tabindex="0" aria-label="L5からL1へ並ぶ構造マップ">
      <div class="map-grid">
        <div class="map-level-row" aria-hidden="true">
          <div class="map-section-label">SECTION</div>
          ${levelHeader}
        </div>
        ${state.doc.sections.map(renderMapSection).join('')}
      </div>
    </div>`;
}

function renderMapSection(section) {
  const cells = LEVELS.map(item => renderMapCell(section, item.level)).join('');
  return `
    <div class="map-row" data-section-id="${attr(section.id)}">
      <button class="map-section-link" type="button" data-scroll-section="${attr(section.id)}">
        <span>${esc(section.index)}</span>
        <strong>${esc(section.title)}</strong>
      </button>
      ${cells}
    </div>`;
}

function renderMapCell(section, level) {
  const paragraphs = section.paragraphs.filter(paragraph => paragraph.level === level);
  return `
    <div class="map-cell" data-level="${level}">
      ${paragraphs.map(renderMapPoint).join('')}
    </div>`;
}

function renderMapPoint(paragraph) {
  const label = `L${paragraph.level} ${paragraph.role || ''} ${paragraph.structuralSummary || ''}`;
  return `
    <button class="map-point" type="button" data-scroll-paragraph="${attr(paragraph.id)}" aria-label="${attr(label)}" title="${attr(paragraph.structuralSummary || '')}">
      <span class="map-point-id">${esc(paragraph.id.toUpperCase())}</span>
      <span class="map-point-role">${esc(paragraph.role || '')}</span>
    </button>`;
}

function renderStructureSummary() {
  const d = state.doc;
  const review = d.structuralReview || d.evaluation || inferEvaluation(d);
  structureSummaryRoot.innerHTML = `
    <div class="structure-read">
      ${d.structuralSignature ? `
        <div class="structure-signature">
          <span>STRUCTURAL SIGNATURE</span>
          <p>${esc(d.structuralSignature)}</p>
        </div>` : ''}
      <div class="review-short">
        ${shortReviewItem('強み', review.strengths)}
        ${shortReviewItem('転換', review.turn)}
        ${shortReviewItem('弱点', review.weakness)}
      </div>
      ${d.thesis ? `
        <details class="thesis-note">
          <summary>中心命題を見る</summary>
          <p>${esc(d.thesis)}</p>
        </details>` : ''}
      <button class="full-review-link" type="button" data-scroll-review>詳しい骨格評価を見る ↓</button>
    </div>`;
}

function shortReviewItem(label, text) {
  return `
    <article class="review-short-item">
      <span>${esc(label)}</span>
      <p>${esc(toText(text))}</p>
    </article>`;
}

function renderSections() {
  sectionsRoot.innerHTML = state.doc.sections.map(renderSection).join('');
}

function renderSection(section) {
  return `
    <section class="section-block" id="${attr(section.id)}" data-section-id="${attr(section.id)}">
      <header class="section-head">
        <div class="section-index">SECTION ${esc(section.index)}</div>
        <h2>${esc(section.title)}</h2>
        <p>${esc(section.summary || '')}</p>
      </header>
      <div class="paragraph-list">
        ${section.paragraphs.map(renderParagraph).join('')}
      </div>
    </section>`;
}

function renderParagraph(paragraph) {
  const depth = 5 - paragraph.level;
  return `
    <details id="${attr(paragraph.id)}" class="paragraph-item level-${paragraph.level}" data-paragraph-id="${attr(paragraph.id)}" style="--depth:${depth}">
      <summary>
        <div class="paragraph-meta">
          <span class="level-chip">L${paragraph.level}</span>
          <span class="role">${esc(paragraph.role || '')}</span>
          <span class="paragraph-id">${esc(paragraph.id.toUpperCase())}</span>
        </div>
        <p class="structural-summary">${esc(paragraph.structuralSummary)}</p>
        <span class="expand-hint" aria-hidden="true">＋</span>
      </summary>
      <div class="paragraph-detail">
        ${paragraph.roleDetail ? `<div><span>ROLE DETAIL</span><p>${esc(paragraph.roleDetail)}</p></div>` : ''}
        <div><span>WHY L${paragraph.level}</span><p>${esc(paragraph.reason || '—')}</p></div>
        <div><span>CONFIDENCE</span><p>${esc((paragraph.confidence || '—').toUpperCase())}</p></div>
      </div>
    </details>`;
}

function renderEvaluation() {
  const review = state.doc.structuralReview || state.doc.evaluation || inferEvaluation(state.doc);
  evaluationRoot.innerHTML = `
    <header class="evaluation-head">
      <p class="eyebrow">FULL STRUCTURAL REVIEW</p>
      <h2>この文章の骨格をどう見るか</h2>
      <p>${esc(toText(review.overall))}</p>
    </header>
    <div class="evaluation-grid">
      ${reviewCard('強いところ', review.strengths, 'strength')}
      ${reviewCard('弱いところ', review.weakness, 'weakness')}
      ${reviewCard('特徴的な転換', review.turn, 'turn')}
      ${reviewCard('改善余地', review.improvement, 'improve')}
      ${reviewCard('盗める構成技法', review.steal, 'steal', true)}
    </div>`;
}

function reviewCard(label, text, className, wide = false) {
  return `<article class="evaluation-card ${className}${wide ? ' wide' : ''}"><span>${esc(label)}</span><p>${esc(toText(text))}</p></article>`;
}

function inferEvaluation(doc) {
  const paragraphs = doc.sections.flatMap(section => section.paragraphs);
  const levels = paragraphs.map(paragraph => paragraph.level);
  const low = levels.filter(level => level <= 2).length;
  const high = levels.filter(level => level >= 4).length;
  let turns = 0;
  for (let index = 2; index < levels.length; index += 1) {
    const a = levels[index - 2];
    const b = levels[index - 1];
    const c = levels[index];
    if ((a > b && c > b) || (a < b && c < b)) turns += 1;
  }
  const balance = Math.abs(low - high) <= Math.max(2, Math.floor(paragraphs.length * 0.15));
  return {
    overall: `全${paragraphs.length}段落を、L1〜L5と役割の切替から読む構造。${turns}か所ほど方向転換があり、往復しながら論を進めている。`,
    strengths: balance ? '具体側と抽象側の両方を使い、一方に固定されにくい骨格。' : '段落ごとの役割が明示され、論の進行を追いやすい。',
    weakness: low < high ? '抽象側の段落が多い。具体的根拠へ降りる橋が十分か確認したい。' : '具体側の段落が多い。事例を上位命題へ回収する段落が十分か確認したい。',
    turn: 'L1〜L5の方向が反転する箇所が、この文章の読みどころになる。',
    improvement: '急な抽象度移動がある箇所では、中間の解釈・橋渡しが省略されていないか確認するとよい。',
    steal: '段落を内容ではなく、入口・証拠・解釈・主張・転換・結論という仕事に置き換えると、別テーマでも骨格を再利用しやすい。'
  };
}

function bindArticleInteractions() {
  document.querySelectorAll('[data-scroll-section]').forEach(button => {
    button.addEventListener('click', () => scrollToSection(button.dataset.scrollSection));
  });

  document.querySelectorAll('[data-scroll-paragraph]').forEach(button => {
    button.addEventListener('click', () => scrollToParagraph(button.dataset.scrollParagraph));
  });

  document.querySelectorAll('[data-scroll-review]').forEach(button => {
    button.addEventListener('click', scrollToReview);
  });
}

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

function scrollToParagraph(id) {
  const target = document.getElementById(id);
  if (!target) return;
  state.activeParagraphId = id;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  target.classList.add('is-targeted');
  window.setTimeout(() => target.classList.remove('is-targeted'), 1100);
}

function scrollToReview() {
  evaluationRoot.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

function observeSections() {
  disconnectArticleObserver();
  const sections = [...document.querySelectorAll('.section-block')];
  if (!sections.length || !('IntersectionObserver' in window)) return;

  state.sectionObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveSection(visible.target.id);
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: [0, 0.25, 0.5]
  });

  sections.forEach(section => state.sectionObserver.observe(section));
}

function setActiveSection(id) {
  state.activeSectionId = id;
  document.querySelectorAll('.map-row').forEach(row => {
    row.classList.toggle('is-active', row.dataset.sectionId === id);
  });
}

function disconnectArticleObserver() {
  if (state.sectionObserver) {
    state.sectionObserver.disconnect();
    state.sectionObserver = null;
  }
}

async function importAnalysis() {
  const file = importFile.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    validateDoc(data);
    disconnectArticleObserver();
    state.doc = data;
    state.route = 'article';
    renderArticle();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    closeToolsMenu();
  } catch (error) {
    alert(`Importできません: ${error.message}`);
  } finally {
    importFile.value = '';
  }
}

function exportAnalysis() {
  if (!state.doc) return;
  const blob = new Blob([JSON.stringify(state.doc, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${state.doc.id || 'argument-altitude-outline'}.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  closeToolsMenu();
}

function closeToolsMenu() {
  if (toolsMenu) toolsMenu.open = false;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function validateManifest(data) {
  if (!data || !Array.isArray(data.articles)) throw new Error('Analysis Libraryのindexが不正です。');
  for (const article of data.articles) {
    if (!article.slug || !article.dataPath || !article.title) throw new Error('Library itemに必要な情報がありません。');
  }
}

function validateDoc(data) {
  if (!data || !Array.isArray(data.sections)) throw new Error('sections がありません');
  const ids = new Set();
  for (const section of data.sections) {
    if (!section.id) throw new Error('section id がありません');
    if (!Array.isArray(section.paragraphs)) throw new Error(`${section.id} の paragraphs が不正です`);
    for (const paragraph of section.paragraphs) {
      if (!paragraph.id) throw new Error('paragraph id がありません');
      if (ids.has(paragraph.id)) throw new Error(`${paragraph.id} が重複しています`);
      ids.add(paragraph.id);
      if (!Number.isInteger(paragraph.level) || paragraph.level < 1 || paragraph.level > 5) throw new Error(`${paragraph.id} の level は1〜5で指定してください`);
      if (!paragraph.structuralSummary) throw new Error(`${paragraph.id} の structuralSummary がありません`);
    }
  }
}

function showError(error, withBack = false) {
  disconnectArticleObserver();
  document.title = 'Error — Argument Altitude';
  document.body.dataset.view = 'error';
  structureMapRoot.hidden = true;
  structureSummaryRoot.hidden = true;
  evaluationRoot.hidden = true;
  sectionsRoot.innerHTML = '';
  hero.innerHTML = `<div class="error-state"><strong>データを読み込めませんでした。</strong><span>${esc(error.message)}</span>${withBack ? '<a href="#/">← Analysis Library</a>' : ''}</div>`;
}

function toText(value) {
  if (Array.isArray(value)) return value.join(' / ');
  return value == null ? '' : String(value);
}

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function attr(value = '') {
  return esc(value);
}
