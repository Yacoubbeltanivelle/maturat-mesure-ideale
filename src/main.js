import './styles/fonts.css';
import './styles/style.css';
import './styles/site-header.css';
import './styles/products.css';
import './styles/home.css';
import './styles/home-tableaux.css';
import './styles/editorial.css';
import './styles/admin.css';
import './styles/footer.css';
import './styles/home-polish.css';
import './styles/suppliers-scene.css';
import './styles/home-labels.css';
import './styles/quote.css';
import './styles/v2-global.css';

import { $, $$ } from './lib/dom.js';
import { state, draft, catalog, resetDraft, resetQuoteRequest, resetSimulation } from './state.js';
import { SITE } from './data/site.js';
import { CATALOG_FILTER_DEFAULTS } from './data/catalog-facets.js';
import { productContext, productMatchesFamilyName, hasActiveFilters } from './data/queries.js';
import { applyProductEdit, productFormValues } from './simulation/catalog-actions.js';
import { readRoute, hashFor, isAdminPage } from './router.js';

import { siteHeader, mountHeader } from './components/site-header.js';
import { siteFooter } from './components/site-footer.js';
import { mountFooterMotion } from './components/footer-motion.js';
let stopFooterMotion = () => {};
import { creditsContent } from './components/credits-dialog.js';
import { updateFamily } from './components/family-controls.js';
import { updateDrop } from './components/dropout-controls.js';
import { summary, productContextBlock, syncQuoteMode } from './components/quote-form.js';

import { home } from './pages/home.js';
import { dropout } from './pages/dropout.js';
import { quote } from './pages/quote.js';
import { products, catalogResultsHTML } from './pages/products.js';
import { family, familyTitle } from './pages/family.js';
import { product, productTitle } from './pages/product.js';
import { notFound } from './pages/not-found.js';
import { about } from './pages/about.js';
import { faq } from './pages/faq.js';
import { suppliers } from './pages/suppliers.js';
import { legal } from './pages/legal.js';
import { news } from './pages/news.js';
import { careers } from './pages/careers.js';
import { adminNotFound } from './admin/admin-shell.js';
import { adminDashboard } from './admin/dashboard.js';
import { adminCatalogList, adminCatalogResultsHTML } from './admin/catalog-list.js';
import { adminProductEditor, adminProductTitle } from './admin/product-editor.js';
import { adminRequests } from './admin/requests.js';

import { mount as mountHeroBloom } from './effects/hero-bloom.js';
import { setupReveal } from './effects/reveal.js';
import { mountCursor } from './effects/cursor.js';
import { onScroll } from './effects/scroll.js';

const main = $('#main');
const headerEl = $('.site-header');
const footerEl = $('#footer');
const dialog = $('#credits-dialog');

const PAGES = {
  home, dropout, quote, products, family, product, notfound: notFound, about, faq, suppliers,
  legal, news, careers,
  admin: adminDashboard,
  'admin-catalog': adminCatalogList,
  'admin-product': adminProductEditor,
  'admin-requests': adminRequests,
  'admin-notfound': () => adminNotFound(state.slug),
};
const TITLES = {
  home: 'Accueil', dropout: 'Dropout', quote: 'Votre besoin', products: 'Produits',
  about: 'Maturat Mesure', faq: 'Questions fréquentes', suppliers: 'Fournisseurs',
  legal: 'Informations légales et confidentialité', news: 'Actualités', careers: 'Recrutement',
  admin: 'Administration', 'admin-catalog': 'Administration — Catalogue',
  'admin-requests': 'Administration — Demandes',
  'admin-notfound': 'Administration — page introuvable',
};
let cleanupHeader = () => {};
let stopHeroBloom = () => {};

function pageTitle() {
  if (state.page === 'family') return familyTitle();
  if (state.page === 'product') return productTitle();
  if (state.page === 'admin-product') return `Administration — ${adminProductTitle()}`;
  if (state.page === 'notfound') return 'Page introuvable';
  return TITLES[state.page];
}

function saveDraft() {
  if (state.page !== 'quote') return;
  $$('form [name]').forEach((el) => {
    // Les radio non cochés ne doivent pas écraser la valeur courante.
    if (el.type === 'radio' && !el.checked) return;
    if (el.dataset.answer !== undefined) {
      draft.answers[el.name] = el.type === 'checkbox' ? el.checked : el.value;
    } else {
      draft[el.name] = el.type === 'checkbox' ? el.checked : el.value;
    }
  });
  // Changer de besoin ne doit pas conserver une fiche rattachee a une autre famille.
  if (draft.product && !productMatchesFamilyName(catalog, draft.product, draft.family)) draft.product = '';
}

function refreshSummary() {
  const live = $('#live-summary');
  if (live) live.innerHTML = summary(true);
}

/* Lors d'un retour arriere sans bfcache, le navigateur reinjecte de lui-meme les
 * valeurs saisies dans les champs, alors que le brouillon est reparti a zero :
 * le champ affichait un texte que le recapitulatif ne connaissait plus.
 * On realigne les controles sur le brouillon, seule source de verite. */
function syncFormFields() {
  const fields = $$('form [name]');
  if (!fields.length) return;
  fields.forEach((el) => {
    if (el.dataset.answer !== undefined) {
      const value = draft.answers[el.name];
      if (el.type === 'radio') el.checked = el.value === String(value ?? '');
      else if (el.type === 'checkbox') el.checked = Boolean(value);
      else el.value = value ?? '';
    } else {
      const value = draft[el.name];
      if (el.type === 'radio') el.checked = el.value === String(value ?? '');
      else if (el.type === 'checkbox') el.checked = Boolean(value);
      else el.value = value ?? '';
    }
  });
  // Une case « je ne sais pas » peut couvrir plusieurs champs numériques (data-skip-key) :
  // rétablir leur état désactivé une fois toutes les cases repositionnées.
  $$('[data-answer][data-skip-key]').forEach((input) => {
    const skipBox = $(`[name="${input.dataset.skipKey}"]`);
    input.disabled = Boolean(skipBox?.checked);
  });
  refreshSummary();
}

/* La fiche retenue s'affiche dans sa propre zone : on la rafraichit sans
 * reconstruire le formulaire, pour ne pas deplacer le focus du visiteur. */
function refreshProductSlot() {
  const slot = $('#quote-product-slot');
  if (slot) slot.innerHTML = productContextBlock();
  refreshSummary();
}

function focusForm() {
  const h = $('form h2');
  if (!h) return;
  h.tabIndex = -1;
  h.focus({ preventScroll: true });
  h.scrollIntoView({ block: 'nearest', behavior: 'instant' });
}

/* Meme cause que pour le formulaire de demande : lors d'un rechargement ou d'un
 * retour arriere, Chromium reinjecte les valeurs saisies dans les champs alors
 * que le catalogue est reparti de ses donnees d'origine. Le catalogue vivant est
 * la seule source de verite : on realigne les controles de l'editeur sur lui. */
function syncAdminFields() {
  const form = $('form[data-admin-product]');
  if (!form) return;
  const values = productFormValues(catalog, form.dataset.adminProduct);
  if (!values) return;
  Object.entries(values).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (!field) return;
    if (field.type === 'checkbox') field.checked = Boolean(value);
    else field.value = value;
  });
}

/* Recherche de l'administration : seule la zone de resultats est reconstruite,
 * pour ne pas perdre le curseur dans le champ. */
function refreshAdminCatalog() {
  const zone = $('#adm-catalog-results');
  if (!zone) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = adminCatalogResultsHTML();
  zone.replaceWith(tmp.firstElementChild);
}

/* Enregistrement d'une fiche. Le formulaire ne fait que fournir des valeurs :
 * la validation et l'ecriture appartiennent a simulation/catalog-actions.js. */
function saveAdminProduct(form) {
  const key = form.dataset.adminProduct;
  const data = new FormData(form);
  const values = {
    name: data.get('name'),
    reference: data.get('reference'),
    summary: data.get('summary'),
    familyId: data.get('familyId'),
    supplierId: data.get('supplierId'),
    published: data.has('published'),
  };

  const result = applyProductEdit(catalog, key, values);
  state.adminFeedback = result.ok
    ? { key, status: 'saved' }
    : { key, status: 'error', errors: result.errors, values };

  render();
  const zone = $('#adm-feedback');
  zone?.focus({ preventScroll: true });
  zone?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
}

/* Recherche et filtres : seule la zone de resultats est reconstruite, pour ne pas
 * perdre le curseur dans le champ de recherche. Aucun rechargement, aucun reseau. */
function refreshCatalog() {
  const results = $('#catalog-results');
  if (!results) return;
  results.innerHTML = catalogResultsHTML();
  const clear = $('.catalog-clear');
  if (clear) clear.disabled = !hasActiveFilters(state.catalogFilters);
}

function clearCatalogFilters(key) {
  if (key && Object.hasOwn(CATALOG_FILTER_DEFAULTS, key)) state.catalogFilters[key] = '';
  else Object.assign(state.catalogFilters, CATALOG_FILTER_DEFAULTS);
  for (const filter of Object.keys(CATALOG_FILTER_DEFAULTS)) {
    const control = $('#catalog-' + (filter === 'q' ? 'search' : filter));
    if (control) control.value = state.catalogFilters[filter];
  }
  const heroSearch = $('#catalog-hero-search');
  if (heroSearch) heroSearch.value = state.catalogFilters.q;
  refreshCatalog();
  const focus = $('#catalog-' + (key && key !== 'q' ? key : 'search'));
  const group = focus?.closest('details');
  if (group) group.open = true;
  focus?.focus({ preventScroll: true });
}

/* Depuis une fiche : on garde le produit et sa famille, on ne touche pas au texte libre. */
function startRequestFor(productId) {
  const picked = productContext(catalog, productId);
  if (!picked) return;
  draft.product = picked.product.id;
  draft.mode = 'reference';
  draft.reference = picked.product.reference;
  if (picked.family) draft.family = picked.family.name;
  state.step = 0;
  state.done = false;
  navigate('quote');
}

function render() {
  cleanupHeader();
  stopFooterMotion();
  stopHeroBloom();
  // La direction artistique « Atmospheric Precision » pilote toute la feuille de style.
  document.body.dataset.pack = 'E';
  document.body.dataset.page = state.page;
  document.body.classList.toggle('reduced', state.reduced);

  // L'administration porte sa propre coque : l'en-tete et le pied du site sont
  // vides, et non seulement masques, pour rester hors du parcours clavier.
  const inAdmin = isAdminPage(state.page);
  document.body.classList.toggle('admin-mode', inAdmin);

  if (inAdmin) {
    headerEl.innerHTML = '';
    footerEl.innerHTML = '';
  } else {
    headerEl.innerHTML = siteHeader(state, catalog);
    cleanupHeader = mountHeader(headerEl);
    footerEl.innerHTML = siteFooter();
  }

  main.innerHTML = PAGES[state.page]();
  document.title = `${SITE.name} — ${pageTitle()}`;

  if (dialog.open) $('#credits-content').innerHTML = creditsContent();
  setupReveal();
  stopHeroBloom = mountHeroBloom($('.hero-focus-atmosphere'), state.reduced);
  stopFooterMotion = mountFooterMotion(footerEl, state.reduced);
}

function navigate(page) {
  saveDraft();
  if (state.page === page) {
    render();
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }
  location.hash = hashFor(page);
}

function openCredits() {
  saveDraft();
  $('#credits-content').innerHTML = creditsContent();
  dialog.showModal();
}

document.addEventListener('click', (e) => {
  // « Aller au contenu » vise un element de la coque, pas une route : sans cette
  // interception, l'ancre #main serait lue comme une adresse et afficherait
  // l'etat introuvable. On deplace le focus sans toucher a l'historique.
  const skip = e.target.closest('a.skip');
  if (skip) {
    e.preventDefault();
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: 'start', behavior: 'instant' });
    return;
  }

  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.page) navigate(b.dataset.page);
  if (b.dataset.scroll) {
    $('#' + b.dataset.scroll)?.scrollIntoView({
      behavior: state.reduced ? 'instant' : 'smooth', block: 'start',
    });
  }
  if (b.dataset.family !== undefined) updateFamily(Number(b.dataset.family));
  if (b.dataset.need) {
    draft.family = b.dataset.need;
    draft.mode = 'need';
    // Une demande ouverte depuis une famille n'herite pas d'une fiche precedente.
    draft.product = '';
    state.step = 0;
    state.done = false;
    navigate('quote');
  }
  if (b.dataset.needProduct) startRequestFor(b.dataset.needProduct);
  if (b.hasAttribute('data-clear-product')) {
    saveDraft();
    draft.product = '';
    refreshProductSlot();
    $('#family')?.focus();
  }
  if (b.hasAttribute('data-catalog-clear')) clearCatalogFilters();
  if (b.dataset.catalogRemove) clearCatalogFilters(b.dataset.catalogRemove);
  if (b.dataset.catalogPick) {
    state.catalogFilters.family = b.dataset.catalogPick;
    $('#catalog-family').value = b.dataset.catalogPick;
    refreshCatalog();
    $('#catalog-search-section').scrollIntoView({ behavior: state.reduced ? 'instant' : 'smooth' });
    $('#catalog-family').focus({ preventScroll: true });
  }
  if (b.dataset.stage !== undefined) updateDrop(Number(b.dataset.stage));
  if (b.dataset.cut !== undefined) {
    state.cut = b.dataset.cut === 'true';
    updateDrop(state.dropStep, true);
  }
  if (b.hasAttribute('data-sync')) {
    state.scrollSync = !state.scrollSync;
    b.setAttribute('aria-pressed', state.scrollSync);
    b.textContent = `Progression au scroll : ${state.scrollSync ? 'activée' : 'en pause'}`;
    onScroll();
  }
  if (b.id === 'motion') { saveDraft(); state.reduced = !state.reduced; render(); }
  if (b.hasAttribute('data-open-credits')) openCredits();
  if (b.id === 'close-credits') dialog.close();
  if (b.hasAttribute('data-prev')) {
    saveDraft();
    state.step = Math.max(0, state.step - 1);
    render();
    focusForm();
  }
  if (b.dataset.gotoStep !== undefined) {
    saveDraft();
    state.step = Number(b.dataset.gotoStep);
    render();
    focusForm();
  }
  if (b.hasAttribute('data-admin-search-clear')) {
    state.adminSearch = '';
    const input = $('#adm-search');
    if (input) input.value = '';
    refreshAdminCatalog();
    input?.focus();
    return;
  }
  if (b.hasAttribute('data-quote-edit')) {
    state.done = false;
    state.step = 0;
    render();
    focusForm();
    return;
  }
  if (b.hasAttribute('data-quote-reset')) {
    resetQuoteRequest();
    render();
    focusForm();
    return;
  }
  // La remise a zero depuis l'administration demande confirmation avant de
  // declencher le reset global (resetSimulation), reserve a l'Admin.
  if (b.hasAttribute('data-featured-apply')) {
    const select = document.getElementById('adm-featured-select');
    if (select?.value) {
      state.featuredProductId = select.value;
      render();
    }
    return;
  }
  if (b.hasAttribute('data-admin-reset')) {
    const zone = $('#adm-reset-confirm');
    if (!zone) return;
    zone.hidden = !zone.hidden;
    b.setAttribute('aria-expanded', String(!zone.hidden));
    if (!zone.hidden) zone.querySelector('[data-reset]')?.focus();
    return;
  }
  if (b.hasAttribute('data-admin-reset-cancel')) {
    const zone = $('#adm-reset-confirm');
    if (zone) zone.hidden = true;
    const opener = $('[data-admin-reset]');
    opener?.setAttribute('aria-expanded', 'false');
    opener?.focus();
    return;
  }
  if (b.hasAttribute('data-reset')) {
    // Meme remise a zero que le rechargement et le retour bfcache : brouillon,
    // fiche retenue, etapes, selections et filtres du catalogue.
    // La reduction du mouvement est une preference d'accessibilite, pas un etat
    // de simulation : elle survit au bouton, et la route courante est conservee.
    const motion = state.reduced;
    resetSimulation();
    state.reduced = motion;
    document.body.style.removeProperty('--selected-halo');
    readRoute();
    render();
    // L'administration n'a pas de formulaire de demande : on rend la main au contenu.
    if (isAdminPage(state.page)) main.focus({ preventScroll: true });
    else focusForm();
  }
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'catalog-search' || e.target.id === 'catalog-hero-search') {
    state.catalogFilters.q = e.target.value;
    const other = $(e.target.id === 'catalog-search' ? '#catalog-hero-search' : '#catalog-search');
    if (other) other.value = e.target.value;
    refreshCatalog();
    return;
  }
  if (e.target.id === 'adm-search') {
    state.adminSearch = e.target.value;
    refreshAdminCatalog();
    return;
  }
  if (!e.target.closest('form') || !e.target.name) return;
  saveDraft();
  refreshSummary();
});

document.addEventListener('change', (e) => {
  if (e.target.dataset.catalogFilter && Object.hasOwn(CATALOG_FILTER_DEFAULTS, e.target.dataset.catalogFilter)) {
    const key = e.target.dataset.catalogFilter;
    state.catalogFilters[key] = e.target.value;
    refreshCatalog();
    return;
  }
  // Le choix « référence » ou « besoin » change les champs obligatoires de l'étape 1.
  if (e.target.name === 'mode') {
    saveDraft();
    syncQuoteMode();
    refreshSummary();
    return;
  }
  // Changer de besoin peut rendre la fiche retenue incohérente et efface les réponses d'application.
  if (e.target.name === 'family') {
    const oldFamily = draft.family;
    saveDraft();
    if (draft.family !== oldFamily) draft.answers = {};
    refreshProductSlot();
    return;
  }
  // Cases à cocher « Je ne sais pas » pour les champs numériques adaptatifs.
  // Une case peut couvrir plusieurs champs (ex. Dropout : pression + débit) :
  // tous les champs portant ce data-skip-key sont désactivés et vidés ensemble,
  // pour qu'aucune ancienne valeur ne survive dans le résumé ou la demande.
  if (e.target.dataset.answer !== undefined && e.target.type === 'checkbox') {
    saveDraft();
    $$(`[data-answer][data-skip-key="${e.target.name}"]`).forEach((input) => {
      input.disabled = e.target.checked;
      if (e.target.checked) {
        input.value = '';
        draft.answers[input.name] = '';
      }
    });
    refreshSummary();
    return;
  }
});

document.addEventListener('submit', (e) => {
  if (e.target.matches('.catalog-hero-search')) {
    e.preventDefault();
    $('#catalog-search-section').scrollIntoView({ behavior: state.reduced ? 'instant' : 'smooth' });
    $('#catalog-search').focus({ preventScroll: true });
    return;
  }
  if (e.target.matches('[data-admin-product]')) {
    e.preventDefault();
    saveAdminProduct(e.target);
    return;
  }
  if (!e.target.matches('.form-card')) return;
  e.preventDefault();
  saveDraft();
  if (state.step < 3) {
    state.step += 1;
  } else {
    state.done = true;
    // La demande simulee rejoint l'administration : aucun envoi reel.
    // Une demande modifiee apres confirmation garde son identifiant et remplace l'ancienne.
    const entry = {
      date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'new',
      name: draft.name,
      company: draft.company,
      email: draft.email,
      mode: draft.mode || (draft.reference ? 'reference' : 'need'),
      reference: (draft.mode || (draft.reference ? 'reference' : 'need')) === 'reference' ? draft.reference : '',
      family: draft.family,
      productId: draft.product,
      application: draft.application,
      answers: { ...draft.answers },
    };
    const existing = draft.requestId ? state.requests.find((r) => r.ref === draft.requestId) : null;
    if (existing) {
      Object.assign(existing, entry);
    } else {
      draft.requestId = `DM-2026-${String(state.requests.length + 1).padStart(3, '0')}`;
      state.requests.push({ id: `req-${Date.now()}`, ref: draft.requestId, ...entry });
    }
  }
  render();
  focusForm();
});

/* Validation dans la page : la bulle du navigateur disparait vite et ne dit pas quoi ecrire. */
const FIELD_ERRORS = {
  reference: 'Indiquez une référence, même partielle, pour continuer.',
  application: 'Décrivez votre besoin en une phrase pour continuer.',
  name: 'Indiquez votre prénom et votre nom.',
  email: 'Indiquez une adresse email complète, par exemple nom@entreprise.fr.',
};
let invalidFocused = false;

document.addEventListener('invalid', (e) => {
  const field = e.target;
  if (!field.closest('.form-card')) return;
  e.preventDefault();
  const id = `${field.name}-error`;
  let message = document.getElementById(id);
  if (!message) {
    message = document.createElement('p');
    message.id = id;
    message.className = 'field-error';
    field.after(message);
  }
  message.textContent = FIELD_ERRORS[field.name] || field.validationMessage;
  field.setAttribute('aria-invalid', 'true');
  const described = (field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
  if (!described.includes(id)) field.setAttribute('aria-describedby', [...described, id].join(' '));
  // Seul le premier champ en erreur prend le focus a chaque envoi.
  if (!invalidFocused) {
    invalidFocused = true;
    field.focus();
    setTimeout(() => { invalidFocused = false; });
  }
}, true);

document.addEventListener('input', (e) => {
  const field = e.target;
  if (field.getAttribute?.('aria-invalid') !== 'true' || !field.validity.valid) return;
  const id = `${field.name}-error`;
  document.getElementById(id)?.remove();
  field.removeAttribute('aria-invalid');
  const described = (field.getAttribute('aria-describedby') || '').split(' ').filter((x) => x && x !== id);
  if (described.length) field.setAttribute('aria-describedby', described.join(' '));
  else field.removeAttribute('aria-describedby');
});

dialog.addEventListener('click', (e) => {
  if (e.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  if (outside) dialog.close();
});

window.addEventListener('hashchange', () => {
  saveDraft();
  // Le retour d'enregistrement ne concerne que l'ecran qui vient de l'afficher.
  state.adminFeedback = null;
  readRoute();
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
  // Le titre de la page recoit le focus : un lecteur d'ecran l'annonce, sans cadre autour de tout le contenu.
  const title = main.querySelector('h1');
  if (title) {
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
  } else {
    main.focus({ preventScroll: true });
  }
});

window.addEventListener('scroll', onScroll, { passive: true });

// Une restauration bfcache reprend aussi le brouillon en mémoire : repartir à zéro.
// Un simple changement d'onglet ne déclenche pas cette remise à zéro.
window.addEventListener('pageshow', (event) => {
  if (!event.persisted) {
    syncFormFields();
    syncAdminFields();
    return;
  }
  resetSimulation();
  document.body.style.removeProperty('--selected-halo');
  if (dialog.open) dialog.close();
  readRoute();
  render();
});

// Un seul abonnement : l'ancienne version en rajoutait un a chaque changement d'ancre.
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  saveDraft();
  state.reduced = e.matches;
  render();
});

mountCursor(dialog);
readRoute();
render();
