import { FAMILIES } from './families.js';

/* Catalogue de démonstration.
 *
 * Les quatre familles de mesure reprennent families.js : un seul endroit décrit
 * leur code, leur photo et leur halo. Les six autres familles sont décrites ici.
 *
 * Les marques sont celles que Maturat distribue (Houdec Innovation, Fuji Electric,
 * Ashcroft, Nivelco, Fitok, Dropout). Les références, caractéristiques et valeurs
 * de chaque fiche sont INVENTÉES pour la maquette : ce n'est pas le catalogue réel
 * de Maturat, et aucune disponibilité, certification, performance garantie ni tarif
 * n'y est affirmé. Seules les familles sans marque connue (contrôle du signal,
 * analyse liquide, smart connexion) reçoivent un fabricant d'exemple.
 *
 * Le champ facultatif `img` d'une fiche est une clé d'IMAGE_ASSETS (résolue avec
 * repli par images.js) ; sans lui, la fiche montre le visuel de sa famille. */

const REAL_NOTE = 'Marque réelle · références et valeurs d’exemple';
const SAMPLE_NOTE = 'Fabricant d’exemple';

const SUPPLIERS = [
  { id: 'sup-houdec', slug: 'houdec-innovation', name: 'Houdec Innovation', note: REAL_NOTE, real: true },
  { id: 'sup-fuji', slug: 'fuji-electric', name: 'Fuji Electric', note: REAL_NOTE, real: true },
  { id: 'sup-ashcroft', slug: 'ashcroft', name: 'Ashcroft', note: REAL_NOTE, real: true },
  { id: 'sup-nivelco', slug: 'nivelco', name: 'Nivelco', note: REAL_NOTE, real: true },
  { id: 'sup-fitok', slug: 'fitok', name: 'Fitok', note: REAL_NOTE, real: true },
  { id: 'sup-dropout', slug: 'dropout', name: 'Dropout', note: REAL_NOTE, real: true },
  { id: 'sup-signalys', slug: 'signalys', name: 'Signalys', note: SAMPLE_NOTE },
  { id: 'sup-aqualis', slug: 'aqualis', name: 'Aqualis', note: SAMPLE_NOTE },
  { id: 'sup-connexis', slug: 'connexis', name: 'Connexis', note: SAMPLE_NOTE },
];

/* Complément éditorial des quatre familles de mesure. */
const MEASUREMENT_DETAILS = {
  '01': {
    slug: 'niveau',
    longName: 'Mesure et détection de niveau',
    intro: 'Savoir ce qu’il reste dans une cuve, un silo ou un bac. Selon le produit stocké et les contraintes d’accès, la mesure peut être continue ou limitée à la détection d’un seuil.',
    uses: [
      'Suivre en continu le contenu d’une cuve de stockage',
      'Détecter un seuil haut ou bas pour protéger une pompe',
      'Surveiller un bac de rétention ou un puisard',
    ],
  },
  '02': {
    slug: 'temperature',
    longName: 'Mesure et détection de température',
    intro: 'La température conditionne la plupart des procédés. Le choix se fait sur la plage attendue, le temps de réponse et la manière dont la sonde est installée dans la tuyauterie.',
    uses: [
      'Suivre la température d’un fluide en ligne',
      'Contrôler une étuve, un échangeur ou une cuve chauffée',
      'Disposer d’une lecture locale sans alimentation électrique',
    ],
  },
  '03': {
    slug: 'pression',
    longName: 'Mesure et détection de pression',
    intro: 'De la lecture locale au signal transmis à l’automate, la pression se mesure au plus près de l’application : nature du fluide, plage utile et raccordement guident le choix.',
    uses: [
      'Surveiller la pression d’un réseau de fluides',
      'Transmettre une mesure vers un automate ou un enregistreur',
      'Lire une pression sur place, au pied de l’équipement',
    ],
  },
  '04': {
    slug: 'debit',
    longName: 'Mesure et détection de débit',
    intro: 'Compter ce qui circule. La technologie retenue dépend du fluide, de la conductivité, de la présence de particules et de la possibilité, ou non, d’intervenir sur la tuyauterie.',
    uses: [
      'Compter un volume consommé sur une utilité',
      'Mesurer un débit sans couper la tuyauterie',
      'Suivre un dosage ou une alimentation de procédé',
    ],
  },
};

/* Les six familles qui entourent la mesure. */
const EXTRA_FAMILIES = [
  {
    code: '05', slug: 'controle-signal', name: 'Contrôle du signal', img: 711,
    longName: 'Contrôle du signal : indicateurs, convertisseurs, régulateurs, calibrateurs',
    text: 'Afficher, convertir, réguler et vérifier le signal entre le capteur et l’automate.',
    intro: 'Une mesure ne s’arrête pas au capteur. Le signal doit être affiché, isolé, converti ou régulé, puis la boucle se vérifie sur le terrain avec un calibrateur.',
    uses: [
      'Afficher une mesure à côté de l’équipement',
      'Isoler ou convertir un signal avant l’entrée de l’automate',
      'Vérifier une boucle de mesure pendant une intervention',
    ],
    principles: ['Indicateur', 'Convertisseur', 'Régulateur', 'Calibrateur'],
    use: 'Acquisition, contrôle et maintenance',
  },
  {
    code: '06', slug: 'traitement-air', name: 'Traitement d’air', img: 721,
    longName: 'Traitement d’air : la gamme Dropout',
    text: 'Séparer l’eau liquide d’un réseau d’air comprimé avec la gamme Dropout.',
    intro: 'Dans un réseau d’air comprimé, l’eau liquide abîme les organes pneumatiques et les instruments en aval. Un séparateur Dropout retire cette eau. Il ne remplace pas un sécheur : la vapeur d’eau reste dans l’air. La page Dropout détaille le principe.',
    uses: [
      'Retirer l’eau liquide d’une ligne d’air comprimé',
      'Protéger des organes pneumatiques et des instruments en aval',
      'Préparer l’étude d’un point d’installation sur un réseau',
    ],
    principles: ['Séparation', 'Filtration', 'Séchage'],
    use: 'Réseaux d’air comprimé',
  },
  {
    code: '07', slug: 'raccords-fluides', name: 'Raccords inox et contrôle des fluides', img: 712,
    longName: 'Raccords inox et contrôle des fluides : la gamme Fitok',
    text: 'Raccorder, isoler et réguler les fluides : raccords à bagues, vannes, manifolds, clapets et détendeurs Fitok.',
    intro: 'Entre l’instrument et le procédé, il y a la tuyauterie. Raccords à bagues, vannes, manifolds, clapets et détendeurs permettent d’isoler un appareil, de le déposer sans vidanger la ligne et de garder une installation démontable.',
    uses: [
      'Isoler un instrument pour le contrôler ou le remplacer',
      'Raccorder un capteur sur une ligne existante',
      'Regrouper les vannes d’isolement et de purge sur un seul bloc',
    ],
    principles: ['Raccords', 'Vannes', 'Manifold', 'Clapet', 'Détendeur'],
    use: 'Assemblage et distribution des fluides',
  },
  {
    code: '08', slug: 'analyse-liquide', name: 'Échantillonnage et analyse liquide', img: 713,
    longName: 'Échantillonnage et analyse liquide : pH, redox, chlore, conductivité',
    text: 'Prélever un liquide et mesurer son pH, son redox, son chlore ou sa conductivité.',
    intro: 'Au-delà des grandeurs physiques, la composition du liquide compte. Le pH, le redox, le chlore et la conductivité se mesurent sur un point de prélèvement ou en ligne, à condition que l’échantillon soit représentatif.',
    uses: [
      'Suivre le pH d’un bain ou d’un effluent',
      'Contrôler le chlore d’une eau de procédé',
      'Mesurer la conductivité d’un circuit',
    ],
    principles: ['pH', 'Redox', 'Chlore', 'Conductivité'],
    use: 'Suivi de la qualité des liquides',
  },
  {
    code: '09', slug: 'smart-connexion', name: 'Smart connexion', img: 714,
    longName: 'Smart connexion : tablettes, téléphones et applications HART et DATI',
    text: 'Configurer et relever les instruments sur le terrain avec des tablettes, des téléphones et des applications.',
    intro: 'Sur le terrain, un technicien configure et relève des instruments avec une tablette ou un téléphone. Les applications HART et DATI se connectent aux instruments compatibles. Le classement en zone à risque d’explosion se confirme appareil par appareil auprès du fabricant.',
    uses: [
      'Configurer un transmetteur HART sans quitter la zone',
      'Relever les valeurs d’un instrument pendant une ronde',
      'Garder une trace d’une intervention de maintenance',
    ],
    principles: ['Tablette', 'Téléphone', 'HART', 'DATI'],
    use: 'Maintenance et configuration terrain',
  },
  {
    code: '10', slug: 'produits-associes', name: 'Produits associés', img: 715,
    longName: 'Produits associés : électrovannes, raccords et vannes pneumatiques, tubing',
    text: 'Les éléments qui complètent une installation : électrovannes, raccords et vannes pneumatiques, tubing.',
    intro: 'Une installation de mesure ou d’air comprimé s’accompagne d’éléments de commande et de liaison : électrovannes, raccords et vannes pneumatiques, tubes d’instrumentation. Cette famille les regroupe.',
    uses: [
      'Commander une vanne à distance avec de l’air comprimé',
      'Relier un instrument à sa prise de process par un tube',
      'Compléter une installation existante',
    ],
    principles: ['Électrovanne', 'Vanne pneumatique', 'Tube'],
    use: 'Commande et liaison',
  },
];

/* Familles : identifiant stable `fam-<code>`, slug d'adresse, et rattachement
 * aux photographies. Les familles annexes n'ont pas d'unité. */
const FAMILY_LIST = [
  ...FAMILIES.map((f) => ({
    id: `fam-${f.code}`,
    code: f.code,
    slug: MEASUREMENT_DETAILS[f.code].slug,
    name: f.name,
    longName: MEASUREMENT_DETAILS[f.code].longName,
    text: f.text,
    intro: MEASUREMENT_DETAILS[f.code].intro,
    uses: [...MEASUREMENT_DETAILS[f.code].uses],
    principles: [...f.principles],
    use: f.use,
    unit: f.unit,
    img: f.img,
    color: f.color,
    published: true,
  })),
  ...EXTRA_FAMILIES.map((f) => ({
    id: `fam-${f.code}`,
    code: f.code,
    slug: f.slug,
    name: f.name,
    longName: f.longName,
    text: f.text,
    intro: f.intro,
    uses: [...f.uses],
    principles: [...f.principles],
    use: f.use,
    unit: '',
    img: f.img,
    color: '#dde6ee',
    published: true,
  })),
];

/* Fiches d'exemple. Références, valeurs et caractéristiques sont inventées :
 * elles servent à éprouver la recherche, les filtres et les parcours. */
const PRODUCT_LIST = [
  {
    id: 'prd-001', slug: 'indicateur-niveau-magnetique-houdec-810', name: 'Indicateur de niveau magnétique Houdec type 810',
    reference: 'Type 810', familyId: 'fam-01', supplierId: 'sup-houdec', img: 202,
    summary: 'Lecture directe du niveau sur la paroi d’une cuve, par un flotteur magnétique et des volets visibles de loin.',
    uses: ['Cuves de stockage sous pression', 'Réservoirs de produits chimiques', 'Lecture locale sans alimentation électrique'],
    specs: [
      ['Principe', 'Flotteur magnétique, lecture par volets'],
      ['Étendue de mesure', '0,3 à 6 m (exemple)'],
      ['Sortie', 'Lecture locale ; transmetteur 4–20 mA en option'],
      ['Raccord process', 'Brides ou piquages soudés'],
      ['Matière de la chambre', 'Acier inoxydable (exemple)'],
    ],
    published: true,
  },
  {
    id: 'prd-002', slug: 'transmetteur-hydrostatique-nivelco-np310', name: 'Transmetteur hydrostatique Nivelco NP-310',
    reference: 'NP-310', familyId: 'fam-01', supplierId: 'sup-nivelco', img: false,
    summary: 'Niveau déduit de la pression de la colonne de liquide, en sonde immergée ou en piquage.',
    uses: ['Cuves ouvertes et bassins', 'Puisards et postes de relevage', 'Eaux et liquides peu chargés'],
    specs: [
      ['Principe', 'Pression hydrostatique'],
      ['Étendue de mesure', '0 à 10 mCE'],
      ['Sortie', '4–20 mA, 2 fils'],
      ['Corps', 'Acier inoxydable'],
      ['Câble', 'Longueur à préciser à la commande'],
    ],
    published: true,
  },
  {
    id: 'prd-003', slug: 'detecteur-flotteur-nivelco-nf120', name: 'Détecteur de niveau à flotteur Nivelco NF-120',
    reference: 'NF-120', familyId: 'fam-01', supplierId: 'sup-nivelco', img: 402,
    summary: 'Détection d’un seuil haut ou bas par un flotteur, simple et sans réglage compliqué.',
    uses: ['Protection de pompe contre la marche à sec', 'Sécurité de remplissage', 'Alarme de niveau haut'],
    specs: [
      ['Principe', 'Flotteur et contact'],
      ['Fonction', 'Détection de seuil, tout ou rien'],
      ['Sortie', 'Contact relais'],
      ['Montage', 'Suspendu ou sur piquage, cuve ouverte'],
      ['Température de service', '0 à 70 °C (exemple)'],
    ],
    published: true,
  },
  {
    id: 'prd-004', slug: 'sonde-pt100-fuji-tp100a', name: 'Sonde PT100 Fuji Electric TP-100A',
    reference: 'TP-100A', familyId: 'fam-02', supplierId: 'sup-fuji', img: 238,
    summary: 'Sonde à résistance de platine avec doigt de gant, pour une mesure stable en ligne.',
    uses: ['Températures de procédé en tuyauterie', 'Cuves et échangeurs', 'Mesure raccordée à un automate'],
    specs: [
      ['Principe', 'Résistance de platine PT100'],
      ['Plage', '−50 à 400 °C (exemple)'],
      ['Montage', 'Doigt de gant, raccord fileté'],
      ['Raccordement', '3 fils'],
      ['Longueur d’immersion', 'À définir selon la tuyauterie'],
    ],
    published: true,
  },
  {
    id: 'prd-005', slug: 'thermocouple-ashcroft-atk6', name: 'Thermocouple Ashcroft AT-K6',
    reference: 'AT-K6', familyId: 'fam-02', supplierId: 'sup-ashcroft', img: false,
    summary: 'Mesure de température haute avec un temps de réponse court.',
    uses: ['Fours et traitements thermiques', 'Points chauds de procédé', 'Mesures à réponse rapide'],
    specs: [
      ['Principe', 'Thermocouple type K'],
      ['Plage', '0 à 900 °C (exemple)'],
      ['Gaine', 'Acier inoxydable, ⌀ 6 mm'],
      ['Raccordement', 'Tête de raccordement'],
      ['Montage', 'Avec ou sans doigt de gant'],
    ],
    published: true,
  },
  {
    id: 'prd-006', slug: 'thermometre-bimetallique-ashcroft-ab100', name: 'Thermomètre bimétallique Ashcroft AB-100',
    reference: 'AB-100', familyId: 'fam-02', supplierId: 'sup-ashcroft', img: false,
    summary: 'Lecture locale de la température, sans alimentation ni câblage.',
    uses: ['Lecture directe au pied de l’équipement', 'Contrôle visuel pendant une ronde', 'Installations sans alimentation disponible'],
    specs: [
      ['Principe', 'Bilame'],
      ['Plage', '0 à 120 °C (exemple)'],
      ['Diamètre du cadran', '100 mm'],
      ['Raccord process', 'Filetage G ½, orientation à préciser'],
      ['Boîtier', 'Acier inoxydable'],
    ],
    published: true,
  },
  {
    id: 'prd-007', slug: 'transmetteur-pression-differentielle-fuji-fkc', name: 'Transmetteur de pression différentielle Fuji Electric FKC',
    reference: 'FKC-D1', familyId: 'fam-03', supplierId: 'sup-fuji', img: 503,
    summary: 'Transmission d’une pression ou d’une pression différentielle vers l’automate, cellule capacitive.',
    uses: ['Réseaux d’air et d’eau', 'Mesure de niveau ou de débit par pression différentielle', 'Signal transmis à un automate'],
    specs: [
      ['Principe', 'Cellule capacitive'],
      ['Étendue de mesure', '0 à 16 bar (exemple)'],
      ['Sortie', '4–20 mA, 2 fils'],
      ['Raccord process', 'Filetage G ¼ ou bride'],
      ['Température de service', '−20 à 85 °C (exemple)'],
    ],
    published: true,
  },
  {
    id: 'prd-008', slug: 'manometre-ashcroft-ag100m', name: 'Manomètre Ashcroft AG-100M',
    reference: 'AG-100M', familyId: 'fam-03', supplierId: 'sup-ashcroft', img: false,
    summary: 'Lecture locale de la pression sur un réseau ou au pied d’un équipement.',
    uses: ['Lecture sur place', 'Contrôle avant intervention', 'Réseaux d’air et de fluides'],
    specs: [
      ['Principe', 'Tube de Bourdon (mécanique)'],
      ['Étendue de mesure', '0 à 10 bar relatifs (exemple)'],
      ['Diamètre du cadran', '100 mm'],
      ['Remplissage', 'Glycérine, en option'],
      ['Raccord process', 'Filetage G ½, orientation à préciser'],
    ],
    published: true,
  },
  {
    id: 'prd-009', slug: 'debitmetre-electromagnetique-fuji-m1000', name: 'Débitmètre électromagnétique Fuji Electric M1000',
    reference: 'M1000-E1', familyId: 'fam-04', supplierId: 'sup-fuji', img: 504,
    summary: 'Mesure de débit sur liquides conducteurs, sans pièce mobile dans la veine.',
    uses: ['Eau et effluents', 'Liquides conducteurs chargés', 'Comptage d’utilités'],
    specs: [
      ['Principe', 'Électromagnétique'],
      ['Diamètres', 'DN 25 à DN 150 (exemple)'],
      ['Sortie', '4–20 mA et impulsions'],
      ['Raccordement', 'Brides'],
      ['Condition', 'Liquide conducteur, conduite pleine'],
    ],
    published: true,
  },
  {
    id: 'prd-010', slug: 'debitmetre-ultrasons-fuji-sflow', name: 'Débitmètre à ultrasons Fuji Electric S-Flow',
    reference: 'S-Flow SF-1', familyId: 'fam-04', supplierId: 'sup-fuji', img: 306,
    summary: 'Mesure par capteurs serrés sur la tuyauterie, sans coupure de la ligne.',
    uses: ['Contrôle ponctuel sur ligne existante', 'Installations sans arrêt possible', 'Diagnostic de réseau'],
    specs: [
      ['Principe', 'Ultrasons, capteurs serrés à l’extérieur'],
      ['Diamètres', 'DN 25 à DN 300 (exemple)'],
      ['Sortie', '4–20 mA'],
      ['Montage', 'Sans découpe de tuyauterie'],
      ['Condition', 'Tuyauterie et fluide à caractériser'],
    ],
    published: true,
  },
  {
    id: 'prd-011', slug: 'vanne-boisseau-fitok-fv-b2', name: 'Vanne à boisseau sphérique Fitok FV-B2',
    reference: 'FV-B2', familyId: 'fam-07', supplierId: 'sup-fitok', img: 712,
    summary: 'Isolement quart de tour d’un instrument ou d’une antenne de tuyauterie.',
    uses: ['Isoler un instrument avant dépose', 'Couper une antenne de distribution', 'Préparer une intervention de maintenance'],
    specs: [
      ['Type', 'Vanne à boisseau sphérique, deux voies'],
      ['Manœuvre', 'Quart de tour, poignée'],
      ['Raccordement', 'Raccords à bagues pour tube ⌀ 6 à 12 mm'],
      ['Corps', 'Acier inoxydable 316 (exemple)'],
      ['Pression de service', '100 bar (exemple)'],
    ],
    published: true,
  },
  {
    id: 'prd-012', slug: 'raccord-a-bagues-fitok-fb6', name: 'Raccord à bagues Fitok FB-6',
    reference: 'FB-6', familyId: 'fam-07', supplierId: 'sup-fitok', img: 712,
    summary: 'Raccord démontable pour piquer un capteur sur une ligne existante.',
    uses: ['Piquage d’une prise de pression', 'Raccordement d’un capteur sur tube', 'Point de purge ou de prélèvement'],
    specs: [
      ['Type', 'Raccord à bagues, démontable'],
      ['Tubes', '⌀ 6 à 12 mm'],
      ['Matière', 'Acier inoxydable 316 (exemple)'],
      ['Filetages', 'G ¼ et G ½'],
      ['Assemblage', 'Sans soudure'],
    ],
    published: true,
  },
  {
    id: 'prd-013', slug: 'isolateur-signal-signalys-sg-i20', name: 'Isolateur-convertisseur de signal Signalys SG-I20',
    reference: 'SG-I20', familyId: 'fam-05', supplierId: 'sup-signalys', img: 711,
    summary: 'Sépare électriquement capteur et automate, et convertit le signal si besoin.',
    uses: ['Supprimer une boucle de masse', 'Dupliquer un signal vers deux destinations', 'Adapter un signal à une entrée automate'],
    specs: [
      ['Type', 'Convertisseur isolateur de signal'],
      ['Entrée', '4–20 mA'],
      ['Sortie', '4–20 mA ou 0–10 V'],
      ['Montage', 'Rail DIN'],
      ['Alimentation', '24 V continu'],
    ],
    published: true,
  },
  {
    id: 'prd-014', slug: 'calibrateur-boucle-signalys-sg-c9', name: 'Calibrateur portable de boucle Signalys SG-C9',
    reference: 'SG-C9', familyId: 'fam-05', supplierId: 'sup-signalys', img: 711,
    summary: 'Appareil de terrain pour générer et lire un signal pendant une intervention.',
    uses: ['Vérifier une boucle 4–20 mA', 'Simuler un capteur pendant un essai', 'Contrôler une entrée automate'],
    specs: [
      ['Type', 'Calibrateur portable de boucle'],
      ['Fonctions', 'Génération et lecture 4–20 mA'],
      ['Tension', 'Lecture 0–30 V continu'],
      ['Alimentation', 'Batterie rechargeable'],
      ['Raccordement', 'Cordons et pinces fournis'],
    ],
    published: true,
  },
  {
    id: 'prd-015', slug: 'separateur-dropout-do-l15', name: 'Séparateur d’eau Dropout DO-L15',
    reference: 'DO-L15', familyId: 'fam-06', supplierId: 'sup-dropout', img: 722,
    summary: 'Sépare l’eau liquide d’une ligne d’air comprimé, en montage sur la canalisation.',
    uses: ['Réseaux d’air comprimé', 'Protection d’organes pneumatiques en aval', 'Instrumentation alimentée en air'],
    specs: [
      ['Fonction', 'Séparation de l’eau liquide'],
      ['Montage', 'En ligne, sur canalisation d’air comprimé'],
      ['Raccordement', 'Filetage G ½ (exemple)'],
      ['Limite', 'Ne retire pas la vapeur d’eau : ce n’est pas un sécheur'],
      ['Performance', 'À confirmer pour l’application'],
    ],
    published: true,
  },
  {
    id: 'prd-016', slug: 'sonde-radar-nivelco-nr300', name: 'Sonde radar Nivelco NR-300',
    reference: 'NR-300', familyId: 'fam-01', supplierId: 'sup-nivelco', img: false,
    summary: 'Mesure continue du niveau sans contact avec le produit, pour cuves fermées et silos.',
    uses: ['Cuves de stockage fermées', 'Silos de matières sèches', 'Produits agressifs ou collants'],
    specs: [
      ['Principe', 'Radar sans contact'],
      ['Étendue de mesure', '0 à 20 m (exemple)'],
      ['Sortie', '4–20 mA, 2 fils'],
      ['Raccord process', 'Filetage G 1½'],
      ['Température de service', '−20 à 80 °C (exemple)'],
    ],
    published: true,
  },
  {
    id: 'prd-017', slug: 'rotametre-houdec-hr40', name: 'Rotamètre Houdec HR-40',
    reference: 'HR-40', familyId: 'fam-04', supplierId: 'sup-houdec', img: 406,
    summary: 'Lecture directe du débit d’un liquide ou d’un gaz sur une échelle graduée, sans alimentation.',
    uses: ['Lecture locale d’un débit', 'Circuits d’utilités', 'Contrôle visuel pendant une ronde'],
    specs: [
      ['Principe', 'Section variable, flotteur dans un tube conique'],
      ['Plage', '1 à 10 m³/h d’eau (exemple)'],
      ['Sortie', 'Lecture locale'],
      ['Montage', 'Vertical, circulation de bas en haut'],
      ['Raccordement', 'Filetage ou brides, à préciser'],
    ],
    published: true,
  },
  {
    id: 'prd-018', slug: 'separateur-dropout-do-g40', name: 'Séparateur d’eau Dropout DO-G40',
    reference: 'DO-G40', familyId: 'fam-06', supplierId: 'sup-dropout', img: 721,
    summary: 'Version pour une canalisation de plus grand diamètre, sur un collecteur d’air comprimé.',
    uses: ['Collecteurs d’air comprimé', 'Départs vers des ateliers', 'Protection d’un ensemble de machines'],
    specs: [
      ['Fonction', 'Séparation de l’eau liquide'],
      ['Montage', 'En ligne, sur collecteur'],
      ['Raccordement', 'Brides, diamètre à préciser'],
      ['Limite', 'Ne retire pas la vapeur d’eau : ce n’est pas un sécheur'],
      ['Performance', 'À confirmer pour l’application'],
    ],
    published: true,
  },
  {
    id: 'prd-019', slug: 'analyseur-ph-redox-aqualis-aq-ph2', name: 'Transmetteur pH et redox Aqualis AQ-PH2',
    reference: 'AQ-PH2', familyId: 'fam-08', supplierId: 'sup-aqualis', img: 713,
    summary: 'Transmetteur avec électrode pour suivre le pH ou le redox d’un bain, d’un effluent ou d’une eau de procédé.',
    uses: ['Bains de traitement de surface', 'Effluents avant rejet', 'Eaux de procédé'],
    specs: [
      ['Mesure', 'pH et redox'],
      ['Plage', 'pH 0 à 14 (exemple)'],
      ['Sortie', '4–20 mA'],
      ['Montage', 'Immersion ou chambre de passage'],
      ['Entretien', 'Étalonnage régulier de l’électrode'],
    ],
    published: true,
  },
  {
    id: 'prd-020', slug: 'analyseur-chlore-conductivite-aqualis-aq-cc1', name: 'Analyseur chlore et conductivité Aqualis AQ-CC1',
    reference: 'AQ-CC1', familyId: 'fam-08', supplierId: 'sup-aqualis', img: 713,
    summary: 'Poste d’analyse sur prélèvement, pour le chlore libre et la conductivité d’une eau.',
    uses: ['Eaux de refroidissement', 'Eaux de rinçage', 'Contrôle d’une eau d’appoint'],
    specs: [
      ['Mesure', 'Chlore libre et conductivité'],
      ['Plage', '0 à 5 mg/L de chlore ; 0 à 2000 µS/cm (exemple)'],
      ['Sortie', '4–20 mA'],
      ['Montage', 'Sur panneau, avec ligne de prélèvement'],
      ['Entretien', 'Réactifs et nettoyage selon le fabricant'],
    ],
    published: true,
  },
  {
    id: 'prd-021', slug: 'tablette-terrain-connexis-cx-t10', name: 'Tablette de terrain Connexis CX-T10',
    reference: 'CX-T10', familyId: 'fam-09', supplierId: 'sup-connexis', img: 714,
    summary: 'Tablette robuste pour configurer, relever et documenter les instruments pendant une ronde.',
    uses: ['Rondes de maintenance', 'Configuration d’instruments sur site', 'Consultation de documents techniques'],
    specs: [
      ['Type', 'Tablette durcie pour environnement industriel'],
      ['Écran', '10 pouces, lisible en plein jour'],
      ['Connexions', 'Bluetooth et Wi-Fi'],
      ['Zone à risque', 'Classement à confirmer avec le fabricant'],
      ['Autonomie', 'Batterie amovible'],
    ],
    published: true,
  },
  {
    id: 'prd-022', slug: 'application-hart-dati-connexis-cx-h1', name: 'Application HART et DATI Connexis CX-H1',
    reference: 'CX-H1', familyId: 'fam-09', supplierId: 'sup-connexis', img: 714,
    summary: 'Application pour dialoguer avec des transmetteurs HART et relever leurs paramètres depuis un téléphone ou une tablette.',
    uses: ['Configuration d’un transmetteur HART', 'Relevé de paramètres pendant une intervention', 'Sauvegarde de la configuration d’un instrument'],
    specs: [
      ['Type', 'Application HART et DATI'],
      ['Système', 'Android (exemple)'],
      ['Liaison', 'Modem HART Bluetooth, vendu séparément'],
      ['Export', 'Fichier de rapport'],
      ['Licence', 'À préciser'],
    ],
    published: true,
  },
  {
    id: 'prd-023', slug: 'vanne-pneumatique-fitok-fp-v2', name: 'Vanne pneumatique Fitok FP-V2',
    reference: 'FP-V2', familyId: 'fam-10', supplierId: 'sup-fitok', img: 715,
    summary: 'Vanne à commande par air comprimé, pour ouvrir ou fermer une ligne à distance.',
    uses: ['Isolement commandé à distance', 'Séquences de remplissage ou de purge', 'Lignes d’instrumentation'],
    specs: [
      ['Type', 'Vanne pneumatique, commande par air comprimé'],
      ['Action', 'Simple effet, retour par ressort (exemple)'],
      ['Pression de commande', '4 à 7 bar (exemple)'],
      ['Raccordement', 'Raccords à bagues'],
      ['Corps', 'Acier inoxydable 316 (exemple)'],
    ],
    published: true,
  },
  {
    id: 'prd-024', slug: 'tube-instrumentation-fitok-ft316', name: 'Tube d’instrumentation Fitok FT-316',
    reference: 'FT-316', familyId: 'fam-10', supplierId: 'sup-fitok', img: 715,
    summary: 'Tube inox sans soudure pour relier un instrument à sa prise de process.',
    uses: ['Liaison entre une prise de pression et un instrument', 'Lignes d’échantillonnage', 'Alimentation en air d’un équipement'],
    specs: [
      ['Type', 'Tube d’instrumentation sans soudure'],
      ['Diamètres', '⌀ 6 et 12 mm (exemple)'],
      ['Matière', 'Acier inoxydable 316 (exemple)'],
      ['Livraison', 'Au mètre ou en longueur coupée'],
      ['Raccordement', 'Compatible raccords à bagues'],
    ],
    published: true,
  },
  {
    id: 'prd-025', slug: 'manifold-fitok-fm-3v', name: 'Manifold 3 voies Fitok FM-3V',
    reference: 'FM-3V', familyId: 'fam-07', supplierId: 'sup-fitok', img: 712,
    summary: 'Bloc regroupant isolement, équilibrage et purge pour un transmetteur de pression.',
    uses: ['Montage d’un transmetteur de pression différentielle', 'Mise à zéro sans arrêt de la ligne', 'Dépose d’un instrument en maintenance'],
    specs: [
      ['Type', 'Manifold 3 voies'],
      ['Fonctions', 'Isolement, équilibrage, purge'],
      ['Montage', 'Direct sur transmetteur ou sur support'],
      ['Corps', 'Acier inoxydable 316 (exemple)'],
      ['Raccordement', 'Filetage G ¼'],
    ],
    published: true,
  },
];

/* Structure source. Personne ne la modifie : elle sert de gabarit aux copies. */
const INITIAL_CATALOG = {
  families: FAMILY_LIST,
  suppliers: SUPPLIERS,
  products: PRODUCT_LIST.map((p) => ({ ...p, specs: p.specs.map(([label, value]) => ({ label, value })) })),
};

/** Copie indépendante du catalogue, tableaux et objets imbriqués compris.
 *  L'administration simulée pourra modifier la copie sans toucher à la source. */
export function createCatalog() {
  return structuredClone(INITIAL_CATALOG);
}
