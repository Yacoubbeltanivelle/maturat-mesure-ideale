import { $, $$ } from '../lib/dom.js';
import { state } from '../state.js';
import { dropCopy } from './dropout-stage.js';

/* Pilotage de la scene Dropout : etape courante et bascule equipement / schema. */
export function updateDrop(i, fromScroll = false) {
  state.dropStep = i;
  if(!fromScroll){state.cut=true;state.scrollSync=false;const b=$('[data-sync]');if(b){b.textContent='Progression au scroll : en pause';b.setAttribute('aria-pressed','false')}}const stage=$('.product-stage');if(!stage)return;stage.dataset.active=i;stage.classList.toggle('is-cut',state.cut);$$('.hotspot').forEach(b=>b.disabled=!state.cut);$('.drop-whole').setAttribute('aria-hidden',state.cut);$('.drop-cut').setAttribute('aria-hidden',!state.cut);$('.stage-id').textContent=state.cut?'PRINCIPE DE SÉPARATION':'SÉPARATEUR DROPOUT';$('.drop-cut').inert=!state.cut;$$('[data-stage]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.stage)===i));$$('[data-cut]').forEach(b=>b.setAttribute('aria-pressed',(b.dataset.cut==='true')===state.cut));$('.drop-copy').innerHTML=dropCopy()}
