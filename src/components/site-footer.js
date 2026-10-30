import { state, catalog } from '../state.js';
import { asset, escapeHTML } from '../lib/dom.js';
import { SITE } from '../data/site.js';
import { textButton } from '../ui/button.js';
import { hashForFamily } from '../lib/route.js';
import { publishedFamilies } from '../data/queries.js';

export function contactCta() {
  if (state.page === 'quote') return '';
  return `<div class="footer-heading footer-contact-cta"><h2>${escapeHTML(SITE.contactCta.title)}</h2><div class="footer-cta-content"><p>${escapeHTML(SITE.contactCta.text)}</p>${textButton(SITE.contactCta.action, 'data-page="quote"')}<small>${escapeHTML(SITE.contactCta.note)}</small></div></div>`;
}

export function siteFooter() {
  const families = publishedFamilies(catalog);
  const familyLinks = families.map((f) =>
    `<li><a href="${hashForFamily(f.slug)}">${escapeHTML(f.name)}</a></li>`
  ).join('');

  return `
${contactCta()}
<div class="footer-scene"><div class="footer-curtain"><div class="footer-panel">
  <div class="footer-directory">
    <div class="footer-identity">
      <a class="brand" href="#/home"><img src="${asset('assets/maturat-logo.png')}" alt="${SITE.name}"></a>
      <p>${SITE.tagline}.<br>Niveau, température, pression, débit.</p>
    </div>
    <nav class="footer-column footer-column-products" aria-label="Produits">
      <h3>Produits</h3>
      <a href="#/products">Tout le catalogue</a>
      <ul class="footer-families-grid">${familyLinks}</ul>
    </nav>
    <nav class="footer-column" aria-label="Découvrir Maturat">
      <h3>Découvrir Maturat</h3>
      <a href="#/home">Accueil</a>
      <a href="#/dropout">Dropout</a>
      <a href="#/suppliers">Fournisseurs</a>
      <a href="#/about">À propos</a>
      <a href="#/faq">Questions fréquentes</a>
      <a href="#/news">Actualités</a>
      <a href="#/careers">Recrutement</a>
      <a href="#/legal">Informations légales et confidentialité</a>
    </nav>
    <div class="footer-column footer-contact">
      <h3>Votre projet</h3>
      <a href="#/quote">Décrire mon besoin →</a>
      <span>${SITE.contact.phone}</span>
      <a href="mailto:${SITE.contact.email}">${SITE.contact.email}</a>
      <p>${SITE.contact.street}<br>${SITE.contact.city}</p>
    </div>
  </div>
  <div class="footer-meta"><span>Maquette de démonstration · données d’exemple</span><div class="footer-settings"><button id="motion" aria-pressed="${state.reduced}">Mouvement <span>${state.reduced ? 'réduit' : 'activé'}</span></button><button data-open-credits>Crédits visuels →</button><a class="footer-admin-link" href="#/admin">Administration — démo →</a><button data-footer-top aria-label="Retour en haut de la page">↑</button></div></div>
</div>
<div class="footer-landscape" aria-hidden="true"><svg class="footer-relief footer-relief-distant" viewBox="0 0 2880 340" preserveAspectRatio="none" focusable="false"><defs><linearGradient id="footer-distant" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="40" y2="400"><stop stop-color="#a8cadf"/><stop offset="1" stop-color="#d4e6f1"/></linearGradient></defs><g class="footer-bob-distant"><g class="footer-wave-distant"><path d="M-1440 100C-1200 40 -960 40 -720 100S-240 160 0 100C240 40 480 40 720 100S1200 160 1440 100C1680 40 1920 40 2160 100S2640 160 2880 100C3120 40 3360 40 3600 100S4080 160 4320 100V600H-1440Z" fill="url(#footer-distant)"/></g></g></svg><span class="footer-wordmark">MATURAT</span>
<svg class="footer-relief" viewBox="0 0 2880 340" preserveAspectRatio="none" focusable="false"><defs><linearGradient id="footer-ridge" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="80" y2="400"><stop stop-color="#bfd7e7"/><stop offset="1" stop-color="#739cb9"/></linearGradient><linearGradient id="footer-front" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="190" y2="440"><stop stop-color="#99bed6"/><stop offset="1" stop-color="#426f91"/></linearGradient></defs><g class="footer-bob-back"><g class="footer-wave-back"><path d="M-1440 155C-1200 107 -960 107 -720 155S-240 203 0 155C240 107 480 107 720 155S1200 203 1440 155C1680 107 1920 107 2160 155S2640 203 2880 155C3120 107 3360 107 3600 155S4080 203 4320 155V600H-1440Z" fill="url(#footer-ridge)"/></g></g><g class="footer-bob-front"><g class="footer-wave-front"><path d="M-1440 260C-1200 222 -960 222 -720 260S-240 298 0 260C240 222 480 222 720 260S1200 298 1440 260C1680 222 1920 222 2160 260S2640 298 2880 260C3120 222 3360 222 3600 260S4080 298 4320 260V600H-1440Z" fill="url(#footer-front)"/></g></g></svg></div></div></div>`;
}
