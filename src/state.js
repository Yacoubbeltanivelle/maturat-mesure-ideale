/* Etat de la demonstration, entierement en memoire.
 * Aucun localStorage, sessionStorage ni IndexedDB : tout repart a zero au rechargement. */

import { createCatalog } from './data/catalog.js';
import { CATALOG_FILTER_DEFAULTS } from './data/catalog-facets.js';

export const DRAFT_DEFAULTS = Object.freeze({
  family: '',
  product: '',
  application: '',
  name: '', company: '', email: '',
  /* « reference » ou « need » ; vide tant que le visiteur n'a pas choisi. */
  mode: '', reference: '',
  /* Identifiant DM-2026-0xx une fois la demande enregistrée. */
  requestId: '',
});

export const draft = { ...DRAFT_DEFAULTS, answers: {} };

/* Le garde permet d'importer ce module hors navigateur, pour les tests de la
 * remise a zero. Dans le navigateur, la preference est lue comme avant. */
const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const initialState = () => ({
  page: 'home',
  slug: '',
  family: 2,
  step: 0,
  done: false,
  dropStep: 0,
  cut: false,
  scrollSync: true,
  catalogFilters: { ...CATALOG_FILTER_DEFAULTS },
  reduced: prefersReducedMotion(),
  featuredProductId: 'prd-001',
  requests: [],
  /* Administration simulee : recherche de la liste et retour du dernier
   * enregistrement. Les deux repartent a zero comme le reste de la simulation. */
  adminSearch: '',
  adminFeedback: null,
});

export const state = initialState();

/* Catalogue partage par le site et, plus tard, par l'administration simulee :
 * une copie independante des donnees sources, modifiable dans cet onglet. */
export const catalog = createCatalog();

export function resetCatalog() {
  Object.assign(catalog, createCatalog());
}

export function resetDraft() {
  Object.assign(draft, DRAFT_DEFAULTS);
  draft.answers = {};
}

/* Bouton « Recommencer » du parcours Quote : repart sur une nouvelle demande
 * sans toucher au catalogue, aux demandes deja enregistrees ni au reste de la
 * simulation (contrairement a resetSimulation, reserve au reset Admin, au
 * rechargement et au retour bfcache). */
export function resetQuoteRequest() {
  resetDraft();
  state.step = 0;
  state.done = false;
}

export function resetSimulation() {
  resetDraft();
  resetCatalog();
  Object.assign(state, initialState());
}
