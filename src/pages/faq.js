import { escapeHTML } from '../lib/dom.js';
import { FAQ } from '../data/company.js';
import { eyebrow } from '../ui/eyebrow.js';
import { textButton } from '../ui/button.js';
import '../styles/faq.css';

/* Questions fréquentes. Le détail natif gère l'ouverture : pas de JavaScript,
 * et le clavier fonctionne sans code supplémentaire. */

function faqItem(entry, index) {
  const linksHtml = entry.links?.length
    ? `<div class="faq-links">${entry.links.map((l) => `<a class="text-button" href="${escapeHTML(l.href)}">${escapeHTML(l.label)} <span aria-hidden="true">→</span></a>`).join('')}</div>`
    : '';
  return `<li class="faq-item">
    <details class="faq-details">
      <summary class="faq-summary">
        <span class="mono faq-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
        <span class="faq-question">${escapeHTML(entry.q)}</span>
        <span class="faq-marker" aria-hidden="true"></span>
      </summary>
      <p class="faq-answer">${escapeHTML(entry.a)}</p>
      ${linksHtml}
    </details>
  </li>`;
}

export function faq() {
  return `<div class="editorial-page faq-page">
    <section class="editorial-intro" aria-labelledby="faq-title">
      <a class="editorial-back mono" href="#/home">← ACCUEIL</a>
      <div class="editorial-intro-grid">
        <div>${eyebrow('QUESTIONS FRÉQUENTES')}<h1 id="faq-title">Les bonnes questions,<br><em>avant le chiffrage.</em></h1></div>
        <div class="editorial-intro-copy">
          <p>Quelques repères pour préparer l’échange, même si certaines données techniques restent à définir.</p>
          <span class="editorial-note-inline">Réponses provisoires, à valider avant publication</span>
        </div>
      </div>
    </section>

    <section class="editorial-section" aria-labelledby="faq-list-title">
      <h2 id="faq-list-title" class="visually-hidden">Liste des questions</h2>
      <ul class="faq-list">${FAQ.map(faqItem).join('')}</ul>
    </section>

    <div class="editorial-cta">
      <p class="editorial-cta-text">Votre question n’y figure pas ?</p>
      ${textButton('Décrire mon besoin', 'data-page="quote"')}
    </div>
  </div>`;
}
