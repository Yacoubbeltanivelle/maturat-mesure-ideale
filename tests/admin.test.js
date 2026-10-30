import test from 'node:test';
import assert from 'node:assert/strict';

import { createCatalog } from '../src/data/catalog.js';
import {
  productById, productBySlug, productByIdOrSlug, publishedProducts,
  productsOfFamily, filterProducts, suppliersInUse, searchAllProducts,
} from '../src/data/queries.js';
import { parseRoute, isAdminPage, hashForAdminProduct } from '../src/lib/route.js';
import { applyProductEdit, validateProductValues, productFormValues, catalogCounts } from '../src/simulation/catalog-actions.js';
import { state, catalog, resetSimulation } from '../src/state.js';

/* Ces tests couvrent la tranche verticale de l'administration simulee :
 * l'ecriture dans le catalogue vivant, ce que le site public en voit, le routage
 * de l'administration, et la remise a zero. Le catalogue source n'est jamais
 * modifie : c'est la garantie qui rend la remise a zero exacte. */

const RADAR = 'prd-001';

test('le formulaire part des valeurs de la fiche existante', () => {
  resetSimulation();
  const values = productFormValues(catalog, RADAR);
  const product = productById(catalog, RADAR);
  assert.deepEqual(values, {
    name: product.name,
    reference: product.reference,
    summary: product.summary,
    familyId: product.familyId,
    supplierId: product.supplierId,
    published: true,
  });
  assert.equal(productFormValues(catalog, 'prd-inexistant'), null);
});

test('une fiche se designe par son identifiant comme par son slug', () => {
  resetSimulation();
  const product = productById(catalog, RADAR);
  assert.equal(productByIdOrSlug(catalog, RADAR).id, RADAR);
  assert.equal(productByIdOrSlug(catalog, product.slug).id, RADAR);
  assert.equal(productByIdOrSlug(catalog, 'ni-l-un-ni-l-autre'), null);
});

test('modifier une fiche ecrit dans le catalogue vivant', () => {
  resetSimulation();
  const before = productById(catalog, RADAR);
  const result = applyProductEdit(catalog, RADAR, {
    ...productFormValues(catalog, RADAR),
    name: '  Sonde radar renommee  ',
    reference: 'NVX-R41',
    summary: 'Resume revu par l administration.',
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, {});

  const after = productById(catalog, RADAR);
  assert.equal(after.name, 'Sonde radar renommee', 'les espaces autour sont retires');
  assert.equal(after.reference, 'NVX-R41');
  assert.equal(after.summary, 'Resume revu par l administration.');
  // Identifiant et slug restent stables : les adresses ouvertes restent valides.
  assert.equal(after.id, before.id);
  assert.equal(after.slug, before.slug);
  // Ce que le formulaire ne touche pas ne bouge pas.
  assert.ok(after.specs.length >= 3);
  assert.ok(after.uses.length >= 1);
});

test('changer la famille deplace la fiche dans les listes publiques', () => {
  resetSimulation();
  const product = productById(catalog, RADAR);
  const from = product.familyId;
  const to = catalog.families.find((f) => f.id !== from).id;

  assert.ok(productsOfFamily(catalog, from).some((p) => p.id === RADAR));

  const result = applyProductEdit(catalog, RADAR, { ...productFormValues(catalog, RADAR), familyId: to });
  assert.equal(result.ok, true);

  assert.ok(!productsOfFamily(catalog, from).some((p) => p.id === RADAR), 'la fiche quitte son ancienne famille');
  assert.ok(productsOfFamily(catalog, to).some((p) => p.id === RADAR), 'la fiche rejoint la nouvelle famille');
  assert.equal(filterProducts(catalog, { family: to }).some((p) => p.id === RADAR), true);
});

test('changer le fournisseur suit dans le filtre par fournisseur', () => {
  resetSimulation();
  const from = productById(catalog, RADAR).supplierId;
  const to = catalog.suppliers.find((s) => s.id !== from).id;

  const result = applyProductEdit(catalog, RADAR, { ...productFormValues(catalog, RADAR), supplierId: to });
  assert.equal(result.ok, true);

  assert.equal(productById(catalog, RADAR).supplierId, to);
  assert.ok(!filterProducts(catalog, { supplier: from }).some((p) => p.id === RADAR));
  assert.ok(filterProducts(catalog, { supplier: to }).some((p) => p.id === RADAR));
});

test('une famille ou un fournisseur inconnu est refuse sans rien ecrire', () => {
  resetSimulation();
  const before = { ...productById(catalog, RADAR) };

  for (const wrong of [{ familyId: 'fam-inexistante' }, { supplierId: 'sup-inexistant' }]) {
    const result = applyProductEdit(catalog, RADAR, { ...productFormValues(catalog, RADAR), ...wrong, name: 'Ne doit pas passer' });
    assert.equal(result.ok, false);
    assert.equal(productById(catalog, RADAR).name, before.name, 'aucune ecriture partielle');
  }
});

test('les champs requis sont controles avant toute ecriture', () => {
  resetSimulation();
  const base = productFormValues(catalog, RADAR);
  const originalName = base.name;

  for (const empty of ['name', 'reference', 'summary']) {
    const errors = validateProductValues(catalog, { ...base, [empty]: '   ' });
    assert.ok(errors[empty], `le champ ${empty} doit etre signale comme requis`);

    const result = applyProductEdit(catalog, RADAR, { ...base, [empty]: '   ' });
    assert.equal(result.ok, false);
    assert.equal(productById(catalog, RADAR).name, originalName, 'une fiche refusee n est pas modifiee');
  }

  assert.deepEqual(validateProductValues(catalog, base), {}, 'les valeurs d origine sont valides');
});

test('modifier une fiche disparue est refuse proprement', () => {
  resetSimulation();
  const result = applyProductEdit(catalog, 'prd-inexistant', { name: 'X' });
  assert.equal(result.ok, false);
  assert.equal(result.product, null);
  assert.ok(result.errors.form);
});

test('masquer une fiche la retire du site public mais pas de l administration', () => {
  resetSimulation();
  const product = productById(catalog, RADAR);
  const slug = product.slug;

  const result = applyProductEdit(catalog, RADAR, { ...productFormValues(catalog, RADAR), published: false });
  assert.equal(result.ok, true);
  assert.equal(productById(catalog, RADAR).published, false);

  // Site public : listes, filtres et famille.
  assert.ok(!publishedProducts(catalog).some((p) => p.id === RADAR));
  assert.ok(!filterProducts(catalog, {}).some((p) => p.id === RADAR));
  assert.ok(!productsOfFamily(catalog, product.familyId).some((p) => p.id === RADAR));

  // Acces direct a la fiche masquee : etat introuvable, comme une fiche retiree.
  assert.equal(parseRoute(`#/products/${slug}`, catalog).page, 'notfound');

  // Administration : la fiche reste listee et modifiable.
  assert.ok(searchAllProducts(catalog, '').some((p) => p.id === RADAR));
  assert.equal(parseRoute(`#/admin/catalog/${RADAR}`, catalog).page, 'admin-product');
});

test('republier une fiche la ramene sur le site public', () => {
  resetSimulation();
  const slug = productById(catalog, RADAR).slug;

  applyProductEdit(catalog, RADAR, { ...productFormValues(catalog, RADAR), published: false });
  assert.equal(parseRoute(`#/products/${slug}`, catalog).page, 'notfound');

  applyProductEdit(catalog, RADAR, { ...productFormValues(catalog, RADAR), published: true });
  assert.ok(publishedProducts(catalog).some((p) => p.id === RADAR));
  assert.deepEqual(parseRoute(`#/products/${slug}`, catalog), { page: 'product', slug });
});

test('masquer les fiches d un fournisseur le retire des fournisseurs en service', () => {
  resetSimulation();
  const supplierId = productById(catalog, RADAR).supplierId;
  assert.ok(suppliersInUse(catalog).some((s) => s.id === supplierId));

  for (const product of catalog.products.filter((p) => p.supplierId === supplierId)) {
    applyProductEdit(catalog, product.id, { ...productFormValues(catalog, product.id), published: false });
  }
  assert.ok(!suppliersInUse(catalog).some((s) => s.id === supplierId));
});

test('la recherche de l administration porte aussi sur les fiches masquees', () => {
  resetSimulation();
  applyProductEdit(catalog, RADAR, { ...productFormValues(catalog, RADAR), published: false });

  const found = searchAllProducts(catalog, '810');
  assert.deepEqual(found.map((p) => p.id), [RADAR], 'la recherche retrouve la fiche masquee');
  assert.equal(filterProducts(catalog, { q: '810' }).length, 0, 'la recherche publique ne la retrouve pas');
  assert.equal(searchAllProducts(catalog, 'zzzz').length, 0);
  assert.equal(searchAllProducts(catalog, '').length, catalog.products.length);
});

test('les reperes du tableau de bord suivent le catalogue vivant', () => {
  resetSimulation();
  const before = catalogCounts(catalog);
  assert.equal(before.total, catalog.products.length);
  assert.equal(before.hidden, 0);
  assert.equal(before.published, before.total);
  assert.equal(before.families, catalog.families.length);
  assert.equal(before.suppliers, catalog.suppliers.length);

  applyProductEdit(catalog, RADAR, { ...productFormValues(catalog, RADAR), published: false });
  const after = catalogCounts(catalog);
  assert.equal(after.total, before.total, 'une fiche masquee reste au catalogue');
  assert.equal(after.hidden, 1);
  assert.equal(after.published, before.published - 1);
});

test('les adresses de l administration sont reconnues', () => {
  resetSimulation();
  const product = productById(catalog, RADAR);

  assert.deepEqual(parseRoute('#/admin', catalog), { page: 'admin', slug: '' });
  assert.deepEqual(parseRoute('#/admin/', catalog), { page: 'admin', slug: '' });
  assert.deepEqual(parseRoute('#/admin/catalog', catalog), { page: 'admin-catalog', slug: '' });
  assert.deepEqual(parseRoute('#/admin/catalog/', catalog), { page: 'admin-catalog', slug: '' });
  assert.deepEqual(parseRoute(`#/admin/catalog/${RADAR}`, catalog), { page: 'admin-product', slug: RADAR });
  assert.deepEqual(parseRoute(`#/admin/catalog/${product.slug}`, catalog), { page: 'admin-product', slug: product.slug });

  // L ancien prefixe du laboratoire reste accepte, comme pour le site.
  assert.equal(parseRoute('#E/admin/catalog', catalog).page, 'admin-catalog');

  // L adresse construite par l administration se relit elle-meme.
  assert.equal(parseRoute(hashForAdminProduct(RADAR), catalog).page, 'admin-product');
});

test('une adresse d administration invalide reste dans l administration', () => {
  resetSimulation();
  assert.equal(parseRoute('#/admin/inconnu', catalog).page, 'admin-notfound');
  assert.equal(parseRoute('#/admin/catalog/prd-inexistant', catalog).page, 'admin-notfound');
  assert.equal(parseRoute('#/admin/catalog/prd-inexistant', catalog).slug, 'prd-inexistant');

  // Une adresse inconnue hors administration garde l etat introuvable du site.
  assert.equal(parseRoute('#/nimporte-quoi', catalog).page, 'notfound');

  for (const page of ['admin', 'admin-catalog', 'admin-product', 'admin-notfound']) {
    assert.equal(isAdminPage(page), true);
  }
  for (const page of ['home', 'products', 'product', 'notfound']) {
    assert.equal(isAdminPage(page), false);
  }
});

test('la remise a zero restaure exactement les donnees d origine', () => {
  resetSimulation();
  const reference = createCatalog();

  applyProductEdit(catalog, RADAR, {
    name: 'Nom de demonstration',
    reference: 'ZZZ-000',
    summary: 'Resume de demonstration.',
    familyId: catalog.families.at(-1).id,
    supplierId: catalog.suppliers.at(-1).id,
    published: false,
  });
  applyProductEdit(catalog, 'prd-009', { ...productFormValues(catalog, 'prd-009'), published: false });
  state.adminSearch = 'radar';
  state.adminFeedback = { key: RADAR, status: 'saved' };

  resetSimulation();

  assert.deepEqual(catalog, reference, 'le catalogue vivant repart des donnees d origine');
  assert.equal(state.adminSearch, '', 'la recherche de l administration repart a zero');
  assert.equal(state.adminFeedback, null, 'le retour d enregistrement ne survit pas');
  assert.equal(parseRoute(`#/products/${reference.products[0].slug}`, catalog).page, 'product');
});

// ── Nouveaux tests : Demandes, Produit mis en avant ──────────────────────────

test('la route #/admin/requests est reconnue', () => {
  resetSimulation();
  assert.deepEqual(parseRoute('#/admin/requests', catalog), { page: 'admin-requests', slug: '' });
  assert.equal(isAdminPage('admin-requests'), true);
  // Une sous-adresse inconnue reste dans le dashboard, pas dans requests
  assert.equal(parseRoute('#/admin/requests/inconnu', catalog).page, 'admin-requests');
});

test('state.requests est vide apres reset', () => {
  resetSimulation();
  assert.deepEqual(state.requests, []);
});

test('une demande simulee peut etre lue sans mutation', () => {
  resetSimulation();
  state.requests.push({
    id: 'req-test-1', name: 'Jean Martin', company: 'Industrie SA',
    email: 'jean@industrie.fr', family: 'Niveau', productId: RADAR,
    application: 'Cuve acide', answers: { goal: 'Mesure continue', value1: '12' },
  });
  const snap = JSON.stringify(state.requests);
  const req = state.requests[0];
  // Accès en lecture à tous les champs
  void (req.name + req.company + req.email + req.family + req.productId + req.application);
  assert.equal(JSON.stringify(state.requests), snap, 'la lecture ne mute pas');
});

test('les reponses adaptatives conservent leurs valeurs', () => {
  resetSimulation();
  const answers = { goal: 'Mesure continue', environment: 'Cuve / réservoir', value1: '12' };
  state.requests.push({
    id: 'req-test-2', name: 'Test', email: 'test@test.fr',
    family: 'Niveau', productId: null, application: '',
    answers: { ...answers },
  });
  assert.equal(state.requests[0].answers.goal, 'Mesure continue');
  assert.equal(state.requests[0].answers.environment, 'Cuve / réservoir');
  assert.equal(state.requests[0].answers.value1, '12');
});

test('resetSimulation efface les demandes', () => {
  resetSimulation();
  state.requests.push({ id: 'r1', name: 'A', email: 'a@a.fr', family: 'Niveau', productId: null, application: '', answers: {} });
  state.requests.push({ id: 'r2', name: 'B', email: 'b@b.fr', family: 'Débit', productId: null, application: '', answers: {} });
  assert.equal(state.requests.length, 2);
  resetSimulation();
  assert.deepEqual(state.requests, []);
});

test('le changement de featuredProductId est reflete par l etat', () => {
  resetSimulation();
  const initial = state.featuredProductId;
  const other = catalog.products.find((p) => p.id !== initial);
  assert.ok(other, 'le catalogue contient au moins deux produits');
  state.featuredProductId = other.id;
  assert.equal(state.featuredProductId, other.id);
  assert.notEqual(state.featuredProductId, initial);
});

test('le reset remet le produit mis en avant d origine', () => {
  resetSimulation();
  const initial = state.featuredProductId;
  const other = catalog.products.find((p) => p.id !== initial);
  state.featuredProductId = other.id;
  assert.equal(state.featuredProductId, other.id);
  resetSimulation();
  assert.equal(state.featuredProductId, initial);
});

test('masquer la fiche mise en avant ne crash pas la simulation', () => {
  resetSimulation();
  const featuredId = state.featuredProductId;
  applyProductEdit(catalog, featuredId, { ...productFormValues(catalog, featuredId), published: false });
  assert.equal(productById(catalog, featuredId).published, false, 'la fiche est masquee');
  // L'id reste intact en état — featured-product.js retourne '' si masquée
  assert.equal(state.featuredProductId, featuredId, 'l id reste en etat');
  // Le reset restaure la publication
  resetSimulation();
  assert.equal(productById(catalog, featuredId).published !== false, true, 'le reset restaure la publication');
  assert.equal(state.featuredProductId, featuredId, 'le reset restaure l id d origine');
});

// ── Tests existants préservés ─────────────────────────────────────────────────

test('le catalogue source n est jamais modifie par l administration', () => {
  resetSimulation();
  const pristine = createCatalog();

  applyProductEdit(catalog, RADAR, {
    name: 'Ecriture dans la copie vivante',
    reference: 'MUT-001',
    summary: 'Cette modification ne doit pas atteindre la source.',
    familyId: catalog.families.at(-1).id,
    supplierId: catalog.suppliers.at(-1).id,
    published: false,
  });

  const fresh = createCatalog();
  assert.deepEqual(fresh, pristine, 'deux copies successives de la source restent identiques');
  assert.notEqual(productById(fresh, RADAR).name, 'Ecriture dans la copie vivante');
  assert.notEqual(productById(fresh, RADAR).reference, 'MUT-001');
  assert.equal(productById(fresh, RADAR).published, true);
  assert.ok(productBySlug(fresh, productById(catalog, RADAR).slug), 'le slug source est inchange');
});
