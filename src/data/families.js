/* Les quatre grandeurs fondamentales du metier Maturat.
 *
 * `color` est le halo de la famille : il teinte le fond de la hero quand une
 * famille est selectionnee, et l'en-tete de sa page. La direction artistique
 * demande une couleur distincte par grandeur, a saturation tres faible —
 * niveau vert d'eau, temperature ambre, pression bleu-violet, debit cyan. */
export const FAMILIES = [
 {name:'Niveau',code:'01',img:202,unit:'m',color:'#d4e8e0',title:'Savoir où vous en êtes.',text:'Mesurer et détecter le niveau de vos liquides ou solides, selon les contraintes du procédé.',principles:['Radar','Hydrostatique','Flotteur'],use:'Cuves, réservoirs et stockage'},
 {name:'Température',code:'02',img:238,unit:'°C',color:'#fbe3c3',title:'Garder la bonne température.',text:'Suivre la température de votre installation et choisir le principe de mesure adapté.',principles:['PT100','Thermocouple','Bimétallique'],use:'Procédés, tuyauteries et équipements'},
 {name:'Pression',code:'03',img:270,unit:'bar',color:'#d6dbf0',title:'Connaître chaque pression.',text:'Mesurer et détecter la pression de vos fluides, au plus près de votre application.',principles:['Piézorésistif','Capacitif','Mécanique'],use:'Réseaux de fluides et installations'},
 {name:'Débit',code:'04',img:306,unit:'m³/h',color:'#cde6ef',title:'Donner du sens au flux.',text:'Mesurer le débit de votre fluide avec une technologie cohérente avec le procédé.',principles:['Ultrasons','Électromagnétique','Coriolis'],use:'Circuits de fluides et utilités'}
];

/* Détourages fabricant propres à l'accueil. Sources et droits dans images.js. */
export const HOME_FAMILIES = FAMILIES.map(f => ({
  ...f, img: 500 + Number(f.code)
}));
