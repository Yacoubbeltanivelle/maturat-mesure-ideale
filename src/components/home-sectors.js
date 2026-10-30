import { SECTORS } from '../data/company.js';
import { escapeHTML } from '../lib/dom.js';
import { img, imageCredit } from '../ui/media.js';
import { sectionLabel } from '../ui/section-label.js';

function sectorPhoto(sector, className) {
  const id = sector.photo;
  return `<figure class="sector-photo ${className}">
    <div class="sector-photo-frame">${img(id, sector.name, '', true)}<span class="sector-photo-label"><strong>${escapeHTML(sector.name)}</strong></span></div>
    <figcaption>Illustration / ${imageCredit(id)}</figcaption>
  </figure>`;
}

export function homeSectors() {
  return `<section class="home-sectors section sectors-tableau" aria-labelledby="sectors-title">
    <header class="sectors-header"><div>${sectionLabel("Secteurs industriels", "sectors")}<h2 id="sectors-title">Six secteurs industriels,<br>des contraintes à chaque fois différentes.</h2></div><p>Chimie, pétrochimie et sidérurgie d’abord, puis énergie, agroalimentaire et pharmacie.</p></header>
    <div class="sectors-composition">
      ${sectorPhoto(SECTORS[0], 'sector-photo-major')}
      <div class="sectors-index"><ul>${SECTORS.map(s => `<li>${escapeHTML(s.name)}</li>`).join('')}</ul><p>Photographies d’illustration.</p></div>
      ${sectorPhoto(SECTORS[1], 'sector-photo-marine')}
      ${sectorPhoto(SECTORS[5], 'sector-photo-lab')}
      <div class="sectors-note"><span class="mono">DU PROCÉDÉ À LA MESURE</span><p>Chaque environnement <br>a ses contraintes.</p><a class="text-button" href="#/quote">Parlons de votre application <span aria-hidden="true">→</span></a></div>
    </div>
  </section>`;
}
