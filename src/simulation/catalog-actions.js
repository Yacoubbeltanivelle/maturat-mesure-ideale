/* Écritures de l'administration simulée sur le catalogue vivant.
 *
 * Ces fonctions reçoivent le catalogue en paramètre, comme les lectures de
 * data/queries.js : elles ne touchent ni au DOM ni à l'état, et restent donc
 * vérifiables hors navigateur. Rien n'est persisté — la copie source du
 * catalogue n'est jamais modifiée, seule la copie vivante de state.js l'est. */

import { productByIdOrSlug, familyById, supplierById } from '../data/queries.js';

const trim = (value) => String(value ?? '').trim();

/** Les champs qu'une fiche existante expose au formulaire d'édition. */
export function productFormValues(catalog, key) {
  const product = productByIdOrSlug(catalog, key);
  if (!product) return null;
  return {
    name: product.name,
    reference: product.reference,
    summary: product.summary,
    familyId: product.familyId,
    supplierId: product.supplierId,
    published: product.published !== false,
  };
}

/** Champs requis et rattachements existants. Un objet vide signifie « valide ». */
export function validateProductValues(catalog, values = {}) {
  const errors = {};
  if (!trim(values.name)) errors.name = 'Le nom est obligatoire : il identifie la fiche sur le site.';
  if (!trim(values.reference)) errors.reference = 'La référence est obligatoire.';
  if (!trim(values.summary)) errors.summary = 'Le résumé est obligatoire : il s’affiche dans le catalogue.';
  if (!familyById(catalog, trim(values.familyId))) errors.familyId = 'Choisissez une famille de la liste.';
  if (!supplierById(catalog, trim(values.supplierId))) errors.supplierId = 'Choisissez un fournisseur de la liste.';
  return errors;
}

/** Applique les modifications à la fiche du catalogue vivant.
 *
 *  L'identifiant et le slug ne bougent pas dans ce lot : les adresses déjà
 *  ouvertes — administration comme site public — restent valides après
 *  l'enregistrement. */
export function applyProductEdit(catalog, key, values = {}) {
  const product = productByIdOrSlug(catalog, key);
  if (!product) return { ok: false, errors: { form: 'Cette fiche n’existe plus dans le catalogue.' }, product: null };

  const errors = validateProductValues(catalog, values);
  if (Object.keys(errors).length) return { ok: false, errors, product };

  product.name = trim(values.name);
  product.reference = trim(values.reference);
  product.summary = trim(values.summary);
  product.familyId = trim(values.familyId);
  product.supplierId = trim(values.supplierId);
  product.published = Boolean(values.published);

  return { ok: true, errors: {}, product };
}

/** Repères du tableau de bord, tous calculés sur le catalogue vivant. */
export function catalogCounts(catalog) {
  const total = catalog.products.length;
  const published = catalog.products.filter((p) => p.published !== false).length;
  return {
    total,
    published,
    hidden: total - published,
    families: catalog.families.length,
    suppliers: catalog.suppliers.length,
  };
}
