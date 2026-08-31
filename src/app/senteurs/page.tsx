import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/commerce/ProductCard";
import { SmokeTrailCanvas } from "@/components/hero/SmokeTrailCanvas";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Button } from "@/components/ui/button";
import { getByCategory, getCategory } from "@/lib/products";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Senteurs",
  description:
    "Bougies parfumées, parfums d'ambiance et encens — l'univers olfactif de MOZAIS. Cire végétale, résines et bois, formulés et coulés à Dakar.",
};

const MATERIALS = [
  {
    name: "Bois de Santal",
    latin: "Santalum album",
    origin: "Import direct, Inde",
    role: "Le bois qui donne sa colonne vertébrale à la moitié de nos bougies. Chaud, laiteux, jamais sucré — loin de la version synthétique et plate qu'on trouve dans la plupart des bougies bon marché.",
    hue: "bg-gold-wash",
  },
  {
    name: "Oliban",
    latin: "Boswellia sacra",
    origin: "Résine, Corne de l'Afrique",
    role: "La matière la plus ancienne du rituel — brûlée sur charbon depuis des millénaires. Une fumée blanche, légèrement citronnée, qui purifie plus qu'elle ne parfume.",
    hue: "bg-linen-shade",
  },
  {
    name: "Vétiver",
    latin: "Chrysopogon zizanioides",
    origin: "Racine, cultivée aussi au Sénégal",
    role: "La même racine qui retient les sols contre l'érosion donne, une fois distillée, l'une des odeurs les plus tenaces de la parfumerie — terreuse, fumée, jamais volatile.",
    hue: "bg-emerald-wash",
  },
];

/** Les trois sous-catégories de l'univers, dans leur état réel du
 *  catalogue — y compris celle qui n'a pas encore ouvert. */
const SUBCATEGORIES = ["bougies", "parfums-ambiance", "encens"] as const;

export default function SenteursPage() {
  const subcategories = SUBCATEGORIES.map((slug) => getCategory(slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );
  const products = [...getByCategory("bougies"), ...getByCategory("parfums-ambiance")];

  const breadcrumb = breadcrumbJsonLd([
    { name: "Accueil", href: "/" },
    { name: "Senteurs", href: "/senteurs" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* — Hero — */}
      <section className="relative isolate overflow-hidden bg-emerald-deep">
        <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 50% 100%, rgba(212,175,55,0.16) 0%, rgba(27,48,34,0) 65%)",
          }}
        />

        <div className="relative mx-auto flex min-h-[min(84vh,50rem)] max-w-[1440px] flex-col items-center justify-center px-5 pb-24 pt-28 text-center md:px-10">
          <p className="eyebrow flex items-center gap-3 text-gold/80">
            <span className="h-px w-10 bg-gold/50" aria-hidden="true" />
            Un nouveau registre
            <span className="h-px w-10 bg-gold/50" aria-hidden="true" />
          </p>

          <h1 className="mt-7 max-w-3xl font-display text-[clamp(2.9rem,7.5vw,5.6rem)] font-light leading-[0.96] text-linen text-balance">
            Ici, tout se respire.
          </h1>

          <p className="mt-7 max-w-lg text-[15px] leading-[1.8] text-linen/60 text-pretty">
            Jusqu&apos;ici, la maison se posait sur la peau. Senteurs est le
            premier rayon qui se contente de l&apos;air d&apos;une pièce — cire
            végétale, résines et bois, coulés et composés à Dakar avec la même
            exigence que nos savons.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="onDark">
              <Link href="/boutique?categorie=bougies">Découvrir les bougies</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-linen/70 hover:text-linen">
              <a href="#matieres">Les matières</a>
            </Button>
          </div>
        </div>

        {/* Volute d'encens — sous le texte, réagit au curseur */}
        <div className="pointer-events-none absolute inset-0 z-[5]" aria-hidden="true">
          <SmokeTrailCanvas focus={{ x: 0.5, y: 0.94 }} />
        </div>
      </section>

      {/* — Les trois rayons — */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <SectionHeading
          index="01"
          eyebrow="Les rayons"
          title="Trois façons de parfumer une pièce."
          intro="Deux sont déjà en boutique. Le troisième attend une deuxième référence prête — nous n'ouvrons jamais un rayon à une seule pièce."
        />

        <div className="mt-14 grid gap-px bg-earth/10 md:grid-cols-3">
          {subcategories.map((cat, i) => {
            const open = cat.published !== false;
            const count = getByCategory(cat.slug).length;
            const content = (
              <>
                <p className="text-[10px] uppercase tracking-[0.24em] text-gold">
                  {open ? `${count} référence${count > 1 ? "s" : ""}` : "Bientôt"}
                </p>
                <h3 className="mt-3 flex items-start gap-2.5 font-display text-[1.7rem] font-light leading-tight text-earth">
                  {cat.name}
                  {open && (
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1}
                      className="mt-1.5 shrink-0 text-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  )}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-earth-soft">{cat.blurb}</p>
              </>
            );

            return (
              <Reveal key={cat.slug} delay={i * 100} className="bg-linen p-8 md:p-9">
                {open ? (
                  <Link href={`/boutique?categorie=${cat.slug}`} className="group block">
                    {content}
                  </Link>
                ) : (
                  <div className="opacity-60">{content}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* — Produits — */}
      {products.length > 0 && (
        <section className="bg-linen-deep py-24 md:py-32">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <SectionHeading
              index="02"
              eyebrow="Déjà en boutique"
              title="Les deux rayons ouverts."
              href="/boutique"
              hrefLabel="Toute la boutique"
            />

            <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:gap-x-8 lg:grid-cols-4">
              {products.map((product, i) => (
                <Reveal key={product.slug} delay={i * 90}>
                  <ProductCard product={product} priority={i === 0} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* — Les matières — */}
      <section id="matieres" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <SectionHeading
          index="03"
          eyebrow="Les matières"
          title="Trois matières, un registre assumé."
          intro="Pas de « senteur fraîcheur » ni de « parfum d'ambiance » vague : chaque référence part d'une matière qu'on peut nommer et situer."
        />

        <div className="mt-14 grid gap-px bg-earth/10 md:grid-cols-3">
          {MATERIALS.map((m, i) => (
            <Reveal key={m.name} delay={i * 100} className={`${m.hue} p-8 md:p-9 lg:p-10`}>
              <h3 className="font-display text-[2rem] font-light leading-none text-emerald-deep">
                {m.name}
              </h3>
              <p className="mt-2 font-display text-sm italic text-earth-soft">{m.latin}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-earth-muted">
                {m.origin}
              </p>
              <div className="rule-gold my-5" />
              <p className="text-[13px] leading-[1.75] text-earth-soft text-pretty">{m.role}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* — Sortie — */}
      <section className="border-t border-earth/10 bg-linen-deep py-20 text-center md:py-28">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="font-display text-[clamp(1.9rem,4vw,2.9rem)] font-light leading-[1.05] text-emerald-deep text-balance">
            Encens et essences sur charbon ouvre bientôt.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-[1.8] text-earth-soft text-pretty">
            Une deuxième référence est en préparation. Le rayon ouvre dès
            qu&apos;il compte au moins deux pièces — pas avant.
          </p>
          <Button asChild variant="outline" size="lg" className="mt-8">
            <Link href="/boutique">
              Voir toute la boutique
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
