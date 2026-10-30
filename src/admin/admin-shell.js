import { escapeHTML } from '../lib/dom.js';

/* Coque de l'administration simulée : barre haute, navigation, en-tête d'écran
 * et zone principale. Aucun écran ne redessine cette structure pour lui-même. */

const NAV = [
  { label: 'Tableau de bord', href: '#/admin', pages: ['admin'] },
  { label: 'Catalogue', href: '#/admin/catalog', pages: ['admin-catalog', 'admin-product'] },
  { label: 'Demandes', href: '#/admin/requests', pages: ['admin-requests'] },
];

/* Sections existantes mais non simulées dans ce lot.
 * Rendues inactives sans promesse de livraison. */
const UNSIMULATED = ['Familles', 'Fournisseurs', 'Pages & FAQ'];

function navHTML(page) {
  const links = NAV.map((item) => {
    const current = item.pages.includes(page);
    return `<li><a class="adm-nav-link" href="${item.href}" aria-current="${current ? 'page' : 'false'}">${escapeHTML(item.label)}</a></li>`;
  }).join('');

  const unsimulated = UNSIMULATED.map((label) =>
    `<li><span class="adm-nav-link adm-nav-link--later">${escapeHTML(label)}</span></li>`
  ).join('');

  return `<nav class="adm-nav" aria-label="Sections de l'administration">
    <div class="adm-nav-brand"><span>MATURAT MESURE</span><small>Administration de démonstration</small></div>
    <p class="adm-nav-heading adm-nav-heading--active">Navigation</p>
    <ul class="adm-nav-list">${links}</ul>
    <p class="adm-nav-heading" id="adm-nav-later">Non simulé dans cette maquette</p>
    <ul class="adm-nav-list adm-nav-list--later" aria-labelledby="adm-nav-later">${unsimulated}</ul>
  </nav>`;
}

/** Assemble un écran d'administration.
 *  `page` : la page courante, pour la navigation. `title` et `intro` : l'en-tête
 *  d'écran. `body` : le contenu déjà échappé de l'écran. */
export function adminShell({ page, title, intro = '', body = '' }) {
  return `<div class="adm">
    <header class="adm-topbar">
      <div class="adm-identity">
        <span class="mono adm-identity-site">MATURAT MESURE</span>
        <span class="adm-identity-space">Administration de démonstration</span>
      </div>
      <div class="adm-topbar-actions">
        <a class="adm-button" href="#/home">Voir le site <span aria-hidden="true">→</span></a>
        <button type="button" class="adm-button" data-admin-reset
          aria-expanded="false" aria-controls="adm-reset-confirm">Réinitialiser la démo</button>
      </div>
    </header>

    <p class="adm-simulation" role="note">
      <span class="adm-simulation-dot" aria-hidden="true"></span>
      Simulation — aucune donnée n'est enregistrée. Les modifications vivent dans cet onglet
      et disparaissent au rechargement de la page.
    </p>

    <div id="adm-reset-confirm" class="adm-reset" role="group" aria-label="Confirmer la réinitialisation" hidden>
      <p class="adm-reset-text">Réinitialiser la démonstration ? Toutes les modifications faites
        depuis l'administration seront perdues et le catalogue repartira de ses données d'origine.</p>
      <div class="adm-reset-actions">
        <button type="button" class="adm-button adm-button--danger" data-reset>Oui, réinitialiser</button>
        <button type="button" class="adm-button" data-admin-reset-cancel>Annuler</button>
      </div>
    </div>

    <div class="adm-body">
      ${navHTML(page)}
      <div class="adm-main adm-main--${page}">
        <div class="adm-screen-head">
          <h1 class="adm-screen-title">${escapeHTML(title)}</h1>
          ${intro ? `<p class="adm-screen-intro">${escapeHTML(intro)}</p>` : ''}
        </div>
        ${body}
      </div>
    </div>
  </div>`;
}

/** Écran d'erreur de l'administration : une section ou une fiche inconnue reste
 *  dans la coque, avec une sortie évidente. */
export function adminNotFound(slug = '') {
  const detail = slug
    ? `<p class="adm-empty-detail">Adresse demandée : <span class="mono">${escapeHTML(slug)}</span></p>`
    : '';
  return adminShell({
    page: 'admin-notfound',
    title: `Cette page d’administration n’existe pas`,
    intro: `La section demandée n’est pas disponible, ou la fiche a été retirée du catalogue.`,
    body: `<div class="adm-card adm-empty">
      ${detail}
      <div class="adm-empty-actions">
        <a class="adm-button adm-button--primary" href="#/admin/catalog">Aller au catalogue</a>
        <a class="adm-button" href="#/admin">Tableau de bord</a>
      </div>
    </div>`,
  });
}
