/* Questions adaptatives par famille — parcours « Décrire mon besoin ».
 * Types : radio, text, number, textarea.
 * Toutes les questions sont facultatives : chacune accepte « Je ne sais pas »
 * (case ajoutée par le formulaire) et rien de technique n'est exigé pour envoyer.
 * Les réponses servent au cadrage uniquement : aucune recommandation automatique,
 * aucun diagnostic, aucune sélection produit. Les clés sont les noms de famille
 * du catalogue (catalog.js). */

export const SKIP_LABEL = 'Je ne sais pas';

export const QUOTE_QUESTIONS = {
  'Niveau': [
    {
      type: 'radio', name: 'goal', label: 'Objectif',
      options: ['Mesure continue', 'Détection de seuil'],
    },
    {
      type: 'radio', name: 'environment', label: 'Environnement',
      options: ['Cuve / réservoir', 'Silo', 'Bac / puisard', 'Autre / à préciser'],
    },
    { type: 'number', name: 'value1', label: 'Plage approximative', unit: 'm' },
  ],
  'Température': [
    {
      type: 'radio', name: 'goal', label: 'Type de mesure',
      options: ['En ligne / procédé', 'Lecture locale'],
    },
    { type: 'number', name: 'value1', label: 'Température minimale', unit: '°C' },
    { type: 'number', name: 'value2', label: 'Température maximale', unit: '°C' },
  ],
  'Pression': [
    {
      type: 'radio', name: 'goal', label: 'Type de besoin',
      options: ['Mesure transmise', 'Lecture locale', 'Pression différentielle'],
    },
    { type: 'number', name: 'value1', label: 'Pression approximative', unit: 'bar' },
  ],
  'Débit': [
    { type: 'text', name: 'environment', label: 'Fluide' },
    { type: 'number', name: 'value1', label: 'Débit approximatif', unit: 'm³/h' },
    {
      type: 'radio', name: 'option', label: 'Intervention sur la tuyauterie',
      options: ['Possible', 'À éviter'],
    },
  ],
  'Contrôle du signal': [
    {
      type: 'radio', name: 'goal', label: 'Besoin',
      options: ['Afficher une mesure', 'Convertir ou isoler un signal', 'Réguler', 'Vérifier une boucle'],
    },
    { type: 'text', name: 'environment', label: 'Signal concerné (par exemple 4–20 mA)' },
  ],
  'Traitement d’air': [
    {
      type: 'radio', name: 'goal', label: 'Besoin',
      options: [
        'Protéger un réseau d’air comprimé',
        'Réduire les condensats',
        'Choisir un point d’installation',
      ],
    },
    { type: 'number', name: 'value1', label: 'Pression', unit: 'bar', skipKey: 'values_skip' },
    { type: 'number', name: 'value2', label: 'Débit', unit: 'm³/h', skipKey: 'values_skip' },
  ],
  'Raccords inox et contrôle des fluides': [
    {
      type: 'radio', name: 'goal', label: 'Besoin',
      options: ['Isoler un instrument', 'Raccorder un instrument', 'Préparer une intervention'],
    },
    { type: 'text', name: 'environment', label: 'Installation' },
  ],
  'Échantillonnage et analyse liquide': [
    {
      type: 'radio', name: 'goal', label: 'Mesure recherchée',
      options: ['pH', 'Redox', 'Chlore', 'Conductivité', 'Prélèvement'],
    },
    { type: 'text', name: 'environment', label: 'Liquide ou procédé' },
  ],
  'Smart connexion': [
    {
      type: 'radio', name: 'goal', label: 'Besoin',
      options: ['Tablette', 'Téléphone', 'Application HART ou DATI'],
    },
    { type: 'text', name: 'environment', label: 'Instruments à configurer ou à relever' },
  ],
  'Produits associés': [
    {
      type: 'radio', name: 'goal', label: 'Besoin',
      options: ['Électrovanne', 'Raccord ou vanne pneumatique', 'Tubing'],
    },
    { type: 'text', name: 'environment', label: 'Installation' },
  ],
};

export const DEFAULT_QUESTIONS = [
  { type: 'textarea', name: 'environment', label: 'Contexte / application' },
];

export function getQuestionsForFamily(family) {
  return QUOTE_QUESTIONS[family] ?? DEFAULT_QUESTIONS;
}

/** Réponses lisibles d'une demande : « Je ne sais pas » pour une case cochée, unité ajoutée aux nombres,
 *  champs vides ignorés. Partagé par le formulaire, la confirmation et l'administration. */
export function answerItems(family, answers = {}) {
  const items = [];
  for (const q of getQuestionsForFamily(family)) {
    const skipKey = q.skipKey || `${q.name}_skip`;
    if (answers[skipKey]) {
      items.push({ name: q.name, label: q.label, text: SKIP_LABEL, skipped: true });
      continue;
    }
    const raw = answers[q.name];
    if (raw === undefined || raw === null || raw === '') continue;
    items.push({ name: q.name, label: q.label, text: q.unit ? `${raw} ${q.unit}` : String(raw) });
  }
  return items;
}
