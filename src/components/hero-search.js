import { catalog, draft, resetQuoteRequest, state } from '../state.js';
import { filterProducts, familyById, supplierById } from '../data/queries.js';
import { hashForProduct } from '../lib/route.js';
import { escapeHTML } from '../lib/dom.js';

/* Recherche de l'accueil : résultats instantanés parmi les fiches publiées, sans appel
 * réseau. Elle accepte une référence comme un problème décrit en mots. Sans résultat,
 * la demande s'ouvre avec la saisie déjà inscrite dans le brouillon, par l'une des deux
 * portes du formulaire. */

export const HERO_SEARCH_LIMIT = 5;
export const HERO_SUGGESTIONS = ['PT100', 'Houdec 810', 'air comprimé'];

export function searchReferences(cat, q) {
  return filterProducts(cat, { q }).slice(0, HERO_SEARCH_LIMIT);
}

export function heroSearch() {
  return `<form class="hero-ref-search" role="search" aria-label="Rechercher une référence ou un besoin" data-hero-search>
    <label for="hero-ref-input">Référence, instrument ou problème</label>
    <div class="hero-ref-field"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg><input id="hero-ref-input" name="hero-ref" type="search" placeholder="Houdec 810, PT100, eau dans l’air comprimé" autocomplete="off" aria-controls="hero-ref-results" maxlength="80"></div>
    <div id="hero-ref-results" class="hero-ref-results" aria-live="polite"></div>
  </form>`;
}

/* Champ vide : des exemples montrent qu'on peut chercher une référence comme un usage. */
export function heroSuggestionsHTML() {
  return `<p class="hero-ref-suggest">Exemples : ${HERO_SUGGESTIONS.map((s) => `<button type="button" data-hero-suggest="${escapeHTML(s)}">${escapeHTML(s)}</button>`).join('')}</p>`;
}

export function heroResultsHTML(cat, q) {
  const term = q.trim();
  if (!term) return '';
  const found = searchReferences(cat, term);
  if (!found.length) {
    const safe = escapeHTML(term);
    const need = `<a href="#/quote" data-quote-need="${safe}">Décrire mon besoin <span aria-hidden="true">→</span></a>`;
    const ref = `<a href="#/quote" data-quote-ref="${safe}">Demander cette référence <span aria-hidden="true">→</span></a>`;
    // Un chiffre signale plutôt une référence : ce lien passe alors en premier.
    return `<p class="hero-ref-empty">Aucune fiche pour « ${safe} ».<span class="hero-ref-actions">${/\d/.test(term) ? ref + need : need + ref}</span></p>`;
  }
  return `<ul>${found.map((p) => {
    const supplier = supplierById(cat, p.supplierId);
    const family = familyById(cat, p.familyId);
    return `<li><a href="${hashForProduct(p.slug)}"><span class="hero-ref-name">${escapeHTML(p.name)}</span><span class="hero-ref-meta">${escapeHTML(p.reference)} · ${escapeHTML(supplier?.name ?? '')}${family ? ` · ${escapeHTML(family.name)}` : ''}</span></a></li>`;
  }).join('')}</ul>`;
}

/* Les écouteurs ne servent qu'au navigateur : les tests importent ce module sans document. */
if (typeof document !== 'undefined') {
  const showResults = (input) => {
    const box = document.getElementById('hero-ref-results');
    if (box) box.innerHTML = input.value.trim() ? heroResultsHTML(catalog, input.value) : heroSuggestionsHTML();
  };

  document.addEventListener('input', (event) => {
    if (event.target.id === 'hero-ref-input') showResults(event.target);
  });

  document.addEventListener('focusin', (event) => {
    if (event.target.id === 'hero-ref-input' && !event.target.value.trim()) showResults(event.target);
  });

  document.addEventListener('submit', (event) => {
    if (!event.target.matches?.('[data-hero-search]')) return;
    event.preventDefault();
    const first = event.target.querySelector('.hero-ref-results a');
    if (first) first.click();
  });

  /* Un exemple remplit le champ. Un lien sans résultat ouvre la demande par la bonne porte,
   * puis le lien #/quote fait la navigation. */
  document.addEventListener('click', (event) => {
    const example = event.target.closest?.('[data-hero-suggest]');
    if (example) {
      const input = document.getElementById('hero-ref-input');
      input.value = example.dataset.heroSuggest;
      showResults(input);
      input.focus();
      return;
    }
    const link = event.target.closest?.('[data-quote-ref], [data-quote-need]');
    if (!link) return;
    resetQuoteRequest();
    if (link.dataset.quoteNeed !== undefined) {
      draft.mode = 'need';
      draft.application = link.dataset.quoteNeed;
    } else {
      draft.mode = 'reference';
      draft.reference = link.dataset.quoteRef;
    }
    state.step = 0;
  });
}
