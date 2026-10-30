import { SITE } from '../data/site.js';
import { escapeHTML } from '../lib/dom.js';
import { eyebrow } from '../ui/eyebrow.js';

export function legal() {
  const { contact } = SITE;
  const email = escapeHTML(contact.email);

  return `<div class="editorial-page v2-editorial v2-legal-page">
    <section class="editorial-intro" aria-labelledby="legal-title">
      <a class="editorial-back mono" href="#/home">← ACCUEIL</a>
      <div class="editorial-intro-grid">
        <div>${eyebrow('INFORMATIONS DU SITE')}<h1 id="legal-title">Informations légales et confidentialité</h1></div>
        <div class="editorial-intro-copy"><p>Cette page décrit l’éditeur de la maquette et le traitement simulé des demandes.</p></div>
      </div>
    </section>

    <section class="editorial-section" aria-labelledby="publisher-title">
      <div class="editorial-section-heading"><div>${eyebrow('01 / ÉDITEUR')}<h2 id="publisher-title">Éditeur et publication</h2></div></div>
      <div class="v2-legal-grid">
        <div><h3>Éditeur</h3><p>${escapeHTML(SITE.name)}, SARL au capital de [exemple].</p><p>RCS [exemple] · SIRET [exemple].</p><address>${escapeHTML(contact.street)}<br>${escapeHTML(contact.city)}<br>${escapeHTML(contact.phone)}<br><a href="mailto:${email}">${email}</a></address></div>
        <div><h3>Directeur de la publication</h3><p>Le gérant (nom à compléter).</p><h3>Hébergeur</h3><p>À compléter.</p></div>
      </div>
    </section>

    <section class="editorial-section" aria-labelledby="rights-title">
      <div class="editorial-section-heading"><div>${eyebrow('02 / CONTENUS')}<h2 id="rights-title">Propriété intellectuelle</h2></div></div>
      <div class="v2-copy"><p>Les marques citées appartiennent à leurs titulaires. Les crédits et les sources des visuels sont indiqués dans la fenêtre Crédits visuels accessible en pied de page.</p></div>
    </section>

    <section class="editorial-section" aria-labelledby="privacy-title">
      <div class="editorial-section-heading"><div>${eyebrow('03 / CONFIDENTIALITÉ')}<h2 id="privacy-title">Formulaire de demande</h2></div><p>Dans cette maquette, le formulaire ne transmet aucune donnée.</p></div>
      <dl class="v2-data-list">
        <div><dt>Données collectées</dt><dd>Nom, e-mail, entreprise, téléphone facultatif, message et contexte produit.</dd></div>
        <div><dt>Finalité</dt><dd>Répondre à la demande et établir un chiffrage.</dd></div>
        <div><dt>Base légale</dt><dd>Mesures précontractuelles prises à la demande de la personne.</dd></div>
        <div><dt>Destinataires</dt><dd>Équipe commerciale de ${escapeHTML(SITE.name)}.</dd></div>
        <div><dt>Durée de conservation</dt><dd>Exemple : trois ans après le dernier échange.</dd></div>
      </dl>
      <div class="v2-copy v2-rights-copy">
        <h3>Vos droits</h3>
        <p>Vous pouvez demander l’accès, la rectification, l’effacement, l’opposition ou la limitation du traitement. Écrivez à <a href="mailto:${email}">${email}</a>. Vous pouvez aussi adresser une réclamation à la CNIL.</p>
        <p>Aucune prospection n’est réalisée sans accord séparé. Cette maquette ne dépose aucun cookie de mesure d’audience.</p>
      </div>
    </section>
  </div>`;
}
