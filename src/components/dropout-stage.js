import { state } from '../state.js';
import { DROP_STEPS } from '../data/drop-steps.js';
import { dropoutImage } from '../ui/media.js';

/* Scene Dropout : equipement, schema du flux, etapes. */
export function stageTabs(){
  const dropStep = state.dropStep;
  return `<div class="stage-tabs" role="group" aria-label="Étapes du fonctionnement">${DROP_STEPS.map((s,i)=>`<button data-stage="${i}" aria-pressed="${i===dropStep}"><span class="mono">0${i+1}</span>${s.name}</button>`).join('')}</div>`}

export function flowDiagram(){
  const dropStep = state.dropStep;
  return `<div class="flow-diagram" role="group" aria-label="Schéma pédagogique simplifié du flux"><svg class="flow-connectors" viewBox="0 0 440 360" aria-hidden="true"><defs><marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#4395d1"/></marker><marker id="purge-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#f7941d"/></marker></defs><path class="air-path" d="M85 135 H159 M281 135 H353"/><path class="purge-path" d="M220 177 V252"/></svg><button class="flow-node flow-in" data-stage="0" aria-pressed="${dropStep===0}"><span>01</span>Air entrant</button><button class="flow-node flow-separation" data-stage="1" aria-pressed="${dropStep===1}"><span>02</span>Séparation</button><button class="flow-node flow-out" data-stage="3" aria-pressed="${dropStep===3}"><span>04</span>Flux en sortie</button><button class="flow-node flow-purge" data-stage="2" aria-pressed="${dropStep===2}"><span>03</span>Collecte & purge</button><span class="flow-note">Schéma de principe simplifié<br>Sans représentation de la construction interne</span></div>`}

export function productStage(){
  const dropStep = state.dropStep;
  const cut = state.cut;
  return `<div class="product-stage ${cut?'is-cut':''}" data-active="${dropStep}"><div class="stage-ambient" aria-hidden="true"></div><span class="mono stage-id">${cut?'PRINCIPE DE SÉPARATION':'SÉPARATEUR DROPOUT'}</span><div class="product-frame">${dropoutImage('drop-whole').replace('<img ',`<img aria-hidden="${cut}" `)}<div class="drop-cut" aria-hidden="${!cut}" ${cut?'':'inert'}>${flowDiagram()}</div></div><div class="view-switch" role="group" aria-label="Présentation"><button data-cut="false" aria-pressed="${!cut}">Équipement</button><button data-cut="true" aria-pressed="${cut}">Schéma du flux</button></div><span class="image-source">Visuel fourni · Détourage et netteté améliorés pour la maquette</span></div>`}

export function dropCopy(){
  const dropStep = state.dropStep;
  const s=DROP_STEPS[dropStep];return `<span class="mono">0${dropStep+1} / ${s.name.toUpperCase()}</span><h2>${s.title}</h2><p>${s.text}</p>`}
