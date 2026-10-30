import { state, draft, catalog } from '../state.js';
import { escapeHTML } from '../lib/dom.js';
import { productContext } from '../data/queries.js';
import { productFacets } from '../data/catalog-facets.js';
import { hashForProduct } from '../lib/route.js';
import { primary } from '../ui/button.js';
import { getQuestionsForFamily, answerItems, DEFAULT_QUESTIONS, SKIP_LABEL } from '../data/quote-questions.js';

/* Parcours de demande — quatre étapes, aucune donnée transmise.
 * Deux entrées : « J'ai une référence » et « Je décris mon besoin ». Aucun champ
 * technique n'est obligatoire : « Je ne sais pas » reste une réponse. */

export const MODE_LABELS = {
  reference: 'J’ai une référence',
  need: 'Je décris mon besoin',
};

/** Mode courant : celui choisi, sinon « référence » dès qu'une référence ou une fiche est connue. */
export const currentMode = () => draft.mode || (draft.reference || draft.product ? 'reference' : 'need');

/* ── Familles disponibles ─────────────────────────────────────────── */

function familyChoices() {
  const families = [...catalog.families.map((f) => f.name), 'Autre / à préciser', SKIP_LABEL];
  return families.map((v) => {
    const checked = draft.family === v ? 'checked' : '';
    return `<label class="family-radio"><input type="radio" name="family" value="${escapeHTML(v)}" ${checked}><span>${escapeHTML(v)}</span></label>`;
  }).join('');
}

const familyLabel = () => draft.family || SKIP_LABEL;
/* Même libellé que le champ de l'étape 01 : « Application » désigne l'étape 02. */
const descriptionLabel = () => currentMode() === 'reference' ? 'Contexte de la demande' : 'Description';

/* ── Fiche retenue ────────────────────────────────────────────────── */

export const selectedProduct = () => draft.product ? productContext(catalog, draft.product) : null;

export function productContextBlock() {
  const picked = selectedProduct();
  if (!picked) {
    return `<p class="quote-product-empty small-note">Aucune fiche sélectionnée : cette demande reste générale. Vous pouvez aussi partir d'une <a href="#/products">fiche du catalogue</a>.</p>`;
  }
  const { product, family } = picked;
  const { technology: principle } = productFacets(product);
  return `<div class="quote-product"><span class="mono">VOUS PARTEZ DE CETTE FICHE</span><p class="quote-product-name">${escapeHTML(product.name)}</p><dl class="product-mini"><div><dt>Famille</dt><dd>${escapeHTML(family?.name ?? '—')}</dd></div>${principle ? `<div><dt>Principe</dt><dd>${escapeHTML(principle)}</dd></div>` : ''}<div><dt>Référence</dt><dd class="mono-val">${escapeHTML(product.reference)}</dd></div></dl><div class="quote-product-actions">${product.published !== false ? `<a href="${hashForProduct(product.slug)}" class="text-button">Revoir la fiche <span aria-hidden="true">→</span></a>` : ''}<button type="button" class="quote-product-clear" data-clear-product>Retirer cette fiche</button></div></div>`;
}

/* Les champs « référence » et « description » ne sont obligatoires que dans leur mode.
 * Appelé au changement de mode ; le rendu initial pose déjà les bons attributs. */
export function syncQuoteMode() {
  const mode = document.querySelector('input[name="mode"]:checked')?.value;
  const ref = document.getElementById('reference');
  const app = document.getElementById('application');
  if (ref) ref.required = mode === 'reference';
  if (app) app.required = mode === 'need';
}

/* ── Rendu d'une question adaptative ─────────────────────────────── */

/* Une case « je ne sais pas » peut couvrir plusieurs champs (ex. air comprimé :
 * pression + débit partagent la même case) : `skipKey` permet de les lier. */
const skipKeyFor = (q) => q.skipKey || `${q.name}_skip`;

function skipBox(q, answers) {
  return `<label class="q-skip"><input data-answer type="checkbox" name="${skipKeyFor(q)}" ${answers[skipKeyFor(q)] ? 'checked' : ''}>${escapeHTML(SKIP_LABEL)}</label>`;
}

function renderQuestion(q, showSkip = true) {
  const answers = draft.answers;
  const val = String(answers[q.name] ?? '');
  const skipKey = skipKeyFor(q);
  const isSkipped = Boolean(answers[skipKey]);
  const disAttr = isSkipped ? 'disabled' : '';

  if (q.type === 'radio') {
    const options = q.options.some((o) => /^je ne sais pas/i.test(o)) ? q.options : [...q.options, SKIP_LABEL];
    const opts = options.map((opt) => {
      const checked = val === opt ? 'checked' : '';
      const safeId = `qr_${q.name}_${opt.replace(/\W+/g, '_')}`;
      return `<label class="radio-choice"><input data-answer type="radio" name="${q.name}" id="${safeId}" value="${escapeHTML(opt)}" ${checked}><span>${escapeHTML(opt)}</span></label>`;
    }).join('');
    return `<fieldset class="question-group"><legend class="q-label">${escapeHTML(q.label)}</legend><div class="radio-options">${opts}</div></fieldset>`;
  }

  if (q.type === 'number') {
    return `<div class="question-group"><label class="q-label" for="q_${q.name}">${escapeHTML(q.label)}</label><div class="unit-input"><input data-answer data-skip-key="${skipKey}" type="number" id="q_${q.name}" name="${q.name}" value="${escapeHTML(String(answers[q.name] ?? ''))}" min="0" step="any" inputmode="decimal" placeholder="—" ${disAttr}><span>${escapeHTML(q.unit)}</span></div>${showSkip ? skipBox(q, answers) : ''}</div>`;
  }

  if (q.type === 'text') {
    return `<div class="question-group"><label class="q-label" for="q_${q.name}">${escapeHTML(q.label)}</label><input data-answer data-skip-key="${skipKey}" type="text" id="q_${q.name}" name="${q.name}" value="${escapeHTML(val)}" maxlength="200" placeholder="" ${disAttr}>${skipBox(q, answers)}</div>`;
  }

  if (q.type === 'textarea') {
    return `<div class="question-group"><label class="q-label" for="q_${q.name}">${escapeHTML(q.label)}</label><textarea data-answer data-skip-key="${skipKey}" id="q_${q.name}" name="${q.name}" maxlength="1000" ${disAttr}>${escapeHTML(val)}</textarea>${skipBox(q, answers)}</div>`;
  }

  return '';
}

function applicationQuestions() {
  const questions = getQuestionsForFamily(draft.family);
  const isOther = questions === DEFAULT_QUESTIONS;
  const otherNote = isOther
    ? `<p class="questions-other-note">Les caractéristiques de votre besoin peuvent être définies avec Maturat lors de l'échange.</p>`
    : '';
  const seen = new Set();
  return otherNote + questions.map((q) => {
    const key = skipKeyFor(q);
    const showSkip = !seen.has(key);
    seen.add(key);
    return renderQuestion(q, showSkip);
  }).join('');
}

/* ── Résumé ──────────────────────────────────────────────────────── */

export function summary(compact = false) {
  const picked = selectedProduct();
  const rows = [];

  rows.push(['Demande', MODE_LABELS[currentMode()]]);
  if (draft.reference && !picked && currentMode() === 'reference') rows.push(['Référence', draft.reference]);
  rows.push(['Famille', familyLabel()]);
  if (picked) rows.push(['Fiche', `${picked.product.name} (${picked.product.reference})`]);
  if (draft.application) rows.push([descriptionLabel(), draft.application]);

  if (!compact) {
    answerItems(draft.family, draft.answers).forEach(({ label, text }) => rows.push([label, text]));
    rows.push(['Contact', draft.name]);
    if (draft.company) rows.push(['Entreprise', draft.company]);
    if (draft.email) rows.push(['E-mail', draft.email]);
  } else {
    const goal = answerItems(draft.family, draft.answers).find((item) => item.name === 'goal');
    if (goal) rows.push([goal.label, goal.text]);
  }

  return `<dl class="summary">${rows.filter(([, v]) => v).map(([k, v]) => `<div><dt>${escapeHTML(k)}</dt><dd>${escapeHTML(v)}</dd></div>`).join('')}</dl>`;
}

/* Blocs de récapitulatif de la demande, communs à l'étape 4 et à la confirmation. */
function recapBlocks() {
  const picked = selectedProduct();
  const renderRows = (rows) => rows.map(([k, v]) => `<div><dt>${escapeHTML(k)}</dt><dd>${escapeHTML(v)}</dd></div>`).join('');
  const items = answerItems(draft.family, draft.answers).map(({ label, text }) => [label, text]);
  const needRows = [['Type de demande', MODE_LABELS[currentMode()]]];
  if (draft.reference && currentMode() === 'reference') needRows.push(['Référence', draft.reference]);
  needRows.push(['Famille', familyLabel()]);
  if (draft.application) needRows.push([descriptionLabel(), draft.application]);

  const ficheBlock = picked
    ? `<div class="summary-block"><span class="mono summary-block-title">FICHE SÉLECTIONNÉE</span><dl class="summary">${renderRows([[picked.product.name, picked.product.reference]])}</dl></div>`
    : '';
  const infosBlock = items.length
    ? `<div class="summary-block"><span class="mono summary-block-title">INFORMATIONS TECHNIQUES</span><dl class="summary">${renderRows(items)}</dl></div>`
    : '';
  const contactRows = [['Nom', draft.name]];
  if (draft.company) contactRows.push(['Entreprise', draft.company]);
  contactRows.push(['E-mail', draft.email]);
  return `<div class="summary-block"><span class="mono summary-block-title">VOTRE BESOIN</span><dl class="summary">${renderRows(needRows)}</dl></div>${ficheBlock}${infosBlock}<div class="summary-block"><span class="mono summary-block-title">CONTACT</span><dl class="summary">${renderRows(contactRows)}</dl></div>`;
}

/* ── Champs par étape ─────────────────────────────────────────────── */

export function fields() {
  const done = state.done;
  const step = state.step;
  const progress = Math.round(((step + 1) / 4) * 100);

  if (done) {
    return `<div class="form-success" role="status"><span class="success-mark" aria-hidden="true">✓</span><span class="mono">DEMANDE ENREGISTRÉE</span><h2>Votre demande est enregistrée.</h2><p class="request-id-line">Identifiant : <strong class="request-id mono">${escapeHTML(draft.requestId)}</strong></p><p>Un interlocuteur de Maturat Mesure la lira et vous répondra à l’adresse indiquée. Aucun délai n’est annoncé. Dans cette maquette, rien n’est réellement envoyé.</p><div class="request-recap">${recapBlocks()}</div><div class="form-actions"><button type="button" class="button" data-quote-edit>Modifier ma demande</button><button type="button" data-quote-reset>Nouvelle demande</button></div></div>`;
  }

  const bar = `<div class="form-progress-bar" aria-hidden="true"><span style="width:${progress}%"></span></div>`;

  if (step === 0) {
    const mode = currentMode();
    const choice = (value) => `<label class="radio-choice"><input type="radio" name="mode" value="${value}" ${mode === value ? 'checked' : ''}><span>${escapeHTML(MODE_LABELS[value])}</span></label>`;
    return `${bar}<span class="mono form-kicker">01 / 04 — BESOIN</span><h2 tabindex="-1">Par quoi voulez-vous<br>commencer ?</h2><fieldset class="question-group quote-mode"><legend class="visually-hidden">Type de demande</legend><div class="radio-options">${choice('reference')}${choice('need')}</div></fieldset><div id="quote-product-slot">${productContextBlock()}</div><div class="mode-reference"><label for="reference">Référence, marque ou instrument <span>*</span></label><input id="reference" name="reference" maxlength="120" value="${escapeHTML(draft.reference)}" placeholder="Houdec 810, PT100…" ${mode === 'reference' ? 'required' : ''}><p class="small-note">Une référence ancienne ou illisible convient : écrivez ce que vous lisez encore.</p></div><p class="family-field-label">Famille <span>(facultatif)</span></p><fieldset class="family-radio-group" aria-label="Famille">${familyChoices()}</fieldset><label for="application" style="margin-top:24px"><span class="mode-need">Décrivez votre besoin en quelques mots <span>*</span></span><span class="mode-reference">Contexte de la demande <span>(facultatif)</span></span></label><textarea id="application" name="application" maxlength="1800" placeholder="Ex. : je souhaite mesurer le niveau d'une cuve de stockage…" ${mode === 'need' ? 'required' : ''}>${escapeHTML(draft.application)}</textarea><div class="form-actions"><span class="small-note">* Champ requis</span>${primary('Continuer', 'type="submit"')}</div>`;
  }

  if (step === 1) {
    return `${bar}<span class="mono form-kicker">02 / 04 — APPLICATION</span><h2 tabindex="-1">Décrivez votre<br>application.</h2><p class="form-intro">Tout est facultatif. Répondez à ce que vous connaissez, cochez « Je ne sais pas » pour le reste.</p>${applicationQuestions()}<div class="form-actions"><button type="button" data-prev>← Retour</button>${primary('Continuer', 'type="submit"')}</div>`;
  }

  if (step === 2) {
    return `${bar}<span class="mono form-kicker">03 / 04 — CONTACT</span><h2 tabindex="-1">Faisons connaissance.</h2><div class="quote-privacy" role="note"><span class="mono">VOS DONNÉES</span><p>Votre nom, votre adresse e-mail et votre entreprise servent à répondre à cette demande, et à rien d’autre. Aucune inscription à une liste de prospection n’est faite. Finalités, durée de conservation et droits : <a href="#/legal">mentions légales et confidentialité</a>.</p></div><p class="form-intro">Utilisez des coordonnées fictives pour tester ce parcours.</p><label for="name">Prénom et nom <span>*</span></label><input id="name" name="name" required maxlength="120" autocomplete="name" value="${escapeHTML(draft.name)}" placeholder="Camille Martin"><label for="company">Entreprise <span>(facultatif)</span></label><input id="company" name="company" maxlength="150" autocomplete="organization" value="${escapeHTML(draft.company)}" placeholder="Votre entreprise"><label for="email">Adresse e-mail professionnelle <span>*</span></label><input id="email" name="email" type="email" required maxlength="200" autocomplete="email" value="${escapeHTML(draft.email)}" placeholder="camille@example.com"><div class="form-actions"><button type="button" data-prev>← Retour</button>${primary('Vérifier la demande', 'type="submit"')}</div>`;
  }

  /* step === 3 : récapitulatif avant envoi */
  return `${bar}<span class="mono form-kicker">04 / 04 — RÉCAPITULATIF</span><h2 tabindex="-1">Vérifiez<br>votre demande.</h2>${recapBlocks()}<p class="small-note" style="margin-top:16px">Dans cette maquette, rien n’est réellement transmis à Maturat.</p><div class="form-actions"><button type="button" data-prev>← Modifier</button>${primary(draft.requestId ? 'Enregistrer les modifications' : 'Envoyer ma demande', 'type="submit"')}</div>`;
}
