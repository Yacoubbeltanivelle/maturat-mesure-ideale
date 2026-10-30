import { $$ } from '../lib/dom.js';
import { state } from '../state.js';

/* Apparition progressive des sections a l'entree dans le viewport. */
let revealObserver;
export function setupReveal(){revealObserver?.disconnect();if(state.reduced)return;revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');revealObserver.unobserve(e.target)}}),{threshold:.08});$$('.section-heading,.family-card,.family-inspector,.feature-copy,.feature-object,.application-cta').forEach(el=>{el.classList.add('will-reveal');revealObserver.observe(el)})}
