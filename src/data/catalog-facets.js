/* Taxonomie de démonstration : les applications regroupent les usages écrits
 * dans les fiches fictives. Aucune compatibilité commerciale n'est affirmée.
 * Les valeurs techniques restent dérivées des specs du catalogue vivant. */
export const CATALOG_FILTER_DEFAULTS = Object.freeze({
  q: '', family: '', technology: '', application: '', supplier: '', signal: '',
});

const plain = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const APPLICATIONS = [
  ['Cuves & stockage', /cuve|stockage|silo|remplissage|niveau haut/],
  ['Tuyauterie', /tuyauterie|\btube\b|ligne|piquage|purge/],
  ['Pompes & réseaux', /pompe|reseau|relevage|distribution/],
  ['Maintenance terrain', /maintenance|intervention|diagnostic|ronde|ponctuel|verifier|essai|depose/],
  ['Procédés thermiques', /temperature|thermique|four|chaud|echangeur/],
  ['Air & gaz', /\bair\b|\bgaz\b|secheur/],
  ['Environnement', /effluent|bassin|puisard/],
  ['Automatismes & signaux', /automate|signal|boucle/],
];

export function productFacets(product) {
  const specs = product.specs ?? [];
  const uses = plain((product.uses ?? []).join(' '));
  const technology = ['principe', 'type', 'fonction', 'fonctions', 'mesure']
    .map((label) => specs.find((s) => plain(s.label) === label)?.value).find(Boolean) || '';
  const output = plain(specs.filter((s) => plain(s.label) === 'sortie').map((s) => s.value).join(' '));
  const signal = [];
  if (/4\s*[-–]\s*20\s*ma/.test(output)) signal.push('4–20 mA');
  if (/0\s*[-–]\s*10\s*v/.test(output)) signal.push('0–10 V');
  if (/relais|tout ou rien|\btor\b/.test(output)) signal.push('Relais / TOR');
  if (/impulsion/.test(output)) signal.push('Impulsions');
  if (/lecture (directe|sur place|locale)/.test(uses)) signal.push('Lecture locale');
  if (/sans alimentation/.test(uses)) signal.push('Sans alimentation');
  return {
    technology,
    application: APPLICATIONS.filter(([, pattern]) => pattern.test(uses)).map(([label]) => label),
    signal,
  };
}

export function catalogFacetOptions(catalog) {
  const facets = catalog.products.filter((p) => p.published !== false).map(productFacets);
  const values = (key) => [...new Set(facets.flatMap((f) => f[key]).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'fr'));
  return { technology: values('technology'), application: values('application'), signal: values('signal') };
}
