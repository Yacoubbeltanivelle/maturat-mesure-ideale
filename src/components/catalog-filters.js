import { escapeHTML } from '../lib/dom.js';
import { publishedFamilies, suppliersInUse, hasActiveFilters } from '../data/queries.js';
import { productGrid } from './product-card.js';
import { catalogFacetOptions } from '../data/catalog-facets.js';

/* Recherche et filtres du catalogue.
 * Pas de formulaire : la touche Entrée ne doit pas recharger la page, et la
 * sélection se met à jour sans rechargement ni appel réseau. */

const option = (value, label, selected) =>
  `<option value="${escapeHTML(value)}" ${selected === value ? 'selected' : ''}>${escapeHTML(label)}</option>`;

export function catalogFilters(catalog, filters) {
  const families = publishedFamilies(catalog);
  const suppliers = suppliersInUse(catalog);
  const active = hasActiveFilters(filters);
  const facets = catalogFacetOptions(catalog);
  const facetField = (key, label, all) => `<div class="catalog-field">
    <label for="catalog-${key}">${label}</label><select id="catalog-${key}" data-catalog-filter="${key}">
    ${option('', all, filters[key])}${facets[key].map((value) => option(value, value, filters[key])).join('')}</select></div>`;
  return `<div class="catalog-filters" role="search">
    <div class="catalog-field catalog-field-search">
      <label for="catalog-search">Rechercher une fiche</label>
      <input id="catalog-search" type="search" value="${escapeHTML(filters.q)}"
        placeholder="Nom, référence, usage…" autocomplete="off" spellcheck="false">
    </div>
    <div class="catalog-field">
      <label for="catalog-family">Famille</label>
      <select id="catalog-family" data-catalog-filter="family">
        ${option('', 'Toutes les familles', filters.family)}
        ${families.map((f) => option(f.id, `${f.code} — ${f.name}`, filters.family)).join('')}
      </select>
    </div>
    ${facetField('technology', 'Principe / technologie', 'Toutes les technologies')}
    ${facetField('application', 'Application', 'Toutes les applications')}
    <details class="catalog-secondary-filters" ${filters.supplier || filters.signal ? 'open' : ''}>
    <summary>Fournisseur &amp; signal <span aria-hidden="true">+</span></summary>
    <div class="catalog-field">
      <label for="catalog-supplier">Fournisseur</label>
      <select id="catalog-supplier" data-catalog-filter="supplier">
        ${option('', 'Tous les fournisseurs', filters.supplier)}
        ${suppliers.map((s) => option(s.id, s.name, filters.supplier)).join('')}
      </select>
    </div>
    ${facetField('signal', 'Signal / sortie', 'Tous les signaux renseignés')}
    <p class="catalog-facet-note">Applications de démonstration. Signaux selon les informations des fiches.</p>
    </details>
    <button type="button" class="catalog-clear" data-catalog-clear ${active ? '' : 'disabled'}>Effacer les filtres</button>
  </div>`;
}

/* Compteur, grille et état vide : un seul bloc, remplacé à chaque frappe. */
export function catalogResults(catalog, filters, products, editorial = false) {
  const count = products.length;
  const label = count === 0 ? 'Aucune fiche' : count === 1 ? '1 fiche' : `${count} fiches`;
  const scope = hasActiveFilters(filters) ? 'correspondent à votre sélection' : 'dans le catalogue de démonstration';
  const empty = `<div class="catalog-empty">
      <p class="catalog-empty-title">Aucune fiche ne correspond à cette sélection.</p>
      <p>Essayez un autre mot, une autre famille, ou repartez de l’ensemble du catalogue.
      Dropout reste accessible depuis sa page dédiée.</p>
      <div class="catalog-empty-actions">
        <button type="button" class="text-button" data-catalog-clear>Effacer les filtres <span aria-hidden="true">→</span></button>
        <a class="text-button" href="#/quote">Décrire mon besoin <span aria-hidden="true">→</span></a>
      </div>
    </div>`;
  const tokens = editorial ? [
    ['q', filters.q.trim()],
    ['family', catalog.families.find((f) => f.id === filters.family)?.name],
    ['technology', filters.technology],
    ['application', filters.application],
    ['supplier', catalog.suppliers.find((s) => s.id === filters.supplier)?.name],
    ['signal', filters.signal],
  ].filter(([, label]) => label) : [];
  return `<p class="catalog-count" role="status">${label} <span>${scope}</span></p>
    ${tokens.length ? `<div class="catalog-tokens" aria-label="Filtres actifs">${tokens.map(([key, label]) => `<button type="button" class="catalog-token" data-catalog-remove="${key}" aria-label="Retirer le filtre ${escapeHTML(label)}">${escapeHTML(label)} <span aria-hidden="true">×</span></button>`).join('')}<button type="button" data-catalog-clear>Tout effacer</button></div>` : ''}
    ${count ? productGrid(catalog, products, editorial) : empty}`;
}
