document.addEventListener('click', event => {
  const link = event.target.closest('[data-layer-link]');
  if (!link) return;
  const targetId = link.dataset.layerLink;
  const target = document.getElementById(targetId);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, true);