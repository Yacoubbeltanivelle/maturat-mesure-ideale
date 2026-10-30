/* Photographies d'illustration. Les licences CC imposent de citer les auteurs :
 * les credits sont affiches dans la fiche « Credits visuels » du pied de page. */
import { IMAGE_ASSETS_V2 } from './images-v2.js';

const BASE_IMAGE_ASSETS = {
  "601": {
  "src": "assets/photos/expertise-pipes.webp",
  "title": "Réseau de tuyauteries industrielles",
  "author": "Peter Jochim",
  "credit": "Peter Jochim / Pexels",
  "source": "https://www.pexels.com/photo/industrial-complex-with-stainless-steel-pipes-36824351/",
  "license": "Licence Pexels",
  "licenseUrl": "https://www.pexels.com/license/",
  "width": 1400,
  "height": 2100
},
  "602": {
  "src": "assets/photos/sector-refinery.webp",
  "title": "Raffinerie éclairée à la tombée de la nuit",
  "author": "Tom Fisk",
  "credit": "Tom Fisk / Pexels",
  "source": "https://www.pexels.com/photo/illuminated-oil-rafinery-10386893/",
  "license": "Licence Pexels",
  "licenseUrl": "https://www.pexels.com/license/",
  "width": 1400,
  "height": 1329
},
  "603": {
  "src": "assets/photos/sector-laboratory.webp",
  "title": "Verrerie de laboratoire",
  "author": "Mikhail Nilov",
  "credit": "Mikhail Nilov / Pexels",
  "source": "https://www.pexels.com/photo/laboratory-glassware-in-close-up-shot-8851176/",
  "license": "Licence Pexels",
  "licenseUrl": "https://www.pexels.com/license/",
  "width": 800,
  "height": 1199
},
  "604": {
  "src": "assets/photos/sector-marine.webp",
  "title": "Navires et grues dans un chantier naval",
  "author": "paul",
  "credit": "paul / Pexels",
  "source": "https://www.pexels.com/photo/ships-during-construction-on-shipyard-5833637/",
  "license": "Licence Pexels",
  "licenseUrl": "https://www.pexels.com/license/",
  "width": 1400,
  "height": 1050
},

  "501": {
    "src": "assets/photos/home-level-houdec.png",
    "title": "Indicateur magnétique de niveau type 810 — Houdec Innovation",
    "author": "Houdec Innovation", "credit": "Houdec Innovation · Type 810",
    "source": "https://www.houdec.com/indicateurs-de-niveau",
    "license": "Visuel fabricant — droits réservés", "licenseUrl": null,
    "width": 1888, "height": 824
  },
  "502": {
    "src": "assets/photos/home-temperature-fuji.png",
    "title": "Sonde de température PT100 — Fuji Electric",
    "author": "Fuji Electric", "credit": "Fuji Electric · PT100",
    "source": "https://www.fujielectric.fr/produit/mesure-de-temperature/sonde-de-temperature-pt100/",
    "license": "Visuel fabricant — droits réservés", "licenseUrl": null,
    "width": 682, "height": 682
  },
  "503": {
    "src": "assets/photos/home-pressure-fuji.png",
    "title": "Transmetteur de pression différentielle FKC — Fuji Electric",
    "author": "Fuji Electric", "credit": "Fuji Electric · FKC",
    "source": "https://www.fujielectric.fr/en/product/pressure-measurement/differential-pressure-transmitter-fkc/",
    "license": "Visuel fabricant — droits réservés", "licenseUrl": null,
    "width": 682, "height": 682
  },
  "504": {
    "src": "assets/photos/home-flow-fuji.png",
    "title": "Débitmètre électromagnétique M1000 — Fuji Electric",
    "author": "Fuji Electric", "credit": "Fuji Electric · M1000",
    "source": "https://www.fujielectric.fr/produit/debitmetre-mesure-debit-liquides-eau-gaz-vapeur/debitmetre-electromagnetique-m1000/",
    "license": "Visuel fabricant — droits réservés", "licenseUrl": null,
    "width": 682, "height": 682
  },
  "402": {
    "src": "assets/photos/level-open-tank-cc.jpg",
    "title": "Détecteur de niveau à flotteur pour cuve ouverte",
    "author": "S.J. de Waard", "credit": "S.J. de Waard — CC BY 2.5",
    "source": "https://commons.wikimedia.org/wiki/File:Float_switch_for_open_tanks.JPG",
    "license": "CC BY 2.5", "licenseUrl": "https://creativecommons.org/licenses/by/2.5/",
    "width": 3155, "height": 2003
  },
  "406": {
    "src": "assets/photos/flow-rotameter-cc.jpg",
    "title": "Débitmètre à section variable — rotamètre",
    "author": "Hannes Grobe", "credit": "Hannes Grobe — CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Flow-tube-meter_hg.jpg",
    "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "width": 1372, "height": 4256
  },
  "270": {
    "src": "assets/photos/pressure-maximator.jpg",
    "title": "Manomètre haute pression MAXIMATOR",
    "author": "CEphoto, Uwe Aranas",
    "credit": "Photo by CEphoto, Uwe Aranas — CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:MAXIMATOR-High-Pressure-Manometer-01a.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "width": 3685,
    "height": 3685
  },
  "238": {
    "src": "assets/photos/temperature-probes.jpg",
    "title": "Sondes de température à résistance de platine",
    "author": "Marián Hubinský",
    "credit": "Marián Hubinský — CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:PRT_Probes.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "width": 3867,
    "height": 3746
  },
  "306": {
    "src": "assets/photos/flow-fuji-s-flow.png",
    "title": "Débitmètre à ultrasons S-Flow — Fuji Electric",
    "author": "Fuji Electric",
    "credit": "Visuel fabricant — Fuji Electric, S-Flow",
    "source": "https://www.fujielectric.fr/technologies/debitmetre-ultrasonique-integre-compact-s-flow/",
    "license": "Visuel fabricant — droits réservés",
    "licenseUrl": null,
    "width": 500,
    "height": 312
  },
  "202": {
    "src": "assets/photos/level-houdec-810.png",
    "title": "Indicateur magnétique de niveau type 810 — Houdec Innovation",
    "author": "Houdec Innovation",
    "credit": "Visuel fabricant — Houdec Innovation, type 810",
    "source": "https://www.houdec.com/type-810",
    "license": "Visuel fabricant — droits réservés",
    "licenseUrl": null,
    "width": 1888,
    "height": 824
  },
  "132": {
    "src": "assets/photos/air-filter.jpg",
    "title": "Filtre à air comprimé Reading Technologies",
    "author": "Jpgflynn",
    "credit": "Jpgflynn — CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Reading_Technologies_Compressed_air_filter.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "width": 1000,
    "height": 845
  }
};

export const IMAGE_ASSETS = { ...BASE_IMAGE_ASSETS, ...IMAGE_ASSETS_V2 };

/* Repli des visuels v2 : tant qu'une clé 7xx manque, une image existante prend la place. */
const V2_FALLBACK = {
  701: 603, 702: 602, 703: 601, 704: 602, 705: 601, 706: 603,
  711: 603, 712: 601, 713: 603, 714: 603, 715: 601,
  721: 601, 722: 132, 731: 602, 732: 603, 741: 601, 742: 603,
};

/** La clé demandée existe-t-elle vraiment (sans repli) ? */
export const hasImage = (id) => Boolean(IMAGE_ASSETS[id]);

/** Clé réellement utilisable : la clé demandée si elle existe, sinon son repli. */
export const resolveImageId = (id) =>
  IMAGE_ASSETS[id] ? Number(id) : (V2_FALLBACK[id] ?? 601);
