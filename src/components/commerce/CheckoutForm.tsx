"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCart,
  useCartHydrated,
  cartSubtotal,
  cartShipping,
  cartTotal,
} from "@/store/cart";
import { formatPrice, cn } from "@/lib/utils";

const REGIONS = [
  "Dakar",
  "Thiès",
  "Saint-Louis",
  "Diourbel",
  "Kaolack",
  "Ziguinchor",
  "Louga",
  "Fatick",
  "Kolda",
  "Tambacounda",
  "Matam",
  "Kaffrine",
  "Kédougou",
  "Sédhiou",
  "International",
];

const PAYMENTS = [
  { id: "wave", name: "Wave", detail: "Vous recevrez un lien de paiement par SMS." },
  { id: "orange-money", name: "Orange Money", detail: "Code de paiement envoyé sur votre mobile." },
  { id: "carte", name: "Carte bancaire", detail: "Visa, Mastercard. Paiement sécurisé." },
  { id: "livraison", name: "À la livraison", detail: "Espèces, Dakar uniquement." },
] as const;

export function CheckoutForm() {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const hydrated = useCartHydrated();

  const [payment, setPayment] = useState<string>("wave");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartSubtotal(lines);
  const shipping = cartShipping(lines);
  const total = cartTotal(lines);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !lines.length) return;

    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      customer: {
        firstName: String(form.get("firstName") ?? ""),
        lastName: String(form.get("lastName") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
      },
      address: {
        street: String(form.get("street") ?? ""),
        detail: String(form.get("detail") ?? ""),
        city: String(form.get("city") ?? ""),
        region: String(form.get("region") ?? ""),
      },
      payment,
      note: String(form.get("note") ?? ""),
      lines,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "La commande n'a pas pu être enregistrée.");

      clear();
      router.push(`/commande/confirmee?ref=${encodeURIComponent(data.reference)}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "La commande n'a pas pu être enregistrée.",
      );
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="mt-12 flex items-center gap-3 text-sm text-earth-soft">
        <Loader2 size={16} className="animate-spin" />
        Chargement de votre panier…
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="mt-16 max-w-md">
        <p className="font-display text-3xl font-light text-earth">
          Votre panier est vide.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-earth-soft">
          Ajoutez au moins un produit pour passer commande.
        </p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/boutique">Retour à la boutique</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-12 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20"
    >
      {/* — Colonne formulaire — */}
      <div className="space-y-12">
        <Fieldset legend="Vos coordonnées" step="01">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="firstName" label="Prénom" autoComplete="given-name" required />
            <Field name="lastName" label="Nom" autoComplete="family-name" required />
            <Field
              name="email"
              label="E-mail"
              type="email"
              autoComplete="email"
              required
              hint="La confirmation de commande y sera envoyée."
            />
            <Field
              name="phone"
              label="Téléphone"
              type="tel"
              autoComplete="tel"
              required
              placeholder="+221 77 000 00 00"
              hint="Le livreur vous appellera à l'arrivée."
            />
          </div>
        </Fieldset>

        <Fieldset legend="Livraison" step="02">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              name="street"
              label="Adresse"
              autoComplete="street-address"
              required
              className="sm:col-span-2"
            />
            <Field
              name="detail"
              label="Complément (étage, repère)"
              className="sm:col-span-2"
              hint="Un repère connu accélère beaucoup la livraison à Dakar."
            />
            <Field name="city" label="Ville / quartier" autoComplete="address-level2" required />
            <label className="block">
              <span className="eyebrow">Région</span>
              <select
                name="region"
                required
                defaultValue="Dakar"
                className="mt-2.5 w-full border-b border-earth/25 bg-transparent py-3 text-[15px] text-earth focus:border-emerald-deep focus:outline-none"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Fieldset>

        <Fieldset legend="Paiement" step="03">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {PAYMENTS.map((p) => (
              <label
                key={p.id}
                className={cn(
                  "cursor-pointer border p-4 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  payment === p.id
                    ? "border-emerald-deep bg-emerald-deep/[0.04]"
                    : "border-earth/18 hover:border-earth/40",
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value={p.id}
                    checked={payment === p.id}
                    onChange={() => setPayment(p.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                      payment === p.id ? "border-emerald-deep" : "border-earth/35",
                    )}
                  >
                    {payment === p.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-deep" />
                    )}
                  </span>
                  <span className="text-[14px] font-medium text-earth">{p.name}</span>
                </span>
                <span className="mt-2 block pl-6.5 text-[12px] leading-relaxed text-earth-soft">
                  {p.detail}
                </span>
              </label>
            ))}
          </div>

          <label className="mt-7 block">
            <span className="eyebrow">Note pour la maison (facultatif)</span>
            <textarea
              name="note"
              rows={3}
              className="mt-2.5 w-full resize-none border-b border-earth/25 bg-transparent py-3 text-[15px] text-earth placeholder:text-earth-muted/60 focus:border-emerald-deep focus:outline-none"
              placeholder="Emballage cadeau, précision sur votre type de peau…"
            />
          </label>
        </Fieldset>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2.5 border border-earth/20 bg-linen-deep p-4 text-[13px] text-earth"
          >
            <AlertCircle size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold" />
            {error}
          </p>
        )}
      </div>

      {/* — Récapitulatif — */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-earth/12 bg-linen-deep p-6 md:p-8">
          <h2 className="font-display text-2xl font-light text-emerald-deep">
            Récapitulatif
          </h2>

          <ul className="mt-6 divide-y divide-earth/10">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-4 py-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-linen">
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  <span className="absolute right-0 top-0 bg-emerald-deep px-1.5 py-0.5 text-[9px] leading-none text-gold-pale">
                    {line.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[1.05rem] leading-tight text-earth">
                    {line.name}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-earth-muted">
                    {line.variantLabel}
                    {line.fragranceName && ` · ${line.fragranceName}`}
                  </p>
                </div>
                <p className="shrink-0 text-[13px] tabular-nums text-earth">
                  {formatPrice(line.unitPrice * line.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-earth/12 pt-5 text-[13px]">
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
              <dt className="font-display text-xl font-light text-emerald-deep">Total</dt>
              <dd className="font-display text-xl tabular-nums text-emerald-deep">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>

          <Button type="submit" size="lg" disabled={submitting} className="mt-7 w-full">
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Enregistrement…
              </>
            ) : (
              "Confirmer la commande"
            )}
          </Button>

          <p className="mt-4 text-[11px] leading-relaxed text-earth-muted">
            En confirmant, vous acceptez nos{" "}
            <Link href="/aide/cgv" className="link-draw text-earth-soft">
              conditions de vente
            </Link>
            . Vos données servent uniquement au traitement de la commande.
          </p>
        </div>
      </aside>
    </form>
  );
}

function Fieldset({
  legend,
  step,
  children,
}: {
  legend: string;
  step: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-7 flex items-baseline gap-4">
        <span className="font-display text-2xl font-light text-gold/70">{step}</span>
        <span className="font-display text-[1.7rem] font-light text-emerald-deep">
          {legend}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  name,
  label,
  hint,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  hint?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="eyebrow">{label}</span>
      <input
        name={name}
        className="mt-2.5 w-full border-b border-earth/25 bg-transparent py-3 text-[15px] text-earth placeholder:text-earth-muted/60 focus:border-emerald-deep focus:outline-none"
        {...props}
      />
      {hint && <span className="mt-2 block text-[11.5px] text-earth-muted">{hint}</span>}
    </label>
  );
}
