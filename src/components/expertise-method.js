import { img } from '../ui/media.js';
import { IMAGE_ASSETS } from '../data/images.js';
import { escapeHTML } from '../lib/dom.js';
import { sectionLabel } from '../ui/section-label.js';
import { METHOD } from '../data/company.js';

const diagrams = [
  '<path d="M18 10 78 24 18 38M78 24l62-14M78 24l62 14"/><circle cx="18" cy="10" r="4"/><circle cx="18" cy="38" r="4"/><circle cx="140" cy="10" r="4"/><circle cx="140" cy="38" r="4"/><circle cx="78" cy="24" r="7"/><circle cx="78" cy="24" r="2" fill="currentColor"/>',
  '<path d="M18 24h45V8h73M63 24h73M63 24v16h73"/><circle cx="18" cy="24" r="4"/><path d="m76 18 6 6-6 6"/><circle cx="140" cy="8" r="3"/><circle cx="140" cy="24" r="5" fill="currentColor"/><circle cx="140" cy="40" r="3"/>',
  '<rect x="7" y="13" width="25" height="22" rx="2"/><path d="M34 24h24m-5-5 5 5-5 5"/><rect x="63" y="13" width="25" height="22" rx="2"/><path d="M90 24h24m-5-5 5 5-5 5"/><rect x="119" y="8" width="31" height="32" rx="2"/><path d="M125 16h18m-18 7h18m-18 7h10"/>',
];

/* Le contenu métier reste fourni par les données ; la photo illustre un procédé. */
export function expertiseMethod(method = METHOD) {
  return `<section class="expertise-method section expertise-tableau" aria-labelledby="expertise-title">
    <header class="expertise-header">
      <div class="expertise-introduction">${sectionLabel("Notre méthode", "method")}<h2 id="expertise-title">${method.title}</h2><p>Comprendre votre application avant de sélectionner la technologie.</p></div>
      <figure class="expertise-photo">${img(601, 'Tuyauteries industrielles', '', true)}<figcaption>Illustration / ${escapeHTML(IMAGE_ASSETS[601].credit)}</figcaption></figure>
    </header>
    <ol class="expertise-steps" role="list">${method.steps.map((step, i) => `<li class="expertise-step">
      <p class="mono expertise-index">${escapeHTML(step.index)} / ${escapeHTML(step.kicker)}</p>
      <h3>${escapeHTML(step.title)}</h3>
      <div class="expertise-detail"><p>${escapeHTML(step.text)}</p>${step.criteria?.length ? `<ul class="expertise-criteria">${step.criteria.map(c => `<li>${escapeHTML(c)}</li>`).join('')}</ul>` : ''}<div class="expertise-action"><svg class="expertise-diagram" viewBox="0 0 160 48" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">${diagrams[i] ?? ''}</svg>${i === method.steps.length - 1 ? `<a class="text-button" href="${escapeHTML(method.cta.href)}">${escapeHTML(method.cta.label)} <span aria-hidden="true">→</span></a>` : ''}</div></div>
    </li>`).join('')}</ol>
  </section>`;
}
