import { escapeHTML } from '../lib/dom.js';
import { state, catalog } from '../state.js';
import { productById } from '../data/queries.js';
import { hashForAdminProduct } from '../lib/route.js';
import { answerItems } from '../data/quote-questions.js';
import { adminShell } from './admin-shell.js';

/* Page Demandes de l'administration simulée.
 * Lit exclusivement state.requests — aucune donnée inventée. */

/* Réponses techniques lisibles : « Je ne sais pas » atténué, unités ajoutées. */
const resolveAnswerItems = (family, answers) =>
  answerItems(family, answers).map(({ label, text, skipped }) => ({ label, text, dim: skipped }));

function requestDetailHTML(req) {
  const product = req.productId ? productById(catalog, req.productId) : null;

  let productCell = '';
  if (req.productId) {
    if (product) {
      productCell = `<div class="adm-req-row">
        <dt>Produit</dt>
        <dd>${escapeHTML(product.name)} <span class="mono">${escapeHTML(product.reference)}</span>
          <a class="adm-action" href="${hashForAdminProduct(product.id)}">Modifier <span aria-hidden="true">→</span></a></dd>
      </div>`;
    } else {
      productCell = `<div class="adm-req-row">
        <dt>Produit</dt>
        <dd><span class="mono">${escapeHTML(req.productId)}</span> <em class="adm-muted">(fiche retirée)</em></dd>
      </div>`;
    }
  }

  const answerItems = resolveAnswerItems(req.family, req.answers ?? {});
  const answersSection = answerItems.length ? `
    <section class="adm-req-section">
      <h2 class="adm-req-section-title">Informations techniques</h2>
      <dl class="adm-req-dl">
        ${answerItems.map(({ label, text, dim }) =>
          `<div class="adm-req-row"><dt>${escapeHTML(label)}</dt><dd${dim ? ' class="adm-muted"' : ''}>${escapeHTML(text)}</dd></div>`
        ).join('')}
      </dl>
    </section>` : '';

  return `<div class="adm-req-detail">
    <section class="adm-req-section">
      <h2 class="adm-req-section-title">Contact</h2>
      <dl class="adm-req-dl">
        <div class="adm-req-row"><dt>Nom</dt><dd>${escapeHTML(req.name || '—')}</dd></div>
        ${req.company ? `<div class="adm-req-row"><dt>Entreprise</dt><dd>${escapeHTML(req.company)}</dd></div>` : ''}
        <div class="adm-req-row"><dt>E-mail</dt><dd>${escapeHTML(req.email || '—')}</dd></div>
      </dl>
    </section>
    <section class="adm-req-section">
      <h2 class="adm-req-section-title">Besoin</h2>
      <dl class="adm-req-dl">
        <div class="adm-req-row"><dt>Famille</dt><dd>${escapeHTML(req.family || 'Je ne sais pas')}</dd></div>
        ${productCell}
        ${req.mode ? `<div class="adm-req-row"><dt>Type de demande</dt><dd>${req.mode === 'reference' ? 'J’ai une référence' : 'Je décris mon besoin'}</dd></div>` : ''}
        ${req.reference ? `<div class="adm-req-row"><dt>Référence</dt><dd class="mono">${escapeHTML(req.reference)}</dd></div>` : ''}
        ${req.application ? `<div class="adm-req-row"><dt>Application</dt><dd>${escapeHTML(req.application)}</dd></div>` : ''}
      </dl>
    </section>
    ${answersSection}
  </div>`;
}

function requestCardHTML(req, index) {
  const label = req.ref || `DEMANDE ${String(index + 1).padStart(2, '0')}`;
  return `<details class="adm-req-card">
    <summary class="adm-req-summary">
      <span class="mono adm-req-label">${escapeHTML(label)}</span>
      <span class="adm-req-name">${escapeHTML(req.name || '—')}</span>
      ${req.application || req.reference ? `<span class="adm-req-app">${escapeHTML(req.application || req.reference)}</span>` : ''}
      <span class="adm-req-family">${escapeHTML(req.family || 'Je ne sais pas')}</span>
    </summary>
    ${requestDetailHTML(req)}
  </details>`;
}

export function adminRequests() {
  const { requests } = state;

  if (!requests.length) {
    return adminShell({
      page: 'admin-requests',
      title: 'Demandes',
      intro: '0 demande simulée dans cette session.',
      body: `<div class="adm-card adm-empty">
        <p>Aucune demande simulée pour le moment.</p>
        <p>Une demande apparaît ici après avoir terminé le parcours
          <strong>Décrire mon besoin</strong> sur le site public.</p>
        <div class="adm-empty-actions">
          <a class="adm-button adm-button--primary" href="#/quote">Simuler une demande sur le site</a>
        </div>
      </div>`,
    });
  }

  // Plus récentes en premier ; numérotation par ordre de soumission (1-based)
  const indexed = requests.map((req, i) => ({ req, i }));
  const ordered = [...indexed].reverse();
  const cards = ordered.map(({ req, i }) => requestCardHTML(req, i)).join('');
  const count = requests.length;
  const intro = count === 1 ? '1 demande simulée dans cette session.' : `${count} demandes simulées dans cette session.`;

  return adminShell({
    page: 'admin-requests',
    title: 'Demandes',
    intro,
    body: `<section class="adm-card adm-req-list" aria-label="Liste des demandes">${cards}</section>`,
  });
}
