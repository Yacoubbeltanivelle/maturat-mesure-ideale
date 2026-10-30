import test from 'node:test';
import assert from 'node:assert/strict';
import { createCatalog } from '../src/data/catalog.js';
import { siteHeader } from '../src/components/site-header.js';

test('le header public contient tous les parcours et les 10 familles sans duplication', () => {
  const catalog = createCatalog();
  const html = siteHeader({ page: 'home' }, catalog);

  // Marque et retour accueil
  assert.ok(html.includes('href="#/home"'));
  assert.ok(html.includes('aria-label="Maturat Mesure, accueil"'));

  // Entrées desktop
  assert.ok(html.includes('sh-products-btn'));
  assert.ok(html.includes('id="sh-products-panel"'));
  assert.ok(html.includes('href="#/products"'));
  assert.ok(html.includes('Tout le catalogue'));

  const expectedFamilies = [
    'Niveau',
    'Température',
    'Pression',
    'Débit',
    'Contrôle du signal',
    'Traitement d’air',
    'Raccords inox et contrôle des fluides',
    'Échantillonnage et analyse liquide',
    'Smart connexion',
    'Produits associés',
  ];

  for (const name of expectedFamilies) {
    assert.ok(html.includes(name), `La famille ${name} doit être présente dans le header`);
  }

  // Autres rubriques
  assert.ok(html.includes('href="#/dropout"'));
  assert.ok(html.includes('href="#/suppliers"'));
  assert.ok(html.includes('href="#/about"'));
  assert.ok(html.includes('href="#/faq"'));
  assert.ok(html.includes('href="#/quote"'));

  // Bouton mobile explicite « Menu »
  assert.ok(html.includes('sh-menu-btn'));
  assert.ok(html.includes('>Menu<'));

  // Dialogue mobile accessible
  assert.ok(html.includes('id="sh-mobile-dialog"'));
  assert.ok(html.includes('sh-dialog-close'));
  assert.ok(html.includes('sh-mob-products'));
  assert.ok(html.includes('sh-mob-sub'));
});

test('les familles proviennent dynamiquement des données du catalogue', () => {
  const catalog = createCatalog();
  assert.equal(catalog.families.length, 10);

  const html = siteHeader({ page: 'products' }, catalog);
  for (const f of catalog.families) {
    assert.ok(html.includes(`#/families/${f.slug}`), `Le lien vers ${f.slug} doit être présent`);
    assert.ok(html.includes(f.name), `Le nom ${f.name} doit être présent`);
  }
});

test('aria-current cible Produits sur family/product/products mais pas sur suppliers', () => {
  const catalog = createCatalog();

  for (const page of ['products', 'family', 'product']) {
    const html = siteHeader({ page }, catalog);
    assert.match(html, /sh-products-btn sh-is-active/);
  }

  const suppliersHtml = siteHeader({ page: 'suppliers' }, catalog);
  assert.doesNotMatch(suppliersHtml, /sh-products-btn sh-is-active/);
  assert.match(suppliersHtml, /href="#\/suppliers" aria-current="page"/);

  const familyHtml = siteHeader({ page: 'family', slug: 'niveau' }, catalog);
  assert.match(familyHtml, /href="#\/families\/niveau" aria-current="page"/);

  const quoteHtml = siteHeader({ page: 'quote' }, catalog);
  assert.match(quoteHtml, /sh-cta-mini nav-action" aria-label="Décrire mon besoin" aria-current="page"/);
});
