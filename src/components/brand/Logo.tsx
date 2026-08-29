import { cn } from "@/lib/utils";

/**
 * Marque MOZAIS — lotus-flamme.
 * Trois flammes centrales pleines, deux pétales extérieurs en arc.
 * Hérite de `currentColor`, donc se pose en or sur crème comme en
 * crème sur émeraude.
 */
export function LotusMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 152"
      role="img"
      aria-label="Lotus MOZAIS"
      className={cn("h-auto w-full", className)}
      fill="none"
    >
      {/* Pétales extérieurs — arcs effilés */}
      <path
        d="M26 66 C 30 108, 60 134, 96 138"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M174 66 C 170 108, 140 134, 104 138"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />

      {/* Flammes intérieures */}
      <g fill="currentColor">
        <path
          d="M100 8 C 116 38, 122 62, 116 86 C 112 104, 100 118, 100 118 C 100 118, 88 104, 84 86 C 78 62, 84 38, 100 8 Z"
          transform="rotate(-34 100 122)"
        />
        <path
          d="M100 8 C 116 38, 122 62, 116 86 C 112 104, 100 118, 100 118 C 100 118, 88 104, 84 86 C 78 62, 84 38, 100 8 Z"
          transform="rotate(34 100 122)"
        />
        <path d="M100 4 C 118 36, 125 64, 118 90 C 113 110, 100 126, 100 126 C 100 126, 87 110, 82 90 C 75 64, 82 36, 100 4 Z" />
      </g>
    </svg>
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
}: {
  className?: string;
  stacked?: boolean;
  showMark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-center",
        stacked ? "flex-col gap-3" : "gap-2.5",
        className,
      )}
    >
      {showMark && <LotusMark className={stacked ? "w-12" : "w-6"} />}
      <span
        className="font-display leading-none"
        style={{ letterSpacing: "0.22em", fontWeight: 300 }}
      >
        MOZAIS
      </span>
    </span>
  );
}
