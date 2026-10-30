import { SITE } from '../data/site.js';
import { escapeHTML } from '../lib/dom.js';
import { eyebrow } from '../ui/eyebrow.js';

export function careers() {
  const email = escapeHTML(SITE.contact.email);

  return `<div class="editorial-page v2-editorial v2-waiting-page">
    <section class="editorial-intro" aria-labelledby="careers-title">
      <a class="editorial-back mono" href="#/home">← ACCUEIL</a>
      <div class="editorial-intro-grid">
        <div>${eyebrow('RECRUTEMENT')}<h1 id="careers-title">Aucune offre publiée pour le moment</h1></div>
        <div class="editorial-intro-copy"><p>Une candidature spontanée peut être envoyée à <a href="mailto:${email}">${email}</a>.</p><p>Les métiers cités ici sont des exemples.</p></div>
      </div>
    </section>
    <section class="editorial-section" aria-labelledby="careers-jobs-title">
      <div class="editorial-section-heading"><div>${eyebrow('MÉTIERS CONCERNÉS')}<h2 id="careers-jobs-title">Exemples de fonctions</h2></div></div>
      <ul class="v2-topic-list"><li>Technico-commercial en instrumentation</li><li>Assistant ou assistante commerciale</li></ul>
    </section>
    <div class="editorial-cta"><a class="text-button" href="#/home">Retour à l’accueil <span aria-hidden="true">→</span></a></div>
  </div>`;
}
