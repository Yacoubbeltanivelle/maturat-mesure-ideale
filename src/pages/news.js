import { eyebrow } from '../ui/eyebrow.js';

export function news() {
  return `<div class="editorial-page v2-editorial v2-waiting-page">
    <section class="editorial-intro" aria-labelledby="news-title">
      <a class="editorial-back mono" href="#/home">← ACCUEIL</a>
      <div class="editorial-intro-grid">
        <div>${eyebrow('ACTUALITÉS')}<h1 id="news-title">Les actualités arrivent bientôt</h1></div>
        <div class="editorial-intro-copy"><p>Cette page présentera les nouveaux produits référencés et les salons auxquels Maturat Mesure participe.</p><p>Elle partagera aussi des retours d’application utiles pour préparer un besoin.</p></div>
      </div>
    </section>
    <section class="editorial-section" aria-labelledby="news-topics-title">
      <div class="editorial-section-heading"><div>${eyebrow('À VENIR')}<h2 id="news-topics-title">Sujets en préparation</h2></div></div>
      <ul class="v2-topic-list"><li>Nouveaux produits référencés</li><li>Salons et rencontres professionnelles</li><li>Retours d’application</li></ul>
    </section>
    <div class="editorial-cta v2-link-row"><a class="text-button" href="#/products">Parcourir le catalogue <span aria-hidden="true">→</span></a><a class="text-button" href="#/quote">Décrire mon besoin <span aria-hidden="true">→</span></a></div>
  </div>`;
}
