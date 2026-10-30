import test from 'node:test';
import assert from 'node:assert/strict';

import { createCatalog } from '../src/data/catalog.js';
import {
  familyBySlug, productBySlug, productsOfFamily, publishedProducts,
  filterProducts, suppliersInUse, productContext, productMatchesFamilyName,
} from '../src/data/queries.js';
import { parseRoute } from '../src/lib/route.js';

/* Ces tests couvrent les risques introduits par le lot catalogue :
 * les relations entre familles, fournisseurs et fiches ; l'analyse des adresses ;
 * et l'independance des copies utilisees par la remise a zero. */

const catalog = createCatalog();

test('chaque fiche pointe vers une famille et un fournisseur existants', () => {
  const familyIds = new Set(catalog.families.map((f) => f.id));
  const supplierIds = new Set(catalog.suppliers.map((s) => s.id));
  for (const product of catalog.products) {
    assert.ok(familyIds.has(product.familyId), `famille inconnue pour ${product.id}`);
    assert.ok(supplierIds.has(product.supplierId), `fournisseur inconnu pour ${product.id}`);
  }
});

test('identifiants et slugs restent uniques', () => {
  const collect = (list, key) => list.map((e) => e[key]);
  for (const [list, label] of [[catalog.families, 'familles'], [catalog.products, 'fiches'], [catalog.suppliers, 'fournisseurs']]) {
    assert.equal(new Set(collect(list, 'id')).size, list.length, `identifiants dupliques : ${label}`);
    assert.equal(new Set(collect(list, 'slug')).size, list.length, `slugs dupliques : ${label}`);
  }
});

test('les dix familles sont presentes et chacune porte au moins une fiche', () => {
  assert.equal(catalog.families.length, 10);
  for (const family of catalog.families) {
    assert.ok(productsOfFamily(catalog, family.id).length >= 1, `aucune fiche pour ${family.slug}`);
    assert.ok(family.slug && family.longName && family.intro, `famille incomplete : ${family.id}`);
    assert.ok(family.uses.length >= 1, `usages manquants : ${family.slug}`);
  }
});

test('le jeu de demonstration tient dans la fourchette annoncee', () => {
  const count = publishedProducts(catalog).length;
  assert.ok(count >= 20 && count <= 30, `nombre de fiches inattendu : ${count}`);
  for (const product of catalog.products) {
    assert.ok(product.specs.length >= 3, `caracteristiques trop courtes : ${product.slug}`);
    assert.ok(product.uses.length >= 1, `usages manquants : ${product.slug}`);
  }
});

test('plusieurs familles comptent plusieurs fiches, de quoi eprouver les filtres', () => {
  const multiple = catalog.families.filter((f) => productsOfFamily(catalog, f.id).length > 1);
  assert.ok(multiple.length >= 3, 'trop peu de familles a plusieurs fiches');
  assert.ok(suppliersInUse(catalog).length >= 3, 'trop peu de fournisseurs distincts');
});

test('recherche et filtres, seuls puis combines', () => {
  const all = filterProducts(catalog, {});
  assert.equal(all.length, publishedProducts(catalog).length);

  // La recherche ignore les accents et la casse.
  const accented = filterProducts(catalog, { q: 'DEBITMETRE' });
  assert.ok(accented.length >= 2);
  assert.ok(accented.every((p) => p.name.toLowerCase().includes('débitmètre')));

  // Une reference retrouve exactement sa fiche.
  assert.deepEqual(filterProducts(catalog, { q: 'nr-300' }).map((p) => p.slug), ['sonde-radar-nivelco-nr300']);

  // Filtre famille seul.
  const niveau = familyBySlug(catalog, 'niveau');
  const byFamily = filterProducts(catalog, { family: niveau.id });
  assert.equal(byFamily.length, productsOfFamily(catalog, niveau.id).length);

  // Filtres combines : recherche + famille + fournisseur.
  const radar = productBySlug(catalog, 'sonde-radar-nivelco-nr300');
  const combined = filterProducts(catalog, { q: 'radar', family: radar.familyId, supplier: radar.supplierId });
  assert.deepEqual(combined.map((p) => p.id), [radar.id]);

  // Combinaison volontairement vide : etat « aucun resultat ».
  const other = catalog.suppliers.find((s) => s.id !== radar.supplierId);
  assert.equal(filterProducts(catalog, { q: 'radar', supplier: other.id }).length, 0);
  assert.equal(filterProducts(catalog, { q: 'zzzz' }).length, 0);
});

test('les adresses connues et les anciennes adresses du laboratoire restent valides', () => {
  assert.deepEqual(parseRoute('', catalog), { page: 'home', slug: '' });
  assert.deepEqual(parseRoute('#/', catalog), { page: 'home', slug: '' });
  for (const page of ['home', 'dropout', 'quote', 'products']) {
    assert.deepEqual(parseRoute(`#/${page}`, catalog), { page, slug: '' });
    assert.deepEqual(parseRoute(`#E/${page}`, catalog), { page, slug: '' });
  }
  assert.equal(parseRoute('#A/home', catalog).page, 'home');
});

test('les pages editoriales ont leur propre adresse', () => {
  for (const page of ['about', 'faq', 'suppliers']) {
    assert.deepEqual(parseRoute(`#/${page}`, catalog), { page, slug: '' });
  }
  // Ajouter ces routes ne doit pas masquer le catalogue ni les fiches.
  assert.equal(parseRoute('#/products', catalog).page, 'products');
  assert.equal(parseRoute(`#/products/${catalog.products[0].slug}`, catalog).page, 'product');
});

test('familles et fiches ont leur propre adresse', () => {
  for (const family of catalog.families) {
    assert.deepEqual(parseRoute(`#/families/${family.slug}`, catalog), { page: 'family', slug: family.slug });
  }
  for (const product of catalog.products) {
    assert.deepEqual(parseRoute(`#/products/${product.slug}`, catalog), { page: 'product', slug: product.slug });
  }
  // Une adresse encodee reste lisible.
  assert.equal(parseRoute('#/families/temp%C3%A9rature', catalog).page, 'notfound');
  assert.equal(parseRoute('#/families/temperature', catalog).page, 'family');
});

test('une famille, une fiche ou une adresse inconnue mene a l etat introuvable', () => {
  assert.equal(parseRoute('#/families/inconnue', catalog).page, 'notfound');
  assert.equal(parseRoute('#/families', catalog).page, 'notfound');
  assert.equal(parseRoute('#/products/inconnue', catalog).page, 'notfound');
  assert.equal(parseRoute('#/nimporte-quoi', catalog).page, 'notfound');
  assert.equal(parseRoute('#/products/sonde-radar-nivelco-nr300/extra', catalog).page, 'product');
});

test('la demande garde le produit choisi et abandonne une association perimee', () => {
  const radar = productBySlug(catalog, 'sonde-radar-nivelco-nr300');
  const context = productContext(catalog, radar.id);
  assert.equal(context.family.slug, 'niveau');
  assert.ok(context.supplier.name);

  assert.equal(productMatchesFamilyName(catalog, radar.id, context.family.name), true);
  assert.equal(productMatchesFamilyName(catalog, radar.id, 'Température'), false);
  assert.equal(productMatchesFamilyName(catalog, radar.id, 'Traitement d’air'), false);
  assert.equal(productMatchesFamilyName(catalog, 'prd-inconnu', context.family.name), false);
  assert.equal(productContext(catalog, ''), null);
});

test('la remise a zero restaure une copie propre, tableaux et objets imbriques compris', () => {
  const live = createCatalog();
  live.products[0].name = 'Modifié par l’administration';
  live.products[0].specs[0].value = 'Valeur modifiée';
  live.products[0].uses.push('Usage ajouté');
  live.families[0].uses.length = 0;
  live.products.pop();
  live.suppliers[0].name = 'Renommé';

  const fresh = createCatalog();
  const reference = createCatalog();
  assert.deepEqual(fresh, reference);
  assert.notEqual(fresh.products[0].name, 'Modifié par l’administration');
  assert.notEqual(fresh.products[0].specs[0].value, 'Valeur modifiée');
  assert.ok(fresh.families[0].uses.length > 0);
  assert.equal(fresh.products.length, reference.products.length);
  assert.equal(fresh.suppliers[0].name, reference.suppliers[0].name);

  // Les identifiants et les rattachements survivent a la remise a zero.
  assert.deepEqual(fresh.products.map((p) => p.id), reference.products.map((p) => p.id));
  assert.deepEqual(fresh.products.map((p) => p.familyId), reference.products.map((p) => p.familyId));
  assert.deepEqual(fresh.products.map((p) => p.supplierId), reference.products.map((p) => p.supplierId));
});

test('aucune coordonnee reelle ni promesse commerciale dans les fiches', () => {
  const text = JSON.stringify(catalog);
  assert.doesNotMatch(text, /maturat\.fr|@maturat|\bprix\b|€|garanti/i);
  for (const supplier of catalog.suppliers) {
    assert.match(supplier.note, /exemple/i);
  }
});

/* Regle d'AGENTS.md qui n'est pas en discussion : tout visuel affiche porte une
 * attribution. Le choix de la licence des visuels de famille reste une decision
 * editoriale ouverte (visuels fabricants ou Creative Commons) : ce test ne la tranche
 * pas, il garantit seulement qu'aucun visuel ne s'affiche sans auteur ni licence. */
test('chaque visuel de famille affiche porte une attribution', async () => {
  const { IMAGE_ASSETS } = await import('../src/data/images.js');
  const illustrated = catalog.families.filter((f) => f.img != null);
  assert.ok(illustrated.length >= 4, 'les quatre grandeurs doivent rester illustrees');
  for (const family of illustrated) {
    const asset = IMAGE_ASSETS[family.img];
    assert.ok(asset, `visuel inconnu pour ${family.slug} : ${family.img}`);
    assert.ok(asset.author, `auteur manquant pour ${family.slug}`);
    assert.ok(asset.credit, `credit manquant pour ${family.slug}`);
    assert.ok(asset.license, `licence manquante pour ${family.slug}`);
    assert.ok(asset.source, `source manquante pour ${family.slug}`);
  }
});
