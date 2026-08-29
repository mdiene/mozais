"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MAX_QTY, shippingFor } from "@/lib/commerce";

export type CartLine = {
  /** Clé unique : produit + déclinaison + fragrance. */
  key: string;
  slug: string;
  name: string;
  line?: string;
  image: string;
  variantId: string;
  variantLabel: string;
  fragranceId?: string;
  fragranceName?: string;
  unitPrice: number;
  quantity: number;
};

export type AddPayload = Omit<CartLine, "key" | "quantity"> & { quantity?: number };

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  /** Ligne ajoutée en dernier — sert à la mettre en avant dans le tiroir. */
  lastAdded: string | null;

  add: (payload: AddPayload) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

function makeKey(slug: string, variantId: string, fragranceId?: string) {
  return [slug, variantId, fragranceId ?? "-"].join("::");
}

/* Les seuils vivent dans @/lib/commerce, partagés avec la route serveur. */
export { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT, MAX_QTY } from "@/lib/commerce";

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      lastAdded: null,

      add: (payload) =>
        set((state) => {
          const key = makeKey(payload.slug, payload.variantId, payload.fragranceId);
          const qty = payload.quantity ?? 1;
          const existing = state.lines.find((l) => l.key === key);

          const lines = existing
            ? state.lines.map((l) =>
                l.key === key ? { ...l, quantity: Math.min(l.quantity + qty, MAX_QTY) } : l,
              )
            : [...state.lines, { ...payload, key, quantity: Math.min(qty, MAX_QTY) }];

          return { lines, isOpen: true, lastAdded: key };
        }),

      remove: (key) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.key !== key),
          lastAdded: state.lastAdded === key ? null : state.lastAdded,
        })),

      setQuantity: (key, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.key !== key)
              : state.lines.map((l) =>
                  l.key === key ? { ...l, quantity: Math.min(quantity, MAX_QTY) } : l,
                ),
        })),

      clear: () => set({ lines: [], lastAdded: null }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false, lastAdded: null }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: "mozais-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      /* `isOpen` et `lastAdded` sont de l'état de session : ils ne doivent
         pas survivre à un rechargement de page. */
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

/**
 * Le panier vit dans localStorage : au premier rendu client, il est encore
 * vide et ne correspond donc pas au HTML rendu côté serveur. Tout ce qui
 * affiche un total ou un compteur doit attendre ce drapeau, sinon React
 * signale une erreur d'hydratation.
 */
export function useCartHydrated() {
  return useSyncExternalStore(
    (onChange) => useCart.persist.onFinishHydration(onChange),
    () => useCart.persist.hasHydrated(),
    // Côté serveur, le panier n'est jamais hydraté.
    () => false,
  );
}

/* ---------- Sélecteurs dérivés ---------- */

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
}

export function cartShipping(lines: CartLine[]) {
  return shippingFor(cartSubtotal(lines), lines.length > 0);
}

export function cartTotal(lines: CartLine[]) {
  return cartSubtotal(lines) + cartShipping(lines);
}
