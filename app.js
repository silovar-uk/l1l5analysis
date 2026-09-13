const DATA_URL = './data/demo.json';
const state = { doc: null };

const hero = document.querySelector('#hero');
const evaluationRoot = document.querySelector('#evaluation');
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

const CURATED_EVALUATIONS = {
  'cinema-manners-outline': {
    overall: '現在の「当たり前」をいったん壊し、歴史的な反例と複数の転換点を積み上げ、最後に価値判断へ戻る。脱自然化のための系譜学的な骨格がかなり明確。',
    strengths: '各節が「具体へ降りる → 解釈する → 上位命題へ戻る」を反復しており、事例紹介だけで終わりにくい。節ごとの役割も、反例・制度・環境・規範ときれいに分かれている。',
    weakness: '因果の橋が細い箇所がある。特に「時間・身体の規律 → 静粛」と「シネコンの高品質化 → マナー厳格化」は、骨格上はL3の橋渡しをもう一段厚くできる。',
    turn: '最も効いている転換は終盤のRESET。歴史的に作られた規範だと示したあと、「だから緩めるべき」と直結せず、事実と価値判断を切り離して論考を立て直している。',
    improvement: '終盤の規範論へ入る前に、静粛を支持する競合理論や「公共空間の調整ルール」という別モデルを一度置くと、最終的な立場がさらに強くなる。',
    steal: '「現在の常識 → 逆の過去 → 複数の転換点 → 理論化 → 現在の症状 → 事実と規範を分離して結論」という型は、そのまま他テーマへ転用できる。'
  }
};

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
  renderEvaluation();
  renderGuide();
  renderSections();
}

function renderHero() {
  const d = state.doc;
  const paragraphCount = d.sections.reduce((sum, section) => sum + section.paragraphs.length, 0);
  hero.innerHTML = `
    <header class="doc-head">
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
      <p class="method-note">原文本文は表示しません。各段落を「そこで何が書かれているか」ではなく、<strong>その段落が論証の中で何をしているか</strong>へ抽象化しています。L1ほど具体、L5ほど抽象です。</p>
    </header>`;
}

function renderEvaluation() {
  const d = state.doc;
  const review = d.evaluation || CURATED_EVALUATIONS[d.id] || inferEvaluation(d);
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
  return `<article class="evaluation-card ${className}${wide ? ' wide' : ''}"><span>${esc(label)}</span><p>${esc(text)}</p></article>`;
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
