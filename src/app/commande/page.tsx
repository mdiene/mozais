import type { Metadata } from "next";
import { CheckoutForm } from "@/components/commerce/CheckoutForm";

export const metadata: Metadata = {
  title: "Votre commande",
  description: "Finalisez votre commande MOZAIS. Paiement Wave, Orange Money ou carte.",
  robots: { index: false },
};

export default function CommandePage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-20">
      <p className="eyebrow">Étape finale</p>
      <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,3.8rem)] font-light leading-[1] text-emerald-deep">
        Votre commande
      </h1>
      <CheckoutForm />
    </div>
  );
}
