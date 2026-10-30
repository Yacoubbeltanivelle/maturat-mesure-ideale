import { escapeHTML } from '../lib/dom.js';
import { state, catalog } from '../state.js';
import { searchAllProducts, familyById, supplierById } from '../data/queries.js';
import { hashForProduct, hashForAdminProduct } from '../lib/route.js';
import { adminShell } from './admin-shell.js';

/* Liste de gestion des fiches. Contrairement au catalogue public, elle montre
 * aussi les fiches masquées : c'est ici qu'on les retrouve pour les republier. */

function rowHTML(product) {
  const family = familyById(catalog, product.familyId);
  const supplier = supplierById(catalog, product.supplierId);
  const visible = product.published !== false;
  const target = hashForAdminProduct(product.id);

  const site = visible
    ? `<a class="adm-action" href="${hashForProduct(product.slug)}">Voir sur le site <span aria-hidden="true">→</span></a>`
    : `<span class="adm-action adm-action--off">Non visible sur le site</span>`;

  return `<tr class="adm-row${visible ? '' : ' adm-row--hidden'}">
    <td data-label="Fiche"><a class="adm-row-name" href="${target}">${escapeHTML(product.name)}</a></td>
    <td data-label="Référence"><span class="mono">${escapeHTML(product.reference)}</span></td>
    <td data-label="Famille">${escapeHTML(family?.name ?? '—')}</td>
    <td data-label="Fournisseur">${escapeHTML(supplier?.name ?? '—')}</td>
    <td data-label="Statut"><span class="adm-status adm-status--${visible ? 'on' : 'off'}">${visible ? 'Publiée' : 'Masquée'}</span></td>
    <td data-label="Actions"><div class="adm-row-actions">
      <a class="adm-action adm-action--strong" href="${target}">Modifier</a>
      ${site}
    </div></td>
  </tr>`;
}

/* Compteur et tableau : le seul bloc remplacé pendant la recherche, pour ne pas
 * perdre le curseur dans le champ. */
export function adminCatalogResultsHTML() {
  const query = state.adminSearch;
  const list = searchAllProducts(catalog, query);
  const label = list.length === 0 ? 'Aucune fiche' : list.length === 1 ? '1 fiche' : `${list.length} fiches`;
  const scope = query.trim() ? 'correspondent à votre recherche' : 'dans le catalogue de démonstration';

  if (!list.length) {
    return `<div id="adm-catalog-results">
      <p class="adm-count" role="status">${label} <span>${scope}</span></p>
      <div class="adm-empty">
        <p>Aucune fiche ne correspond à cette recherche.</p>
        <button type="button" class="adm-button" data-admin-search-clear>Effacer la recherche</button>
      </div>
    </div>`;
  }

  return `<div id="adm-catalog-results">
    <p class="adm-count" role="status">${label} <span>${scope}</span></p>
    <div class="adm-table-wrap">
      <table class="adm-table">
        <caption>Fiches du catalogue, publiées et masquées</caption>
        <thead><tr>
          <th scope="col">Fiche</th>
          <th scope="col">Référence</th>
          <th scope="col">Famille</th>
          <th scope="col">Fournisseur</th>
          <th scope="col">Statut</th>
          <th scope="col">Actions</th>
        </tr></thead>
        <tbody>${list.map(rowHTML).join('')}</tbody>
      </table>
    </div>
  </div>`;
}

export function adminCatalogList() {
  return adminShell({
    page: 'admin-catalog',
    title: 'Catalogue',
    intro: 'Toutes les fiches de la démonstration. Les fiches masquées restent listées ici, signalées comme telles.',
    body: `<section class="adm-card">
      <div class="adm-search" role="search">
        <label class="adm-label" for="adm-search">Rechercher une fiche</label>
        <input id="adm-search" type="search" value="${escapeHTML(state.adminSearch)}"
          placeholder="Nom, référence, famille, fournisseur…" autocomplete="off" spellcheck="false">
      </div>
      ${adminCatalogResultsHTML()}
    </section>`,
  });
}
