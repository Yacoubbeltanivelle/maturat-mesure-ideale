import { escapeHTML } from '../lib/dom.js';

/* Fil d'Ariane. Les étapes parcourables sont des liens, la page courante ne l'est pas. */
export function breadcrumb(trail) {
  const items = trail.map((step, i) => {
    const last = i === trail.length - 1;
    const label = escapeHTML(step.label);
    const content = last || !step.href
      ? `<span ${last ? 'aria-current="page"' : ''}>${label}</span>`
      : `<a href="${escapeHTML(step.href)}">${label}</a>`;
    return `<li>${content}</li>`;
  }).join('');
  return `<nav class="breadcrumb" aria-label="Fil d’Ariane"><ol>${items}</ol></nav>`;
}
