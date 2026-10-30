import { $ } from '../lib/dom.js';
import { state } from '../state.js';
import { updateDrop } from '../components/dropout-controls.js';

/* Progression de la scene Dropout pilotee par le scroll. */
let scheduled = false;
export function onScroll(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;const feature=$('[data-feature]');if(feature){const r=feature.getBoundingClientRect();feature.style.setProperty('--feature-phase',Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight*.7))))}const cinematic=$('.cinematic');if(cinematic&&!state.reduced&&innerWidth>800&&innerHeight>780){const r=cinematic.getBoundingClientRect();const progress=Math.max(0,Math.min(1,-r.top/(cinematic.offsetHeight-innerHeight)));$('.scroll-track span').style.width=progress*100+'%';if(state.scrollSync){const next=Math.min(3,Math.floor(progress*4));if(next!==state.dropStep){state.cut=next>0;updateDrop(next,true)}}}})}
