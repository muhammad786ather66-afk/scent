/**
 * VELORA - Centralized Fragrance Product Catalog
 * 
 * Instructions for updating:
 * - Update prices by changing the `price` property (e.g., "PKR 0,000" or "PKR 14,500").
 * - If numeric calculation is desired, update `numericPrice` (e.g., 0 or 14500).
 * - All changes automatically reflect across the entire store:
 *   Home, Collection, Product Details, Cart, and COD Checkout.
 */

window.VELORA_PRODUCTS = [
  {
    id: "midnight",
    slug: "midnight",
    name: "MIDNIGHT",
    fullName: "MIDNIGHT by VELORA",
    type: "EAU DE PARFUM",
    size: "50 ML",
    price: "Rs. 1,899",
    numericPrice: 1899,
    originalPrice: "Rs. 3,000",
    originalNumericPrice: 3000,
    discountBadge: "37% OFF",
    saveAmount: "Rs. 1,101",
    image: "assets/images/midnight.webp",
    fallbackImage: "assets/images/midnight.jpg",
    description: "Deep, mysterious, and sophisticated — a fragrance created for the moments when the night takes over.",
    character: "Mysterious & Confident",
    occasion: "Evening & Nocturnal Gatherings",
    mood: "Enigmatic, commanding, and quietly alluring.",
    available: true,
    features: [
      "Concentration: Eau de Parfum",
      "Nominal Volume: 50 ML / 1.7 FL. OZ.",
      "Vessel: Frosted amber flacon with faceted diamond crystal stopper & chrome collar",
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
    price: "Rs. 2,000",
    numericPrice: 2000,
    originalPrice: "Rs. 3,000",
    originalNumericPrice: 3000,
    discountBadge: "33% OFF",
    saveAmount: "Rs. 1,000",
    image: "assets/images/silver-storm.webp",
    fallbackImage: "assets/images/silver-storm.jpg",
    description: "Fresh, energetic, and striking — a modern expression of confidence and adventure.",
    character: "Energetic & Striking",
    occasion: "Signature Daily & Dynamic Moments",
    mood: "Electrifying, crisp, and boldly confident.",
    available: true,
    features: [
      "Concentration: Eau de Parfum",
      "Nominal Volume: 50 ML / 1.7 FL. OZ.",
      "Vessel: Frosted ruby crimson glass with polished chrome collar and crystal stopper",
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
    price: "Rs. 2,199",
    numericPrice: 2199,
    originalPrice: "Rs. 3,000",
    originalNumericPrice: 3000,
    discountBadge: "27% OFF",
    saveAmount: "Rs. 801",
    image: "assets/images/royal-dusk.webp",
    fallbackImage: "assets/images/royal-dusk.jpg",
    description: "Refined and mysterious, inspired by the quiet sophistication of twilight.",
    character: "Refined & Contemplative",
    occasion: "Twilight Receptions & Formal Intimacy",
    mood: "Serene, regal, and effortlessly distinguished.",
    available: true,
    features: [
      "Concentration: Eau de Parfum",
      "Nominal Volume: 50 ML / 1.7 FL. OZ.",
      "Vessel: Frosted emerald seafoam glass with silver emblem and crystal stopper",
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
    price: "Rs. 1,800",
    numericPrice: 1800,
    originalPrice: "Rs. 3,000",
    originalNumericPrice: 3000,
    discountBadge: "40% OFF",
    saveAmount: "Rs. 1,200",
    image: "assets/images/noir-vanilla.webp",
    fallbackImage: "assets/images/noir-vanilla.jpg",
    description: "Warm, sensual, and captivating, blending the richness of vanilla with a darker character.",
    character: "Sensual & Captivating",
    occasion: "Close Encounters & Autumnal Evenings",
    mood: "Velvety, resonant, and intoxicatingly dark.",
    available: true,
    features: [
      "Concentration: Eau de Parfum",
      "Nominal Volume: 50 ML / 1.7 FL. OZ.",
      "Vessel: Frosted dark mocha smoked glass with silver emblem and crystal stopper",
      "Origin: Contemporary luxury fragrance crafted for lasting presence"
    ]
  }
];

// Centralized helper functions
window.getVeloraProducts = function() {
  return window.VELORA_PRODUCTS || [];
};

window.getVeloraProductBySlug = function(slug) {
  if (!slug) return (window.VELORA_PRODUCTS && window.VELORA_PRODUCTS[0]) || null;
  const cleaned = String(slug).trim().toLowerCase();
  return (window.VELORA_PRODUCTS || []).find(p => p.slug === cleaned || p.id === cleaned) || window.VELORA_PRODUCTS[0];
};

window.getVeloraProductById = function(id) {
  if (!id) return null;
  const cleaned = String(id).trim().toLowerCase();
  return (window.VELORA_PRODUCTS || []).find(p => p.id === cleaned || p.slug === cleaned) || null;
};
