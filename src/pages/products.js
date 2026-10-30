import { state, catalog } from '../state.js';
import { escapeHTML } from '../lib/dom.js';
import { publishedFamilies, productsOfFamily, filterProducts } from '../data/queries.js';
import { hashForFamily } from '../lib/route.js';
import { img, imageCredit, dropoutImage } from '../ui/media.js';
import { eyebrow } from '../ui/eyebrow.js';
import { familyMark } from '../ui/family-mark.js';
import { catalogFilters, catalogResults } from '../components/catalog-filters.js';
import { HOME_FAMILIES } from '../data/families.js';

/* Page Produits : familles, recherche et fiches de démonstration.
 * Dropout garde sa place propre, en dehors des filtres et de son compteur. */

function familyCount(family) {
  const n = productsOfFamily(catalog, family.id).length;
  return n === 1 ? '1 fiche' : `${n} fiches`;
}

function measurementCard(family) {
  const visual = HOME_FAMILIES.find((f) => f.code === family.code)?.img || family.img;
  return `<li><a class="catalog-card catalog-card-${escapeHTML(family.code)}" href="${hashForFamily(family.slug)}">
    <div class="catalog-card-heading"><span class="mono">${escapeHTML(family.code)} / ${escapeHTML(family.name.toUpperCase())}</span><h3>${escapeHTML(family.longName)}</h3></div>
    <figure class="catalog-image"><span class="catalog-unit mono" aria-hidden="true">${escapeHTML(family.unit)}</span>${img(visual, family.name, '', true)}
      <figcaption>${imageCredit(visual)} · Illustration de la famille</figcaption>
    </figure>
    <div class="catalog-card-copy"><p>${escapeHTML(family.text)}</p><ul class="catalog-tags">${family.principles.map((p) => `<li>${escapeHTML(p)}</li>`).join('')}</ul>
    <p class="catalog-use">${escapeHTML(family.use)}</p>
    <span class="catalog-card-link">Voir la famille · ${familyCount(family)} <span aria-hidden="true">→</span></span></div>
  </a></li>`;
}

function complementaryRow(family) {
  return `<li><a class="catalog-row catalog-row-${escapeHTML(family.code)}" href="${hashForFamily(family.slug)}">
    <span class="mono catalog-row-number">${escapeHTML(family.code)}</span>
    <div><h3>${escapeHTML(family.name)}</h3><p>${escapeHTML(family.text)}</p></div>
    <div><ul class="catalog-list">${family.principles.map((p) => `<li>${escapeHTML(p)}</li>`).join('')}</ul>
    <span class="catalog-card-link">Voir la famille · ${familyCount(family)} <span aria-hidden="true">→</span></span></div>
    <span class="catalog-row-mark" aria-hidden="true">${familyMark(family.code)}</span>
  </a></li>`;
}

export function catalogResultsHTML() {
  const filters = state.catalogFilters;
  return catalogResults(catalog, filters, filterProducts(catalog, filters), true);
}

export function products() {
  const families = publishedFamilies(catalog);
  const measured = families.filter((f) => f.unit);
  const others = families.filter((f) => !f.unit);

  return `<div class="catalog-page catalog-editorial catalog-finder-first">
    <section class="catalog-intro" aria-labelledby="catalog-title">
      <div class="catalog-hero-photo" aria-hidden="true">${img(601, '', '', false)}</div>
      <div class="catalog-hero-top"><a class="catalog-back mono" href="#/home">← ACCUEIL</a><span class="mono">MATURAT MESURE / CATALOGUE</span></div>
      <div class="catalog-intro-grid"><div>${eyebrow('PRODUITS & SOLUTIONS')}<h1 id="catalog-title">À chaque procédé,<br><em>sa juste mesure.</em></h1><p class="catalog-hero-lead">Votre application guide le choix.</p></div>
      <div class="catalog-intro-copy"><form class="catalog-hero-search" role="search" aria-label="Rechercher dans le catalogue">
        <label for="catalog-hero-search" class="mono">UN PRODUIT, UNE RÉFÉRENCE, UN BESOIN</label>
        <div><input id="catalog-hero-search" type="search" value="${escapeHTML(state.catalogFilters.q)}" placeholder="Référence, instrument ou problème" autocomplete="off"><button type="submit" aria-label="Voir les résultats de recherche"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m16 16 4.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>
      </form><nav class="catalog-hero-families" aria-label="Filtrer par grandeur">${measured.map((f) => `<button type="button" data-catalog-pick="${escapeHTML(f.id)}"><span class="mono" aria-hidden="true">${escapeHTML(f.code)}</span>${escapeHTML(f.name)}<span aria-hidden="true">→</span></button>`).join('')}</nav>
      <button type="button" class="catalog-hero-all" data-scroll="catalog-search-section" data-catalog-clear>Voir toutes les fiches <span aria-hidden="true">↓</span></button></div></div>
      <p class="catalog-hero-note">Familles et marques réelles · références et valeurs d’exemple</p>
    </section>

    <section id="catalog-search-section" class="catalog-search-section" aria-labelledby="catalog-search-title">
      <div class="catalog-section-heading"><div>${eyebrow('TOUTES LES FICHES')}<h2 id="catalog-search-title">Trouvez rapidement<br><em>votre point de départ.</em></h2></div><p>Par nom, référence ou usage. Affinez ensuite par famille ou par <a href="#/suppliers">fournisseur</a>.</p></div>
      <div class="catalog-finder">${catalogFilters(catalog, state.catalogFilters)}
      <div id="catalog-results">${catalogResultsHTML()}</div></div>
      <p class="catalog-disclaimer">Ces fiches sont des exemples créés pour la maquette. Les marques sont réelles ; les références et les caractéristiques sont inventées et ne décrivent aucun produit commercialisé.</p>
    </section>

    <section id="catalog-measurements" class="catalog-measurements" aria-labelledby="measurements-title">
      <div class="catalog-section-heading"><div>${eyebrow('LE CŒUR DE VOTRE INSTALLATION')}<h2 id="measurements-title">Explorer<br><em>par famille.</em></h2></div><p>Mesurer, détecter, surveiller.<br>Ouvrez la famille qui vous concerne.</p></div>
      <ul class="catalog-grid">${measured.map(measurementCard).join('')}</ul>
    </section>

    <section id="catalog-complements" class="catalog-complements" aria-labelledby="complements-title">
      <div class="catalog-section-heading"><div>${eyebrow('UNE VISION D’ENSEMBLE')}<h2 id="complements-title">Tout ce qui accompagne<br><em>la mesure.</em></h2></div><p>Connecter les équipements, exploiter le signal et comprendre votre environnement.</p></div>
      <ul class="catalog-rows">${others.map(complementaryRow).join('')}</ul>
    </section>

    <section id="catalog-dropout" class="catalog-dropout" aria-labelledby="catalog-dropout-title">
      <div class="catalog-dropout-copy">${eyebrow('TRAITEMENT DE L’AIR COMPRIMÉ')}<h2 id="catalog-dropout-title">En amont de la mesure,<br><em>protéger vos équipements.</em></h2><p>Dropout garde sa page dédiée : elle explique ce que sépare un Dropout, et ce qu’il ne remplace pas.</p><a class="text-button" href="#/dropout">Découvrir Dropout <span aria-hidden="true">→</span></a></div>
      <div class="catalog-dropout-visual">${dropoutImage('', true)}<span class="mono">DROP’OUT / SÉPARATION</span></div>
    </section>
  </div>`;
}
