/**
 * Prépare les photos de produits pour le web.
 *
 * Déposez vos originaux (pleine résolution, tels que sortis de l'appareil
 * ou du générateur d'images) dans `assets/photos/`, puis :
 *
 *   npm run photos
 *
 * Le script écrit les versions optimisées dans `public/products/` sans
 * jamais toucher aux originaux — vous pouvez donc relancer la commande
 * après avoir changé les réglages ci-dessous.
 *
 * Un nom de fichier doit correspondre au `slug` du produit dans
 * src/lib/products.ts (ex. `perfect-skin.jpg`), ou porter un suffixe
 * `-macro-1`, `-macro-2` pour les vignettes carrées de la galerie.
 */

import { readdirSync, mkdirSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, "../assets/photos");
const outDir = resolve(here, "../public/products");

/* Le site n'affiche jamais une vignette produit au-delà de ~750 px de large
   sur un écran 2x, d'où ce plafond : au-delà, on paie du poids pour des
   pixels que personne ne voit. */
const PRESETS = {
  portrait: { width: 1200, height: 1500, fit: "cover" },
  square: { width: 900, height: 900, fit: "cover" },
};

const QUALITY = 82;
const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

mkdirSync(outDir, { recursive: true });

let files;
try {
  files = readdirSync(srcDir);
} catch {
  console.error(
    `Aucun dossier ${srcDir}.\nCréez-le et déposez-y vos photos, puis relancez.`,
  );
  process.exit(1);
}

const photos = files.filter((f) => SOURCE_EXT.has(extname(f).toLowerCase()));

if (!photos.length) {
  console.log("Aucune photo à traiter dans assets/photos/.");
  process.exit(0);
}

const kb = (n) => `${Math.round(n / 1024)} ko`;
let totalBefore = 0;
let totalAfter = 0;

for (const file of photos) {
  const base = file.slice(0, -extname(file).length);
  const preset = /-macro-\d+$/.test(base) ? PRESETS.square : PRESETS.portrait;
  const inPath = join(srcDir, file);
  const outPath = join(outDir, `${base}.jpg`);

  const before = statSync(inPath).size;
  const meta = await sharp(inPath).metadata();

  await sharp(inPath)
    .rotate() // applique l'orientation EXIF avant tout recadrage
    .resize({
      width: preset.width,
      height: preset.height,
      fit: preset.fit,
      position: "attention", // recadre autour du sujet, pas du centre géométrique
      withoutEnlargement: true,
    })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toFile(outPath);

  const after = statSync(outPath).size;
  totalBefore += before;
  totalAfter += after;

  const ratio = (meta.width / meta.height).toFixed(3);
  console.log(
    `${base.padEnd(28)} ${meta.width}×${meta.height} (${ratio})  ` +
      `${kb(before).padStart(9)} → ${kb(after).padStart(8)}`,
  );
}

console.log(
  `\n${photos.length} photo(s) — ${kb(totalBefore)} → ${kb(totalAfter)} ` +
    `(−${Math.round((1 - totalAfter / totalBefore) * 100)} %)`,
);
console.log("Écrites dans public/products/. Pensez à mettre à jour src/lib/products.ts.");
