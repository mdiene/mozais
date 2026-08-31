import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Marque MOZAIS — lotus-flamme, détourée depuis les fichiers logo
 * officiels (public/brand/lotus-gold.png, lotus-black.png ; voir
 * scripts/cutout-logo.mjs). Un PNG à canal alpha ne suit pas
 * `currentColor` comme le faisait l'ancien tracé SVG dessiné à la
 * main — la couleur se choisit donc via `variant`, pas via une
 * classe `text-*` sur un parent.
 *
 * Dans tout le site sauf mention contraire, c'est la version or qui
 * est utilisée — y compris dans l'en-tête, qui affichait jusqu'ici la
 * marque en vert émeraude : harmonisé avec le footer et le menu
 * mobile, qui étaient déjà en or.
 */
const SOURCES = {
  gold: "/brand/lotus-gold.png",
  black: "/brand/lotus-black.png",
} as const;

// Proportions réelles du fichier détouré (~1.24:1) — sert uniquement
// au calcul d'aspect-ratio de next/image ; la taille affichée est
// pilotée par la classe passée en `className` (w-*, h-auto).
const INTRINSIC = { width: 413, height: 334 };

export function LotusMark({
  className,
  variant = "gold",
}: {
  className?: string;
  variant?: keyof typeof SOURCES;
}) {
  return (
    <Image
      src={SOURCES[variant]}
      alt="Lotus MOZAIS"
      width={INTRINSIC.width}
      height={INTRINSIC.height}
      className={cn("h-auto w-full", className)}
    />
  );
}

/**
 * Signature complète : lotus + mot-marque.
 * `stacked` pour les zones verticales (footer, hero), sinon en ligne.
 */
export function Logo({
  className,
  stacked = false,
  showMark = true,
  variant = "gold",
}: {
  className?: string;
  stacked?: boolean;
  showMark?: boolean;
  variant?: keyof typeof SOURCES;
}) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-center",
        stacked ? "flex-col gap-3" : "gap-2.5",
        className,
      )}
    >
      {showMark && <LotusMark variant={variant} className={stacked ? "w-12" : "w-6"} />}
      <span
        className="font-display leading-none"
        style={{ letterSpacing: "0.22em", fontWeight: 300 }}
      >
        MOZAIS
      </span>
    </span>
  );
}
