import { SITE } from '../data/site.js';
import { asset, escapeHTML } from '../lib/dom.js';
import { HOME_FAMILIES } from '../data/families.js';
import { IMAGE_ASSETS } from '../data/images.js';
import { catalog } from '../state.js';
import { familyByCode } from '../data/queries.js';
import { hashForFamily } from '../lib/route.js';
import { img } from '../ui/media.js';
import { textButton } from '../ui/button.js';
import { solutions } from '../components/families.js';
import { feature } from '../components/dropout-feature.js';
import { featuredProduct } from '../components/featured-product.js';
import { METHOD } from '../data/company.js';
import { homeSectors } from '../components/home-sectors.js';
import { homeSuppliers } from '../components/home-suppliers.js';
import { expertiseMethod } from '../components/expertise-method.js';
import { heroSearch } from '../components/hero-search.js';
import { homeFamilyIndex } from '../components/home-family-index.js';
import { homeProximity } from '../components/home-proximity.js';
import '../styles/c2-home.css';

// Garder toute la carte visible lors du parcours clavier de la liste mobile.
document.addEventListener('focusin', (event) => {
  const link = event.target.closest?.('.hero-instrument a');
  const gallery = link?.closest('.hero-instrument-grid');
  if (gallery && gallery.scrollWidth > gallery.clientWidth) {
    link.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  }
});

export function home() {
  const hero = `<section class="hero hero-focus hero-four" aria-labelledby="hero-title">
    <div class="hero-focus-atmosphere" aria-hidden="true"><img class="hero-focus-texture" src="${asset('assets/hero-blue-grain.png')}" width="1774" height="887" alt="" fetchpriority="high" decoding="async"><div class="hero-bloom-mesh"></div></div>
    <div class="hero-four-copy"><h1 id="hero-title">${SITE.heading}</h1><div class="hero-focus-intro"><p class="hero-intro">Instrumentation, traitement d’air et solutions de contrôle pour la chimie, la pétrochimie, la sidérurgie et les autres industries. Décrivez votre application, nous cherchons la solution avec vous.</p>${heroSearch()}${textButton('Explorer les solutions', 'data-scroll="solutions"')}</div></div>
    <div class="hero-focus-stage"><div class="hero-instruments">
      <p class="mono hero-four-caption"><span>QUATRE GRANDEURS<br>UN MÊME SAVOIR-FAIRE</span></p>
      <nav class="hero-instrument-grid" aria-label="Nos quatre grandeurs de mesure">${HOME_FAMILIES.map(f => {
        const entry = familyByCode(catalog, f.code);
        const photo = IMAGE_ASSETS[f.img];
        return `<figure class="hero-instrument hero-instrument-${f.code}"><a href="${entry ? hashForFamily(entry.slug) : '#/products'}"><span class="mono hero-instrument-meta" aria-hidden="true">${escapeHTML(f.code)} / ${escapeHTML(f.unit)}</span><span class="hero-instrument-photo">${img(f.img, f.name)}</span><span class="hero-instrument-heading"><span class="hero-instrument-name">${escapeHTML(f.name)}</span><span class="hero-instrument-description">${escapeHTML(f.text)}</span><span class="hero-instrument-arrow" aria-hidden="true">→</span></span></a><figcaption>${escapeHTML(photo.credit)}</figcaption></figure>`;
      }).join('')}</nav>

    </div></div>

  </section>`;
  return hero + solutions(HOME_FAMILIES) + homeFamilyIndex() + expertiseMethod(METHOD) + featuredProduct() + feature() + homeSectors() + homeProximity() + homeSuppliers();
}
