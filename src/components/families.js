import { state, catalog } from '../state.js';
import { FAMILIES } from '../data/families.js';
import { familyByCode, productsOfFamily } from '../data/queries.js';
import { hashForFamily } from '../lib/route.js';
import { escapeHTML } from '../lib/dom.js';
import { img, imageCredit } from '../ui/media.js';
import { textButton } from '../ui/button.js';
import { sectionLabel } from '../ui/section-label.js';

/* Les quatre familles de mesure : onglets, specimen et lignes éditoriales. */
export function familyTabs(){
  const family = state.family;
  return `<div class="family-tabs" role="group" aria-label="Grandeur physique">${FAMILIES.map((f,i)=>`<button data-family="${i}" aria-pressed="${i===family}"><span class="mono">${f.code}</span>${f.name}<span class="tab-marker" aria-hidden="true">→</span></button>`).join('')}</div>`}

export function specimen(){
  const family = state.family;
  const f=FAMILIES[family];return `<div class="specimen-meta"><span class="mono">${f.code} / ${f.name.toUpperCase()}</span><span class="mono">UNITÉ / ${f.unit}</span></div>${img(f.img,'Exemple d’instrument de '+f.name.toLowerCase(),'hero-key-image')}<div class="specimen-caption"><span>${f.use}</span><span class="mono">MATURAT / MESURE</span></div>`}

export function principles(){
  const family = state.family;
  return `<span class="mono">PRINCIPES DE MESURE</span><p>${FAMILIES[family].principles.join(' · ')}</p>`}

/* Chaque ligne donne un accès direct à la famille et au besoin. */
function familyPageLink(code){
  const entry=familyByCode(catalog,code);
  if(!entry)return '';
  const n=productsOfFamily(catalog,entry.id).length;
  return `<a class="text-button" href="${hashForFamily(entry.slug)}" aria-label="Voir la famille ${escapeHTML(entry.name)}">Voir la famille <span class="family-row-count">· ${n} ${n===1?'fiche':'fiches'}</span><span aria-hidden="true">→</span></a>`;
}

export function solutions(families = FAMILIES){
  return `<section class="solutions section family-editorial" id="solutions" aria-labelledby="solutions-title">
    <header class="family-editorial-header">
      <div>${sectionLabel('Instrumentation', 'instrumentation')}<h2 id="solutions-title">Tout commence<br><em>par la bonne mesure.</em></h2></div>
      <span class="mono family-editorial-total">${String(families.length).padStart(2,'0')} GRANDEURS</span>
      <div class="family-editorial-intro"><p>Quatre grandeurs fondamentales.<br>Une sélection guidée par vos contraintes.</p><a class="text-button" href="#/products">Voir tout le catalogue <span aria-hidden="true">→</span></a></div>
    </header>
    <div class="family-rows">${families.map(f=>`<article class="family-row family-row-${f.code}" aria-labelledby="family-row-${f.code}">
      <div class="family-row-identity"><span class="mono">${escapeHTML(f.code)} / MESURE</span><h3 id="family-row-${f.code}">${escapeHTML(f.name)}</h3></div>
      <figure class="family-row-figure"><div class="family-row-object">${img(f.img,f.name,'family-row-image',true)}</div><figcaption>${imageCredit(f.img)}</figcaption></figure>
      <div class="family-row-details"><p>${escapeHTML(f.text)}</p><ul class="family-row-principles mono" aria-label="Principes de mesure">${f.principles.map(p=>`<li>${escapeHTML(p)}</li>`).join('')}</ul><div class="family-row-actions">${familyPageLink(f.code)}${textButton('Décrire mon besoin',`data-need="${escapeHTML(f.name)}" aria-label="Décrire mon besoin en ${escapeHTML(f.name.toLowerCase())}"`)}</div></div>
    </article>`).join('')}</div>
  </section>`;
}
