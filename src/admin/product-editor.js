import { escapeHTML } from '../lib/dom.js';
import { state, catalog } from '../state.js';
import { productByIdOrSlug } from '../data/queries.js';
import { hashForProduct } from '../lib/route.js';
import { productFormValues } from '../simulation/catalog-actions.js';
import { adminShell, adminNotFound } from './admin-shell.js';

/* Édition d'une fiche existante. Le formulaire ne décide de rien : il affiche
 * des valeurs et renvoie des champs. La validation et l'écriture vivent dans
 * simulation/catalog-actions.js. */

const option = (value, label, selected) =>
  `<option value="${escapeHTML(value)}"${value === selected ? ' selected' : ''}>${escapeHTML(label)}</option>`;

function fieldError(errors, name) {
  if (!errors[name]) return '';
  return `<p class="adm-field-error" id="adm-error-${name}">${escapeHTML(errors[name])}</p>`;
}

const describedBy = (errors, name) => (errors[name] ? ` aria-invalid="true" aria-describedby="adm-error-${name}"` : '');

/* Retour du dernier enregistrement, s'il concerne bien cette fiche. La
 * comparaison porte sur l'identifiant : l'adresse, elle, accepte aussi le slug. */
function feedbackFor(id) {
  const feedback = state.adminFeedback;
  return feedback && feedback.key === id ? feedback : null;
}

function feedbackHTML(feedback, product) {
  if (!feedback) return `<div id="adm-feedback" class="adm-feedback" tabindex="-1" aria-live="polite" aria-atomic="true"></div>`;

  if (feedback.status === 'saved') {
    const link = product.published !== false
      ? ` <a href="${hashForProduct(product.slug)}">Voir sur le site <span aria-hidden="true">→</span></a>`
      : ' Cette fiche est masquée : elle n’apparaît plus sur le site public.';
    return `<div id="adm-feedback" class="adm-feedback adm-feedback--ok" tabindex="-1" aria-live="polite" aria-atomic="true">
      <p><strong>Fiche enregistrée.</strong> La modification est déjà visible partout dans cette démonstration.${link}</p>
    </div>`;
  }

  const list = Object.values(feedback.errors ?? {})
    .map((message) => `<li>${escapeHTML(message)}</li>`).join('');
  return `<div id="adm-feedback" class="adm-feedback adm-feedback--error" tabindex="-1" aria-live="polite" aria-atomic="true">
    <p><strong>La fiche n’a pas été enregistrée.</strong> Corrigez les points suivants :</p>
    <ul>${list}</ul>
  </div>`;
}

export function adminProductEditor() {
  const key = state.slug;
  const product = productByIdOrSlug(catalog, key);
  if (!product) return adminNotFound(key);

  const feedback = feedbackFor(product.id);
  const errors = feedback?.status === 'error' ? feedback.errors : {};
  // Après un refus de validation, on réaffiche ce que la personne avait saisi.
  const values = feedback?.status === 'error' ? feedback.values : productFormValues(catalog, key);

  const families = catalog.families
    .map((f) => option(f.id, `${f.code} — ${f.name}`, values.familyId)).join('');
  const suppliers = catalog.suppliers
    .map((s) => option(s.id, s.name, values.supplierId)).join('');

  const body = `<p class="adm-back"><a href="#/admin/catalog">← Retour au catalogue</a></p>

    ${feedbackHTML(feedback, product)}

    <form class="adm-card adm-form" data-admin-product="${escapeHTML(product.id)}" novalidate>
      <div class="adm-field">
        <label class="adm-label" for="adm-name">Nom de la fiche</label>
        <input id="adm-name" name="name" type="text" maxlength="120" required
          value="${escapeHTML(values.name)}"${describedBy(errors, 'name')}>
        ${fieldError(errors, 'name')}
      </div>

      <div class="adm-field">
        <label class="adm-label" for="adm-reference">Référence</label>
        <input id="adm-reference" name="reference" type="text" maxlength="60" required
          class="mono-input" value="${escapeHTML(values.reference)}"${describedBy(errors, 'reference')}>
        ${fieldError(errors, 'reference')}
      </div>

      <div class="adm-field">
        <label class="adm-label" for="adm-summary">Résumé</label>
        <textarea id="adm-summary" name="summary" rows="3" maxlength="400" required
          ${describedBy(errors, 'summary')}>${escapeHTML(values.summary)}</textarea>
        <p class="adm-field-hint">Phrase affichée sous le nom, dans le catalogue et sur la fiche publique.</p>
        ${fieldError(errors, 'summary')}
      </div>

      <div class="adm-field-pair">
        <div class="adm-field">
          <label class="adm-label" for="adm-familyId">Famille</label>
          <select id="adm-familyId" name="familyId"${describedBy(errors, 'familyId')}>${families}</select>
          ${fieldError(errors, 'familyId')}
        </div>
        <div class="adm-field">
          <label class="adm-label" for="adm-supplierId">Fournisseur</label>
          <select id="adm-supplierId" name="supplierId"${describedBy(errors, 'supplierId')}>${suppliers}</select>
          ${fieldError(errors, 'supplierId')}
        </div>
      </div>

      <div class="adm-field adm-field--check">
        <label class="adm-check" for="adm-published">
          <input id="adm-published" name="published" type="checkbox"${values.published ? ' checked' : ''}>
          <span>Publiée sur le site</span>
        </label>
        <p class="adm-field-hint">Décochez pour retirer la fiche du catalogue public. Elle reste
          listée et modifiable ici, et son adresse publique mène à la page « introuvable ».</p>
      </div>

      <div class="adm-form-actions">
        <button type="submit" class="adm-button adm-button--primary">Enregistrer</button>
        <a class="adm-button" href="#/admin/catalog">Annuler</a>
      </div>
    </form>

    <p class="adm-card-note">L’identifiant <span class="mono">${escapeHTML(product.id)}</span> et
      l’adresse <span class="mono">${escapeHTML(product.slug)}</span> ne sont pas modifiables dans
      cette version : les liens déjà ouverts restent valides.</p>`;

  return adminShell({
    page: 'admin-product',
    title: product.name,
    intro: 'Modifier une fiche existante. L’enregistrement s’applique immédiatement au site public.',
    body,
  });
}

/** Nom de la fiche en cours d'édition, pour le titre du document. */
export function adminProductTitle() {
  return productByIdOrSlug(catalog, state.slug)?.name || 'Fiche introuvable';
}
