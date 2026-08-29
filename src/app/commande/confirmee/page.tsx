import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LotusMark } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Commande confirmée",
  robots: { index: false },
};

const NEXT_STEPS = [
  {
    title: "Confirmation par e-mail",
    detail: "Le récapitulatif complet part dans les minutes qui viennent.",
  },
  {
    title: "Préparation à l'atelier",
    detail: "Votre commande est préparée et expédiée sous 24 h depuis Dakar.",
  },
  {
    title: "Suivi de livraison",
    detail: "Un second e-mail vous donnera le numéro de suivi du colis.",
  },
  {
    title: "Conseils de rituel",
    detail: "Sept jours après réception, le protocole d'utilisation de votre produit.",
  },
];

export default async function ConfirmeePage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
      <LotusMark className="mx-auto w-14 text-gold" />

      <p className="eyebrow mt-8">Commande enregistrée</p>
      <h1 className="mt-4 font-display text-[clamp(2.4rem,5.5vw,4rem)] font-light leading-[1] text-emerald-deep text-balance">
        Merci pour votre confiance.
      </h1>

      {ref && (
        <p className="mt-6 inline-block border border-gold/50 px-5 py-2.5 font-display text-xl tracking-[0.16em] text-emerald-deep">
          {ref}
        </p>
      )}

      <p className="mx-auto mt-7 max-w-lg text-[15px] leading-[1.8] text-earth-soft text-pretty">
        Votre commande part de l&apos;atelier de Sacré-Cœur 3. Conservez la
        référence ci-dessus : elle nous permet de retrouver votre dossier
        immédiatement.
      </p>

      <ol className="mt-14 grid gap-px bg-earth/10 text-left sm:grid-cols-2">
        {NEXT_STEPS.map((step, i) => (
          <li key={step.title} className="bg-linen p-7">
            <span className="font-display text-3xl font-light leading-none text-gold/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-4 font-display text-xl font-light text-earth">
              {step.title}
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-earth-soft">
              {step.detail}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/boutique">Continuer mes achats</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/rituels">Découvrir les rituels</Link>
        </Button>
      </div>
    </div>
  );
}
