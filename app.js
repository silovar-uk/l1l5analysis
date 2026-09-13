import { renderLibraryPage, renderDetailPage } from './lib/render.js';
import { createDrawers } from './lib/drawers.js';

const DATA_URLS = ["./data/cinema-manners.json"];
const main = document.querySelector("#main");
const xrayToggle = document.querySelector("#xray-toggle");
let analyses = [];
let currentAnalysis = null;
let xrayEnabled = false;
let observer = null;

const drawers = createDrawers({
  sourceDrawer: document.querySelector("#source-drawer"),
  sourceBody: document.querySelector("#source-drawer-body"),
  mriDrawer: document.querySelector("#mri-drawer"),
  mriBody: document.querySelector("#mri-drawer-body"),
  getAnalysis: () => currentAnalysis
});

async function init() {
  analyses = (await Promise.all(DATA_URLS.map(loadJson))).filter(Boolean);
  window.addEventListener("hashchange", route);
  xrayToggle.addEventListener("click", toggleXray);
  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", event => { if (event.key === "Escape") drawers.closeAll(); });
  route();
}

async function loadJson(url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to load ${url}`, error);
    return null;
  }
}

function route() {
  drawers.closeAll();
  const match = (location.hash || "#/").match(/^#\/analysis\/([^/?#]+)/);
  const analysis = match ? analyses.find(item => item.slug === match[1]) : null;
  analysis ? showDetail(analysis) : showLibrary();
}

function showLibrary() {
  currentAnalysis = null;
  xrayEnabled = false;
  xrayToggle.hidden = true;
  document.body.classList.remove("xray");
  document.title = "L1–L5 Analysis Archive";
  main.innerHTML = renderLibraryPage(analyses);
  window.scrollTo(0, 0);
}

function showDetail(item) {
  currentAnalysis = item;
  xrayToggle.hidden = false;
  xrayToggle.setAttribute("aria-pressed", String(xrayEnabled));
  document.body.classList.toggle("xray", xrayEnabled);
  document.title = `${item.title} | L1–L5 Analysis Archive`;
  main.innerHTML = renderDetailPage(item);
  setupObserver();
  window.scrollTo(0, 0);
}

function toggleXray() {
  xrayEnabled = !xrayEnabled;
  document.body.classList.toggle("xray", xrayEnabled);
  xrayToggle.setAttribute("aria-pressed", String(xrayEnabled));
}

function handleClick(event) {
  const source = event.target.closest("[data-source-id]");
  if (source) return drawers.openSource(source.dataset.sourceId);
  const trace = event.target.closest("[data-trace-id]");
  if (trace) return drawers.openMri(trace.dataset.traceId);
  if (event.target.closest("[data-close-drawer]")) drawers.closeSource();
  if (event.target.closest("[data-close-mri]")) drawers.closeMri();
}

function setupObserver() {
  if (observer) observer.disconnect();
  const sections = document.querySelectorAll("[data-layer-section]");
  const links = document.querySelectorAll("[data-layer-link]");
  observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const id = visible.target.dataset.layerSection;
    links.forEach(link => link.classList.toggle("active", link.dataset.layerLink === id));
  }, { rootMargin: "-20% 0px -68% 0px", threshold: [0, .2, .5, .8] });
  sections.forEach(section => observer.observe(section));
}

init();