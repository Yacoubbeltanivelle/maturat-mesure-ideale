# Reprise

## Retour client — dernière correction

L'accueil commence par les quatre familles de mesure à parts égales sur le fond bleu
animé. Dropout reste accessible dans la navigation et dans sa section dédiée après
l'instrumentation. Les visuels niveau et débit sont remplacés partout par Houdec
Innovation type 810 et Fuji Electric S-Flow, avec attribution fabricant (voir ASSETS.md).
Les coordonnées de la signature client ne sont pas reprises.

Le catalogue local enrichi a été conservé : sept familles et quinze fiches fictives,
recherche, filtres et contexte produit dans la demande. Build et 17 tests automatisés
réussis ; les 22 pages famille/fiche, le chargement des images, la recherche et son état
vide, le formulaire jusqu'à confirmation et le reset bfcache simulé ont été vérifiés
dans Chromium. Aucun débordement horizontal sur ces pages à 390 px.

## Ce qui vient d'être fait — lot « migration Vite »

La maquette statique est devenue un projet Vite en modules, sans changement de design.

- `dist/` n'est plus une source : c'est la sortie de `npm run build`, et il est
  désormais dans `.gitignore`.
- L'ancien `app.js` de 29 Ko est découpé en composants sous `src/`.
- Le bandeau du laboratoire de design a été retiré : barre sombre du haut, sélecteur
  de directions A à E, carnet « Direction & crédits », mention « Exploration de design ».
  Seule Atmospheric Precision est accessible ; des styles historiques restent présents.
- Les crédits photo restent obligatoires (licences Creative Commons) : ils sont
  désormais dans la fiche « Crédits visuels », ouverte depuis le pied de page.
- Le réglage « Mouvement » a suivi, du bandeau vers le pied de page.
- Les anciennes adresses `#E/home` fonctionnent toujours, comme `#/home`.
- Correction au passage : chaque changement d'ancre ajoutait un écouteur
  `prefers-reduced-motion` qui n'était jamais retiré. Il n'y en a plus qu'un.

## Finalisation de la migration

- Le workflow GitHub Pages prépare Node 22, exécute `npm ci` puis `npm run build`
  avant de publier `dist/`.
- `dist/` est retiré du suivi Git ; les ressources sources sont dans `public/`
  et `package-lock.json` accompagne les sources Vite.
- Au retour bfcache (`pageshow` avec `persisted`), le brouillon, les sélections et
  les étapes sont réinitialisés. La route courante est conservée, les crédits
  sont fermés et l'affichage est reconstruit. Aucun reset au changement d'onglet.
- Le fichier `.claude/launch.json`, propre au PC, reste hors du dépôt.

Avant une publication : vérifier `npm ci`, `npm run build`, les parcours et le reset,
puis contrôler le déploiement GitHub Actions après le push.

Vérifications locales du 12 septembre 2026 : installation et build réussis ; reset
complet de l'état testé ; parcours du formulaire jusqu'à la confirmation et bouton
« Recommencer » vérifiés dans Chromium. L'événement `pageshow` avec `persisted: true`
a été simulé dans le navigateur : brouillon effacé, première étape restaurée,
route conservée, crédits fermés et halo nettoyé. La navigation entre pages et les
événements de visibilité/focus conservent les saisies ; le rechargement les efface.
Une restauration réelle du cache navigateur n'a pas été testée. Le déploiement
GitHub Actions reste à vérifier après publication.

## Lot « catalogue public » — pages par famille et fiches produits

La page Produits est devenue un vrai catalogue.

- `#/products` liste les sept familles, puis une zone « toutes les fiches » avec
  recherche textuelle, filtre par famille, filtre par fournisseur, compteur, état
  sans résultat et effacement des filtres. Tout se met à jour dans la page : pas de
  rechargement, pas d'appel réseau, aucune dépendance ajoutée.
- `#/families/<slug>` : nom, introduction, usages principaux, fiches rattachées,
  retour au catalogue et accès à la demande préremplie.
- `#/products/<slug>` : fil d'Ariane, nom, famille, fournisseur, visuel, description,
  usages, caractéristiques, bouton de demande et retour vers la famille.
- Une famille, une fiche ou une adresse inconnue affiche un état introuvable propre.
  `#E/home`, `#E/dropout` et `#E/quote` fonctionnent toujours ; les préfixes `#A/` à
  `#D/` du laboratoire sont acceptés de la même façon.
- Depuis l'accueil, les pages de famille sont accessibles par l'inspecteur des quatre
  cartes et par le lien « Voir tout le catalogue ». Les cartes restent des boutons :
  aucun lien n'est imbriqué à l'intérieur, et l'inspecteur fonctionne comme avant.
- Depuis une fiche, la demande conserve le produit et sa famille. Le texte libre du
  visiteur n'est jamais écrasé. Changer de fiche remplace le contexte ; changer de
  famille dans le formulaire retire une association devenue incohérente.
- Dropout garde sa place à part : page dédiée, section propre sur le catalogue,
  et aucune caractéristique inventée.

### Données

`src/data/catalog.js` décrit sept familles, cinq fournisseurs et quinze fiches, avec
identifiants stables, slugs et relations. `createCatalog()` en renvoie une copie profonde ;
`src/state.js` en garde la copie vivante que l'administration simulée modifiera plus tard
dans le même onglet, et `resetSimulation()` la remplace par une copie propre.

Les familles et Dropout sont réels. Les quinze fiches, leurs références, leurs
fournisseurs et leurs caractéristiques sont **inventés**, et chaque page le dit. Aucune
certification, performance garantie, disponibilité, tarif ni document téléchargeable.
Les fiches n'affichent pas de photographie : un repère au trait, propre à chaque famille,
évite d'attribuer un visuel réel à une référence fictive.

### Corrections après la vérification de Codex

Trois écarts de fonctionnement relevés par Codex ont été reproduits, corrigés et couverts
par des contrôles automatisés.

1. **« Aller au contenu » au clavier.** L'ancre `#main` de la coque était lue comme une
   adresse : Tab puis Entrée affichait « Page introuvable ». `main.js` intercepte
   désormais ce lien, déplace le focus vers le contenu et ne touche ni à l'ancre ni à
   l'historique. Un test fixe la cause : une ancre interne n'est pas une route.
2. **« Recommencer » remet toute la simulation à zéro.** Le bouton n'effaçait que le
   formulaire ; la recherche et les filtres du catalogue survivaient. Il applique
   maintenant la même remise à zéro que le rechargement et le retour bfcache — brouillon,
   fiche retenue, étapes, sélections, halo et filtres — en conservant la route courante.
   La réduction du mouvement, qui est une préférence d'accessibilité et non un état de
   simulation, survit volontairement au bouton.
3. **Retour navigateur : champ et récapitulatif réalignés.** Lors d'un retour arrière qui
   recharge le document, Chromium réinjecte les valeurs saisies dans les champs alors que
   le brouillon est reparti à zéro : le champ affichait un texte que le récapitulatif ne
   connaissait plus. `pageshow` sans `persisted` réaligne les contrôles sur le brouillon,
   seule source de vérité. Le comportement « aucun reset au changement d'onglet » est
   inchangé et toujours vérifié.

### Décision à prendre : licence des visuels de famille

Codex a relevé que les crédits des visuels fabricants indiquent « droits réservés », alors
qu'AGENTS.md affirme que les photographies sont sous licence Creative Commons, et que
l'attribution seule ne vaut pas autorisation de réutilisation. **Cette décision n'a pas
été tranchée ici** : elle est éditoriale et le README documente le choix inverse
(« les visuels Houdec/Fuji restent propres aux pages du catalogue »).

État constaté : l'accueil affiche quatre photographies Creative Commons ; le catalogue et
les pages `#/families/niveau` et `#/families/debit` affichent les visuels fabricants
Houdec type 810 et Fuji Electric S-Flow, crédités « droits réservés ». Les autres familles
(pression, température) sont sous Creative Commons partout.

Si l'alignement sur Creative Commons est souhaité pour tout le site, une seule ligne de
`src/data/catalog.js` est concernée : la famille reprend `f.img` de `families.js` ; il
suffit d'y substituer la sélection CC déjà utilisée par l'accueil (`HOME_FAMILIES`).
Un test vérifie en attendant que chaque visuel affiché porte auteur, crédit, licence et
source, quelle que soit la licence retenue.

### Vérifications du 12 septembre 2026

`npm run build` réussi. `npm test` : 17 tests Node sur le routage, les relations entre
données, la recherche, l'étendue de la remise à zéro et l'attribution des visuels — tous au vert.

Dans Chromium piloté, sur le résultat compilé : 129 contrôles au vert, aucune erreur
JavaScript, aucune requête en échec, aucune image cassée. Couvrent notamment l'accueil et
Dropout, l'accès au catalogue depuis la navigation, la recherche et les filtres seuls puis
combinés, l'effacement et l'état sans résultat, l'ouverture des sept familles et des quinze
fiches, les liens directs, le rechargement, l'historique, les routes inconnues, la demande
préremplie depuis une fiche et sa présence dans le récapitulatif, la demande générale sans
produit, le changement de produit, la conservation des saisies pendant la navigation, la
remise à zéro par « Recommencer » et par rechargement, la navigation au clavier, le focus
visible, et l'absence de débordement horizontal à 390 et 320 px.

Limites de ces vérifications :

- `pageshow` avec `persisted: true` a été **simulé** : brouillon, contexte produit et
  étapes remis à zéro, route conservée. Une **restauration réelle du bfcache n'a pas pu
  être reproduite** : le navigateur piloté recharge le document au lieu de le restaurer,
  même avec le bfcache forcé. Ce point reste à vérifier à la main.
- Le retour arrière sans bfcache est désormais réaligné sur le brouillon, y compris le
  champ « application ». La correction repose sur l'ordre observé dans Chromium — la
  restauration des champs précède `pageshow` ; à reconfirmer si un autre navigateur est
  ciblé un jour.
- Sur les quatre photographies de famille, trois portent un crédit au ras du visuel ;
  celle des sondes de température n'est créditée que dans la fiche « Crédits visuels ».
  L'attribution reste présente dans la maquette ; l'affichage au ras du visuel dépend de
  la liste de `imageCredit()` et reste un choix éditorial.
- Le déploiement GitHub Actions reste à vérifier après publication.

## Lot « Administration V0 — Produit du moment »

Première tranche verticale complète : Administration → State → Accueil.

### Ce qui a été réalisé

- Bloc **Produit du moment** sur l'accueil (`src/components/featured-product.js`),
  entre les solutions de famille et la section Dropout. Toutes les données viennent
  de `catalog` et `state.featuredProductId` : rien n'est en dur dans le composant.
- Route **`#/admin`** : page d'administration simulée (`src/pages/admin.js`).
  En-tête avec bannière « Maquette de démonstration », liste déroulante des produits
  publiés, aperçu mis à jour à la sélection, bouton d'application, confirmation inline,
  liens retour vers l'accueil et le catalogue.
- Lien discret **« Admin ↗ »** dans `.footer-meta` du pied de page.
- **`state.featuredProductId`** ajouté dans `initialState()` (valeur : `'prd-001'`).
  Couvert par `resetSimulation()` : le rechargement, le bfcache et le bouton
  « Recommencer » restaurent tous `prd-001`.
- **`'admin'`** ajouté dans `ROUTES` (`src/lib/route.js`).
- Styles dans `src/styles/home.css` (featured-product) et `src/styles/admin.css` (admin).

### Flux Admin → State → Accueil

Sélection d'un produit dans `<select id="admin-product-select">` → aperçu mis à jour
sans re-render → clic « Appliquer » → `state.featuredProductId = valeur` → confirmation
inline → retour `#/home` → `render()` → `featuredProduct()` lit le nouvel identifiant.
La modification est active dans l'onglet ; elle disparaît au rechargement.

### Vérifications — lot Administration V0

`npm test` : 23 tests, 23 réussis. 6 nouveaux tests couvrent : existence et validité
du produit initial, changement de `featuredProductId`, restauration par `resetSimulation()`,
exclusion des produits non publiés, et fonctionnement des requêtes après remise à zéro.

`npm run build` réussi : 48 modules, 65,5 Ko JS, 101 Ko CSS.

Limites de ces vérifications :

- Les parcours navigateur (`#/home`, `#/admin`, changement de produit, retour accueil,
  rechargement, mobile 390 px, navigation clavier) n'ont **pas été vérifiés dans Chromium**
  lors de ce lot — à effectuer avant le push.
- Le lien « Admin ↗ » dans `.footer-meta` est à vérifier sur fond clair et sombre.

## Lot « Administration V1+V2 — Gestion des fiches »

Deuxième tranche verticale : gestion des fiches depuis `#/admin`.

### Ce qui a été réalisé

- **Section « Gestion des fiches »** ajoutée à la page `#/admin`
  (`src/pages/admin.js`). Elle liste toutes les fiches — publiées et dépubliées.
- **V1 — Bascule publiée/dépubliée** : bouton « Dépublier » / « Republier » par
  ligne. Un produit dépublié disparaît de `publishedProducts()` → plus visible dans
  le catalogue, plus proposé dans la liste « Mise en avant ». Si c'était le produit du
  moment, le bloc « Produit du moment » sur l'accueil disparaît silencieusement
  (`featuredProduct()` retourne `''`). Avertissement inline dans la zone de confirmation.
- **V2 — Édition inline** : bouton « Modifier » par ligne ouvre un mini-formulaire
  (nom + résumé). « Enregistrer » écrit dans `catalog.products[i]` en mémoire et
  rafraîchit la liste par `replaceWith` sans re-rendre la page. « Annuler » ferme
  le formulaire sans modifier le catalogue.
- Rafraîchissement ciblé `refreshAdminProductList()` dans `main.js` : remplace
  `#admin-product-list` via `replaceWith`, préserve le focus ailleurs dans la page.
- Styles dans `src/styles/admin.css` : `.admin-product-list`, `.admin-product-row`,
  `.admin-product-row--unpublished`, `.admin-product-status`, `.admin-product-actions`,
  `.admin-edit-form`, `.admin-edit-input`, `.admin-edit-textarea`, `.button.secondary`,
  `.button.small`.

### Vérifications — lot Administration V1+V2

`npm test` : 27 tests, 27 réussis. 4 nouveaux tests couvrent : dépublication
(retire de publishedProducts), republication (réintègre), édition nom+résumé (reflète
dans le catalogue), remise à zéro (restaure nom, résumé et statut originaux).

`npm run build` réussi : 48 modules, 68,9 Ko JS, 102,9 Ko CSS.

Limites de ces vérifications :

- Les parcours navigateur (`#/admin`, toggle, édition, retour accueil, vérification
  du bloc « Produit du moment » masqué, mobile 390 px, navigation clavier) n'ont
  **pas été vérifiés dans Chromium** lors de ce lot — à effectuer avant le push.

## Roadmap — lots réalisés

1. ~~Bloc « produit du moment » sur l'accueil, modifiable depuis l'administration.~~ ✓ fait
2. ~~Administration simulée, qui écrira dans le catalogue de `src/state.js`.~~ ✓ fait
3. ~~Administration V1+V2 : dépublication/republication et édition inline des fiches.~~ ✓ fait

## Points encore ouverts

- Le titre de page et la description sont désormais ceux du client
  (« Maturat Mesure — Instrumentation industrielle ») et non plus ceux du laboratoire.
- Les coordonnées restent fictives, centralisées dans `src/data/site.js` :
  contact@example.com, 00 00 00 00 00, 1 rue de la Démonstration / Ville exemple.
  Le téléphone n'est pas cliquable.
