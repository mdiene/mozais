"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

/**
 * Sélection déclinaison + fragrance, puis ajout au panier.
 * Toute la logique d'achat de la fiche produit tient ici : c'est le seul
 * îlot client de la page, le reste reste rendu côté serveur.
 */
export function AddToCart({ product }: { product: Product }) {
  const add = useCart((s) => s.add);

  const [variantId, setVariantId] = useState(
    product.variants.find((v) => v.inStock)?.id ?? product.variants[0].id,
  );
  const [fragranceId, setFragranceId] = useState(product.fragrances?.[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId)!;
  const fragrance = product.fragrances?.find((f) => f.id === fragranceId);

  function handleAdd() {
    add({
      slug: product.slug,
      name: product.name,
      line: product.line,
      image: product.image,
      variantId: variant.id,
      variantLabel: variant.label,
      fragranceId: fragrance?.id,
      fragranceName: fragrance?.name,
      unitPrice: variant.price,
      quantity,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2200);
  }

  return (
    <div className="mt-8">
      {/* Prix */}
      <div className="flex items-baseline gap-3">
        <p className="font-display text-3xl font-light text-emerald-deep tabular-nums">
          {formatPrice(variant.price)}
        </p>
        {variant.compareAt && (
          <p className="text-sm text-earth-muted line-through tabular-nums">
            {formatPrice(variant.compareAt)}
          </p>
        )}
        {variant.compareAt && (
          <span className="bg-gold-wash px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-deep">
            −{Math.round((1 - variant.price / variant.compareAt) * 100)} %
          </span>
        )}
      </div>

      {/* Déclinaisons */}
      {product.variants.length > 1 && (
        <fieldset className="mt-7">
          <legend className="eyebrow">Format</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={!v.inStock}
                onClick={() => setVariantId(v.id)}
                aria-pressed={v.id === variantId}
                className={cn(
                  "border px-4 py-2.5 text-[12px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  v.id === variantId
                    ? "border-emerald-deep bg-emerald-deep text-linen"
                    : "border-earth/20 text-earth hover:border-earth/45",
                  !v.inStock && "cursor-not-allowed line-through opacity-40",
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Fragrances */}
      {product.fragrances && product.fragrances.length > 0 && (
        <fieldset className="mt-7">
          <legend className="eyebrow">Fragrance</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.fragrances.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFragranceId(f.id)}
                aria-pressed={f.id === fragranceId}
                className={cn(
                  "border px-4 py-2.5 text-[12px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  f.id === fragranceId
                    ? "border-emerald-deep bg-emerald-deep text-linen"
                    : "border-earth/20 text-earth hover:border-earth/45",
                )}
              >
                {f.name}
              </button>
            ))}
          </div>
          {fragrance && (
            <p className="mt-3 text-[12.5px] italic leading-relaxed text-earth-soft">
              {fragrance.note}
            </p>
          )}
        </fieldset>
      )}

      {/* Quantité + ajout */}
      <div className="mt-8 flex flex-wrap items-stretch gap-3">
        <div className="flex items-center border border-earth/20">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="flex h-12 w-11 items-center justify-center text-earth-soft transition-colors hover:bg-linen-deep hover:text-earth disabled:opacity-30"
            aria-label="Diminuer la quantité"
          >
            <Minus size={13} strokeWidth={1.5} />
          </button>
          <span
            className="w-9 text-center text-sm tabular-nums"
            aria-live="polite"
            aria-label={`Quantité : ${quantity}`}
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="flex h-12 w-11 items-center justify-center text-earth-soft transition-colors hover:bg-linen-deep hover:text-earth"
            aria-label="Augmenter la quantité"
          >
            <Plus size={13} strokeWidth={1.5} />
          </button>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={handleAdd}
          disabled={!variant.inStock}
          className="min-w-[15rem] flex-1"
        >
          {!variant.inStock ? (
            "Épuisé"
          ) : justAdded ? (
            <>
              <Check size={15} strokeWidth={1.75} />
              Ajouté au panier
            </>
          ) : (
            "Ajouter au panier"
          )}
        </Button>
      </div>

      <p className="mt-4 text-[11.5px] leading-relaxed text-earth-muted">
        Expédié sous 24 h depuis Dakar · Livraison offerte dès 25 000 F CFA ·
        Paiement Wave, Orange Money ou carte
      </p>
    </div>
  );
}
