import { escapeHTML, asset } from '../lib/dom.js';
import { IMAGE_ASSETS, resolveImageId } from '../data/images.js';
import { HOME_FAMILIES } from '../data/families.js';

/* Images : le chemin passe par asset() pour suivre la base du site. */
export const img=(requested,alt,cls='',lazy=false)=>{const id=resolveImageId(requested);const a=IMAGE_ASSETS[id];return `<img class="${cls} asset-${id}" src="${asset(a.src)}" alt="${escapeHTML(a.title)} — visuel d’illustration" width="${a.width}" height="${a.height}" ${lazy?'loading="lazy"':''} decoding="async">`};
export const imageCredit = (requested) => escapeHTML(IMAGE_ASSETS[resolveImageId(requested)]?.credit ?? '');
export const dropoutImage=(cls='',lazy=false)=>`<img class="${cls}" src="${asset('assets/dropout-cutout.png')}" width="455" height="1738" alt="Séparateur Dropout, corps en aluminium et raccords bleus — visuel fourni amélioré" ${lazy?'loading="lazy"':''} decoding="async">`;

/* Visuel d'une fiche : le sien s'il existe, sinon celui de sa famille (détourage d'accueil pour les quatre grandeurs).
 * `img: false` impose le repère graphique quand la photo de famille montre l'appareil d'une autre marque. */
export const productVisualId = (product, family) =>
  product?.img ?? HOME_FAMILIES.find((f) => f.code === family?.code)?.img ?? family?.img ?? null;
