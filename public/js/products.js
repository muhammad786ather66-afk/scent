/**
 * VELORA - Centralized Product Data Architecture
 * 
 * Instructions for editing:
 * - Update prices by changing the `price` property (e.g., "PKR 12,500").
 * - Image replacements: Drop official WebP or PNG files into `/assets/images/` 
 *   using filenames: midnight.webp, silver-storm.webp, royal-dusk.webp, noir-vanilla.webp.
 * - Centralized structure ensures changes reflect on the Home, Collection, and Product Detail pages automatically.
 */

window.VELORA_PRODUCTS = [
  {
    id: "midnight",
    slug: "midnight",
    name: "MIDNIGHT",
    fullName: "MIDNIGHT by VELORA",
    type: "EAU DE PARFUM",
    size: "50 ML",
    price: "PKR 0,000",
    image: "assets/images/midnight.webp",
    fallbackImage: "assets/images/midnight.svg",
    description: "Deep, mysterious, and sophisticated — a fragrance created for the moments when the night takes over.",
    character: "Mysterious & Confident",
    occasion: "Evening & Nocturnal Gatherings",
    mood: "Enigmatic, commanding, and quietly alluring.",
    features: [
      "Concentration: Eau de Parfum",
      "Nominal Volume: 50 ML / 1.7 FL. OZ.",
      "Vessel: Hand-finished octagonal bottle with faceted diamond crystal stopper",
      "Origin: Contemporary luxury fragrance crafted for lasting presence"
    ]
  },
  {
    id: "silver-storm",
    slug: "silver-storm",
    name: "SILVER STORM",
    fullName: "SILVER STORM by VELORA",
    type: "EAU DE PARFUM",
    size: "50 ML",
    price: "PKR 0,000",
    image: "assets/images/silver-storm.webp",
    fallbackImage: "assets/images/silver-storm.svg",
    description: "Fresh, energetic, and striking — a modern expression of confidence and adventure.",
    character: "Energetic & Striking",
    occasion: "Signature Daily & Dynamic Moments",
    mood: "Electrifying, crisp, and boldly confident.",
    features: [
      "Concentration: Eau de Parfum",
      "Nominal Volume: 50 ML / 1.7 FL. OZ.",
      "Vessel: Frosted ruby glass with polished chrome collar and crystal stopper",
      "Origin: Contemporary luxury fragrance crafted for lasting presence"
    ]
  },
  {
    id: "royal-dusk",
    slug: "royal-dusk",
    name: "ROYAL DUSK",
    fullName: "ROYAL DUSK by VELORA",
    type: "EAU DE PARFUM",
    size: "50 ML",
    price: "PKR 0,000",
    image: "assets/images/royal-dusk.webp",
    fallbackImage: "assets/images/royal-dusk.svg",
    description: "Refined and mysterious, inspired by the quiet sophistication of twilight.",
    character: "Refined & Contemplative",
    occasion: "Twilight Receptions & Formal Intimacy",
    mood: "Serene, regal, and effortlessly distinguished.",
    features: [
      "Concentration: Eau de Parfum",
      "Nominal Volume: 50 ML / 1.7 FL. OZ.",
      "Vessel: Frosted emerald glass with silver emblem and crystal stopper",
      "Origin: Contemporary luxury fragrance crafted for lasting presence"
    ]
  },
  {
    id: "noir-vanilla",
    slug: "noir-vanilla",
    name: "NOIR VANILLA",
    fullName: "NOIR VANILLA by VELORA",
    type: "EAU DE PARFUM",
    size: "50 ML",
    price: "PKR 0,000",
    image: "assets/images/noir-vanilla.webp",
    fallbackImage: "assets/images/noir-vanilla.svg",
    description: "Warm, sensual, and captivating, blending the richness of vanilla with a darker character.",
    character: "Sensual & Captivating",
    occasion: "Close Encounters & Autumnal Evenings",
    mood: "Velvety, resonant, and intoxicatingly dark.",
    features: [
      "Concentration: Eau de Parfum",
      "Nominal Volume: 50 ML / 1.7 FL. OZ.",
      "Vessel: Frosted dark mocha glass with silver emblem and crystal stopper",
      "Origin: Contemporary luxury fragrance crafted for lasting presence"
    ]
  }
];

// Centralized helper functions
window.getVeloraProducts = function() {
  return window.VELORA_PRODUCTS;
};

window.getVeloraProductBySlug = function(slug) {
  if (!slug) return window.VELORA_PRODUCTS[0];
  const cleaned = slug.trim().toLowerCase();
  return window.VELORA_PRODUCTS.find(p => p.slug === cleaned || p.id === cleaned) || window.VELORA_PRODUCTS[0];
};

window.getVeloraProductById = function(id) {
  return window.VELORA_PRODUCTS.find(p => p.id === id) || window.VELORA_PRODUCTS[0];
};
