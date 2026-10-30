import { catalog } from '../state.js';
import { escapeHTML } from '../lib/dom.js';
import { familyByCode, productsOfFamily } from '../data/queries.js';
import { hashForFamily } from '../lib/route.js';
import { sectionLabel } from '../ui/section-label.js';

/* Index des six ensembles qui entourent la mesure. Traitement d'air renvoie à la
 * page Dropout, qui reste la page de référence. */
const CODES = ['05', '06', '07', '08', '09', '10'];

export function homeFamilyIndex() {
  const rows = CODES.map((code) => familyByCode(catalog, code)).filter((f) => f && f.published !== false).map((f) => {
    const n = productsOfFamily(catalog, f.id).length;
    const href = f.code === '06' ? '#/dropout' : hashForFamily(f.slug);
    return `<li><a href="${href}"><span class="mono home-index-code">${escapeHTML(f.code)}</span><span class="home-index-copy"><span class="home-index-name">${escapeHTML(f.name)}</span><span class="home-index-text">${escapeHTML(f.text)}</span></span><span class="home-index-count">${n} ${n === 1 ? 'fiche' : 'fiches'} <span aria-hidden="true">→</span></span></a></li>`;
  }).join('');
  return `<section class="home-index section" aria-labelledby="home-index-title">
    <header class="home-index-header">${sectionLabel('Autour de la mesure', 'product')}<h2 id="home-index-title">Six autres ensembles pour compléter votre installation.</h2></header>
    <ul class="home-index-list">${rows}</ul>
  </section>`;
}
