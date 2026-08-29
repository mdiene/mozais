import { cn } from "@/lib/utils";

/** Étoiles en demi-pas, dessinées au clip plutôt qu'en glyphe : la
 *  demi-étoile reste nette et la couleur suit `currentColor`. */
export function Stars({
  rating,
  className,
  size = 12,
}: {
  rating: number;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 text-gold", className)}
      role="img"
      aria-label={`${rating} sur 5`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
            <defs>
              <linearGradient id={`s${i}-${Math.round(fill * 100)}`}>
                <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                <stop offset={`${fill * 100}%`} stopColor="currentColor" stopOpacity="0.22" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.6l2.47 5.28 5.53.72-4.06 3.9 1.03 5.6L10 14.4l-4.97 2.7 1.03-5.6L2 7.6l5.53-.72L10 1.6z"
              fill={`url(#s${i}-${Math.round(fill * 100)})`}
            />
          </svg>
        );
      })}
    </span>
  );
}
