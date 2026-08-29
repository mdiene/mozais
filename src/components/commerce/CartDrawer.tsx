"use client";

import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LotusMark } from "@/components/brand/Logo";
import {
  useCart,
  useCartHydrated,
  cartCount,
  cartSubtotal,
  cartShipping,
  cartTotal,
  FREE_SHIPPING_THRESHOLD,
} from "@/store/cart";
import { formatPrice, cn } from "@/lib/utils";

export function CartDrawer() {
  const { lines, isOpen, close, remove, setQuantity, lastAdded } = useCart();
  const hydrated = useCartHydrated();

  const count = cartCount(lines);
  const subtotal = cartSubtotal(lines);
  const shipping = cartShipping(lines);
  const total = cartTotal(lines);
  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-earth/35 backdrop-blur-[2px] data-[state=closed]:animate-[fadeOut_300ms_ease-out] data-[state=open]:animate-[fadeIn_400ms_ease-out]" />

        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed right-0 top-0 z-[71] flex h-dvh w-full max-w-[26.5rem] flex-col bg-linen shadow-[-24px_0_60px_-30px_rgba(46,25,17,0.35)]",
            "data-[state=open]:animate-[slideIn_520ms_cubic-bezier(0.16,1,0.3,1)]",
            "data-[state=closed]:animate-[slideOut_320ms_cubic-bezier(0.65,0,0.35,1)]",
          )}
        >
          {/* En-tête */}
          <div className="flex items-center justify-between border-b border-earth/10 px-6 py-5">
            <Dialog.Title className="font-display text-2xl font-light text-emerald-deep">
              Votre panier
              {hydrated && count > 0 && (
                <span className="ml-2 align-middle font-sans text-[11px] tracking-[0.2em] text-earth-muted">
                  {count}
                </span>
              )}
            </Dialog.Title>
            <Dialog.Close
              className="-mr-2 p-2 text-earth-soft transition-colors hover:text-earth"
              aria-label="Fermer le panier"
            >
              <X size={19} strokeWidth={1.25} />
            </Dialog.Close>
          </div>

          {/* Jauge de franco de port */}
          {hydrated && lines.length > 0 && (
            <div className="border-b border-earth/10 px-6 py-4">
              <p className="text-[11px] leading-relaxed text-earth-soft">
                {missing > 0 ? (
                  <>
                    Plus que{" "}
                    <span className="font-medium text-emerald-deep">
                      {formatPrice(missing)}
                    </span>{" "}
                    pour la livraison offerte.
                  </>
                ) : (
                  <span className="font-medium text-emerald-deep">
                    Livraison offerte — c&apos;est acquis.
                  </span>
                )}
              </p>
              <div className="mt-2.5 h-px w-full bg-earth/12">
                <div
                  className="h-px bg-gold transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Lignes */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-6">
            {!hydrated ? (
              <div className="space-y-6 py-8">
                {[0, 1].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-28 w-[5.5rem] shrink-0 animate-pulse bg-linen-shade" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 w-3/4 animate-pulse bg-linen-shade" />
                      <div className="h-2.5 w-1/2 animate-pulse bg-linen-shade" />
                    </div>
                  </div>
                ))}
              </div>
            ) : lines.length === 0 ? (
              <EmptyCart onClose={close} />
            ) : (
              <ul className="divide-y divide-earth/10">
                {lines.map((line) => (
                  <li
                    key={line.key}
                    className={cn(
                      "flex gap-4 py-5 transition-colors duration-1000",
                      line.key === lastAdded && "bg-gold-wash/50",
                    )}
                  >
                    <Link
                      href={`/produits/${line.slug}`}
                      onClick={close}
                      className="relative h-28 w-[5.5rem] shrink-0 overflow-hidden bg-linen-deep"
                    >
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        sizes="88px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      {line.line && (
                        <span className="text-[9px] uppercase tracking-[0.22em] text-gold">
                          {line.line}
                        </span>
                      )}
                      <Link
                        href={`/produits/${line.slug}`}
                        onClick={close}
                        className="font-display text-lg leading-tight text-earth hover:text-emerald-deep"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-earth-muted">
                        {line.variantLabel}
                        {line.fragranceName && ` · ${line.fragranceName}`}
                      </p>

                      <div className="mt-auto flex items-end justify-between pt-3">
                        <div className="flex items-center border border-earth/20">
                          <button
                            type="button"
                            onClick={() => setQuantity(line.key, line.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center text-earth-soft transition-colors hover:bg-linen-deep hover:text-earth"
                            aria-label={`Retirer un ${line.name}`}
                          >
                            <Minus size={12} strokeWidth={1.5} />
                          </button>
                          <span className="w-7 text-center text-[11px] tabular-nums">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(line.key, line.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center text-earth-soft transition-colors hover:bg-linen-deep hover:text-earth"
                            aria-label={`Ajouter un ${line.name}`}
                          >
                            <Plus size={12} strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm tabular-nums text-earth">
                            {formatPrice(line.unitPrice * line.quantity)}
                          </p>
                          <button
                            type="button"
                            onClick={() => remove(line.key)}
                            className="link-draw mt-1 text-[10px] uppercase tracking-[0.16em] text-earth-muted hover:text-earth"
                          >
                            Retirer
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pied */}
          {hydrated && lines.length > 0 && (
            <div className="border-t border-earth/10 bg-linen-deep px-6 py-5">
              <dl className="space-y-1.5 text-[13px]">
                <div className="flex justify-between text-earth-soft">
                  <dt>Sous-total</dt>
                  <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-earth-soft">
                  <dt>Livraison</dt>
                  <dd className="tabular-nums">
                    {shipping === 0 ? "Offerte" : formatPrice(shipping)}
                  </dd>
                </div>
                <div className="rule-gold my-3" />
                <div className="flex items-baseline justify-between">
                  <dt className="font-display text-xl font-light text-emerald-deep">
                    Total
                  </dt>
                  <dd className="font-display text-xl tabular-nums text-emerald-deep">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>

              <Button asChild size="lg" className="mt-5 w-full">
                <Link href="/commande" onClick={close}>
                  Passer commande
                </Link>
              </Button>
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-earth-muted">
                Paiement Wave · Orange Money · Carte
              </p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16 text-center">
      <LotusMark className="w-12 text-gold/35" />
      <p className="mt-6 font-display text-2xl font-light text-earth">
        Votre panier est vide
      </p>
      <p className="mt-2 max-w-[16rem] text-[13px] leading-relaxed text-earth-soft">
        Commencez par le savon qui a fait la réputation de la maison.
      </p>
      <Button asChild variant="outline" className="mt-7">
        <Link href="/boutique" onClick={onClose}>
          Découvrir la boutique
        </Link>
      </Button>
    </div>
  );
}
