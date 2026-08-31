/**
 * Détoure les deux fichiers logo (fond crème pour l'or, fond blanc pour
 * le noir) en PNG à canal alpha, pour un usage sur des fonds variés
 * (émeraude, crème, blanc) sans rectangle visible autour du motif.
 *
 * Méthode : distance euclidienne RVB à un échantillon du fond pris aux
 * quatre coins (le fond est un aplat quasi uniforme, mesuré à moins de
 * 15 unités d'écart entre les coins et le centre — un vignettage trop
 * léger pour justifier un seuillage HSL, qui s'est révélé moucheté par
 * le bruit JPEG). Rampe lissée (smoothstep) entre les deux seuils pour
 * un bord anti-crénelé plutôt qu'une découpe dure.
 *
 *   node scripts/cutout-logo.mjs
 */

import sharp from "sharp";
import { resolve } from "node:path";

const smoothstep = (edge0, edge1, x) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

async function sampleBackground(inPath) {
  const { data, info } = await sharp(inPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const at = (x, y) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const pts = [at(4, 4), at(width - 5, 4), at(4, height - 5), at(width - 5, height - 5)];
  const avg = [0, 1, 2].map((c) => Math.round(pts.reduce((s, p) => s + p[c], 0) / pts.length));
  return avg;
}

/** @param {number} innerR distance sous laquelle un pixel est 100% fond */
async function cutout(inPath, outPath, { innerR, outerR }) {
  const [br, bg, bb] = await sampleBackground(inPath);
  const { data, info } = await sharp(inPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const out = Buffer.alloc(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    const i = p * channels;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const dist = Math.sqrt((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2);
    // 0 tout près du fond, 1 à partir du trait — rampe lissée entre les deux.
    const alpha = smoothstep(innerR, outerR, dist);

    const o = p * 4;
    out[o] = r;
    out[o + 1] = g;
    out[o + 2] = b;
    out[o + 3] = Math.round(alpha * 255);
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    // Le cadre source laisse une large marge transparente autour du
    // motif ; on la retire pour que l'image se comporte comme un SVG
    // à viewBox ajusté, pas comme une vignette avec du vide intégré.
    .trim({ threshold: 12 })
    .resize({ width: 640, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  return { background: [br, bg, bb] };
}

const here = resolve(import.meta.dirname, "..");

const gold = await cutout(
  resolve(here, "assets/photos/logo mozais doree.jpg"),
  resolve(here, "public/brand/lotus-gold.png"),
  { innerR: 12, outerR: 40 },
);
const black = await cutout(
  resolve(here, "assets/photos/logo mozais noir.jpg"),
  resolve(here, "public/brand/lotus-black.png"),
  { innerR: 10, outerR: 60 },
);

console.log("or  — fond échantillonné:", gold.background);
console.log("noir — fond échantillonné:", black.background);
console.log("Écrits : public/brand/lotus-gold.png, public/brand/lotus-black.png");
