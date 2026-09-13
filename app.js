const INDEX_URL = './data/index.json';
const state = { manifest: null, doc: null, route: 'library' };

const hero = document.querySelector('#hero');
const evaluationRoot = document.querySelector('#evaluation');
const sectionsRoot = document.querySelector('#sections');
const levelGuide = document.querySelector('#levelGuide');
const importBtn = document.querySelector('#importBtn');
const exportBtn = document.querySelector('#exportBtn');
const importFile = document.querySelector('#importFile');

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
    bind();
    await route();
  } catch (error) {
    showError(error);
  }
}

function bind() {
  importBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', importAnalysis);
  exportBtn.addEventListener('click', exportAnalysis);
  window.addEventListener('hashchange', route);
}

async function route() {
  const match = location.hash.match(/^#\/article\/([^/?#]+)/);
  if (!match) {
    state.route = 'library';
    state.doc = null;
    renderLibrary();
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
  exportBtn.hidden = true;
  evaluationRoot.hidden = true;
  levelGuide.hidden = true;

  hero.innerHTML = `
    <header class="library-head">
      <p class="eyebrow">ANALYSIS LIBRARY · ${state.manifest.articles.length} STRUCTURES</p>
      <h1>文章ではなく、<br>論証の骨格を集める。</h1>
      <p>各論考を段落単位のL1〜L5と役割へ抽象化し、「何を言ったか」ではなく「どう組み立てたか」を保存するArchive。</p>
    </header>`;

  sectionsRoot.innerHTML = `
    <section class="library-list" aria-label="分析一覧">
      ${state.manifest.articles.map(renderLibraryItem).join('')}
    </section>`;
}

function renderLibraryItem(article) {
  return `
    <article class="library-item">
      <div class="library-item-top">
        <div>
          <p class="library-kicker">${esc(article.sectionCount)} SECTIONS · ${esc(article.paragraphCount)} PARAGRAPH UNITS</p>
          <h2><a href="#/article/${encodeURIComponent(article.slug)}">${esc(article.title)}</a></h2>
          ${article.subtitle ? `<p class="library-subtitle">${esc(article.subtitle)}</p>` : ''}
        </div>
        <a class="library-open" href="#/article/${encodeURIComponent(article.slug)}">分析を見る <span aria-hidden="true">→</span></a>
      </div>
      <div class="signature-block">
        <span>STRUCTURAL SIGNATURE</span>
        <p>${esc(article.structuralSignature || '')}</p>
      </div>
      ${article.structuralNote ? `<p class="structural-note"><strong>STRUCTURAL NOTE</strong>${esc(article.structuralNote)}</p>` : ''}
      <div class="library-footer source-only">
        ${article.source?.url ? `<a href="${attr(article.source.url)}" target="_blank" rel="noreferrer">原文 ↗</a>` : ''}
      </div>
    </article>`;
}

function renderArticle() {
  document.title = `${state.doc.title} — Argument Altitude`;
  document.body.dataset.view = 'article';
  exportBtn.hidden = false;
  evaluationRoot.hidden = false;
  levelGuide.hidden = false;
  renderHero();
  renderEvaluation();
  renderGuide();
  renderSections();
}

function renderHero() {
  const d = state.doc;
  const paragraphCount = d.sections.reduce((sum, section) => sum + section.paragraphs.length, 0);
  hero.innerHTML = `
    <header class="doc-head">
      <a class="back-link" href="#/">← Analysis Library</a>
      <p class="eyebrow">PARAGRAPH REVERSE OUTLINE</p>
      <div class="title-row">
        <div class="title-copy">
          <h1>${esc(d.title)}</h1>
          ${d.subtitle ? `<p class="subtitle">${esc(d.subtitle)}</p>` : ''}
        </div>
        ${d.source?.url ? `<a class="source-cta" href="${attr(d.source.url)}" target="_blank" rel="noreferrer"><span>原文を読む</span><b aria-hidden="true">↗</b></a>` : ''}
      </div>
      <div class="meta">
        <span>${esc(d.source?.publisher || '')}</span>
        <span>${d.sections.length} sections</span>
        <span>${paragraphCount} paragraph units</span>
      </div>
      <p class="thesis">${esc(d.thesis || '')}</p>
      ${d.structuralSignature ? `<div class="article-signature"><span>STRUCTURAL SIGNATURE</span><p>${esc(d.structuralSignature)}</p></div>` : ''}
      <p class="method-note">原文本文は表示しません。各段落を「そこで何が書かれているか」ではなく、<strong>その段落が論証の中で何をしているか</strong>へ抽象化しています。左のL5ほど抽象、右のL1ほど具体です。</p>
    </header>`;
}

function renderEvaluation() {
  const d = state.doc;
  const review = d.structuralReview || d.evaluation || inferEvaluation(d);
  evaluationRoot.innerHTML = `
    <header class="evaluation-head">
      <p class="eyebrow">STRUCTURAL REVIEW</p>
      <h2>この文章の骨格をどう見るか</h2>
      <p>${esc(review.overall)}</p>
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
  const levels = paragraphs.map(p => p.level);
  const low = levels.filter(level => level <= 2).length;
  const high = levels.filter(level => level >= 4).length;
  let turns = 0;
  for (let i = 2; i < levels.length; i += 1) {
    const a = levels[i - 2], b = levels[i - 1], c = levels[i];
    if ((a > b && c > b) || (a < b && c < b)) turns += 1;
  }
  const balance = Math.abs(low - high) <= Math.max(2, Math.floor(paragraphs.length * .15));
  return {
    overall: `全${paragraphs.length}段落を、L1〜L5の上下と役割の切替から読む構造。${turns}か所ほど大きな方向転換があり、一直線というより往復しながら論を進めている。`,
    strengths: balance ? '具体側と抽象側の両方を使っており、一方に固定されにくい骨格。' : '段落ごとの役割が明示されているため、論の進行を追いやすい。',
    weakness: low < high ? '抽象側の段落が多い。具体的根拠へ降りる橋が十分か確認したい。' : '具体側の段落が多い。事例を上位命題へ回収する段落が十分か確認したい。',
    turn: 'L1〜L5の方向が反転する箇所が、この文章の読みどころになる。',
    improvement: '急な抽象度移動がある箇所では、中間の解釈・橋渡しが省略されていないか確認するとよい。',
    steal: '段落を内容ではなく「入口・証拠・解釈・主張・転換・結論」という仕事に置き換えると、別テーマでも骨格を再利用しやすい。'
  };
}

function renderGuide() {
  levelGuide.innerHTML = `
    <div class="guide-copy"><span>抽象</span><span>具体</span></div>
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
  const depth = 5 - paragraph.level;
  return `
    <details class="paragraph-item level-${paragraph.level}" style="--depth:${depth}">
      <summary>
        <div class="paragraph-meta">
          <span class="paragraph-id">${esc(paragraph.id.toUpperCase())}</span>
          <span class="level-chip">L${paragraph.level}</span>
          <span class="role">${esc(paragraph.role)}</span>
          ${paragraph.roleDetail ? `<span class="role-detail">${esc(paragraph.roleDetail)}</span>` : ''}
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
  if (delta > 0) return { label: `← ABSTRACT +${delta}`, className: 'up' };
  if (delta < 0) return { label: `CONCRETE +${Math.abs(delta)} →`, className: 'down' };
  return { label: '→ HOLD', className: 'hold' };
}

async function importAnalysis() {
  const file = importFile.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    validateDoc(data);
    state.doc = data;
    state.route = 'article';
    renderArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.doc.id || 'argument-altitude-outline'}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function validateManifest(data) {
  if (!data || !Array.isArray(data.articles)) throw new Error('Analysis Libraryのindexが不正です。');
  for (const article of data.articles) {
    if (!article.slug || !article.dataPath || !article.title) throw new Error('Library itemに必要な情報がありません。');
  }
}

function validateDoc(data) {
  if (!data || !Array.isArray(data.sections)) throw new Error('sections がありません');
  for (const section of data.sections) {
    if (!Array.isArray(section.paragraphs)) throw new Error(`${section.id || 'section'} の paragraphs が不正です`);
    for (const paragraph of section.paragraphs) {
      if (!paragraph.id) throw new Error('paragraph id がありません');
      if (!Number.isInteger(paragraph.level) || paragraph.level < 1 || paragraph.level > 5) throw new Error(`${paragraph.id} の level は1〜5で指定してください`);
      if (!paragraph.structuralSummary) throw new Error(`${paragraph.id} の structuralSummary がありません`);
    }
  }
}

function showError(error, withBack = false) {
  document.title = 'Error — Argument Altitude';
  evaluationRoot.hidden = true;
  levelGuide.hidden = true;
  sectionsRoot.innerHTML = '';
  hero.innerHTML = `<div class="error-state"><strong>データを読み込めませんでした。</strong><span>${esc(error.message)}</span>${withBack ? '<a href="#/">← Analysis Library</a>' : ''}</div>`;
}

function toText(value) {
  return Array.isArray(value) ? value.join(' / ') : (value || '—');
}

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function attr(value = '') {
  return esc(value);
}