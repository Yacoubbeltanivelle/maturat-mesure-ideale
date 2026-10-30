import { $ } from '../lib/dom.js';
import { state } from '../state.js';

/* Curseur personnalise et leger parallaxe sur les scenes produit. */
export function mountCursor(dialog) {
  const cursor = $('.cursor');
  document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||state.reduced||dialog.open||state.page==='quote'||e.target.closest('input,textarea,select')){cursor.classList.remove('visible');return}cursor.classList.add('visible');cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';const interactive=e.target.closest('[data-art],.family-card,.feature-object');cursor.classList.toggle('explore',!!interactive);$('span',cursor).textContent=interactive?'VOIR':'';const art=e.target.closest('[data-art]');if(art){const r=art.getBoundingClientRect();art.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5)*10+'px');art.style.setProperty('--my',((e.clientY-r.top)/r.height-.5)*8+'px')}});document.addEventListener('pointerleave',()=>cursor.classList.remove('visible'));
}
