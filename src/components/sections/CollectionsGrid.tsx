import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getByCategory, publishedCategories } from "@/lib/products";

/**
 * Visuel de tête par collection — la première fiche de la catégorie.
 * L'ancienne entrée "huiles" est devenue deux catégories (fusion du
 * 30/08/2026), et Senteurs ouvre ses deux premiers rayons le
 * 31/08/2026 : la grille passe de 4 à 7 tuiles au total.
 */
const COVER: Record<string, string> = {
  savons: "/products/hydra-karite-miel.jpg",
  skincare: "/products/perfect-skin.jpg",
  capillaire: "/products/elixir-neem-ricin.svg",
  "huiles-essentielles": "/products/huile-essentielle-neem.svg",
  "huiles-bien-etre": "/products/huile-baobab.svg",
  bougies: "/products/bougie-vetiver-fume.jpg",
  "parfums-ambiance": "/products/parfum-rose-de-saba.jpg",
};

export function CollectionsGrid() {
  return (
    <section id="collections" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
      <SectionHeading
        index="01"
        eyebrow="Les collections"
        title={
          <>
            Quatre familles,
            <br />
            une même exigence.
          </>
        }
        href="/boutique"
      />

      <div className="mt-14 grid gap-px bg-earth/10 md:grid-cols-2">
        {publishedCategories().map((category, i) => {
          const count = getByCategory(category.slug).length;
          return (
            <Reveal key={category.slug} delay={i * 110}>
              <Link
                href={`/boutique?categorie=${category.slug}`}
                className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden bg-linen p-8 md:min-h-[26rem] md:p-10"
              >
                <Image
                  src={COVER[category.slug]}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover opacity-90 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                {/* Voile qui garantit le contraste du texte quelle que soit l'image */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-emerald-deep/88 via-emerald-deep/40 to-transparent transition-opacity duration-700 group-hover:from-emerald-deep/94"
                />

                <div className="relative">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gold">
                    {count} référence{count > 1 ? "s" : ""}
                  </p>
                  <h3 className="mt-2 flex items-start gap-3 font-display text-[2rem] font-light leading-tight text-linen md:text-[2.4rem]">
                    {category.title}
                    <ArrowUpRight
                      size={22}
                      strokeWidth={1}
                      className="mt-2 shrink-0 text-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </h3>
                  <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-linen/65">
                    {category.blurb}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
