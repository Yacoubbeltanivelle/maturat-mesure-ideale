import { state } from '../state.js';
import { eyebrow } from '../ui/eyebrow.js';
import { primary, textButton } from '../ui/button.js';
import { dropoutImage, img, imageCredit } from '../ui/media.js';
import { productStage, dropCopy, stageTabs } from '../components/dropout-stage.js';
import '../styles/dropout.css';

/* Le moteur existant pilote les vues et les quatre étapes de cette page. */
export function dropout(){
  const scrollSync = state.scrollSync;
  return `<div class="dropout-page">
    <section class="drop-intro">
      <button class="back" data-page="home">← Accueil</button>
      <div class="drop-intro-grid">
        <div class="drop-hero-copy">
          ${eyebrow('TRAITEMENT DE L’AIR COMPRIMÉ')}
          <h1>Drop’out<span class="drop-period">.</span></h1>
          <h2>Retirer l’eau liquide<br>de votre air comprimé.</h2>
          <p>Un séparateur Dropout sépare l’eau liquide d’un réseau d’air comprimé et protège les organes pneumatiques et les instruments en aval. Il ne remplace pas un sécheur : la vapeur d’eau reste dans l’air.</p>
          <div class="intro-actions">${primary('Décrire mon besoin','data-need="Traitement d’air"')}${textButton('Explorer le fonctionnement','data-scroll="fonctionnement"')}</div>
        </div>
        <figure class="drop-hero-object">
          <span class="mono drop-object-index">MATURAT / DROPOUT</span>
          <div class="drop-object-orbit" aria-hidden="true"></div>
          ${dropoutImage('drop-hero-image')}
          <figcaption><span class="mono">SÉPARATION DE L’EAU LIQUIDE</span><span>Visuel fourni · amélioré pour la maquette</span></figcaption>
        </figure>
      </div>
    </section>
    <section class="drop-problem drop-section" aria-labelledby="drop-problem-title">
      <div class="drop-section-heading">${eyebrow('01 / LE PROBLÈME DANS LE FLUX')}<h2 id="drop-problem-title">Ce que l’air comprimé<br>peut transporter.</h2><p class="drop-limit">L’eau liquide se sépare. La vapeur d’eau reste dans l’air, et un séparateur ne la retire pas : c’est le rôle d’un sécheur.</p></div>
      <div class="drop-problem-flow"><div class="drop-flux-source"><strong>AIR COMPRIMÉ</strong><div><span>+ EAU LIQUIDE</span><span>+ VAPEUR D’EAU</span></div></div><span class="drop-flux-line" aria-hidden="true">→</span><div class="drop-flux-target">ÉQUIPEMENTS<br>EN AVAL</div></div>
      <figure class="drop-network-photo">${img(721, '', 'drop-network-img', true)}<figcaption>${imageCredit(721)}</figcaption></figure>
      <p class="drop-transition">Voyons ce qui se passe dans Dropout. <span aria-hidden="true">↓</span></p>
    </section>
    <section class="drop-experience cinematic" id="fonctionnement" aria-label="Explorer le fonctionnement de Dropout">
      <div class="drop-sticky"><div class="drop-workspace">
        <div class="drop-stage-shell">${productStage()}</div>
        <div class="drop-editorial">${eyebrow('02 / OBSERVER LE PRINCIPE')}<div class="drop-copy" aria-live="polite">${dropCopy()}</div>${stageTabs()}<button class="sync-button" aria-pressed="${scrollSync}" data-sync>Progression au scroll : ${scrollSync?'activée':'en pause'}</button><p class="small-note">Choisissez une étape ou explorez le schéma du flux.</p></div>
      </div><div class="scroll-track" aria-hidden="true"><span></span></div></div>
    </section>
    <section class="drop-protection drop-section" aria-labelledby="drop-protection-title">
      <div class="drop-section-heading">${eyebrow('03 / EN AVAL')}<h2 id="drop-protection-title">Protéger<br>ce qui vient après.</h2></div>
      <ol class="drop-protection-list"><li><span>01</span><h3>Organes pneumatiques</h3></li><li><span>02</span><h3>Instrumentation</h3></li><li><span>03</span><h3>Équipements en aval</h3></li></ol>
    </section>
    <section class="application-cta drop-section">
      <div>${eyebrow('04 / PRÉPARER L’APPLICATION')}<h2>Votre procédé<br>a ses particularités.</h2><p>Ces informations permettent de préparer l’étude de l’application.</p></div>
      <div><ul class="drop-application-data"><li>Fluide</li><li>Pression</li><li>Débit</li><li>Contraintes d’installation</li></ul><p class="small-note">Les performances se confirment pour chaque modèle et chaque application, sans taux annoncé ici. La maquette ne réalise aucun calcul de dimensionnement.</p>${primary('Décrire mon besoin','data-need="Traitement d’air"')}<a class="text-button" href="#/faq">Questions fréquentes <span aria-hidden="true">→</span></a></div>
    </section>
  </div>`;
}
