/* ============================================================
   MOZAIS — Catalogue
   Source de vérité produit. Remplacez les `image` par vos
   photos dans /public/products/ (même nom de fichier).
   ============================================================ */

export type CategorySlug =
  | "savons"
  | "skincare"
  | "capillaire"
  // Univers Huiles & Soins Body — remplace l'ancienne catégorie "huiles",
  // fusionnée ici en deux rayons distincts (voir la feuille de route,
  // décision du 30/08/2026 : deux libellés concurrents auraient fait
  // doublon aux yeux d'une cliente).
  | "huiles-essentielles"
  | "huiles-bien-etre"
  | "soins-regeneration"
  // Univers Senteurs — nouveau, aucun produit publié pour l'instant.
  | "bougies"
  | "parfums-ambiance"
  | "encens";

export type Category = {
  slug: CategorySlug;
  name: string;
  /** Intitulé long utilisé en tête de collection. */
  title: string;
  blurb: string;
  /**
   * Masque la catégorie de la navigation, du pied de page, des facettes
   * boutique et du sitemap tant qu'elle n'a pas au moins deux produits —
   * le seuil retenu le 30/08/2026 est un plancher, pas une cible. Absent
   * ou `true` = publiée. Voir `publishedCategories()`.
   */
  published?: boolean;
};

export const CATEGORIES: Category[] = [
  {
    slug: "savons",
    name: "Savons de soin",
    title: "Savons de soin",
    blurb:
      "Saponifiés à froid, coulés en petits lots à Dakar. Chaque pain garde ses corps gras et sa glycérine naturelle.",
  },
  {
    slug: "skincare",
    name: "Skincare",
    title: "Skincare naturel",
    blurb:
      "Des formules courtes, actives, pensées pour les peaux riches en mélanine — imperfections, taches, éclat.",
  },
  {
    slug: "capillaire",
    name: "Soins capillaires afro",
    title: "Soins capillaires afro",
    blurb:
      "Cuir chevelu assaini, longueurs nourries, boucles définies. Pour cheveux crépus, frisés et locksés.",
  },
  {
    slug: "huiles-essentielles",
    name: "Huiles essentielles",
    title: "Huiles essentielles",
    blurb:
      "Concentrés à diluer, jamais purs sur la peau. Puissants — à respecter, pas à improviser.",
  },
  {
    slug: "huiles-bien-etre",
    name: "Huiles de bien-être",
    title: "Huiles de bien-être",
    blurb:
      "Huiles corps et visage prêtes à l'emploi, pressées à froid. Baobab, ricin, sésame.",
  },
  {
    slug: "soins-regeneration",
    name: "Soins de régénération corporelle",
    title: "Soins de régénération corporelle",
    blurb:
      "Baumes et beurres corps, pour les peaux marquées ou en réparation.",
    published: false, // aucun produit encore — rayon vierge, voir la feuille de route.
  },
  {
    slug: "bougies",
    name: "Bougies parfumées",
    title: "Bougies parfumées",
    blurb:
      "Cire végétale, mèche en coton, coulées en petits lots à Dakar — même logique de production que les savons.",
    // Publiée le 31/08/2026 : 2 références prêtes (seuil minimum atteint).
  },
  {
    slug: "parfums-ambiance",
    name: "Parfums d'ambiance",
    title: "Parfums d'ambiance & d'intérieur",
    blurb: "Brumes et sprays sans flamme, pour parfumer un intérieur en un geste.",
    // Publiée le 31/08/2026 : 2 références prêtes (seuil minimum atteint).
  },
  {
    slug: "encens",
    name: "Encens et essences",
    title: "Encens et essences sur charbon",
    blurb:
      "Thiouraye et résines, brûlés sur charbon — le geste rituel le plus proche de ceux déjà sur le site.",
    // Publiée le 31/08/2026 : 2 références prêtes (seuil minimum atteint).
  },
];

/**
 * Catégories prêtes à être montrées en navigation, facettes et sitemap.
 * Utilisée par tout composant qui liste des catégories publiquement —
 * `CATEGORIES` reste la source complète pour que le nom et le descriptif
 * d'un rayon existent déjà avant son ouverture.
 */
export function publishedCategories() {
  return CATEGORIES.filter((c) => c.published !== false);
}

/* ---------- Univers ---------- */

export type UniverseSlug = "soins" | "huiles-soins-body" | "senteurs";

export type Universe = {
  slug: UniverseSlug;
  name: string;
  categories: CategorySlug[];
};

export const UNIVERSES: Universe[] = [
  {
    slug: "soins",
    name: "Soins visage & corps",
    categories: ["savons", "skincare", "capillaire"],
  },
  {
    slug: "huiles-soins-body",
    name: "Huiles & Soins Body",
    categories: ["huiles-essentielles", "huiles-bien-etre", "soins-regeneration"],
  },
  {
    slug: "senteurs",
    name: "Senteurs",
    categories: ["bougies", "parfums-ambiance", "encens"],
  },
];

export function getUniverseForCategory(slug: CategorySlug) {
  return UNIVERSES.find((u) => u.categories.includes(slug));
}

export type Variant = {
  id: string;
  /** Ex. « 150 g », « 50 ml » */
  label: string;
  price: number;
  /** Écart de prix affiché barré, optionnel. */
  compareAt?: number;
  inStock: boolean;
};

export type Fragrance = {
  id: string;
  name: string;
  note: string;
};

export type Active = {
  name: string;
  latin?: string;
  role: string;
};

export type RitualStep = {
  title: string;
  detail: string;
};

export type Review = {
  author: string;
  city: string;
  rating: number;
  date: string;
  body: string;
  verified: boolean;
};

export type Product = {
  slug: string;
  name: string;
  line?: string;
  tagline: string;
  category: CategorySlug;
  /** Chemin dans /public. */
  image: string;
  /** Vignettes secondaires de la galerie. */
  gallery?: string[];
  /** Teinte de fond de la vignette catalogue. */
  tone: "linen" | "emerald" | "gold" | "earth";
  description: string;
  skinConcerns: string[];
  actives: Active[];
  ritual: RitualStep[];
  variants: Variant[];
  fragrances?: Fragrance[];
  reviews: Review[];
  featured?: boolean;
  /** Badge éditorial affiché sur la vignette. */
  badge?: string;
  /**
   * Photo de geste insérée en interstitiel sur la fiche produit, entre les
   * actifs et le rituel. Facultatif : seuls les produits qui en disposent
   * l'affichent, pas de gabarit générique pour tous.
   */
  lifestyle?: { image: string; alt: string; caption: string };
  /**
   * Avertissements d'usage, affichés à part du rituel dans un encart
   * distinct (accordéon) — jamais mélangés aux étapes du geste quotidien.
   * Réservé aux produits qui en ont réellement besoin (concentrés à
   * diluer, contre-indications) : absent partout ailleurs.
   */
  precautions?: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "perfect-skin",
    name: "Perfect Skin",
    tagline: "Soin purifiant anti-imperfections",
    category: "skincare",
    image: "/products/perfect-skin.jpg",
    tone: "linen",
    featured: true,
    badge: "Best-seller",
    lifestyle: {
      image: "/editorial/geste-mousse.jpg",
      alt: "Deux mains à la peau mate font mousser le savon MOZAIS Perfect Skin entre les paumes, sur un fond de marbre émeraude.",
      caption:
        "« On la travaille dans les mains, jamais en frottant le pain à même la peau. »",
    },
    description:
      "Le pain fondateur de la maison. Extraits de plantes et soufre purifiant, coulés dans une base saponifiée à froid qui nettoie sans décaper. Il resserre le grain de peau, assèche les boutons installés et estompe progressivement les marques post-acné, sans l'effet tiraillé des savons dermatologiques classiques.",
    skinConcerns: ["Imperfections", "Excès de sébum", "Marques post-acné"],
    actives: [
      {
        name: "Soufre purifiant",
        role: "Kératolytique doux : désincruste les pores et régule le sébum.",
      },
      {
        name: "Neem",
        latin: "Azadirachta indica",
        role: "Assainissant reconnu, calme les rougeurs des boutons inflammatoires.",
      },
      {
        name: "Karité brut",
        latin: "Vitellaria paradoxa",
        role: "Reconstruit le film hydrolipidique que le nettoyage fragilise.",
      },
    ],
    ritual: [
      {
        title: "Faire mousser à part",
        detail:
          "Entre les paumes humides, jamais directement sur le visage. On veut la mousse, pas le frottement du pain.",
      },
      {
        title: "Poser 60 secondes",
        detail:
          "Appliquer en mouvements circulaires légers et laisser agir une minute pleine : c'est là que le soufre travaille.",
      },
      {
        title: "Rincer à l'eau tiède",
        detail:
          "Jamais chaude. Sécher en tamponnant, sans frotter la zone des imperfections.",
      },
      {
        title: "Hydrater dans la foulée",
        detail:
          "Une huile légère sur peau encore humide. Une peau purifiée mais déshydratée sur-produira du sébum.",
      },
    ],
    variants: [
      { id: "150g", label: "150 g", price: 8500, inStock: true },
      { id: "duo", label: "Duo 2 × 150 g", price: 15300, compareAt: 17000, inStock: true },
    ],
    reviews: [
      {
        author: "Aïssatou D.",
        city: "Dakar",
        rating: 5,
        date: "2026-06-14",
        body: "Trois semaines et mon front est net. J'avais essayé beaucoup de savons au soufre, celui-ci ne dessèche pas.",
        verified: true,
      },
      {
        author: "Mariama S.",
        city: "Paris",
        rating: 5,
        date: "2026-05-02",
        body: "L'odeur est franche au début — c'est le soufre, c'est normal. Les résultats valent largement ça.",
        verified: true,
      },
      {
        author: "Khady N.",
        city: "Thiès",
        rating: 4,
        date: "2026-04-21",
        body: "Très efficace sur les boutons du menton. Je mets une huile juste après, sinon ça tire un peu.",
        verified: true,
      },
    ],
  },
  {
    slug: "hydra-karite-miel",
    name: "Savon Réparateur Karité & Miel",
    line: "Mozais Hydra",
    tagline: "Hydratant & apaisant",
    category: "savons",
    image: "/products/hydra-karite-miel.jpg",
    tone: "gold",
    featured: true,
    description:
      "Un pain gras, presque fondant, pour les peaux sèches et réactives. Le miel appelle l'eau et la retient, le karité brut la scelle. À utiliser sur le corps, et sur le visage pour les peaux qui tiraillent après le nettoyage.",
    skinConcerns: ["Sécheresse", "Tiraillements", "Peau réactive"],
    actives: [
      {
        name: "Miel de Casamance",
        role: "Humectant naturel, apaise les sensations d'échauffement.",
      },
      {
        name: "Karité non raffiné",
        latin: "Vitellaria paradoxa",
        role: "Riche en insaponifiables : nourrit et restaure la barrière cutanée.",
      },
      {
        name: "Aloe vera",
        role: "Calme immédiatement les zones irritées et rougies.",
      },
    ],
    ritual: [
      {
        title: "Sur peau mouillée",
        detail: "Le pain se travaille sur une peau bien humide pour libérer sa mousse crémeuse.",
      },
      {
        title: "Masser sans presser",
        detail: "Laisser glisser. Ce savon nourrit pendant qu'il nettoie ; inutile d'insister.",
      },
      {
        title: "Sceller à l'huile",
        detail: "Huile de baobab sur peau humide, dans les trois minutes qui suivent la sortie de douche.",
      },
    ],
    variants: [
      { id: "150g", label: "150 g", price: 6500, inStock: true },
      { id: "trio", label: "Trio 3 × 150 g", price: 17500, compareAt: 19500, inStock: true },
    ],
    reviews: [
      {
        author: "Fatou B.",
        city: "Dakar",
        rating: 5,
        date: "2026-07-01",
        body: "Ma peau ne tiraille plus du tout après la douche. Le parfum de miel est discret et vraiment agréable.",
        verified: true,
      },
      {
        author: "Ndèye F.",
        city: "Bruxelles",
        rating: 5,
        date: "2026-06-08",
        body: "Je le prends en trio maintenant. Toute la famille l'utilise, même mon fils qui a de l'eczéma léger.",
        verified: true,
      },
    ],
  },
  {
    slug: "hydra-aloe-moringa",
    name: "Savon Purifiant Aloé & Moringa",
    line: "Mozais Hydra",
    tagline: "Assainissant & régénérant",
    category: "savons",
    image: "/products/hydra-aloe-moringa.jpg",
    tone: "emerald",
    description:
      "Le moringa, arbre de vie du Sahel, concentre une densité rare d'antioxydants. Associé à l'aloé, il donne un pain vert profond qui purifie sans agresser — l'entre-deux idéal entre le savon détox et le savon nourrissant.",
    skinConcerns: ["Grain de peau irrégulier", "Teint terne", "Peau mixte"],
    actives: [
      {
        name: "Moringa",
        latin: "Moringa oleifera",
        role: "Antioxydant puissant, protège la peau du stress oxydatif urbain.",
      },
      { name: "Aloe vera", role: "Hydrate et calme, apporte de la souplesse." },
      { name: "Argile verte", role: "Absorbe l'excès de sébum sur la zone T." },
    ],
    ritual: [
      { title: "Matin et soir", detail: "Deux passages courts valent mieux qu'un long nettoyage." },
      {
        title: "Insister sur la zone T",
        detail: "Front, nez, menton — laisser la mousse agir trente secondes de plus.",
      },
      { title: "Terminer à l'eau fraîche", detail: "Pour resserrer visiblement les pores." },
    ],
    variants: [{ id: "150g", label: "150 g", price: 6500, inStock: true }],
    reviews: [
      {
        author: "Sokhna M.",
        city: "Dakar",
        rating: 5,
        date: "2026-05-19",
        body: "Peau mixte compliquée, ce savon a trouvé l'équilibre. Le teint est plus lumineux au bout d'un mois.",
        verified: true,
      },
    ],
  },
  {
    slug: "hydra-charbon-detox",
    name: "Savon Détox Charbon Actif",
    line: "Mozais Hydra",
    tagline: "Désincrustant profond",
    category: "savons",
    image: "/products/hydra-charbon-detox.jpg",
    tone: "earth",
    description:
      "Charbon de coque de coco activé, noir dense. Il capte les impuretés par adsorption plutôt que par abrasion — aucun grain, aucune micro-rayure. Pensé pour les peaux grasses et les épidermes exposés à la poussière et à la pollution.",
    skinConcerns: ["Peau grasse", "Pores obstrués", "Points noirs"],
    actives: [
      { name: "Charbon actif de coco", role: "Adsorbe impuretés et excès de sébum." },
      { name: "Huile de coco vierge", role: "Compense l'action asséchante du charbon." },
      { name: "Menthe poivrée", role: "Effet frais immédiat, resserre les pores." },
    ],
    ritual: [
      { title: "Deux à trois fois par semaine", detail: "Ce n'est pas un savon quotidien. Alterner avec un pain doux." },
      { title: "Poser en masque", detail: "Laisser la mousse deux minutes sur le nez et le menton." },
      { title: "Rincer abondamment", detail: "Le charbon doit partir entièrement." },
    ],
    variants: [{ id: "150g", label: "150 g", price: 7000, inStock: true }],
    reviews: [
      {
        author: "Ibrahima K.",
        city: "Dakar",
        rating: 4,
        date: "2026-06-27",
        body: "Efficace sur les points noirs. Je l'utilise deux fois par semaine comme conseillé, pas plus.",
        verified: true,
      },
    ],
  },
  {
    slug: "hydra-curcuma-miel",
    name: "Savon Éclat Curcuma & Miel",
    line: "Mozais Hydra",
    tagline: "Unifiant & illuminateur",
    category: "savons",
    image: "/products/hydra-curcuma-miel.jpg",
    tone: "gold",
    description:
      "Un pain jaune safrané pour travailler l'uniformité du teint sans aucun agent éclaircissant. Le curcuma agit sur l'inflammation qui entretient les taches, le miel adoucit. Une alternative honnête aux savons dits « clarifiants ».",
    skinConcerns: ["Taches", "Teint irrégulier", "Marques d'hyperpigmentation"],
    actives: [
      {
        name: "Curcuma",
        latin: "Curcuma longa",
        role: "Anti-inflammatoire, atténue l'hyperpigmentation post-inflammatoire.",
      },
      { name: "Miel brut", role: "Adoucit et apporte de la lumière au teint." },
      { name: "Huile de sésame", role: "Assouplit et facilite le renouvellement cellulaire." },
    ],
    ritual: [
      { title: "Le soir de préférence", detail: "Le curcuma travaille pendant la nuit, phase de réparation cutanée." },
      { title: "Une minute de pose", detail: "Sur les zones marquées uniquement." },
      {
        title: "Protection solaire le matin",
        detail: "Indispensable : sans écran solaire, aucun soin anti-taches ne tient ses promesses.",
      },
    ],
    variants: [{ id: "150g", label: "150 g", price: 7000, inStock: true }],
    reviews: [
      {
        author: "Awa T.",
        city: "Saint-Louis",
        rating: 5,
        date: "2026-04-30",
        body: "Mes marques de boutons s'estompent enfin. Et j'apprécie que ce ne soit pas un savon éclaircissant.",
        verified: true,
      },
    ],
  },
  {
    slug: "huile-baobab",
    name: "Huile de Baobab",
    tagline: "Élixir corps & visage, pression à froid",
    category: "huiles-bien-etre",
    image: "/products/huile-baobab.jpg",
    tone: "gold",
    featured: true,
    badge: "Pressée à froid",
    description:
      "Extraite des graines de l'arbre-bouteille du Sahel. Sa richesse en oméga 3, 6 et 9 en fait une huile sèche remarquablement pénétrante : elle nourrit en profondeur sans laisser de film gras, et se pose aussi bien sur le corps que sur le visage.",
    skinConcerns: ["Sécheresse", "Vergetures", "Élasticité"],
    actives: [
      {
        name: "Baobab",
        latin: "Adansonia digitata",
        role: "Oméga 3-6-9, vitamines A, D, E : nutrition et souplesse.",
      },
      { name: "Vitamine E naturelle", role: "Antioxydant, protège les lipides cutanés." },
    ],
    ritual: [
      { title: "Sur peau humide", detail: "Trois à cinq gouttes, juste après la douche." },
      { title: "Chauffer entre les paumes", detail: "L'huile pénètre mieux à température de peau." },
      { title: "Insister sur les zones sèches", detail: "Coudes, genoux, tibias, pointes des cheveux." },
    ],
    variants: [
      { id: "50ml", label: "50 ml", price: 12000, inStock: true },
      { id: "100ml", label: "100 ml", price: 20000, compareAt: 24000, inStock: true },
    ],
    fragrances: [
      { id: "nature", name: "Nature", note: "Aucun parfum ajouté — l'odeur discrète de la graine." },
      { id: "neroli", name: "Néroli", note: "Fleur d'oranger, lumineuse et florale." },
      { id: "vetiver", name: "Vétiver", note: "Racine fumée, boisée, tenace." },
    ],
    reviews: [
      {
        author: "Coumba L.",
        city: "Dakar",
        rating: 5,
        date: "2026-07-11",
        body: "Une huile sèche, elle ne colle pas du tout. Je l'utilise sur le visage le soir, c'est parfait.",
        verified: true,
      },
      {
        author: "Julie M.",
        city: "Lyon",
        rating: 5,
        date: "2026-06-03",
        body: "La qualité se sent tout de suite. Le flacon 100 ml est vite devenu un abonnement chez moi.",
        verified: true,
      },
    ],
  },
  {
    slug: "elixir-neem-ricin",
    name: "Élixir Cuir Chevelu Neem & Ricin",
    tagline: "Assainit, densifie, apaise les démangeaisons",
    category: "capillaire",
    image: "/products/elixir-neem-ricin.jpg",
    tone: "emerald",
    featured: true,
    description:
      "Le soin qui traite le cuir chevelu, pas la longueur. Ricin noir pressé traditionnellement et neem assainissant, dans une base de baobab qui rend le mélange applicable sans alourdir. Pour les cuirs chevelus qui grattent, les tresses serrées et les lisières fragilisées.",
    skinConcerns: ["Démangeaisons", "Pellicules", "Lisière dégarnie"],
    actives: [
      { name: "Ricin noir", latin: "Ricinus communis", role: "Stimule la circulation du bulbe, épaissit la fibre." },
      { name: "Neem", latin: "Azadirachta indica", role: "Assainit un cuir chevelu sujet aux pellicules." },
      { name: "Baobab", role: "Fluidifie la formule et nourrit sans effet cartonné." },
    ],
    ritual: [
      { title: "Raies par raies", detail: "Appliquer directement sur le cuir chevelu avec l'embout, jamais en nappage." },
      { title: "Masser cinq minutes", detail: "Du bout des doigts, jamais avec les ongles. Le massage fait la moitié du travail." },
      { title: "Deux fois par semaine", detail: "Sur cheveux détachés ou entre les tresses." },
      { title: "Laisser poser une nuit", detail: "Une fois par semaine, sous un bonnet en satin." },
    ],
    variants: [
      { id: "60ml", label: "60 ml", price: 11000, inStock: true },
      { id: "120ml", label: "120 ml", price: 18500, compareAt: 22000, inStock: true },
    ],
    fragrances: [
      { id: "nature", name: "Nature", note: "L'amertume végétale franche du neem." },
      { id: "menthe", name: "Menthe poivrée", note: "Picotement frais, très apprécié sur cuir chevelu irrité." },
      { id: "lavande", name: "Lavande", note: "Apaisant, idéal pour la pose de nuit." },
    ],
    reviews: [
      {
        author: "Bineta S.",
        city: "Dakar",
        rating: 5,
        date: "2026-07-19",
        body: "Ma lisière repousse après des années de tissages. Le picotement de la version menthe est très agréable.",
        verified: true,
      },
      {
        author: "Rama D.",
        city: "Montréal",
        rating: 5,
        date: "2026-05-27",
        body: "Fini les démangeaisons sous les box braids. L'embout applicateur est vraiment bien pensé.",
        verified: true,
      },
      {
        author: "Nafissatou G.",
        city: "Dakar",
        rating: 4,
        date: "2026-03-15",
        body: "Très efficace. L'odeur du neem nature est forte, je conseille la version lavande.",
        verified: true,
      },
    ],
  },
  {
    slug: "masque-karite-baobab",
    name: "Masque Fondant Karité & Baobab",
    tagline: "Nutrition profonde pour cheveux crépus",
    category: "capillaire",
    image: "/products/masque-karite-baobab.jpg",
    tone: "linen",
    description:
      "Une texture beurre qui fond à la chaleur des mains. Conçu pour les cheveux 4A à 4C, les cheveux colorés et les longueurs abîmées par la chaleur. Il redonne du glissement au démêlage et de la définition à la boucle, sans silicone.",
    skinConcerns: ["Cheveux secs", "Casse", "Démêlage difficile"],
    actives: [
      { name: "Karité brut", role: "Gaine la fibre et limite la casse au démêlage." },
      { name: "Baobab", role: "Pénètre le cortex, restaure l'élasticité." },
      { name: "Protéines de riz", role: "Comble les brèches de la cuticule sur cheveux fragilisés." },
    ],
    ritual: [
      { title: "Sur cheveux essorés", detail: "Trop d'eau dilue le masque, trop peu empêche la répartition." },
      { title: "Section par section", detail: "Quatre sections minimum. Démêler au peigne large dans le masque." },
      { title: "Vingt minutes sous charlotte", detail: "La chaleur ouvre l'écaille. Une serviette chaude fonctionne aussi." },
      { title: "Rinçage à l'eau froide", detail: "Pour refermer la cuticule et faire briller." },
    ],
    variants: [
      { id: "200ml", label: "200 ml", price: 13500, inStock: true },
      { id: "400ml", label: "400 ml", price: 23000, compareAt: 27000, inStock: false },
    ],
    reviews: [
      {
        author: "Adja W.",
        city: "Dakar",
        rating: 5,
        date: "2026-06-21",
        body: "Le démêlage de mes 4C n'a jamais été aussi simple. Je fais durer le pot deux mois.",
        verified: true,
      },
      {
        author: "Sophie N.",
        city: "Paris",
        rating: 5,
        date: "2026-04-09",
        body: "Enfin un masque sans silicone qui fait vraiment le travail. Texture beurre, odeur douce.",
        verified: true,
      },
    ],
  },
  {
    slug: "huile-essentielle-neem",
    name: "Huile Essentielle de Neem",
    tagline: "Concentré purifiant, à diluer",
    category: "huiles-essentielles",
    image: "/products/huile-essentielle-neem.jpg",
    tone: "emerald",
    description:
      "Un concentré à respecter. Le neem s'utilise dilué, quelques gouttes dans une huile végétale ou un masque capillaire, pour renforcer l'action assainissante d'un soin. Puissant sur les peaux à imperfections tenaces et les cuirs chevelus à pellicules.",
    skinConcerns: ["Imperfections tenaces", "Pellicules", "Peau à problèmes"],
    actives: [
      {
        name: "Neem pur",
        latin: "Azadirachta indica",
        role: "Azadirachtine et acides gras : action assainissante de référence.",
      },
    ],
    ritual: [
      { title: "En cure courte", detail: "Dix jours, puis pause. Le neem n'est pas un soin d'entretien quotidien." },
    ],
    precautions: [
      "Toujours diluer : trois gouttes maximum dans une cuillère d'huile de baobab, jamais pur sur la peau.",
      "Tester au pli du coude 48 heures avant toute première application sur le visage.",
      "Déconseillé pendant la grossesse et l'allaitement, sauf avis médical.",
    ],
    variants: [{ id: "30ml", label: "30 ml", price: 9500, inStock: true }],
    reviews: [
      {
        author: "Mame Diarra F.",
        city: "Dakar",
        rating: 5,
        date: "2026-05-11",
        body: "Je l'ajoute à mon masque capillaire. Plus aucune pellicule depuis deux mois.",
        verified: true,
      },
    ],
  },
  {
    slug: "rituel-perfect-skin",
    name: "Le Rituel Perfect Skin",
    tagline: "Coffret trois gestes — purifier, traiter, nourrir",
    category: "skincare",
    image: "/products/rituel-perfect-skin.jpg",
    tone: "emerald",
    featured: true,
    badge: "Coffret",
    description:
      "Le protocole complet anti-imperfections de la maison, dans un coffret en carton recyclé doublé de lin. Perfect Skin 150 g, Huile Essentielle de Neem 30 ml et Huile de Baobab 50 ml, accompagnés de la carte-rituel qui détaille les quatre semaines de cure.",
    skinConcerns: ["Imperfections", "Marques", "Routine complète"],
    actives: [
      { name: "Soufre + Neem", role: "Le duo purifiant : nettoyage et traitement ciblé." },
      { name: "Baobab", role: "Le geste de nutrition qui évite l'effet rebond de sébum." },
    ],
    ritual: [
      { title: "Semaine 1 — Purifier", detail: "Perfect Skin matin et soir, baobab uniquement le soir." },
      { title: "Semaine 2 — Cibler", detail: "Ajouter le neem dilué en touche locale, le soir." },
      { title: "Semaine 3 — Consolider", detail: "Espacer le neem un soir sur deux, maintenir le reste." },
      { title: "Semaine 4 — Entretenir", detail: "Perfect Skin le soir seulement, baobab matin et soir." },
    ],
    variants: [
      { id: "coffret", label: "Coffret complet", price: 27500, compareAt: 30000, inStock: true },
    ],
    reviews: [
      {
        author: "Oumou C.",
        city: "Dakar",
        rating: 5,
        date: "2026-07-05",
        body: "La carte-rituel change tout. On sait exactement quoi faire semaine après semaine, sans se tromper.",
        verified: true,
      },
      {
        author: "Léa B.",
        city: "Marseille",
        rating: 5,
        date: "2026-06-16",
        body: "Offert à ma sœur, elle a racheté le coffret pour elle un mois après. Le packaging est superbe.",
        verified: true,
      },
    ],
  },

  /* ============================================================
     Univers Senteurs — premières références, ajoutées le 31/08/2026.
     Deux sous-catégories seulement (Bougies, Parfums d'ambiance) :
     Encens reste fermée, faute d'un second visuel exploitable —
     voir la feuille de route, seuil de 2 produits minimum.
     ============================================================ */
  {
    slug: "bougie-choses-simples",
    name: "Les Choses Simples",
    line: "Bougies MOZAIS",
    tagline: "Bougie parfumée trois mèches — senteur des beaux jours",
    category: "bougies",
    image: "/products/bougie-choses-simples.jpg",
    tone: "gold",
    featured: true,
    description:
      "Coulée dans un verre ambré, trois mèches pour une diffusion large sans qu'aucune ne noie les autres. Le label dessiné à la plume évoque un jardin de fin d'été — la senteur suit : foin coupé, fleurs sauvages, une pointe de miel.",
    skinConcerns: ["Ambiance chaleureuse", "Soirée", "Ne charbonne pas"],
    actives: [
      { name: "Cire de soja", role: "Combustion propre, sans suie ni composés volatils inutiles." },
      {
        name: "Trois mèches en coton",
        role: "Diffusion homogène sur toute la largeur du verre, sans tunnel.",
      },
      {
        name: "Huile parfumée dosée à 8 %",
        role: "Assez concentrée pour tenir la pièce sans devenir entêtante.",
      },
    ],
    ritual: [
      {
        title: "Première combustion : deux heures",
        detail:
          "Laisser la cire fondre jusqu'aux bords du verre avant d'éteindre — sinon elle garde son premier diamètre et creuse un tunnel pour toujours.",
      },
      {
        title: "Couper la mèche à 5 mm",
        detail:
          "Avant chaque allumage suivant, une fois la cire refroidie. Une mèche trop longue noircit le verre et fait fumer la flamme.",
      },
      {
        title: "Quatre heures maximum",
        detail:
          "Laisser refroidir au moins deux heures entre deux combustions — la cire liquide en surface a besoin de se figer.",
      },
    ],
    precautions: [
      "Ne jamais laisser une bougie allumée sans surveillance.",
      "Brûler sur une surface stable, à l'écart des courants d'air, des tissus et de tout objet inflammable.",
      "Hors de portée des enfants et des animaux.",
      "Éteindre à 1 cm du fond du verre : ne pas brûler jusqu'au bout.",
    ],
    variants: [{ id: "180g", label: "180 g", price: 9500, inStock: true }],
    reviews: [],
  },
  {
    slug: "bougie-vetiver-fume",
    name: "Vétiver Fumé",
    line: "Bougies MOZAIS",
    tagline: "Bougie parfumée — vétiver boisé et fumé",
    category: "bougies",
    image: "/products/bougie-vetiver-fume.jpg",
    tone: "emerald",
    featured: true,
    description:
      "La plus sombre de la maison. Un vétiver racinaire, fumé, posé sur un fond boisé sec — pensée pour les pièces où l'on reçoit tard. Verre dépoli, mèche unique, combustion lente.",
    skinConcerns: ["Ambiance chaleureuse", "Soirée", "Registre boisé"],
    actives: [
      { name: "Cire de soja", role: "Combustion propre, sans suie ni composés volatils inutiles." },
      { name: "Vétiver", latin: "Chrysopogon zizanioides", role: "Racine fumée, boisée, la colonne vertébrale du parfum." },
      { name: "Mèche en bois", role: "Crépite légèrement à la combustion, renforce le registre fumé." },
    ],
    ritual: [
      {
        title: "Première combustion : deux heures",
        detail: "Jusqu'aux bords du verre, comme pour toute bougie à mèche large — c'est ce qui évite le tunnel.",
      },
      {
        title: "Couper la mèche à 5 mm",
        detail: "La mèche en bois s'entretient comme une mèche coton : on la raccourcit, on ne la casse pas.",
      },
    ],
    precautions: [
      "Ne jamais laisser une bougie allumée sans surveillance.",
      "Brûler sur une surface stable, à l'écart des courants d'air, des tissus et de tout objet inflammable.",
      "Hors de portée des enfants et des animaux.",
    ],
    variants: [{ id: "180g", label: "180 g", price: 10500, inStock: true }],
    reviews: [],
  },
  {
    slug: "parfum-rose-de-saba",
    name: "Rose de Saba",
    line: "L'Office des Parfums",
    tagline: "Parfum d'intérieur — linge & maison, 500 ml",
    category: "parfums-ambiance",
    image: "/products/parfum-rose-de-saba.jpg",
    tone: "linen",
    featured: true,
    description:
      "Un format généreux pour vaporiser sans compter — linge de maison, canapés, rideaux, chambres. La rose s'ouvre franche puis s'assagit sur un fond boisé, sans jamais tourner sucré.",
    skinConcerns: ["Linge & textile", "Chambre", "Ambiance"],
    actives: [
      {
        name: "Alcool parfumé haute concentration",
        role: "Tient sur le tissu plusieurs heures sans laisser d'auréole.",
      },
      { name: "Rose de Damas", role: "Note de cœur florale et ronde, jamais poudrée." },
      { name: "Bois de cachemire", role: "Fond boisé doux qui prolonge la tenue sur le textile." },
    ],
    ritual: [
      { title: "Vaporiser à 30 cm", detail: "Sur le linge ou le tissu, jamais au contact direct de la peau." },
      { title: "Laisser sécher à l'air libre", detail: "Avant de replier ou de s'asseoir — quelques minutes suffisent." },
      {
        title: "Un passage suffit",
        detail: "Deux à trois pressions par pièce ; insister n'allonge pas la tenue, ça sature juste l'air.",
      },
    ],
    precautions: [
      "Tester sur une zone cachée avant d'utiliser sur un tissu délicat (soie, cuir).",
      "Ne jamais vaporiser à proximité d'une flamme ou d'une source de chaleur.",
      "Éviter le contact avec les yeux.",
    ],
    variants: [{ id: "500ml", label: "500 ml", price: 13500, inStock: true }],
    reviews: [],
  },
  {
    slug: "parfum-patchouli",
    name: "Patchouli",
    line: "L'Office des Parfums",
    tagline: "Brume & diffuseur, duo pour la maison",
    category: "parfums-ambiance",
    image: "/products/parfum-patchouli.jpg",
    tone: "earth",
    description:
      "Le duo qui parfume vite et qui parfume long : la brume pour l'effet immédiat, le diffuseur à bâtonnets pour la diffusion continue les jours suivants. Le patchouli, terreux et chaud, s'installe sans jamais devenir entêtant.",
    skinConcerns: ["Ambiance", "Diffusion continue", "Pièces de vie"],
    actives: [
      { name: "Patchouli", role: "Note de fond terreuse et chaude, la colonne vertébrale du parfum." },
      { name: "Bâtonnets rotin", role: "Remontent le parfum du flacon en continu, sans flamme ni chaleur." },
    ],
    ritual: [
      { title: "La brume en entrée", detail: "Un passage dans la pièce pour un effet immédiat, en arrivant." },
      { title: "Le diffuseur en fond", detail: "Retourner les bâtonnets une fois par semaine pour raviver la diffusion." },
    ],
    precautions: [
      "Tenir hors de portée des enfants et des animaux — le flacon du diffuseur n'est pas scellé.",
      "Ne pas ingérer, ne pas appliquer sur la peau.",
    ],
    variants: [{ id: "duo", label: "Duo brume + diffuseur", price: 15500, inStock: true }],
    reviews: [],
  },

  /* ============================================================
     Encens et essences sur charbon — ouvre le 31/08/2026 avec ces
     deux références.

     TODO (placeholder assumé) : le bloc « Le geste » de la fiche
     thiouraye utilise provisoirement la photo fournie montrant un
     brûle-parfum sur braise à côté d'une brume et d'une bougie de
     marque tierce (Durance) clairement lisible sur les étiquettes.
     Intégrée à la demande explicite du 31/08/2026 (« en attendant,
     je la modifierai plus tard ») — le recadrage n'exclut pas les
     étiquettes, la scène entière ayant été demandée telle quelle.
     À remplacer par une photo maison dès qu'elle existe : présenter
     durablement le produit d'un tiers sur une fiche MOZAIS reste un
     risque de marque à ne pas laisser traîner en production.
     ============================================================ */
  {
    slug: "encens-thiouraye",
    name: "Thiouraye",
    tagline: "Encens traditionnel sénégalais, à braise",
    category: "encens",
    image: "/products/encens-thiouraye.jpg",
    tone: "earth",
    featured: true,
    description:
      "L'encens le plus ancien de la maison — un mélange de copeaux de bois et de résines parfumées, tel qu'on le brûle à Dakar depuis des générations pour accueillir un hôte ou parfumer un boubou avant une cérémonie. Sur braise, il dégage une fumée dense et enveloppante, loin des bâtonnets fins vendus ailleurs.",
    lifestyle: {
      image: "/editorial/encens-brule-parfum.jpg",
      alt: "Thiouraye brûlant sur charbon dans un brûle-parfum, volute de fumée montante",
      caption: "« On fait circuler le tissu dans la fumée — jamais l'inverse. »",
    },
    skinConcerns: ["Ambiance", "Tradition", "Réception"],
    actives: [
      {
        name: "Copeaux de bois parfumés",
        role: "La base du mélange — dense, elle brûle lentement et longtemps sur la braise.",
      },
      { name: "Résines naturelles", role: "Fixent le parfum et l'intensifient à la chaleur du charbon." },
    ],
    ritual: [
      {
        title: "Allumer le charbon d'abord",
        detail: "Laisser le charbon devenir incandescent avant d'y déposer le thiouraye — jamais l'inverse.",
      },
      {
        title: "Une pincée suffit",
        detail: "Déposer une petite quantité sur la braise ; le mélange est dense et se consume lentement.",
      },
      {
        title: "Passer le tissu au-dessus",
        detail:
          "Le geste traditionnel : on fait circuler le boubou ou le tissu dans la fumée plutôt que de simplement parfumer la pièce.",
      },
    ],
    precautions: [
      "Utiliser uniquement sur un charbon dédié à l'encens, dans un brûle-parfum stable et ininflammable.",
      "Toujours dans une pièce ventilée — ne jamais laisser sans surveillance.",
      "Hors de portée des enfants : le charbon reste brûlant longtemps après l'extinction de la flamme visible.",
    ],
    variants: [{ id: "100g", label: "100 g", price: 8000, inStock: true }],
    reviews: [],
  },
  {
    slug: "encens-pastilles-santal",
    name: "Pastilles de Résine Santal",
    tagline: "Pastilles à braise, format découverte",
    category: "encens",
    image: "/products/encens-fondants-santal.jpg",
    tone: "gold",
    description:
      "Des pastilles de résine compressée, plus simples à doser qu'un mélange en vrac — une pincée de braise suffit à en faire fondre le parfum. Le santal y domine, chaud et laiteux, pensé pour qui découvre l'encens sur charbon.",
    skinConcerns: ["Ambiance", "Découverte", "Registre boisé"],
    actives: [
      {
        name: "Résine de santal compressée",
        role: "Se consume proprement, sans à-coups, contrairement à un mélange en copeaux.",
      },
    ],
    ritual: [
      {
        title: "Une pastille par braise",
        detail: "Ne pas superposer plusieurs pastilles — une seule suffit pour une diffusion complète.",
      },
      {
        title: "Laisser fondre, ne pas souffler",
        detail:
          "La pastille se consume d'elle-même sur la braise ; souffler dessus disperse la fumée sans l'intensifier.",
      },
    ],
    precautions: [
      "Utiliser uniquement sur un charbon dédié à l'encens, dans un brûle-parfum stable et ininflammable.",
      "Toujours dans une pièce ventilée — ne jamais laisser sans surveillance.",
      "Hors de portée des enfants et des animaux.",
    ],
    variants: [{ id: "12pc", label: "Boîte de 12 pastilles", price: 7500, inStock: true }],
    reviews: [],
  },
];

/* ---------- Accès ---------- */

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getFeatured() {
  return PRODUCTS.filter((p) => p.featured);
}

export function getByCategory(slug: CategorySlug) {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Prix affiché en vignette : celui de la plus petite déclinaison. */
export function fromPrice(product: Product) {
  return Math.min(...product.variants.map((v) => v.price));
}

export function averageRating(product: Product) {
  if (!product.reviews.length) return 0;
  const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / product.reviews.length) * 10) / 10;
}

/** Toutes les préoccupations du catalogue, dédupliquées — sert de facette. */
export function allConcerns() {
  return Array.from(new Set(PRODUCTS.flatMap((p) => p.skinConcerns))).sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
}
