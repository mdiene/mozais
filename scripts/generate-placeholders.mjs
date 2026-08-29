/**
 * Génère les visuels produits de substitution dans /public/products.
 *
 * Ce sont des SVG composés aux couleurs de la marque, pas des « image
 * manquante » : le site est présentable tel quel. Remplacez chaque fichier
 * par votre photo en gardant le même nom (l'extension peut devenir .jpg,
 * il faut alors ajuster `image` dans src/lib/products.ts).
 *
 *   node scripts/generate-placeholders.mjs
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../public/products");
mkdirSync(outDir, { recursive: true });

const TONES = {
  linen: { from: "#F4EFEA", to: "#E3DAD0", object: "#FDFBF9", ink: "#2E1911", accent: "#C5A059" },
  emerald: { from: "#1B3022", to: "#0F1D14", object: "#F4EFEA", ink: "#E3CD9B", accent: "#C5A059" },
  gold: { from: "#F6EFDF", to: "#E3CD9B", object: "#FDFBF9", ink: "#2E1911", accent: "#1B3022" },
  earth: { from: "#3A2018", to: "#22120C", object: "#EBE3DA", ink: "#E3CD9B", accent: "#C5A059" },
};

const LOTUS = `
  <g transform="translate(400 %CY%) scale(%S%) translate(-100 -76)">
    <path d="M26 66 C 30 108, 60 134, 96 138" stroke="%C%" stroke-width="13" stroke-linecap="round" fill="none"/>
    <path d="M174 66 C 170 108, 140 134, 104 138" stroke="%C%" stroke-width="13" stroke-linecap="round" fill="none"/>
    <g fill="%C%">
      <path d="M100 8 C 116 38, 122 62, 116 86 C 112 104, 100 118, 100 118 C 100 118, 88 104, 84 86 C 78 62, 84 38, 100 8 Z" transform="rotate(-34 100 122)"/>
      <path d="M100 8 C 116 38, 122 62, 116 86 C 112 104, 100 118, 100 118 C 100 118, 88 104, 84 86 C 78 62, 84 38, 100 8 Z" transform="rotate(34 100 122)"/>
      <path d="M100 4 C 118 36, 125 64, 118 90 C 113 110, 100 126, 100 126 C 100 126, 87 110, 82 90 C 75 64, 82 36, 100 4 Z"/>
    </g>
  </g>`;

/** Un SVG est du XML : « Karité & Miel » sans échappement casse le parsing
 *  et l'image ne s'affiche pas du tout. */
const xml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const lotus = (color, cy, scale) =>
  LOTUS.replaceAll("%C%", color).replace("%CY%", cy).replace("%S%", scale);

/** Pain de savon / boîte, vu de face, légèrement en perspective. */
function barShape(t) {
  return `
    <g>
      <ellipse cx="400" cy="742" rx="212" ry="26" fill="${t.ink}" opacity="0.13"/>
      <rect x="212" y="366" width="376" height="376" rx="10" fill="${t.object}"/>
      <rect x="212" y="366" width="376" height="376" rx="10" fill="none" stroke="${t.accent}" stroke-width="1.6" opacity="0.55"/>
      <path d="M212 400 H588" stroke="${t.accent}" stroke-width="1" opacity="0.35"/>
      <path d="M212 708 H588" stroke="${t.accent}" stroke-width="1" opacity="0.35"/>
      ${lotus(t.accent, 486, 0.52)}
    </g>`;
}

/** Flacon compte-gouttes. */
function bottleShape(t) {
  return `
    <g>
      <ellipse cx="400" cy="752" rx="150" ry="22" fill="${t.ink}" opacity="0.13"/>
      <rect x="366" y="286" width="68" height="70" rx="6" fill="${t.accent}" opacity="0.9"/>
      <rect x="356" y="348" width="88" height="26" rx="4" fill="${t.accent}"/>
      <path d="M296 374 H504 V700 a52 52 0 0 1 -52 52 H348 a52 52 0 0 1 -52 -52 Z" fill="${t.object}"/>
      <path d="M296 374 H504 V700 a52 52 0 0 1 -52 52 H348 a52 52 0 0 1 -52 -52 Z" fill="none" stroke="${t.accent}" stroke-width="1.6" opacity="0.55"/>
      <path d="M320 396 v300" stroke="#FFFFFF" stroke-width="10" opacity="0.5" stroke-linecap="round"/>
      ${lotus(t.accent, 520, 0.42)}
    </g>`;
}

/** Coffret rituel — boîte avec couvercle. */
function boxShape(t) {
  return `
    <g>
      <ellipse cx="400" cy="736" rx="228" ry="26" fill="${t.ink}" opacity="0.13"/>
      <rect x="196" y="424" width="408" height="312" rx="8" fill="${t.object}"/>
      <rect x="180" y="376" width="440" height="66" rx="8" fill="${t.object}"/>
      <rect x="180" y="376" width="440" height="66" rx="8" fill="none" stroke="${t.accent}" stroke-width="1.6" opacity="0.6"/>
      <rect x="196" y="424" width="408" height="312" rx="8" fill="none" stroke="${t.accent}" stroke-width="1.6" opacity="0.5"/>
      <path d="M400 442 V736" stroke="${t.accent}" stroke-width="1" opacity="0.3"/>
      ${lotus(t.accent, 560, 0.5)}
    </g>`;
}

const SHAPES = { bar: barShape, bottle: bottleShape, box: boxShape };

const ITEMS = [
  { file: "perfect-skin", tone: "linen", shape: "bar", label: "Perfect Skin" },
  { file: "perfect-skin-scene", tone: "emerald", shape: "bar", label: "Perfect Skin" },
  { file: "hydra-karite-miel", tone: "gold", shape: "bar", label: "Karité & Miel" },
  { file: "hydra-aloe-moringa", tone: "emerald", shape: "bar", label: "Aloé & Moringa" },
  { file: "hydra-charbon-detox", tone: "earth", shape: "bar", label: "Charbon Actif" },
  { file: "hydra-curcuma-miel", tone: "gold", shape: "bar", label: "Curcuma & Miel" },
  { file: "huile-baobab", tone: "gold", shape: "bottle", label: "Huile de Baobab" },
  { file: "elixir-neem-ricin", tone: "emerald", shape: "bottle", label: "Neem & Ricin" },
  { file: "masque-karite-baobab", tone: "linen", shape: "box", label: "Masque Fondant" },
  { file: "huile-essentielle-neem", tone: "emerald", shape: "bottle", label: "Neem pur" },
  { file: "rituel-perfect-skin", tone: "emerald", shape: "box", label: "Le Rituel" },
];

for (const item of ITEMS) {
  const t = TONES[item.tone];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="${t.from}"/>
      <stop offset="1" stop-color="${t.to}"/>
    </linearGradient>
    <radialGradient id="key" cx="0.28" cy="0.18" r="0.85">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="800" height="1000" fill="url(#bg)"/>
  <rect width="800" height="1000" fill="url(#key)"/>

  ${SHAPES[item.shape](t)}

  <text x="400" y="866" text-anchor="middle" fill="${t.ink}" opacity="0.72"
        font-family="Georgia, 'Cormorant Garamond', serif" font-size="38" letter-spacing="1">${xml(item.label)}</text>
  <text x="400" y="908" text-anchor="middle" fill="${t.ink}" opacity="0.45"
        font-family="system-ui, sans-serif" font-size="15" letter-spacing="6">M O Z A I S</text>

  <rect width="800" height="1000" filter="url(#grain)" opacity="0.05" style="mix-blend-mode:multiply"/>
</svg>
`;
  writeFileSync(resolve(outDir, `${item.file}.svg`), svg, "utf8");
}

console.log(`${ITEMS.length} visuels générés dans public/products/`);
