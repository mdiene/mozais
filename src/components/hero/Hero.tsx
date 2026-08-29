import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SoapFoamCanvas } from "@/components/hero/SoapFoamCanvas";
import { Stars } from "@/components/ui/Stars";

/**
 * Scène d'ouverture : le pain Perfect Skin posé sur une plaque de marbre
 * émeraude, enveloppé d'une mousse qui suit le curseur.
 *
 * Le canvas couvre toute la scène en `pointer-events: none` : il écoute la
 * fenêtre, ce qui laisse la mousse réagir même quand le curseur survole le
 * titre, tout en gardant les boutons du hero pleinement cliquables.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-linen">
      {/* Lumière chaude en haut à gauche — la « golden hour » de la marque */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 18% 6%, rgba(228,200,140,0.34) 0%, rgba(251,248,245,0) 62%), radial-gradient(90% 70% at 88% 96%, rgba(27,48,34,0.10) 0%, rgba(251,248,245,0) 60%)",
        }}
      />
      <div className="grain pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[min(92vh,58rem)] max-w-[1440px] items-center gap-y-10 px-5 pb-16 pt-14 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-12 lg:pb-24 lg:pt-16">
        {/* — Colonne éditoriale — */}
        <div className="relative z-20 max-w-xl">
          <p className="eyebrow flex items-center gap-3 text-gold">
            <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
            Made with love in Senegal
          </p>

          <h1 className="mt-7 font-display text-[clamp(2.9rem,7.2vw,5.4rem)] font-light leading-[0.94] tracking-[-0.02em] text-emerald-deep text-balance">
            La peau nette,
            <br />
            <em className="not-italic text-earth">sans compromis.</em>
          </h1>

          <p className="mt-7 max-w-md text-[15px] leading-[1.75] text-earth-soft text-pretty">
            Soufre purifiant, neem et karité brut, saponifiés à froid en petits
            lots à Dakar. Un pain qui traite les imperfections sans décaper —
            parce qu&apos;une peau agressée se défend en produisant davantage de
            sébum.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/produits/perfect-skin">Découvrir Perfect Skin</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/boutique">Toute la boutique</Link>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <Stars rating={4.8} size={13} />
            <p className="text-[12.5px] text-earth-soft">
              <span className="font-medium text-earth">4,8 / 5</span> — 312 avis
              vérifiés
            </p>
          </div>
        </div>

        {/* — Scène produit —
            La photo apporte sa propre plaque de marbre, sa mousse et son
            filet d'huile. La scène dessinée en SVG qui occupait cette place
            ferait double emploi : deux marbres, deux sources de lumière. */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative aspect-4/5 w-full max-w-[29rem] overflow-hidden shadow-[0_44px_88px_-44px_rgba(27,48,34,0.55)]">
            <Image
              src="/products/perfect-skin.jpg"
              alt="Le savon MOZAIS Perfect Skin posé sur une plaque de marbre émeraude, enveloppé de mousse, entouré de noix de karité et d'un bol de soufre"
              fill
              priority
              sizes="(min-width: 1024px) 29rem, 88vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mousse — au-dessus de la scène, sous le texte */}
      <div className="pointer-events-none absolute inset-0 z-[15]" aria-hidden="true">
        <SoapFoamCanvas focus={{ x: 0.7, y: 0.55 }} density={0.55} />
      </div>

      {/* Invite au défilement */}
      <a
        href="#collections"
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-earth-muted transition-colors hover:text-earth"
      >
        <span className="text-[9px] uppercase tracking-[0.3em]">Explorer</span>
        <ArrowDown size={14} strokeWidth={1.25} className="animate-bounce" />
      </a>
    </section>
  );
}
