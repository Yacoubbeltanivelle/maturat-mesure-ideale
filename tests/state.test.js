import test from 'node:test';
import assert from 'node:assert/strict';

import { state, draft, catalog, resetSimulation, resetQuoteRequest, DRAFT_DEFAULTS } from '../src/state.js';
import { productBySlug } from '../src/data/queries.js';
import { parseRoute } from '../src/lib/route.js';

/* Regle commune de remise a zero : le bouton « Recommencer », le rechargement et le
 * retour bfcache repartent de la meme simulation propre. Ces tests fixent l'etendue
 * de cette remise a zero, y compris les filtres du catalogue. */

test('la remise a zero couvre le brouillon, la fiche retenue et les filtres', () => {
  const radar = productBySlug(catalog, 'sonde-radar-nivelco-nr300');

  // Une simulation en cours : recherche, filtres, brouillon, fiche et etapes.
  Object.assign(state.catalogFilters, { q: 'radar', family: radar.familyId, supplier: radar.supplierId,
    technology: 'Radar sans contact', application: 'Cuves & stockage', signal: '4–20 mA' });
  Object.assign(draft, { application: 'Demande en cours', product: radar.id, family: 'Niveau', name: 'Camille' });
  state.step = 2;
  state.done = true;
  state.family = 0;
  state.dropStep = 3;
  state.cut = true;
  state.scrollSync = false;

  resetSimulation();

  assert.deepEqual(state.catalogFilters, { q: '', family: '', supplier: '', technology: '', application: '', signal: '' }, 'les six filtres doivent repartir a zero');
  assert.equal(draft.product, '', 'la fiche retenue doit etre oubliee');
  assert.equal(draft.application, '');
  assert.equal(draft.name, '');
  assert.equal(draft.family, DRAFT_DEFAULTS.family);
  assert.equal(state.step, 0);
  assert.equal(state.done, false);
  assert.equal(state.dropStep, 0);
  assert.equal(state.cut, false);
  assert.equal(state.scrollSync, true);
});

test('la remise a zero rend un catalogue propre sans casser les rattachements', () => {
  const before = catalog.products.map((p) => `${p.id}|${p.familyId}|${p.supplierId}`);
  catalog.products[0].name = 'Modifié par l’administration';
  catalog.products[0].specs[0].value = 'Valeur modifiée';
  catalog.products.pop();

  resetSimulation();

  assert.equal(catalog.products.length, before.length, 'toutes les fiches doivent revenir');
  assert.deepEqual(catalog.products.map((p) => `${p.id}|${p.familyId}|${p.supplierId}`), before);
  assert.notEqual(catalog.products[0].name, 'Modifié par l’administration');
  assert.notEqual(catalog.products[0].specs[0].value, 'Valeur modifiée');
});

test('les filtres restent des objets independants entre deux remises a zero', () => {
  const first = state.catalogFilters;
  resetSimulation();
  first.q = 'trace laissée sur l’ancien objet';
  assert.equal(state.catalogFilters.q, '', 'l’ancien objet de filtres ne doit plus etre partage');
});

/* Le bouton « Recommencer » de Quote doit permettre une nouvelle demande sans
 * toucher au reste de la simulation (catalogue, demandes, produit vedette) :
 * seul resetSimulation (reset Admin, rechargement, bfcache) a cette portee. */
test('resetQuoteRequest prepare une nouvelle demande sans toucher au reste de la simulation', () => {
  resetSimulation();
  const radar = productBySlug(catalog, 'sonde-radar-nivelco-nr300');

  Object.assign(draft, { application: 'Demande en cours', product: radar.id, family: 'Niveau', name: 'Camille', company: 'ACME', email: 'c@acme.fr' });
  draft.answers = { goal: 'Mesure continue' };
  state.step = 3;
  state.done = true;
  state.requests.push({ id: 'req-1', name: 'Camille', email: 'c@acme.fr', family: 'Niveau', productId: radar.id, application: 'Demande en cours', answers: {} });
  state.featuredProductId = catalog.products.find((p) => p.id !== state.featuredProductId).id;
  catalog.products[0].name = 'Modifie par admin';
  const featuredBefore = state.featuredProductId;
  const productNameBefore = catalog.products[0].name;

  resetQuoteRequest();

  assert.deepEqual(draft, { ...DRAFT_DEFAULTS, answers: {} }, 'le brouillon repart a zero, pret pour une nouvelle demande');
  assert.equal(state.step, 0);
  assert.equal(state.done, false);
  assert.equal(state.requests.length, 1, 'la demande deja soumise reste enregistree');
  assert.equal(state.requests[0].name, 'Camille');
  assert.equal(state.featuredProductId, featuredBefore, 'le produit mis en avant n est pas touche');
  assert.equal(catalog.products[0].name, productNameBefore, 'les mutations du catalogue restent en place');
});

/* Cause de l'ecart sur « Aller au contenu » : une ancre de la coque n'est pas une
 * route. Le routeur doit continuer a le dire, et main.js a intercepter ce lien. */
test('une ancre interne de la coque n est pas une route', () => {
  assert.equal(parseRoute('#main', catalog).page, 'notfound');
  assert.equal(parseRoute('#/main', catalog).page, 'notfound');
});
