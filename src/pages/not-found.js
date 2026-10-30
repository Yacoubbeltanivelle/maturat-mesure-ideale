import { eyebrow } from '../ui/eyebrow.js';

/* Etat introuvable : une adresse inconnue, une famille ou une fiche retirée.
 * Aucune erreur JavaScript, et toujours une sortie. */
export function notFound() {
  return `<section class="notfound-page" aria-labelledby="notfound-title">
    ${eyebrow('PAGE INTROUVABLE')}
    <h1 id="notfound-title">Cette adresse<br><em>ne mène nulle part.</em></h1>
    <p>La famille ou la fiche demandée n’existe pas, ou n’est plus publiée dans cette démonstration.</p>
    <div class="notfound-actions">
      <a class="text-button" href="#/products">Voir le catalogue <span aria-hidden="true">→</span></a>
      <a class="text-button" href="#/home">Retour à l’accueil <span aria-hidden="true">→</span></a>
    </div>
  </section>`;
}
