import { primary } from '../ui/button.js';
import { dropoutImage, img, imageCredit } from '../ui/media.js';
import { hasImage } from '../data/images.js';

/* Section Dropout de la page d'accueil.
 * Le visuel 722 (montage Dropout) prend la place quand il existe ; sinon le
 * détourage fourni reste affiché. */
export function feature(){
  const art = hasImage(722)
    ? `<figure class="feature-photo">${img(722, 'Montage d’un séparateur Dropout', 'feature-dropout-photo', true)}<figcaption>${imageCredit(722)}</figcaption></figure>`
    : dropoutImage('feature-dropout', true);
  return `<section class="drop-feature" data-feature><div class="feature-wash" aria-hidden="true"></div><div class="feature-copy"><h2>Moins d’eau liquide dans votre air comprimé.</h2><p>Un séparateur Dropout retire l’eau liquide d’un réseau d’air comprimé et protège les organes pneumatiques et les instruments en aval. Il ne remplace pas un sécheur : la vapeur d’eau reste dans l’air.</p>${primary('Découvrir Dropout','data-page="dropout"')}<div class="feature-benefits"><span>Eau liquide : séparée</span><span>Vapeur d’eau : non traitée</span></div></div><div class="feature-object" data-art>${art}<span class="mono">DROP’OUT / SÉPARATION DE L’EAU LIQUIDE</span></div></section>`;
}
