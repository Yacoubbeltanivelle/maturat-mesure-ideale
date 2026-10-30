import { img, imageCredit } from '../ui/media.js';
import { sectionLabel } from '../ui/section-label.js';

/* Bloc de proximité : implantation et bassin industriel, sans promesse d'intervention ni de délai. */
export function homeProximity() {
  return `<section class="home-proximity section" aria-labelledby="proximity-title">
    <div class="home-proximity-copy">${sectionLabel('Implantation', 'sectors')}<h2 id="proximity-title">Basés à Martigues, au cœur du bassin industriel de Fos-Berre.</h2>
      <p>Le bassin réunit Fos-sur-Mer, Lavéra, Berre-l’Étang et Marseille. Être sur place aide à comprendre les installations et leurs contraintes avant de proposer une solution.</p>
      <a class="text-button" href="#/about">Connaître Maturat Mesure <span aria-hidden="true">→</span></a></div>
    <figure class="home-proximity-figure">${img(731, 'Martigues et le bassin industriel', '', true)}<figcaption>${imageCredit(731)}</figcaption></figure>
  </section>`;
}
