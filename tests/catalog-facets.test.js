import test from 'node:test';
import assert from 'node:assert/strict';
import { createCatalog } from '../src/data/catalog.js';
import { filterProducts, hasActiveFilters } from '../src/data/queries.js';
import { productFacets, catalogFacetOptions } from '../src/data/catalog-facets.js';

test('les six critères se combinent sans élargir la sélection', () => {
  const catalog = createCatalog();
  const filters = { q: 'houdec', family: 'fam-01', supplier: 'sup-houdec',
    technology: 'Flotteur magnétique, lecture par volets', application: 'Cuves & stockage', signal: '4–20 mA' };
  assert.deepEqual(filterProducts(catalog, filters).map((p) => p.id), ['prd-001']);
  assert.equal(filterProducts(catalog, { ...filters, signal: 'Relais / TOR' }).length, 0);
});

test('une technologie de famille ne devient pas celle de toutes ses fiches', () => {
  assert.deepEqual(filterProducts(createCatalog(), { technology: 'Flotteur magnétique, lecture par volets' }).map((p) => p.id), ['prd-001']);
});

test('les variantes de sortie sont regroupées sans confondre entrée et sortie', () => {
  const catalog = createCatalog();
  assert.deepEqual(productFacets(catalog.products[8]).signal, ['4–20 mA', 'Impulsions']);
  assert.deepEqual(productFacets(catalog.products[3]).signal, []);
  assert.deepEqual(productFacets(catalog.products[13]).signal, []);
  assert.deepEqual(productFacets(catalog.products[5]).signal, ['Lecture locale', 'Sans alimentation']);
});

test('les facettes suivent les modifications et publications du catalogue vivant', () => {
  const catalog = createCatalog();
  catalog.products[0].specs.find((s) => s.label === 'Principe').value = 'Principe révisé';
  assert.ok(catalogFacetOptions(catalog).technology.includes('Principe révisé'));
  assert.ok(!catalogFacetOptions(catalog).technology.includes('Flotteur magnétique, lecture par volets'));
  catalog.products[0].published = false;
  assert.ok(!catalogFacetOptions(catalog).technology.includes('Principe révisé'));
});

test('les tags applications sont dérivés des usages courants, sans données copiées', () => {
  const product = createCatalog().products[0];
  assert.ok(productFacets(product).application.includes('Cuves & stockage'));
  product.uses = ['Intervention de maintenance sur réseau'];
  assert.deepEqual(productFacets(product).application, ['Pompes & réseaux', 'Maintenance terrain']);
});

test('chacun des nouveaux critères active l’état filtré', () => {
  for (const key of ['technology', 'application', 'signal']) assert.equal(hasActiveFilters({ [key]: 'valeur' }), true);
  assert.equal(hasActiveFilters({}), false);
});
