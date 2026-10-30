# Maturat Mesure — Atmospheric Precision V0.2

Maquette de démonstration du site Maturat Mesure. La direction artistique
« Atmospheric Precision » est validée ; cette version la porte sur une base Vite
en modules, sans rien changer au rendu.

## Lancer en local

```
npm install
npm run dev
```

Vite ouvre la maquette sur `http://localhost:5173/maturat-mesure/`.
Pour vérifier le résultat compilé : `npm run build` puis `npm run preview`.

## Publication

GitHub Actions installe les dépendances, lance `npm run build` et publie `dist`
sur GitHub Pages à chaque mise à jour de `main`.
URL : https://yacoubbeltanivelle.github.io/maturat-mesure/

`dist/` n'est plus versionné : c'est désormais une sortie de compilation.

## Organisation des fichiers

| Dossier | Contenu |
| --- | --- |
| `index.html` | Coque de la page : en-tête, contenu, pied de page, fiche crédits. |
| `src/data/` | Contenu éditorial : familles de mesure, catalogue, étapes Dropout, photos, coordonnées. |
| `src/data/catalog.js` | Source du catalogue : familles, fournisseurs et fiches, et `createCatalog()`. |
| `src/data/queries.js` | Lectures du catalogue : recherche, filtres, relations. Fonctions pures. |
| `src/lib/route.js` | Analyse des adresses, sans état ni DOM : la partie testable du routage. |
| `src/ui/` | Éléments de base réutilisables : boutons, surtitre, images, repères de famille. |
| `src/components/` | Sections : en-tête, familles, Dropout, formulaire, filtres, fiches, fil d'Ariane. |
| `src/pages/` | Assemblage des pages : accueil, Dropout, votre besoin, catalogue, famille, fiche, introuvable. |
| `src/effects/` | Mouvement du fond, apparition au scroll, curseur, progression Dropout. |
| `src/admin/` | Administration simulée : coque, tableau de bord, liste des fiches, éditeur. |
| `src/simulation/` | Écritures de l'administration sur le catalogue vivant. Testables hors navigateur. |
| `src/state.js` | État de la démonstration et catalogue vivant, uniquement en mémoire. |
| `src/router.js` | Application de l'adresse à l'état, anciennes adresses `#E/...` comprises. |
| `tests/` | Tests Node sur le routage, les relations entre données et la remise à zéro. |
| `public/assets/` | Images, photographies et polices, copiées telles quelles. |

## Base à conserver

Hero centrée sur niveau, température, pression et débit, avec fond bleu grainé animé ;
section Dropout conservée plus bas sur l'accueil ;
couleurs du logo ; titres H2 harmonisés ; pied de page complet.
Ne pas remplacer la direction artistique.

## Adresses

| Adresse | Page |
| --- | --- |
| `#/home` | Accueil |
| `#/dropout` | Dropout |
| `#/quote` | Définir mon besoin |
| `#/products` | Catalogue : sept familles, recherche et fiches |
| `#/families/<slug>` | Une famille : introduction, usages, fiches rattachées |
| `#/products/<slug>` | Une fiche : identité, usages, caractéristiques de démonstration |
| `#/admin` | Administration simulée : tableau de bord du catalogue |
| `#/admin/catalog` | Administration : liste de gestion des fiches, publiées et masquées |
| `#/admin/catalog/<id ou slug>` | Administration : édition d'une fiche existante |

Les anciennes adresses `#E/home`, `#E/dropout` et `#E/quote` restent valides.
Une famille, une fiche ou une adresse inconnue affiche un état introuvable
avec un retour vers le catalogue et l'accueil.

## Données du catalogue

Tout est décrit dans `src/data/catalog.js` : sept familles (identifiant `fam-<code>`,
slug, nom court et nom long, introduction, usages), cinq fournisseurs et quinze fiches
(identifiant `prd-NNN`, slug, référence, `familyId`, `supplierId`, résumé, usages,
caractéristiques, `published`).

`createCatalog()` en renvoie une copie profonde et indépendante. `src/state.js` en tient
une copie vivante, partagée par le site et, plus tard, par l'administration simulée dans
le même onglet ; `resetSimulation()` la remplace par une copie propre. Les composants
lisent ce catalogue, ils n'en gardent pas de version en dur.

Les sept familles et Dropout sont réels. En revanche **les quinze fiches, leurs références,
leurs fournisseurs et leurs caractéristiques sont inventés** pour la démonstration : chaque
page le dit. Aucune certification, performance garantie, disponibilité, tarif ni document
téléchargeable n'est affirmé. Dropout n'est pas décrit comme une fiche fictive : il garde
sa page dédiée, accessible depuis le catalogue.

## État

Accueil, catalogue (`#/products`), pages par famille, fiches produits, page Dropout et
parcours « définir mon besoin » simulé. Le catalogue offre une recherche textuelle, un
filtre par famille, un filtre par fournisseur, un compteur, un état sans résultat et un
effacement des filtres — sans rechargement, sans appel réseau et sans dépendance ajoutée.
Depuis une fiche, la demande s'ouvre en conservant le produit et sa famille ; le produit
apparaît dans le contexte et dans le récapitulatif final. Une demande générale sans produit
reste possible. Aucun envoi de mail réel, aucun back-office. Les coordonnées affichées sont fictives.

L'accueil affiche un bloc « Produit du moment » entre les solutions de famille et la section
Dropout. Le produit affiché est piloté par `state.featuredProductId` (valeur initiale : `prd-001`) ;
aucune donnée produit n'est dupliquée dans le composant.

La route `#/admin` donne accès à une administration simulée, avec sa propre coque :
tableau de bord des repères du catalogue, liste de gestion des fiches (`#/admin/catalog`)
et édition d'une fiche existante (`#/admin/catalog/<id ou slug>` : nom, référence, résumé,
famille, fournisseur, publication). L'identifiant et le slug d'une fiche ne sont pas
modifiables, afin que les adresses déjà ouvertes restent valides.

Une fiche masquée disparaît des listes publiques et son adresse directe mène à l'état
introuvable ; elle reste listée et modifiable dans l'administration. La modification
s'applique immédiatement dans l'onglet et est effacée au rechargement, au retour bfcache,
par « Recommencer » ou par « Réinitialiser la démo ». Aucune donnée n'est réellement
enregistrée — le bandeau de l'administration le dit explicitement.
Visuels provisoires, crédits dans `ASSETS.md` et dans la fiche « Crédits visuels »
du pied de page. `noindex` est une consigne d'indexation, pas une protection d'accès.

Le domaine maturat.fr et les emails Gandi ne sont pas modifiés par cette démonstration.

## Retour client — équilibre de l'accueil

L'ouverture présente les quatre familles de mesure, sans visuel Dropout dans la Hero.
Le fond bleu animé est conservé, ainsi que la section Dropout après l'instrumentation.
Les familles niveau et débit utilisent désormais les visuels fabricant Houdec type 810
et Fuji Electric S-Flow ; les anciens visuels concurrents ont été retirés de `public/`.
Les sources et attributions sont documentées dans `ASSETS.md` et dans les crédits visuels.

### Correction de composition — 12 septembre 2026

L’accueil retrouve le layout de référence : visuels au centre, titre en bas à gauche,
introduction et lien en bas à droite. Les quatre photographies sous licence libre
remplacent le produit phare dans la Hero et illustrent les cartes de l’accueil.
Le fond bleu animé et l’ordre des sections sont conservés. Les visuels Houdec/Fuji
restent propres aux pages du catalogue ; voir ASSETS.md pour les nouvelles sources.

### Visuels de l’accueil — 13 septembre 2026

Les quatre photos sont désormais remplacées par des détourages officiels Houdec
(type 810) et Fuji Electric (PT100, FKC, M1000), sans fond. Le layout est conservé.
Cette sélection remplace celle sous licence libre du 12 septembre : les droits
restent aux fabricants. Voir ASSETS.md pour les sources et le périmètre local.

## Finder du catalogue

Le catalogue place la recherche immédiatement après une introduction compacte,
avant l’exploration des sept familles. Six critères se combinent : recherche libre,
famille, technologie, application, fournisseur et signal/sortie. Les filtres actifs
sont retirables séparément ; « Tout effacer », le reset et le rechargement les remettent
à zéro. Les champs de recherche de l’introduction et du Finder partagent le même état.

`src/data/catalog-facets.js` dérive les technologies des caractéristiques présentes
(Principe, Type, Fonction/Fonctions ou Mesure). Les signaux normalisent uniquement
les sorties explicitement renseignées ; lecture locale et absence d’alimentation
sont retenues lorsqu’elles sont décrites dans les usages. Une entrée de calibrateur
n’est pas assimilée à une sortie. Une information absente ne crée pas de valeur.

Les applications sont une taxonomie de démonstration, calculée depuis les usages
écrits des fiches fictives : cuves/stockage, tuyauterie, pompes/réseaux, maintenance,
procédés thermiques, air/gaz, environnement et automatismes/signaux. Ces regroupements
ne constituent pas des garanties de compatibilité commerciale. Les options suivent
les fiches publiées du catalogue vivant, y compris après une modification simulée.

Le CTA final est celui du footer commun à la Home ; aucune variante propre au
catalogue n’est ajoutée.
