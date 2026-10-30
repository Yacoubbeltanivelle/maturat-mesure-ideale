import test from 'node:test';
import assert from 'node:assert/strict';
import { createCatalog } from '../src/data/catalog.js';
import { productsOfPrinciple } from '../src/data/queries.js';

test('les quatre familles demandées rattachent uniquement les fiches attestées', () => {
  const catalog = createCatalog();
  const expected = {
    'fam-01': { Radar: ['prd-016'], Hydrostatique: ['prd-002'], Flotteur: ['prd-001', 'prd-003'] },
    'fam-02': { PT100: ['prd-004'], Thermocouple: ['prd-005'], Bimétallique: ['prd-006'] },
    'fam-04': { Ultrasons: ['prd-010'], Électromagnétique: ['prd-009'], Coriolis: [] },
    'fam-07': { Raccords: ['prd-012'], Vannes: ['prd-011'], Manifold: ['prd-025'], Clapet: [], Détendeur: [] },
  };
  for (const [familyId, principles] of Object.entries(expected)) {
    for (const [principle, ids] of Object.entries(principles)) {
      assert.deepEqual(productsOfPrinciple(catalog, familyId, principle).map(p => p.id), ids, principle);
    }
  }
});

test('plusieurs fiches, masquage, renommage et changement de famille suivent le catalogue vivant', () => {
  const catalog = createCatalog();
  const radar = catalog.products.find((p) => p.id === 'prd-016');
  const second = { ...structuredClone(radar), id: 'test-radar', slug: 'test-radar', name: 'Autre sonde radar' };
  catalog.products.push(second);
  assert.equal(productsOfPrinciple(catalog, radar.familyId, 'Radar').length, 2);
  radar.published = false;
  second.name = 'Nom actualisé';
  const result = productsOfPrinciple(catalog, 'fam-01', 'Radar');
  assert.deepEqual(result.map(p => p.name), ['Nom actualisé']);
  assert.strictEqual(result[0], second);
  second.familyId = 'fam-02';
  assert.deepEqual(productsOfPrinciple(catalog, 'fam-01', 'Radar'), []);
});

test('un nom ou un usage radar ne remplace pas un principe Lame vibrante', () => {
  const catalog = createCatalog();
  catalog.products = [structuredClone(catalog.products[2])];
  catalog.products[0].specs.find((s) => s.label === 'Principe').value = 'Lame vibrante';
  catalog.products[0].name = 'Radar de démonstration';
  catalog.products[0].uses = ['Flotteur et radar'];
  assert.deepEqual(productsOfPrinciple(catalog, 'fam-01', 'Radar'), []);
  assert.deepEqual(productsOfPrinciple(catalog, 'fam-01', 'Flotteur'), []);
});

test('un raccord process ne classe pas une sonde dans les raccords', () => {
  const catalog = createCatalog();
  const radar = catalog.products.find((p) => p.id === 'prd-016');
  radar.familyId = 'fam-07';
  radar.specs.push({ label: 'Raccord process', value: 'Raccord à bague' });
  assert.deepEqual(productsOfPrinciple(catalog, 'fam-07', 'Raccords').map(p => p.id), ['prd-012']);
});

test('la correspondance ignore casse et accents, mais respecte les mots entiers', () => {
  const catalog = createCatalog();
  assert.equal(productsOfPrinciple(catalog, 'fam-04', 'ELECTROMAGNETIQUE').length, 1);
  const radar = catalog.products.find((p) => p.id === 'prd-016');
  radar.specs[0].value = 'Microradar expérimental';
  assert.deepEqual(productsOfPrinciple(catalog, 'fam-01', 'Radar'), []);
  radar.specs = [];
  assert.deepEqual(productsOfPrinciple(catalog, 'fam-01', 'Radar'), []);
});
