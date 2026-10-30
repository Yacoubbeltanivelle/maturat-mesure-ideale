import { escapeHTML } from '../lib/dom.js';
import { familyById, supplierById } from '../data/queries.js';
import { hashForProduct } from '../lib/route.js';
import { familyMark } from '../ui/family-mark.js';
import { img, imageCredit, productVisualId } from '../ui/media.js';

/* Carte d'une fiche. La carte entière est un lien : rien d'interactif n'est imbriqué. */
export function productCard(catalog, product, editorial = false) {
  const family = familyById(catalog, product.familyId);
  const supplier = supplierById(catalog, product.supplierId);
  if (editorial) {
    const visual = productVisualId(product, family);
    const usefulSpec = editorial === 'family'
      ? product.specs?.find((spec) => /^(principe|type|fonction|fonctions|mesure)$/i.test(spec.label))
      : product.specs?.find((spec) => /étendue|plage|gamme/i.test(spec.label)) ?? product.specs?.[0];
    return `<li><a class="product-card product-card-editorial" href="${hashForProduct(product.slug)}">
      <figure class="product-card-visual">${visual ? img(visual, family.name, '', true) : familyMark(family?.code)}</figure>
      <div class="product-card-body"><h3>${escapeHTML(product.name)}</h3>
      <span class="product-card-supplier">${escapeHTML(family?.name ?? '')} / ${escapeHTML(supplier?.name ?? '')}</span>
      <p class="product-card-spec">${escapeHTML(usefulSpec ? `${usefulSpec.label} : ${usefulSpec.value}` : product.uses?.[0] ?? product.summary)}</p>
      <span class="product-card-foot">Voir la fiche<span class="product-card-arrow" aria-hidden="true">→</span></span>
      <span class="product-card-credit">${visual ? `${imageCredit(visual)} · ` : ''}${product.img ? 'Visuel d’illustration' : 'Illustration de famille'}</span></div>
    </a></li>`;
  }
  return `<li><a class="product-card" href="${hashForProduct(product.slug)}">
    <span class="product-card-mark" aria-hidden="true">${familyMark(family?.code)}</span>
    <div class="product-card-body">
      <span class="mono product-card-meta">${escapeHTML(family?.code ?? '')} / ${escapeHTML(family?.name ?? '')}</span>
      <h3>${escapeHTML(product.name)}</h3>
      <p>${escapeHTML(product.summary)}</p>
      <span class="product-card-foot"><span class="mono">${escapeHTML(supplier?.name ?? '')}</span><span class="product-card-arrow" aria-hidden="true">→</span></span>
    </div>
  </a></li>`;
}

/* Grille de fiches. */
export const productGrid = (catalog, products, editorial = false) =>
  `<ul class="product-grid">${products.map((p) => productCard(catalog, p, editorial)).join('')}</ul>`;
