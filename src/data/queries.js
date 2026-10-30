/* Lectures du catalogue. Fonctions pures : elles reçoivent le catalogue en
 * paramètre, ne touchent ni au DOM ni à l'état, et restent donc testables. */

import { productFacets } from './catalog-facets.js';

const published = (entry) => entry.published !== false;

export const familyById = (catalog, id) => catalog.families.find((f) => f.id === id) || null;
export const familyBySlug = (catalog, slug) => catalog.families.find((f) => f.slug === slug) || null;
export const familyByName = (catalog, name) => catalog.families.find((f) => f.name === name) || null;
export const familyByCode = (catalog, code) => catalog.families.find((f) => f.code === code) || null;
export const supplierById = (catalog, id) => catalog.suppliers.find((s) => s.id === id) || null;
export const productById = (catalog, id) => catalog.products.find((p) => p.id === id) || null;
export const productBySlug = (catalog, slug) => catalog.products.find((p) => p.slug === slug) || null;

/** Une fiche désignée par son identifiant ou par son slug : l'administration
 *  accepte les deux dans ses adresses. */
export const productByIdOrSlug = (catalog, key) =>
  productById(catalog, key) || productBySlug(catalog, key);

export const publishedFamilies = (catalog) => catalog.families.filter(published);
export const publishedProducts = (catalog) => catalog.products.filter(published);

/** Fiches rattachées à une famille. */
export const productsOfFamily = (catalog, familyId) =>
  publishedProducts(catalog).filter((p) => p.familyId === familyId);

/** Fournisseurs réellement utilisés par au moins une fiche publiée. */
export function suppliersInUse(catalog) {
  const used = new Set(publishedProducts(catalog).map((p) => p.supplierId));
  return catalog.suppliers.filter((s) => used.has(s.id));
}

/** Comparaison insensible aux accents et à la casse, pour la recherche. */
export const normalize = (value) =>
  String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Correspondances textuelles explicites, sans déduire une technologie des usages.
 * Raccords et vannes désignent un type d'objet : leur nom peut faire foi.
 * Les autres principes doivent figurer dans la caractéristique technique, au
 * mot près : seuls les synonymes listés ici rapprochent deux termes, un
 * principe et le nom que les fiches lui donnent. */
export function productsOfPrinciple(catalog, familyId, principle) {
  const words = (value) => ` ${normalize(value).replace(/[^a-z0-9]+/g, ' ').trim()} `;
  const label = normalize(principle);
  const objectName = { raccords: 'raccord', vannes: 'vanne' }[label];
  const synonym = { bimetallique: 'bilame' }[label];
  const terms = objectName ? [objectName, label] : synonym ? [principle, synonym] : [principle];
  return productsOfFamily(catalog, familyId).filter((product) => {
    const sources = [productFacets(product).technology];
    if (objectName) sources.push(product.name);
    return sources.some((source) => terms.some((term) => words(source).includes(words(term))));
  });
}

/** Texte indexé d'une fiche : ce qui la décrit elle-même, plus sa famille et son
 *  fournisseur. Les principes de mesure de la famille sont volontairement exclus :
 *  chercher « radar » ne doit pas remonter toutes les fiches de niveau. */
function searchIndex(catalog, product) {
  const family = familyById(catalog, product.familyId);
  const supplier = supplierById(catalog, product.supplierId);
  return normalize([
    product.name, product.reference, product.summary, product.uses.join(' '),
    product.specs.map((s) => `${s.label} ${s.value}`).join(' '),
    family?.name, family?.longName, supplier?.name,
  ].filter(Boolean).join(' '));
}

/** Une fiche répond-elle aux termes cherchés ? Partagé par la recherche publique
 *  et par celle de l'administration, qui ne portent pas sur le même périmètre. */
/* Mots outils ignorés : « eau dans l’air comprimé » doit trouver le séparateur Dropout. */
const STOPWORDS = new Set(['a', 'au', 'aux', 'avec', 'd', 'dans', 'de', 'des', 'du', 'en', 'et', 'l', 'la', 'le', 'les', 'mon', 'mes', 'ou', 'par', 'pour', 'sur', 'un', 'une']);

export function matchesQuery(catalog, product, q = '') {
  const terms = normalize(q).split(/[\s'’]+/).filter((term) => term && !STOPWORDS.has(term));
  if (!terms.length) return true;
  const haystack = searchIndex(catalog, product);
  return terms.every((term) => haystack.includes(term));
}

/** Recherche et filtres combinés. Aucun rechargement, aucun appel réseau. */
export function filterProducts(catalog, { q = '', family = '', supplier = '', technology = '', application = '', signal = '' } = {}) {
  return publishedProducts(catalog).filter((product) => {
    if (family && product.familyId !== family) return false;
    if (supplier && product.supplierId !== supplier) return false;
    if (technology || application || signal) {
      const facets = productFacets(product);
      if (technology && facets.technology !== technology) return false;
      if (application && !facets.application.includes(application)) return false;
      if (signal && !facets.signal.includes(signal)) return false;
    }
    return matchesQuery(catalog, product, q);
  });
}

/** Recherche de l'administration : toutes les fiches, masquées comprises. */
export const searchAllProducts = (catalog, q = '') =>
  catalog.products.filter((product) => matchesQuery(catalog, product, q));

export const hasActiveFilters = ({ q = '', family = '', supplier = '', technology = '', application = '', signal = '' } = {}) =>
  Boolean(q.trim() || family || supplier || technology || application || signal);

/** Fiche complète : produit, famille et fournisseur résolus. */
export function productContext(catalog, productId) {
  const product = productById(catalog, productId);
  if (!product) return null;
  return {
    product,
    family: familyById(catalog, product.familyId),
    supplier: supplierById(catalog, product.supplierId),
  };
}

/** Le produit retenu reste-t-il cohérent avec la famille choisie dans le formulaire ?
 *  Sert à ne pas garder une association périmée quand le visiteur change de besoin. */
export function productMatchesFamilyName(catalog, productId, familyName) {
  const context = productContext(catalog, productId);
  if (!context) return false;
  return context.family?.name === familyName;
}
