/* Contenu éditorial : entreprise, secteurs desservis et questions fréquentes.
 *
 * Ces textes sont PROVISOIRES et écrits pour la maquette. Ils devront être
 * relus et validés par Maturat avant toute publication.
 *
 * Les secteurs sont ceux cités par le client : chimie, pétrochimie et sidérurgie
 * d'abord, puis énergie, agroalimentaire et pharmacie. Aucun nom de client n'est
 * mentionné : citer une entreprise comme référence demande son autorisation écrite.
 * `photo` est une clé v2 ; images.js la remplace par une image existante si besoin. */

export const SECTORS = [
  { code: '01', name: 'Chimie', photo: 702, text: 'Procédés de synthèse, dosage et fluides agressifs.' },
  { code: '02', name: 'Pétrochimie', photo: 701, text: 'Raffinage, stockage et transfert de produits pétroliers.' },
  { code: '03', name: 'Sidérurgie', photo: 703, text: 'Hautes températures, poussières et fonctionnement continu.' },
  { code: '04', name: 'Énergie', photo: 704, text: 'Utilités, réseaux de fluides et installations de production.' },
  { code: '05', name: 'Agroalimentaire', photo: 705, text: 'Lignes de production, utilités et nettoyage en place.' },
  { code: '06', name: 'Pharmacie', photo: 706, text: 'Production sous contrainte de traçabilité et de propreté.' },
];

export const COMPANY = {
  intro:
    'Maturat Mesure est un distributeur-conseil de solutions de mesure industrielle et de traitement d’air, installé à Martigues depuis 2015. Nous aidons les industriels à choisir un instrument adapté à leur installation, puis à préparer leur demande de chiffrage.',
  approach: [
    {
      title: 'Comprendre l’application avant le produit',
      text: 'Le fluide, la plage utile, le raccordement et l’environnement conditionnent le choix. Nous partons de votre installation, pas d’un catalogue.',
    },
    {
      title: 'Une sélection resserrée de fournisseurs',
      text: 'Plutôt qu’un référencement généraliste, nous privilégions des fabricants ciblés selon les familles et les technologies. L’objectif : mieux connaître les solutions proposées et les confronter aux contraintes de votre application.',
    },
    {
      title: 'Un interlocuteur unique',
      text: 'Du premier échange au chiffrage et aux échanges techniques, vous gardez un même fil de discussion, sans avoir à reprendre votre contexte à chaque étape.',
    },
  ],
};

/* Méthode de sélection présentée sur l'accueil.
 *
 * Description d'une démarche de travail, rien de plus : aucun délai, aucun
 * engagement commercial, aucune certification ni expertise non démontrée.
 * Les principes de mesure cités en étape 02 sont ceux du catalogue.
 *
 * `title` contient du balisage, comme SITE.heading : il est injecté tel quel. */
export const METHOD = {
  eyebrow: 'EXPERTISE / MÉTHODE',
  title: 'De votre besoin<br><em>à la bonne mesure.</em>',
  steps: [
    {
      index: '01',
      kicker: 'APPLICATION',
      title: 'Comprendre l’application',
      text: 'Les paramètres du point de mesure, relevés avec vous avant toute recommandation.',
      criteria: ['Fluide', 'Température', 'Pression', 'Plage de mesure', 'Environnement', 'Raccordement'],
    },
    {
      index: '02',
      kicker: 'PRINCIPE',
      title: 'Sélectionner le principe adapté',
      text: 'Radar ou hydrostatique, électromagnétique ou ultrasons : chaque principe a ses conditions d’emploi. Nous les comparons au regard de votre installation.',
    },
    {
      index: '03',
      kicker: 'SOLUTION',
      title: 'Définir la solution',
      text: 'Une gamme et sa configuration, la documentation associée, puis une demande de chiffrage prête à être transmise.',
    },
  ],
  cta: { label: 'Décrire mon besoin', href: '#/quote' },
};

export const HOME_SUPPLIERS = {
  title: 'Les marques que nous distribuons.',
  intro: 'Houdec Innovation, Fuji Electric, Ashcroft, Nivelco, Fitok et Dropout. Chaque marque a ses gammes ; la page fournisseurs les relie aux familles du catalogue.',
};

export const FAQ = [
  {
    q: 'Ma référence est illisible ou ancienne : puis-je quand même demander un chiffrage ?',
    a: 'Oui. Indiquez ce que vous lisez encore, comme la marque, la plage de mesure ou le raccordement, et décrivez l’installation. La référence exacte se retrouve ensuite avec vous. Le formulaire accepte « Je ne sais pas » pour les champs techniques.',
    links: [{ label: 'Décrire mon besoin', href: '#/quote' }],
  },
  {
    q: 'Peut-on acheter en ligne ?',
    a: 'Non. Le site ne publie ni prix ni panier, et ne prend aucun paiement. Chaque demande est étudiée, puis chiffrée sur demande.',
    links: [{ label: 'Parcourir le catalogue', href: '#/products' }],
  },
  {
    q: 'Quelle documentation est fournie ?',
    a: 'La documentation du fabricant, quand elle existe pour la référence concernée : fiche technique, notice, plan d’encombrement. Elle accompagne la réponse à votre demande. Une référence peut ne pas en avoir.',
  },
  {
    q: 'Quelles marques distribuez-vous ?',
    a: 'Houdec Innovation, Fuji Electric, Ashcroft, Nivelco, Fitok et Dropout. Pour le contrôle du signal, l’analyse liquide et la smart connexion, la maquette montre des fabricants d’exemple en attendant les gammes réelles.',
    links: [{ label: 'Voir les fournisseurs', href: '#/suppliers' }],
  },
  {
    q: 'Quelle zone desservez-vous ?',
    a: 'Maturat est basé à Martigues et travaille d’abord avec les sites du bassin industriel de Fos-Berre. Une demande venue d’ailleurs est lue de la même façon. L’intervention sur site, elle, se discute au cas par cas.',
  },
  {
    q: 'Que devient ma demande ?',
    a: 'Elle est enregistrée avec un identifiant, que vous voyez à la confirmation, puis lue par un interlocuteur de Maturat qui répond à l’adresse indiquée. Aucun délai n’est annoncé. Dans cette maquette, rien n’est réellement envoyé.',
    links: [{ label: 'Décrire mon besoin', href: '#/quote' }],
  },
];
