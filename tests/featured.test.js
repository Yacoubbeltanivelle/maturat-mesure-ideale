import test from 'node:test';
import assert from 'node:assert/strict';

import { createCatalog } from '../src/data/catalog.js';
import { productById, publishedProducts } from '../src/data/queries.js';
import { state, catalog as liveCatalog, resetSimulation } from '../src/state.js';

const catalog = createCatalog();

/* 1. Le produit du moment initial est defini et existe dans le catalogue. */
test('featuredProductId initial est defini dans l’etat', () => {
  resetSimulation();
  assert.ok(state.featuredProductId, 'featuredProductId ne doit pas etre vide apres remise a zero');
});

/* 2. Il correspond a un produit publie valide. */
test('le produit du moment initial est un produit valide et publie', () => {
  resetSimulation();
  const product = productById(catalog, state.featuredProductId);
  assert.ok(product, `aucun produit pour l’identifiant initial : ${state.featuredProductId}`);
  assert.ok(product.published !== false, 'le produit du moment initial doit etre publie');
});

/* 3. Le changement de featuredProductId est applique immediatement. */
test('modifier featuredProductId change le produit du moment', () => {
  resetSimulation();
  const initial = state.featuredProductId;
  const other = publishedProducts(catalog).find((p) => p.id !== initial);
  assert.ok(other, 'il doit exister au moins un second produit publie');
  state.featuredProductId = other.id;
  assert.equal(state.featuredProductId, other.id);
});

/* 4. resetSimulation() restaure le produit initial. */
test('resetSimulation restaure le featuredProductId initial', () => {
  const other = publishedProducts(catalog).find((p) => p.id !== 'prd-001');
  state.featuredProductId = other?.id ?? 'prd-002';
  resetSimulation();
  assert.equal(state.featuredProductId, 'prd-001', 'la remise a zero doit restaurer prd-001');
});

/* 5. Un produit non publie doit etre exclu de publishedProducts(). */
test('publishedProducts exclut les fiches marquees published:false', () => {
  const withUnpublished = createCatalog();
  const target = withUnpublished.products[0];
  target.published = false;
  const published = publishedProducts(withUnpublished);
  assert.ok(
    !published.find((p) => p.id === target.id),
    'un produit marque published:false ne doit pas apparaitre dans publishedProducts'
  );
});

/* 6. Les requetes existantes restent fonctionnelles apres ajout de featuredProductId. */
test('les requetes du catalogue fonctionnent apres remise a zero', () => {
  resetSimulation();
  const all = publishedProducts(catalog);
  assert.ok(all.length >= 12, 'le catalogue doit rester complet apres remise a zero');
  const found = productById(catalog, state.featuredProductId);
  assert.ok(found, 'productById doit retrouver le produit du moment dans le catalogue');
});

/* 7. Depublier une fiche la retire de publishedProducts (Admin V1). */
test('depublier une fiche la retire de publishedProducts', () => {
  resetSimulation();
  const target = liveCatalog.products[0];
  const id = target.id;
  assert.ok(target.published !== false, 'le produit doit etre publie avant toggle');
  target.published = false;
  const published = publishedProducts(liveCatalog);
  assert.ok(!published.find((p) => p.id === id), 'le produit depublie ne doit plus apparaitre dans publishedProducts');
});

/* 8. Republier une fiche la reintegre dans publishedProducts (Admin V1). */
test('republier une fiche la reintegre dans publishedProducts', () => {
  resetSimulation();
  const target = liveCatalog.products[0];
  const id = target.id;
  target.published = false;
  target.published = true;
  const published = publishedProducts(liveCatalog);
  assert.ok(published.find((p) => p.id === id), 'le produit republier doit reapparaitre dans publishedProducts');
});

/* 9. Modifier le nom et le resume d'une fiche les reflète dans le catalogue (Admin V2). */
test('modifier nom et resume les reflete dans le catalogue', () => {
  resetSimulation();
  const target = liveCatalog.products[0];
  target.name = 'Nom modifie';
  target.summary = 'Resume modifie';
  const found = productById(liveCatalog, target.id);
  assert.equal(found.name, 'Nom modifie');
  assert.equal(found.summary, 'Resume modifie');
});

/* 11. Les demandes simulees demarrent vides et se stockent dans l etat. */
test('state.requests demarre vide et accepte une demande', () => {
  resetSimulation();
  assert.ok(Array.isArray(state.requests), 'state.requests doit etre un tableau');
  assert.equal(state.requests.length, 0, 'aucune demande apres remise a zero');
  state.requests.push({
    id: 'req-test', date: '12/09/2026 14:30', status: 'new',
    name: 'Client test', company: 'Usine test', email: 'test@example.com',
    family: 'Pression', productId: 'prd-001', application: 'Besoin de demonstration',
  });
  assert.equal(state.requests.length, 1);
  assert.equal(state.requests[0].status, 'new');
});

/* 12. resetSimulation() efface les demandes simulees. */
test('resetSimulation efface les demandes simulees', () => {
  state.requests.push({
    id: 'req-a-effacer', date: '', status: 'new',
    name: '', company: '', email: '', family: '', productId: '', application: '',
  });
  resetSimulation();
  assert.equal(state.requests.length, 0, 'les demandes doivent disparaitre apres remise a zero');
});

/* 10. resetSimulation() restaure le nom et le resume originaux. */
test('resetSimulation restaure les donnees originales du catalogue', () => {
  const original = createCatalog();
  const first = original.products[0];
  liveCatalog.products[0].name = 'Nom temporaire';
  liveCatalog.products[0].summary = 'Resume temporaire';
  liveCatalog.products[0].published = false;
  resetSimulation();
  const restored = productById(liveCatalog, first.id);
  assert.ok(restored, 'le produit doit exister apres remise a zero');
  assert.equal(restored.name, first.name, 'le nom doit etre restaure');
  assert.equal(restored.summary, first.summary, 'le resume doit etre restaure');
  assert.ok(restored.published !== false, 'le statut publie doit etre restaure');
});
