import '../styles/suppliers.css';
import { escapeHTML } from '../lib/dom.js';
import { catalog } from '../state.js';
import { publishedProducts, suppliersInUse, familyById } from '../data/queries.js';
import { hashForProduct, hashForFamily } from '../lib/route.js';
import { eyebrow } from '../ui/eyebrow.js';

const number = (index) => String(index + 1).padStart(2, '0');
const count = (products) => `${products.length} fiche${products.length === 1 ? '' : 's'}`;

export function suppliers() {
  const published = publishedProducts(catalog);
  const entries = [...suppliersInUse(catalog)].sort((a, b) => Number(Boolean(b.real)) - Number(Boolean(a.real))).map((supplier) => {
    const products = published.filter((product) => product.supplierId === supplier.id);
    const familyData = [...new Set(products.map((product) => familyById(catalog, product.familyId)).filter(Boolean))];
    return { supplier, products, familyData };
  });
  return `<div class="suppliers-page">
    <section class="suppliers-hero" aria-labelledby="suppliers-title">
      <a class="suppliers-back" href="#/products">← CATALOGUE</a>
      ${eyebrow('NOS FOURNISSEURS')}
      <div class="suppliers-intro">
        <h1 id="suppliers-title">Des fabricants ciblés,<br><em>des technologies<br>à comparer.</em></h1>
        <div class="suppliers-intro-copy">
          <p>Houdec Innovation, Fuji Electric, Ashcroft, Nivelco, Fitok et Dropout sont les marques distribuées. Pour le contrôle du signal, l’analyse liquide et la smart connexion, la maquette montre des fabricants d’exemple. Maturat aide ensuite à confronter ces solutions aux contraintes de votre application.</p>
          <p class="suppliers-demo">Marques réelles, références d’exemple · logos soumis à autorisation, donc affichés en texte</p>
        </div>
      </div>
    </section>
    <section class="suppliers-index" aria-labelledby="suppliers-index-title">
      <div class="suppliers-section-label"><h2 id="suppliers-index-title">Marques et fabricants d’exemple</h2><span>${entries.length} fournisseurs / ${count(published)}</span></div>
      <ol>${entries.map(({ supplier, products, familyData }, index) => `<li>
        <span class="suppliers-ordinal">${number(index)}</span><span class="suppliers-index-name">${escapeHTML(supplier.name)}</span><span class="suppliers-index-families">${familyData.map((f) => escapeHTML(f.name)).join(' / ')}</span><span class="suppliers-count">${count(products)}</span>
      </li>`).join('')}</ol>
    </section>
    <section class="suppliers-details" aria-labelledby="suppliers-details-title">
      <h2 id="suppliers-details-title" class="visually-hidden">Fournisseurs et fiches du catalogue</h2>
      <ol class="suppliers-blocks">${entries.map(({ supplier, products, familyData }, index) => `<li class="suppliers-block">
        <div class="suppliers-identity"><span class="suppliers-ordinal">${number(index)} / FOURNISSEUR</span><h3>${escapeHTML(supplier.name)}</h3><p class="suppliers-block-note">${escapeHTML(supplier.note)}</p><ul class="suppliers-family-list">${familyData.map((f) => `<li><a href="${hashForFamily(f.slug)}">${escapeHTML(f.name)}</a></li>`).join('')}</ul></div>
        <div class="suppliers-records"><p class="suppliers-records-heading">FICHES PUBLIÉES <span>${count(products)}</span></p><ul>${products.map((product) => `<li><a href="${hashForProduct(product.slug)}"><span><span class="suppliers-product-name">${escapeHTML(product.name)}</span><span class="suppliers-reference">${escapeHTML(product.reference || '')} · ${escapeHTML(familyById(catalog, product.familyId)?.name || '')}</span></span><span class="suppliers-arrow" aria-hidden="true">→</span></a></li>`).join('')}</ul></div>
      </li>`).join('')}</ol>
    </section>
    <section class="suppliers-selection" aria-labelledby="suppliers-selection-title">
      <div>${eyebrow('LOGIQUE DE SÉLECTION')}<h2 id="suppliers-selection-title">Le fabricant n’est pas<br><em>le point de départ.</em></h2><p>Le choix dépend des contraintes de votre installation. L’application donne le point de départ pour comparer les solutions.</p><a class="suppliers-catalog-link" href="#/products">Voir le catalogue <span aria-hidden="true">→</span></a></div>
      <ol class="suppliers-steps">${['Application', 'Principe', 'Technologie', 'Fournisseur / gamme'].map((step, index) => `<li><span class="suppliers-ordinal">${number(index)}</span><span>${step}</span>${index < 3 ? '<span class="suppliers-step-arrow" aria-hidden="true">↓</span>' : ''}</li>`).join('')}</ol>
    </section>
  </div>`;
}
