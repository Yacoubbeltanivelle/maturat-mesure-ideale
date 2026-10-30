import test from 'node:test';
import assert from 'node:assert/strict';
import { createCatalog } from '../src/data/catalog.js';
import { answerItems, SKIP_LABEL } from '../src/data/quote-questions.js';
import { searchReferences, heroResultsHTML, HERO_SEARCH_LIMIT } from '../src/components/hero-search.js';
import { IMAGE_ASSETS, resolveImageId, hasImage } from '../src/data/images.js';
import { SECTORS, FAQ } from '../src/data/company.js';
import { SITE } from '../src/data/site.js';
import { draft, resetDraft, state } from '../src/state.js';

const catalog = createCatalog();

test('le catalogue compte six marques réelles et trois fabricants d’exemple', () => {
  const real = catalog.suppliers.filter((s) => s.real).map((s) => s.name);
  assert.deepEqual(real, ['Houdec Innovation', 'Fuji Electric', 'Ashcroft', 'Nivelco', 'Fitok', 'Dropout']);
  assert.equal(catalog.suppliers.filter((s) => /Fabricant d’exemple/.test(s.note)).length, 3);
});

test('chaque famille annexe porte deux fiches au moins et prd-001 est le Houdec 810', () => {
  for (const family of catalog.families.filter((f) => Number(f.code) > 4)) {
    assert.ok(catalog.products.filter((p) => p.familyId === family.id).length >= 2, family.slug);
  }
  const first = catalog.products.find((p) => p.id === 'prd-001');
  assert.equal(first.supplierId, 'sup-houdec');
  assert.match(first.name, /Houdec/);
  assert.equal(first.img, 202);
});

test('chaque image de fiche ou de famille se résout vers une image créditée', () => {
  const keys = [...catalog.products.map((p) => p.img), ...catalog.families.map((f) => f.img)].filter((k) => k != null);
  for (const key of keys) {
    const asset = IMAGE_ASSETS[resolveImageId(key)];
    assert.ok(asset?.credit && asset?.src, `image ${key}`);
  }
  assert.equal(hasImage(999999), false);
  assert.equal(resolveImageId(999999), 601);
});

test('la recherche de l’accueil limite à cinq résultats et propose la demande sans résultat', () => {
  assert.equal(searchReferences(catalog, 'Houdec 810')[0].id, 'prd-001');
  assert.ok(searchReferences(catalog, 'PT100').some((p) => p.id === 'prd-004'));
  assert.ok(searchReferences(catalog, 'mesure').length <= HERO_SEARCH_LIMIT);
  const none = heroResultsHTML(catalog, 'XZ-999');
  assert.match(none, /Aucune fiche pour « XZ-999 »/);
  assert.match(none, /data-quote-ref="XZ-999"/);
  assert.equal(heroResultsHTML(catalog, '   '), '');
});

test('la recherche de l’accueil comprend un problème décrit en mots et propose les deux portes sans résultat', () => {
  assert.ok(searchReferences(catalog, 'eau dans l’air comprimé').length > 0);
  const words = heroResultsHTML(catalog, 'capteur introuvable');
  assert.match(words, /data-quote-need="capteur introuvable"/);
  assert.ok(words.indexOf('data-quote-need') < words.indexOf('data-quote-ref'));
  const reference = heroResultsHTML(catalog, 'XZ-999');
  assert.ok(reference.indexOf('data-quote-ref') < reference.indexOf('data-quote-need'));
});

test('les réponses de la demande acceptent « Je ne sais pas » et restent facultatives', () => {
  assert.deepEqual(answerItems('Niveau', {}), []);
  const items = answerItems('Traitement d’air', { values_skip: true, goal: 'Réduire les condensats' });
  assert.deepEqual(items.map((i) => i.text), ['Réduire les condensats', SKIP_LABEL, SKIP_LABEL]);
  assert.equal(answerItems('Niveau', { value1: '12' })[0].text, '12 m');
  assert.ok(answerItems('Famille inconnue', { environment: 'Cuve' }).length === 1);
});

test('la remise à zéro du brouillon efface le mode, la référence et l’identifiant', () => {
  Object.assign(draft, { mode: 'reference', reference: 'Houdec 810', requestId: 'DM-2026-001' });
  resetDraft();
  assert.equal(draft.mode, '');
  assert.equal(draft.reference, '');
  assert.equal(draft.requestId, '');
  assert.equal(state.featuredProductId, 'prd-001');
});

test('secteurs, titre et textes respectent les décisions de contenu', () => {
  assert.deepEqual(SECTORS.map((s) => s.name), ['Chimie', 'Pétrochimie', 'Sidérurgie', 'Énergie', 'Agroalimentaire', 'Pharmacie']);
  assert.doesNotMatch(SITE.heading, /<em|<br/);
  assert.equal(SITE.contactCta.emphasis, undefined);
  assert.equal(FAQ.length, 6);
  const text = JSON.stringify([FAQ, catalog]);
  assert.doesNotMatch(text, /ATEX|SIL\b|certifi|exclusiv|zéro entretien|\d+ ?% ?d/i);
});
