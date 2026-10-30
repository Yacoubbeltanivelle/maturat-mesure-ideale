import { state, catalog } from '../state.js';
import { escapeHTML } from '../lib/dom.js';
import { familyBySlug, productsOfFamily, productsOfPrinciple } from '../data/queries.js';
import { hashForProduct } from '../lib/route.js';
import { img, imageCredit } from '../ui/media.js';
import { eyebrow } from '../ui/eyebrow.js';
import { familyMark } from '../ui/family-mark.js';
import { textButton } from '../ui/button.js';
import { breadcrumb } from '../components/breadcrumb.js';
import { productGrid } from '../components/product-card.js';
import { notFound } from './not-found.js';
import { HOME_FAMILIES } from '../data/families.js';

/** Nom de la famille courante, pour le titre du document. */
export function familyTitle() {
  return familyBySlug(catalog, state.slug)?.name || 'Famille introuvable';
}

/* Visuel d'en-tête : photographie créditée pour les quatre grandeurs de mesure,
 * repère au trait pour les familles qui n'ont pas de photographie pertinente. */
function familyVisual(family) {
  if (family.img) {
    const visual = HOME_FAMILIES.find((f) => f.code === family.code)?.img ?? family.img;
    return `<figure class="family-hero-photo">${img(visual, family.name)}
      ${imageCredit(visual) ? `<figcaption>${imageCredit(visual)}</figcaption>` : ''}
    </figure>`;
  }
  return `<div class="family-hero-mark" aria-hidden="true">${familyMark(family.code, 'family-mark-large')}</div>`;
}

/* Relevés techniques discrets, à la manière d'un afficheur d'instrument.
 * Toutes les valeurs sont lues dans les données : rien n'est inventé ici. */
function familyReadout(family, productCount) {
  const rows = [
    ['FAMILLE', family.code],
    family.unit ? ['UNITÉ', family.unit] : null,
    ['PRINCIPES', String(family.principles.length).padStart(2, '0')],
    ['FICHES', String(productCount).padStart(2, '0')],
  ].filter(Boolean);

  return `<dl class="family-readout" aria-label="Repères de la famille">
    ${rows.map(([label, value]) => `<div class="family-readout-row">
      <dt class="mono">${escapeHTML(label)}</dt>
      <dd class="mono">${escapeHTML(value)}</dd>
    </div>`).join('')}
  </dl>`;
}

export function family() {
  const entry = familyBySlug(catalog, state.slug);
  if (!entry) return notFound();

  const list = productsOfFamily(catalog, entry.id);
  const count = list.length === 1 ? '1 fiche d’exemple' : `${list.length} fiches d’exemple`;

  const need = textButton('Décrire mon besoin', `data-need="${escapeHTML(entry.name)}" aria-label="Décrire un besoin : ${escapeHTML(entry.name)}"`);
  return `<div class="family-page family-editorial" data-family="${escapeHTML(entry.code)}" style="--family-halo: ${escapeHTML(entry.code === '01' ? '#dcebf5' : entry.color)}">
    ${breadcrumb([
      { label: 'Accueil', href: '#/home' },
      { label: 'Produits', href: '#/products' },
      { label: entry.name },
    ])}

    <section class="family-hero" aria-labelledby="family-title">
      <div class="family-hero-top">
        ${eyebrow(`${escapeHTML(entry.code)} — FAMILLE`)}
        <span class="mono">${String(list.length).padStart(2, '0')} ${list.length === 1 ? 'FICHE' : 'FICHES'}</span>
      </div>
      <div class="family-hero-copy">
        <h1 id="family-title">${escapeHTML(entry.longName)}</h1>
        <p class="family-intro">${escapeHTML(entry.intro)}</p>
      </div>
      <div class="family-visual">${familyVisual(entry)}${entry.unit ? `<span class="family-unit" aria-hidden="true">${escapeHTML(entry.unit)}</span>` : ''}</div>
      <ul class="family-principles">${entry.principles.map((p) => `<li>${escapeHTML(p)}</li>`).join('')}</ul>
      ${familyReadout(entry, list.length)}
      <div class="family-hero-need">${need}${entry.code === '06' ? '<a class="text-button" href="#/dropout">Page Dropout <span aria-hidden="true">→</span></a>' : ''}</div>
    </section>

    <section class="family-products" aria-labelledby="family-products-title">
      <div class="catalog-section-heading"><div><p class="family-label mono">EXPLORER LES SOLUTIONS</p><h2 id="family-products-title">Fiches de la famille</h2></div><p class="mono family-products-count">${count}</p></div>
      ${list.length
        ? productGrid(catalog, list, 'family')
        : '<p class="catalog-empty-title">Aucune fiche d’exemple n’est rattachée à cette famille pour le moment.</p>'}
      <p class="catalog-disclaimer">Les marques sont réelles ; références et caractéristiques sont des données d’exemple pour la maquette.</p>
      <a class="text-button family-catalog-link" href="#/products">Revenir au catalogue <span aria-hidden="true">→</span></a>
    </section>

    <section class="family-guide" aria-labelledby="family-guide-title">
      <p class="family-label mono">LES PRINCIPES DE LA FAMILLE</p>
      <h2 id="family-guide-title">Quel principe choisir ?</h2>
      <ol class="family-principle-grid">${entry.principles.map((p, i) => {
        const associated = productsOfPrinciple(catalog, entry.id, p);
        return `<li><span class="mono" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div class="family-principle-content"><h3>${escapeHTML(p)}</h3>
          <p class="family-principle-count">${associated.length ? `${associated.length} ${associated.length === 1 ? 'fiche associée' : 'fiches associées'}` : 'Aucune fiche d’exemple'}</p>
          ${associated.map((product) => `<a class="family-principle-product" href="${hashForProduct(product.slug)}"><span>${escapeHTML(product.name)}</span><span class="family-principle-link">Voir la fiche <span aria-hidden="true">→</span></span></a>`).join('')}
        </div></li>`;
      }).join('')}</ol>
    </section>

    <section class="family-uses" aria-labelledby="family-uses-title">
      <div class="family-uses-heading"><p class="family-label mono">APPLICATIONS</p><h2 id="family-uses-title">Dans quelles<br><em>situations ?</em></h2><div class="family-process" aria-hidden="true">${familyMark(entry.code)}</div></div>
      <ol class="family-uses-list">${entry.uses.map((u, i) => `<li><span class="mono" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span>${escapeHTML(u)}</span></li>`).join('')}</ol>
    </section>

    <section class="family-help" aria-labelledby="family-help-title">
      <div><p class="family-label mono">DÉFINIR MON BESOIN</p><h2 id="family-help-title">Vous hésitez entre<br>plusieurs principes ?</h2><p>Décrivez votre application pour préparer le bon point de départ.</p></div>
      ${need}
    </section>
  </div>`;
}
