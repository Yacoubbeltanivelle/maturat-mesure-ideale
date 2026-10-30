import { catalog, state } from '../state.js';
import { catalogCounts } from '../simulation/catalog-actions.js';
import { publishedProducts, productById, familyById } from '../data/queries.js';
import { adminShell } from './admin-shell.js';
import { escapeHTML } from '../lib/dom.js';

/* Tableau de bord : repères calculés sur le catalogue vivant et les demandes
 * simulées. Aucune statistique de trafic ni chiffre d'affaires inventé. */

const CATALOG_METRICS = [
  { key: 'total', label: 'fiches au catalogue' },
  { key: 'published', label: 'fiches publiées' },
  { key: 'hidden', label: 'fiches masquées' },
  { key: 'families', label: 'familles' },
  { key: 'suppliers', label: 'fournisseurs' },
];

const truncate = (s, max = 45) => {
  const str = String(s ?? '');
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
};

function recentRequestsHTML() {
  const { requests } = state;
  if (!requests.length) {
    return `<p class="adm-card-text">Aucune demande simulée.
      <a href="#/quote">Simuler une demande sur le site</a>.</p>`;
  }
  const recent = requests.slice(-3).reverse();
  const rows = recent.map((req) => {
    const app = (req.application || req.reference) ? truncate(req.application || req.reference) : '';
    return `<div class="adm-recent-row">
      <span class="adm-recent-name">${escapeHTML(req.name || '—')}</span>
      <span class="adm-recent-family">${escapeHTML(req.family || 'Je ne sais pas')}</span>
      ${app ? `<span class="adm-recent-app">${escapeHTML(app)}</span>` : ''}
    </div>`;
  }).join('');
  return `<div class="adm-recent-list">${rows}</div>
    <p class="adm-card-note"><a href="#/admin/requests">Voir toutes les demandes →</a></p>`;
}

function featuredSectionHTML() {
  const published = publishedProducts(catalog);
  const currentId = state.featuredProductId;
  const currentProduct = currentId ? productById(catalog, currentId) : null;
  const currentPublished = currentProduct && currentProduct.published !== false;

  if (!published.length) {
    return `<section class="adm-card" aria-labelledby="adm-featured-title">
      <h2 id="adm-featured-title" class="adm-card-title">Produit mis en avant</h2>
      <p class="adm-card-text">Aucun produit publié disponible.</p>
    </section>`;
  }

  let currentInfo;
  if (!currentProduct) {
    currentInfo = `<p class="adm-featured-status adm-muted">Aucun produit sélectionné.</p>`;
  } else if (!currentPublished) {
    currentInfo = `<p class="adm-featured-status">
      <strong>${escapeHTML(currentProduct.name)}</strong>
      <span class="mono">${escapeHTML(currentProduct.reference)}</span>
      — <span class="adm-status adm-status--off">Masquée — non visible sur le site</span>
    </p>`;
  } else {
    const family = familyById(catalog, currentProduct.familyId);
    currentInfo = `<p class="adm-featured-status">
      <strong>${escapeHTML(currentProduct.name)}</strong>
      <span class="mono">${escapeHTML(currentProduct.reference)}</span>
      ${family ? `· ${escapeHTML(family.name)}` : ''}
    </p>`;
  }

  const options = published.map((p) => {
    const selected = p.id === currentId ? ' selected' : '';
    return `<option value="${escapeHTML(p.id)}"${selected}>${escapeHTML(p.name)} — ${escapeHTML(p.reference)}</option>`;
  }).join('');

  return `<section class="adm-card" aria-labelledby="adm-featured-title">
    <h2 id="adm-featured-title" class="adm-card-title">Produit mis en avant</h2>
    <p class="adm-eyebrow">Produit actuel</p>
    ${currentInfo}
    <div class="adm-field-row">
      <label class="adm-label" for="adm-featured-select">Choisir un produit publié</label>
      <div class="adm-field-row-controls">
        <select id="adm-featured-select">${options}</select>
        <button type="button" class="adm-button adm-button--primary" data-featured-apply>Mettre en avant</button>
      </div>
    </div>
    <p class="adm-card-note">La modification s'applique immédiatement à l'accueil dans cette session.</p>
  </section>`;
}

export function adminDashboard() {
  const counts = catalogCounts(catalog);
  const requestCount = state.requests.length;

  const catalogCards = CATALOG_METRICS.map(({ key, label }) => `<li class="adm-metric">
    <span class="adm-metric-value">${counts[key]}</span>
    <span class="adm-metric-label">${label}</span>
  </li>`).join('');

  const requestMetric = `<li class="adm-metric">
    <span class="adm-metric-value">${requestCount}</span>
    <span class="adm-metric-label">demandes simulées</span>
  </li>`;

  return adminShell({
    page: 'admin',
    title: 'Tableau de bord',
    intro: 'État du catalogue et des demandes simulées dans cette session.',
    body: `<section class="adm-card" aria-labelledby="adm-metrics-title">
        <h2 id="adm-metrics-title" class="adm-card-title">Catalogue</h2>
        <ul class="adm-metrics">${catalogCards}${requestMetric}</ul>
        <p class="adm-card-note">Les fiches masquées restent modifiables ici et ne sont plus visibles sur le site.</p>
      </section>

      <section class="adm-card" aria-labelledby="adm-requests-title">
        <h2 id="adm-requests-title" class="adm-card-title">Dernières demandes</h2>
        ${recentRequestsHTML()}
      </section>

      ${featuredSectionHTML()}

      <section class="adm-card" aria-labelledby="adm-next-title">
        <h2 id="adm-next-title" class="adm-card-title">Gérer le catalogue</h2>
        <p class="adm-card-text">Modifier le nom, la référence, le résumé, la famille, le
          fournisseur ou la visibilité d'une fiche existante.</p>
        <a class="adm-button adm-button--primary" href="#/admin/catalog">Gérer le catalogue
          <span aria-hidden="true">→</span></a>
      </section>`,
  });
}
