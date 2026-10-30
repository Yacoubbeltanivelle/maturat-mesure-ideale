import { HOME_SUPPLIERS } from '../data/company.js';
import { catalog } from '../state.js';
import { escapeHTML } from '../lib/dom.js';
import { familyById } from '../data/queries.js';
import { sectionLabel } from '../ui/section-label.js';

/* Marques réelles en texte : aucun logo tant que leur usage n'est pas autorisé. */
export function homeSuppliers() {
  const brands = catalog.suppliers.filter((s) => s.real).map((s) => {
    const families = [...new Set(catalog.products.filter((p) => p.supplierId === s.id && p.published !== false).map((p) => familyById(catalog, p.familyId)?.name).filter(Boolean))];
    return `<li><span class="home-brand-name">${escapeHTML(s.name)}</span><span class="home-brand-families">${families.map(escapeHTML).join(' · ')}</span></li>`;
  }).join('');
  return `<section class="home-suppliers section" aria-labelledby="suppliers-home-title">
    <header class="suppliers-intro">
      <div>${sectionLabel('Nos fournisseurs', 'suppliers')}<h2 id="suppliers-home-title">${escapeHTML(HOME_SUPPLIERS.title)}</h2></div>
      <div class="suppliers-intro-copy"><p>${escapeHTML(HOME_SUPPLIERS.intro)}</p><a class="text-button" href="#/suppliers">Voir les fournisseurs et leurs produits <span aria-hidden="true">→</span></a></div>
    </header>
    <ul class="home-brand-list">${brands}</ul>
  </section>`;
}
