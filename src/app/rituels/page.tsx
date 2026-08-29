import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { PRODUCTS, getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "Les rituels",
  description:
    "Nos protocoles de soin détaillés : peau à imperfections, cuir chevelu qui gratte, peau sèche, taches. Quatre routines, geste par geste.",
};

const ROUTINES = [
  {
    id: "imperfections",
    number: "01",
    title: "Peau à imperfections",
    lede: "Le protocole en quatre semaines : purifier, cibler, consolider, entretenir. La montée en puissance progressive évite l'effet rebond qui fait échouer la plupart des routines anti-acné.",
    products: ["perfect-skin", "huile-essentielle-neem", "huile-baobab"],
    duration: "4 semaines",
    frequency: "Matin et soir",
  },
  {
    id: "cuir-chevelu",
    number: "02",
    title: "Cuir chevelu qui gratte",
    lede: "On traite le cuir chevelu, pas les longueurs. Deux applications hebdomadaires raies par raies, un massage de cinq minutes, une pose de nuit par semaine sous bonnet satin.",
    products: ["elixir-neem-ricin", "masque-karite-baobab"],
    duration: "6 semaines",
    frequency: "2 fois par semaine",
  },
  {
    id: "peau-seche",
    number: "03",
    title: "Peau sèche et réactive",
    lede: "La règle des trois minutes : l'huile se pose sur peau encore humide, dans les trois minutes après la douche. Passé ce délai, elle nourrit sans hydrater.",
    products: ["hydra-karite-miel", "huile-baobab"],
    duration: "En continu",
    frequency: "Quotidien",
  },
  {
    id: "taches",
    number: "04",
    title: "Taches et teint irrégulier",
    lede: "Le curcuma agit sur l'inflammation qui entretient les marques. Le soir, sur les zones concernées uniquement — et un écran solaire le matin, sans quoi rien ne tient.",
    products: ["hydra-curcuma-miel", "huile-baobab"],
    duration: "8 à 12 semaines",
    frequency: "Le soir",
  },
];

export default function RituelsPage() {
  return (
    <>
      {/* En-tête */}
      <header className="relative overflow-hidden bg-emerald-deep py-20 text-linen md:py-28">
        <div className="grain absolute inset-0" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 20% 0%, rgba(212,175,55,0.18) 0%, rgba(27,48,34,0) 65%)",
          }}
        />
        <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow text-gold/80">Le carnet</p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.6rem,6vw,4.6rem)] font-light leading-[0.98] text-linen text-balance">
            Un bon produit mal utilisé ne soigne rien.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-[1.8] text-linen/60 text-pretty">
            La moitié des retours négatifs que nous recevons viennent d&apos;un
            geste, pas d&apos;une formule : un savon posé trop longtemps, une
            huile appliquée sur peau sèche, une cure poursuivie trop loin. Voici
            nos quatre protocoles, écrits sans raccourci.
          </p>
        </div>
      </header>

      {/* Routines */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        {ROUTINES.map((routine, index) => {
          const anchor = getProduct(routine.products[0]);
          const rest = routine.products
            .slice(1)
            .map((slug) => getProduct(slug))
            .filter((p): p is NonNullable<typeof p> => Boolean(p));

          if (!anchor) return null;

          return (
            <section
              key={routine.id}
              id={routine.id}
              className="grid gap-12 border-b border-earth/10 py-20 last:border-b-0 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20"
            >
              {/* Visuel */}
              <Reveal
                className={index % 2 === 1 ? "lg:order-2" : undefined}
                delay={0}
              >
                <div className="relative aspect-4/5 overflow-hidden bg-linen-deep">
                  <Image
                    src={anchor.image}
                    alt={anchor.name}
                    fill
                    sizes="(min-width: 1024px) 44vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 flex gap-px">
                    <span className="bg-emerald-deep px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-gold-pale">
                      {routine.duration}
                    </span>
                    <span className="bg-gold px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-emerald-deep">
                      {routine.frequency}
                    </span>
                  </div>
                </div>
              </Reveal>

              {/* Protocole */}
              <div className="flex flex-col justify-center">
                <Reveal>
                  <p className="eyebrow flex items-center gap-3">
                    <span className="text-gold">{routine.number}</span>
                    <span className="h-px w-8 bg-current opacity-40" aria-hidden="true" />
                    Protocole
                  </p>
                  <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.2rem)] font-light leading-[1.02] text-emerald-deep text-balance">
                    {routine.title}
                  </h2>
                  <p className="mt-5 max-w-lg text-[15px] leading-[1.8] text-earth-soft text-pretty">
                    {routine.lede}
                  </p>
                </Reveal>

                <ol className="mt-10 space-y-0">
                  {anchor.ritual.map((step, i) => (
                    <Reveal
                      key={step.title}
                      as="li"
                      delay={i * 80}
                      className="grid grid-cols-[2.75rem_1fr] gap-4 border-t border-earth/12 py-5 last:border-b"
                    >
                      <span className="font-display text-2xl font-light leading-none text-gold/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-light leading-tight text-earth">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-earth-soft">
                          {step.detail}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </ol>

                <Reveal delay={160} className="mt-9">
                  <p className="eyebrow">Les produits du rituel</p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {[anchor, ...rest].map((p) => (
                      <Link
                        key={p.slug}
                        href={`/produits/${p.slug}`}
                        className="group flex items-center gap-2 border border-earth/18 px-4 py-2.5 text-[12px] text-earth transition-colors hover:border-emerald-deep hover:text-emerald-deep"
                      >
                        {p.name}
                        <ArrowRight
                          size={13}
                          strokeWidth={1.5}
                          className="text-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                        />
                      </Link>
                    ))}
                  </div>
                </Reveal>
              </div>
            </section>
          );
        })}
      </div>

      {/* Sortie */}
      <section className="mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
        <h2 className="font-display text-[clamp(1.9rem,4vw,2.9rem)] font-light leading-[1.05] text-emerald-deep text-balance">
          Un doute sur le protocole qui vous convient ?
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[15px] leading-[1.8] text-earth-soft text-pretty">
          Décrivez-nous votre peau ou votre cuir chevelu. Nous répondons
          nous-mêmes, sous 48 h, et il nous arrive souvent de déconseiller un
          produit.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/maison#contact">Nous écrire</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/boutique">Voir les {PRODUCTS.length} produits</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
