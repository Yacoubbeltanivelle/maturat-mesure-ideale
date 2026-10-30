import { asset } from '../lib/dom.js';
import { IMAGE_ASSETS } from '../data/images.js';

/* Les photographies sont sous licence Creative Commons : l'attribution doit rester
 * visible dans la maquette. Cette fiche remplace l'ancien carnet de direction artistique. */
export function photoCredits(){return `<section class="photo-credits"><span class="mono">PHOTOGRAPHIES / SOURCES & LICENCES</span><h2>Des visuels pour se projeter.</h2><p>Le visuel Dropout provient de l’extrait de plaquette fourni, amélioré avec l’IA puis détouré. Le niveau Houdec 810 et le débitmètre Fuji Electric S-Flow proviennent des sites des fabricants, qui en conservent les droits. L’accueil utilise les détourages officiels Houdec (type 810) et Fuji Electric (PT100, FKC et M1000). Ces visuels restent la propriété des fabricants ; aucune licence libre ni autorisation de publication n’est revendiquée. Les autres photographies conservent les licences indiquées ci-dessous. Ces visuels illustrent les familles ; ils ne représentent pas les références fictives du catalogue.</p><div class="credit-list">${Object.entries(IMAGE_ASSETS).map(([,a])=>`<article><img src="${asset(a.src)}" width="80" height="76" alt="" loading="lazy"><div><h3>${a.title}</h3><p>${a.author} · ${a.width.toLocaleString('fr-FR')} × ${a.height.toLocaleString('fr-FR')} px</p><div class="credit-links"><a href="${a.source}" target="_blank" rel="noopener noreferrer">Voir la source ↗</a>${a.licenseUrl ? `<a href="${a.licenseUrl}" target="_blank" rel="noopener noreferrer">${a.license} ↗</a>` : `<span>${a.license}</span>`}</div></div></article>`).join('')}</div></section>`}

export function creditsContent() {
  return photoCredits();
}
