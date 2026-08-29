import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { getProduct } from "@/lib/products";

/**
 * Mise en avant du protocole en quatre semaines.
 * Colonne image collante à gauche, étapes numérotées à droite : le lecteur
 * garde le produit sous les yeux pendant qu'il lit le rituel.
 */
export function RitualFeature() {
  const product = getProduct("rituel-perfect-skin");
  if (!product) return null;

  return (
    <section className="relative overflow-hidden bg-emerald-deep text-linen">
      <div className="grain absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[1440px] gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-2 lg:gap-20">
        {/* Visuel */}
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-4/5 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 42vw, 90vw"
              className="object-cover"
            />
            <span className="absolute bottom-0 left-0 bg-gold px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-deep">
              Coffret · 4 semaines
            </span>
          </div>
        </Reveal>

        {/* Protocole */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-gold/80">
              <span className="text-gold">03</span>
              <span className="h-px w-8 bg-current opacity-40" aria-hidden="true" />
              Le protocole
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,4.4vw,3.5rem)] font-light leading-[1.02] text-linen text-balance">
              Quatre semaines,
              <br />
              quatre gestes.
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-[1.75] text-linen/60 text-pretty">
              La plupart des routines anti-imperfections échouent parce
              qu&apos;elles vont trop fort, trop vite. Celle-ci monte en
              puissance, puis redescend. La carte-rituel livrée dans le coffret
              reprend chaque étape, jour par jour.
            </p>
          </Reveal>

          <ol className="mt-12 space-y-0">
            {product.ritual.map((step, i) => (
              <Reveal
                key={step.title}
                as="li"
                delay={i * 90}
                className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-gold/20 py-7 last:border-b"
              >
                <span className="font-display text-3xl font-light leading-none text-gold/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-light leading-tight text-linen">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-linen/55">
                    {step.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={200} className="mt-10">
            <Button asChild variant="onDark" size="lg">
              <Link href={`/produits/${product.slug}`}>Découvrir le coffret</Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
