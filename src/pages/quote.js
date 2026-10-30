import { state } from '../state.js';
import { eyebrow } from '../ui/eyebrow.js';
import { summary, fields } from '../components/quote-form.js';
import '../styles/c2-quote.css';

/* Page « Décrire mon besoin » — demande de chiffrage en 4 étapes. */
export function quote() {
  const step = state.step;
  const STEPS = ['Besoin', 'Application', 'Contact', 'Récapitulatif'];
  const progressItems = STEPS.map((s, i) => {
    const isCurrent = step === i;
    const isDone = step > i || state.done;
    // Une étape déjà remplie se rouvre d'un clic, tant que la demande n'est pas confirmée.
    const revisit = isDone && !state.done;
    const cls = [isDone ? 'done' : '', revisit ? 'revisit' : ''].filter(Boolean).join(' ');
    const link = revisit ? `<button type="button" class="step-link" data-goto-step="${i}" aria-label="Revenir à l’étape ${i + 1} : ${s}"></button>` : '';
    return `<li ${isCurrent && !state.done ? 'aria-current="step"' : ''} class="${cls}"><span>0${i + 1}</span>${s}${isDone ? '<b aria-hidden="true">✓</b>' : ''}${link}</li>`;
  }).join('');

  return `<section class="quote-page"><div class="quote-heading"><button class="back" data-page="home">← Accueil</button>${eyebrow('DÉCRIRE MON BESOIN')}<h1>Une référence ou un problème, la demande part de là.</h1><p>Aucune donnée technique n’est obligatoire : « Je ne sais pas » est une réponse acceptée.</p></div><div class="quote-layout"><aside class="quote-aside"><ol class="form-progress">${progressItems}</ol><div class="side-summary"><span class="mono">VOTRE DEMANDE</span><div id="live-summary">${summary(true)}</div></div><p class="privacy-note">Mode démonstration. Vos saisies restent dans cette page jusqu'à son rechargement. Aucun envoi réel.</p><p class="quote-aside-help"><a href="#/faq">Questions fréquentes <span aria-hidden="true">→</span></a></p></aside><form class="form-card">${fields()}</form></div></section>`;
}
