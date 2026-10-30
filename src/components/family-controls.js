import { $, $$ } from '../lib/dom.js';
import { state } from '../state.js';
import { FAMILIES } from '../data/families.js';
import { specimen, principles } from './families.js';

/* Changement de grandeur : met a jour le halo, le specimen et les principes. */
export function updateFamily(i){
  state.family = i;
  const family = i;
  document.body.style.setProperty('--selected-halo',FAMILIES[i].color);$$('[data-family]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.family)===i));if($('#hero-specimen'))$('#hero-specimen').innerHTML=specimen();if($('#control-principles'))$('#control-principles').innerHTML=principles()}
