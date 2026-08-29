import Image from "next/image";
import Link from "next/link";
import { Stars } from "@/components/ui/Stars";
import { averageRating, fromPrice, type Product } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";

const TONE_BG: Record<Product["tone"], string> = {
  linen: "bg-linen-deep",
  emerald: "bg-emerald-wash",
  gold: "bg-gold-wash",
  earth: "bg-linen-shade",
};

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const rating = averageRating(product);
  const soldOut = product.variants.every((v) => !v.inStock);

  return (
    <article className={cn("group", className)}>
      <Link href={`/produits/${product.slug}`} className="block">
        <div
          className={cn(
            "relative aspect-4/5 overflow-hidden",
            TONE_BG[product.tone],
          )}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
          />

          {product.badge && !soldOut && (
            <span className="absolute left-0 top-4 bg-emerald-deep px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-gold-pale">
              {product.badge}
            </span>
          )}
          {soldOut && (
            <span className="absolute left-0 top-4 bg-earth px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-linen">
              Épuisé
            </span>
          )}

          {/* Voile au survol : le geste, pas un bouton flottant. */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-emerald-deep/92 px-4 py-3.5 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-gold-pale transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
            Voir le rituel
          </span>
        </div>

        <div className="pt-4">
          {product.line && (
            <p className="text-[9px] uppercase tracking-[0.24em] text-gold">
              {product.line}
            </p>
          )}
          <h3 className="mt-1 font-display text-[1.35rem] font-light leading-tight text-earth transition-colors group-hover:text-emerald-deep">
            {product.name}
          </h3>
          <p className="mt-1 text-[12.5px] leading-snug text-earth-soft">
            {product.tagline}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-[13px] tabular-nums text-earth">
              {product.variants.length > 1 && (
                <span className="text-earth-muted">dès </span>
              )}
              {formatPrice(fromPrice(product))}
            </p>
            {rating > 0 && (
              <span className="flex items-center gap-1.5">
                <Stars rating={rating} size={11} />
                <span className="text-[11px] text-earth-muted">
                  ({product.reviews.length})
                </span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
