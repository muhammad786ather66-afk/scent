import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Helper to generate luxury SVG bottle illustrations matching the official VELORA photography
function createBottleSvg({
  title,
  subTitle = "EAU DE PARFUM",
  glassGradientStart,
  glassGradientEnd,
  liquidGradientStart,
  liquidGradientEnd,
  bgColorTop,
  bgColorBottom,
  hasSnow = false,
  hasMoon = false,
  accentGlow = "rgba(255,255,255,0.2)"
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bgColorTop}" />
      <stop offset="65%" stop-color="${bgColorBottom}" />
      <stop offset="100%" stop-color="#07080a" />
    </linearGradient>

    <!-- Glass Body Gradient -->
    <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${glassGradientStart}" />
      <stop offset="15%" stop-color="${glassGradientEnd}" />
      <stop offset="50%" stop-color="${glassGradientStart}" stop-opacity="0.85" />
      <stop offset="85%" stop-color="${glassGradientEnd}" />
      <stop offset="100%" stop-color="${glassGradientStart}" />
    </linearGradient>

    <!-- Liquid Core Gradient -->
    <radialGradient id="liquidGrad" cx="50%" cy="55%" r="50%">
      <stop offset="0%" stop-color="${liquidGradientStart}" stop-opacity="0.9" />
      <stop offset="70%" stop-color="${liquidGradientEnd}" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#0d0e12" stop-opacity="0.98" />
    </radialGradient>

    <!-- Silver Chrome Collar -->
    <linearGradient id="silverChrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#71717a" />
      <stop offset="25%" stop-color="#e4e4e7" />
      <stop offset="45%" stop-color="#ffffff" />
      <stop offset="70%" stop-color="#a1a1aa" />
      <stop offset="100%" stop-color="#52525b" />
    </linearGradient>

    <!-- Faceted Diamond Stopper Gradient -->
    <linearGradient id="diamondFacet1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#cbd5e1" stop-opacity="0.6" />
    </linearGradient>
    <linearGradient id="diamondFacet2" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#94a3b8" stop-opacity="0.5" />
    </linearGradient>
    <linearGradient id="diamondFacet3" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#e2e8f0" stop-opacity="0.3" />
    </linearGradient>

    <!-- Drop Shadow Filter -->
    <filter id="luxuryGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="45" stdDeviation="35" flood-color="#000000" flood-opacity="0.85" />
    </filter>
  </defs>

  <!-- Background Environment -->
  <rect width="1080" height="1920" fill="url(#bgGrad)" />

  ${hasMoon ? `
  <!-- Atmospheric Moon & Night Haze -->
  <circle cx="540" cy="240" r="140" fill="#ffffff" opacity="0.12" filter="url(#luxuryGlow)" />
  <circle cx="540" cy="240" r="80" fill="#f8fafc" opacity="0.25" filter="url(#luxuryGlow)" />
  <circle cx="540" cy="240" r="40" fill="#ffffff" opacity="0.4" />
  ` : `
  <!-- Warm Ambient Light Glow -->
  <circle cx="540" cy="380" r="300" fill="${accentGlow}" opacity="0.3" filter="url(#luxuryGlow)" />
  `}

  <!-- Ground Bed / Frost / Moss / Snow Texture Base -->
  <ellipse cx="540" cy="1660" rx="460" ry="140" fill="#090a0d" opacity="0.9" />
  <path d="M0,1520 Q270,1490 540,1510 T1080,1500 L1080,1920 L0,1920 Z" fill="#0d0f14" opacity="0.75" />
  <path d="M0,1590 Q360,1550 720,1580 T1080,1560 L1080,1920 L0,1920 Z" fill="#141720" opacity="0.85" />

  <!-- Frost / Snow sparkles on ground -->
  <g opacity="0.5" fill="#e2e8f0">
    <circle cx="210" cy="1620" r="4" /><circle cx="290" cy="1680" r="3" />
    <circle cx="420" cy="1650" r="5" /><circle cx="480" cy="1720" r="3" />
    <circle cx="620" cy="1660" r="5" /><circle cx="710" cy="1630" r="4" />
    <circle cx="850" cy="1690" r="3" /><circle cx="940" cy="1640" r="4" />
    <circle cx="340" cy="1750" r="6" opacity="0.4" /><circle cx="780" cy="1740" r="5" opacity="0.4" />
  </g>

  <!-- BOTTLE REFLECTION & SHADOW -->
  <ellipse cx="540" cy="1560" rx="280" ry="45" fill="#000000" opacity="0.9" />

  <!-- BOTTLE CONTAINER (Centered at X=540) -->
  <g filter="url(#softShadow)">
    <!-- BOTTLE BODY (Cut-corner octagon: bevelled top shoulders) -->
    <!-- Top width: 500 (290 to 790), shoulder bevel to 210 and 870 at Y=830, down to Y=1520, bottom base bevelled -->
    <path d="
      M 340,700
      L 740,700
      L 870,820
      L 870,1470
      Q 870,1530 810,1540
      L 270,1540
      Q 210,1530 210,1470
      L 210,820
      Z
    " fill="url(#glassGrad)" stroke="rgba(255,255,255,0.25)" stroke-width="2" />

    <!-- Frosted Glass Liquid Core -->
    <path d="
      M 360,730
      L 720,730
      L 840,840
      L 840,1450
      Q 840,1505 790,1515
      L 290,1515
      Q 240,1505 240,1450
      L 240,840
      Z
    " fill="url(#liquidGrad)" />

    <!-- Glass Thickness / Side Bevel Reflections -->
    <!-- Left edge highlight -->
    <path d="M 215,825 L 342,705 L 355,715 L 230,830 L 230,1460 L 215,1460 Z" fill="#ffffff" opacity="0.25" />
    <path d="M 225,835 L 225,1450 L 240,1450 L 240,845 Z" fill="#ffffff" opacity="0.15" />

    <!-- Right edge highlight -->
    <path d="M 865,825 L 738,705 L 725,715 L 850,830 L 850,1460 L 865,1460 Z" fill="#000000" opacity="0.35" />
    <path d="M 855,835 L 855,1450 L 840,1450 L 840,845 Z" fill="#ffffff" opacity="0.12" />

    <!-- Base Glass Footing (Heavy crystal base) -->
    <path d="M 240,1450 L 840,1450 L 820,1515 L 260,1515 Z" fill="rgba(255,255,255,0.08)" />
    <line x1="280" y1="1450" x2="800" y2="1450" stroke="rgba(255,255,255,0.2)" stroke-width="2" />

    <!-- Internal Dip Tube (Subtle translucent line) -->
    <path d="M 537,690 L 537,1200 Q 537,1380 460,1480" stroke="rgba(255,255,255,0.2)" stroke-width="5" fill="none" stroke-linecap="round" />

    <!-- BOTTLE NECK & CHROME COLLAR -->
    <!-- Neck -->
    <rect x="470" y="650" width="140" height="50" fill="#27272a" />
    <!-- Polished Silver Collar Rings -->
    <rect x="420" y="620" width="240" height="40" rx="8" fill="url(#silverChrome)" stroke="#ffffff" stroke-width="1.5" />
    <rect x="435" y="605" width="210" height="20" rx="4" fill="url(#silverChrome)" />
    <rect x="450" y="580" width="180" height="30" rx="5" fill="url(#silverChrome)" />

    <!-- DIAMOND FACETED CRYSTAL STOPPER -->
    <!-- Stopper Head (Facet diamond geometry) -->
    <!-- Center top table facet -->
    <polygon points="420,330 660,330 760,420 320,420" fill="url(#diamondFacet1)" stroke="rgba(255,255,255,0.8)" stroke-width="2" />
    <!-- Lower pavilion facets converging to collar -->
    <polygon points="320,420 540,580 420,420" fill="url(#diamondFacet2)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" />
    <polygon points="420,420 540,580 660,420" fill="url(#diamondFacet1)" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" opacity="0.95" />
    <polygon points="660,420 540,580 760,420" fill="url(#diamondFacet3)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" />
    
    <!-- Central faceted diamond star glints -->
    <polygon points="480,380 600,380 540,490" fill="#ffffff" opacity="0.4" />
    <circle cx="540" cy="420" r="6" fill="#ffffff" filter="url(#luxuryGlow)" />

    <!-- BRAND EMBLEM: Intertwined Double-V Monogram -->
    <g transform="translate(540, 970) scale(0.95)">
      <!-- Left V with flourishes -->
      <path d="M -80,-60 L -30,60 L 0,-10" fill="none" stroke="#e4e4e7" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M -80,-60 C -100,-70 -115,-40 -90,-20 C -65,0 -40,10 -30,60" fill="none" stroke="#d4d4d8" stroke-width="5" />
      <!-- Right V with flourishes -->
      <path d="M 0,-10 L 30,60 L 80,-60" fill="none" stroke="#e4e4e7" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 80,-60 C 100,-70 115,-40 90,-20 C 65,0 40,10 30,60" fill="none" stroke="#d4d4d8" stroke-width="5" />
      <!-- Central apex drop -->
      <path d="M 0,-30 L 0,35" stroke="#f4f4f5" stroke-width="4" stroke-linecap="round" />
      <!-- Silver metallic sheen overlay -->
      <circle cx="0" cy="10" r="8" fill="#ffffff" opacity="0.6" filter="url(#luxuryGlow)" />
    </g>

    <!-- PRODUCT TITLE (Exact Fragrance Name in Luxury Serif) -->
    <text x="540" y="1170" 
          font-family="'Playfair Display', 'Cinzel', 'Didot', 'Times New Roman', serif" 
          font-size="52" 
          font-weight="600" 
          letter-spacing="10" 
          fill="#f4f4f5" 
          text-anchor="middle"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
      ${title}
    </text>

    <!-- SUBTITLE (EAU DE PARFUM in Clean Sans-Serif) -->
    <text x="540" y="1370" 
          font-family="'Plus Jakarta Sans', 'Montserrat', 'Inter', sans-serif" 
          font-size="24" 
          font-weight="400" 
          letter-spacing="8" 
          fill="#e4e4e7" 
          text-anchor="middle" 
          opacity="0.9">
      ${subTitle}
    </text>

    ${hasSnow ? `
    <!-- Atmospheric Snow / Frost Droplets on Midnight bottle -->
    <g fill="#ffffff" opacity="0.55">
      <circle cx="340" cy="890" r="3" /><circle cx="390" cy="940" r="2.5" />
      <circle cx="430" cy="860" r="4" /><circle cx="680" cy="920" r="3.5" />
      <circle cx="720" cy="850" r="2.5" /><circle cx="310" cy="1180" r="3" />
      <circle cx="760" cy="1220" r="3.5" /><circle cx="640" cy="1420" r="3" />
      <circle cx="380" cy="1390" r="4" /><circle cx="480" cy="1440" r="2.5" />
      <!-- Water trickle streak -->
      <path d="M 430,864 Q 432,920 430,950" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.3" fill="none" />
      <path d="M 680,924 Q 678,980 682,1010" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.25" fill="none" />
    </g>
    ` : ''}

  </g>
</svg>`;
}

// Generate the 4 official fragrances matching the user's uploaded photography
const fragrances = [
  {
    id: "midnight",
    filename: "midnight",
    title: "MIDNIGHT",
    subTitle: "EAU DE PARFUM",
    glassGradientStart: "#3b2314",
    glassGradientEnd: "#1f130b",
    liquidGradientStart: "#8b4513",
    liquidGradientEnd: "#2c1508",
    bgColorTop: "#080c14",
    bgColorBottom: "#0f172a",
    hasSnow: true,
    hasMoon: true,
    accentGlow: "rgba(147, 197, 253, 0.25)"
  },
  {
    id: "silver-storm",
    filename: "silver-storm",
    title: "SILVER STORM",
    subTitle: "EAU DE PARFUM",
    glassGradientStart: "#581c2b",
    glassGradientEnd: "#2e0d16",
    liquidGradientStart: "#881337",
    liquidGradientEnd: "#3f0a17",
    bgColorTop: "#1c1014",
    bgColorBottom: "#13090c",
    hasSnow: false,
    hasMoon: false,
    accentGlow: "rgba(244, 63, 94, 0.2)"
  },
  {
    id: "royal-dusk",
    filename: "royal-dusk",
    title: "ROYAL DUSK",
    subTitle: "EAU DE PARFUM",
    glassGradientStart: "#134e4a",
    glassGradientEnd: "#0b2e2b",
    liquidGradientStart: "#115e59",
    liquidGradientEnd: "#062320",
    bgColorTop: "#0d1a19",
    bgColorBottom: "#091211",
    hasSnow: false,
    hasMoon: false,
    accentGlow: "rgba(45, 212, 191, 0.2)"
  },
  {
    id: "noir-vanilla",
    filename: "noir-vanilla",
    title: "NOIR VANILLA",
    subTitle: "EAU DE PARFUM",
    glassGradientStart: "#382417",
    glassGradientEnd: "#1e130c",
    liquidGradientStart: "#54331a",
    liquidGradientEnd: "#23140a",
    bgColorTop: "#16110e",
    bgColorBottom: "#0d0a08",
    hasSnow: false,
    hasMoon: false,
    accentGlow: "rgba(217, 119, 6, 0.2)"
  }
];

const targetDirs = [
  path.resolve('./assets/images'),
  path.resolve('./public/assets/images')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

fragrances.forEach(frag => {
  const svgContent = createBottleSvg(frag);
  
  targetDirs.forEach(dir => {
    const svgPath = path.join(dir, `${frag.filename}.svg`);
    const webpPath = path.join(dir, `${frag.filename}.webp`);
    fs.writeFileSync(svgPath, svgContent, 'utf-8');

    try {
      // Use convert from ImageMagick to generate high-resolution webp
      execSync(`convert "${svgPath}" -quality 92 "${webpPath}"`);
      console.log(`Successfully generated ${webpPath}`);
    } catch (err) {
      console.warn(`Could not convert ${svgPath} to webp, using svg copy as webp fallback:`, err.message);
      fs.copyFileSync(svgPath, webpPath);
    }
  });
});

console.log('All 4 VELORA official fragrance images generated successfully.');
