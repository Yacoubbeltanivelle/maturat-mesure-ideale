import { state, catalog } from '../state.js';
import { escapeHTML } from '../lib/dom.js';
import { productBySlug, familyById, supplierById, productsOfFamily } from '../data/queries.js';
import { hashForFamily } from '../lib/route.js';
import { eyebrow } from '../ui/eyebrow.js';
import { familyMark } from '../ui/family-mark.js';
import { primary } from '../ui/button.js';
import { breadcrumb } from '../components/breadcrumb.js';
import { productGrid } from '../components/product-card.js';
import { img, imageCredit, productVisualId } from '../ui/media.js';
import { notFound } from './not-found.js';

/** Nom de la fiche courante, pour le titre du document. */
export function productTitle() {
  return productBySlug(catalog, state.slug)?.name || 'Fiche introuvable';
}

function productVisual(family, entry) {
  const visual = productVisualId(entry, family);
  if (!visual) {
    return `<div class="product-visual-mark">${familyMark(family?.code, 'family-mark-product')}</div>
      <p class="product-visual-note">Repère graphique de famille.<br>Cette fiche fictive ne représente aucun appareil réel.</p>`;
  }
  return `<figure class="product-visual-photo">${img(visual, family.name)}
    <figcaption>${imageCredit(visual) ? `${imageCredit(visual)} · ` : ''}${entry.img ? 'Visuel d’illustration' : 'Illustration de famille'} · non contractuel</figcaption>
  </figure>`;
}

function keySpecs(entry) {
  return entry.specs.slice(0, 5);
}

export function product() {
  const entry = productBySlug(catalog, state.slug);
  if (!entry) return notFound();

  const family = familyById(catalog, entry.familyId);
  const supplier = supplierById(catalog, entry.supplierId);
  const related = family ? productsOfFamily(catalog, family.id).filter((item) => item.id !== entry.id).slice(0, 3) : [];
  const specs = keySpecs(entry);

  return `<div class="product-page">
    ${breadcrumb([
      { label: 'Accueil', href: '#/home' },
      { label: 'Produits', href: '#/products' },
      ...(family ? [{ label: family.name, href: hashForFamily(family.slug) }] : []),
      { label: entry.name },
    ])}

    <section class="product-hero" aria-labelledby="product-title">
      <div class="product-visual product-visual-stage">
        <div class="product-visual-meta mono"><span>${escapeHTML(entry.reference)}</span><span>${escapeHTML(family?.code ?? '—')} / ${escapeHTML(family?.name ?? 'FAMILLE')}</span></div>
        <div class="product-visual-grid" aria-hidden="true"></div>
        ${productVisual(family, entry)}
        <span class="product-visual-unit mono" aria-hidden="true">${escapeHTML(family?.unit ?? '')}</span>
      </div>
      <div class="product-hero-copy">
        ${eyebrow(`${escapeHTML(family?.code ?? '—')} — ${escapeHTML(family?.name ?? 'FAMILLE')}`)}
        <h1 id="product-title">${escapeHTML(entry.name)}</h1>
        <p class="product-summary">${escapeHTML(entry.summary)}</p>
        <dl class="product-identity">
          <div><dt>Référence</dt><dd class="mono">${escapeHTML(entry.reference)}</dd></div>
          <div><dt>Fournisseur</dt><dd>${escapeHTML(supplier?.name ?? 'Non renseigné')}</dd></div>
          <div><dt>Famille</dt><dd>${family ? `<a href="${hashForFamily(family.slug)}">${escapeHTML(family.name)}</a>` : 'Non rattachée'}</dd></div>
        </dl>
        <dl class="product-hero-specs" aria-label="Données clés">
          ${specs.slice(0, 3).map((spec) => `<div><dt>${escapeHTML(spec.label)}</dt><dd>${escapeHTML(spec.value)}</dd></div>`).join('')}
        </dl>
        ${primary('Demander cette référence', `data-need-product="${escapeHTML(entry.id)}"`)}
      </div>
    </section>

    <section class="product-key-data" aria-labelledby="product-key-data-title">
      <div><p class="product-section-label mono">02 — LECTURE RAPIDE</p><h2 id="product-key-data-title">Données clés</h2></div>
      <dl>${specs.map((spec) => `<div><dt>${escapeHTML(spec.label)}</dt><dd>${escapeHTML(spec.value)}</dd></div>`).join('')}</dl>
    </section>

    <p class="product-notice" role="note">Données d’exemple. La marque est réelle ; la référence et les caractéristiques ci-dessous sont inventées pour la maquette. Elles ne décrivent aucun produit commercialisé et n’engagent aucun fabricant.</p>

    <section class="product-body">
      <section class="product-uses" aria-labelledby="product-uses-title">
        <p class="product-section-label mono">03 — APPLICATIONS</p>
        <h2 id="product-uses-title">Où utiliser cette solution ?</h2>
        <ol class="product-uses-list">${entry.uses.map((u, index) => `<li><span class="mono" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span>${escapeHTML(u)}</span></li>`).join('')}</ol>
      </section>

      <section class="product-specs" aria-labelledby="product-specs-title">
        <p class="product-section-label mono">04 — SPÉCIFICATIONS</p>
        <h2 id="product-specs-title">Caractéristiques d’exemple</h2>
        <dl class="spec-list">${entry.specs.map((s) => `<div><dt>${escapeHTML(s.label)}</dt><dd>${escapeHTML(s.value)}</dd></div>`).join('')}</dl>
        <p class="small-note">Valeurs d’exemple. Aucune performance n’est garantie et aucun document technique n’accompagne cette fiche.</p>
      </section>
    </section>

    <section class="product-context" aria-labelledby="product-context-title">
      <p class="product-section-label mono">05 — CONTEXTE</p>
      <h2 id="product-context-title">Fournisseur &amp; contexte</h2>
      <dl>
        <div><dt>Fournisseur</dt><dd>${escapeHTML(supplier?.name ?? 'Non renseigné')}</dd></div>
        <div><dt>Famille</dt><dd>${family ? `<a href="${hashForFamily(family.slug)}">${escapeHTML(family.name)}</a>` : 'Non rattachée'}</dd></div>
        <div><dt>Principe</dt><dd>${escapeHTML(entry.specs[0]?.value ?? 'Non renseigné')}</dd></div>
        <div><dt>Référence</dt><dd class="mono">${escapeHTML(entry.reference)}</dd></div>
      </dl>
      <a class="text-button" href="#/suppliers">Voir les fournisseurs du catalogue <span aria-hidden="true">→</span></a>
    </section>

    ${related.length ? `<section class="product-related" aria-labelledby="product-related-title">
      <div class="product-related-heading"><div><p class="product-section-label mono">06 — MÊME FAMILLE</p><h2 id="product-related-title">Autres solutions de la famille</h2></div>${family ? `<a class="text-button" href="${hashForFamily(family.slug)}">Voir ${escapeHTML(family.name)} <span aria-hidden="true">→</span></a>` : ''}</div>
      ${productGrid(catalog, related, 'family')}
    </section>` : ''}

    <section class="product-request" aria-labelledby="product-request-title">
      <div><p class="product-section-label mono">07 — DEMANDE</p><h2 id="product-request-title">Cette fiche semble correspondre à votre application ?</h2></div>
      <div><p>Préparez les informations nécessaires au chiffrage en conservant cette référence dans votre demande.</p>${primary('Demander cette référence', `data-need-product="${escapeHTML(entry.id)}"`)}</div>
    </section>

  </div>`;
}
