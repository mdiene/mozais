"use client";

import { ShoppingBag } from "lucide-react";
import { useCart, useCartHydrated, cartCount } from "@/store/cart";

export function CartButton() {
  const lines = useCart((s) => s.lines);
  const open = useCart((s) => s.open);
  const hydrated = useCartHydrated();
  const count = cartCount(lines);

  return (
    <button
      type="button"
      onClick={open}
      className="group relative -mr-2 flex items-center gap-2.5 p-2 text-earth transition-colors hover:text-emerald-deep"
      aria-label={
        hydrated && count > 0
          ? `Panier, ${count} article${count > 1 ? "s" : ""}`
          : "Panier"
      }
    >
      <span className="hidden text-[11px] font-medium uppercase tracking-[0.2em] sm:inline">
        Panier
      </span>
      <span className="relative">
        <ShoppingBag size={19} strokeWidth={1.25} />
        {/* Le compteur n'apparaît qu'après lecture du localStorage,
            sinon le HTML serveur et le HTML client divergent. */}
        {hydrated && count > 0 && (
          <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-deep px-1 text-[9px] font-semibold leading-none text-gold-pale">
            {count}
          </span>
        )}
      </span>
    </button>
  );
}
