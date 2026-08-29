import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { LotusMark } from "@/components/brand/Logo";
import { IngredientsRail } from "@/components/sections/IngredientsRail";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "La Maison",
  description:
    "MOZAIS, née à Dakar en 2019 d'un refus : celui des savons éclaircissants. Saponification à froid, petits lots, matières premières achetées en direct.",
};

const CHAPTERS = [
  {
    year: "2019",
    title: "Une cuisine à Sacré-Cœur",
    body: "Les premiers pains sortent d'une casserole de vingt litres. Le problème de départ est simple : trouver un savon efficace contre les imperfections qui ne promette pas, dans la même phrase, d'éclaircir le teint. Il n'en existe pas.",
  },
  {
    year: "2021",
    title: "Le passage à l'atelier",
    body: "Deux cents commandes par mois, une cuisine devenue impraticable. L'atelier ouvre avec une contrainte que nous n'avons jamais levée : des lots de 400 pains maximum, quatre semaines de séchage, aucun raccourci sur la cure.",
  },
  {
    year: "2023",
    title: "L'approvisionnement direct",
    body: "Nous cessons d'acheter le karité chez les grossistes de Dakar pour traiter directement avec neuf coopératives de femmes en Casamance et dans le Ferlo. Prix négocié à l'année, payé d'avance sur la récolte.",
  },
  {
    year: "2026",
    title: "Dix références, pas une de plus",
    body: "La gamme aurait pu tripler. Chaque nouvelle formule doit répondre à un besoin qu'aucune des précédentes ne couvre — sinon elle ne sort pas. C'est la règle qui nous coûte le plus de chiffre d'affaires, et celle à laquelle nous tenons le plus.",
  },
];

const ENGAGEMENTS = [
  {
    title: "Aucun agent éclaircissant",
    body: "Ni hydroquinone, ni corticoïde, ni mercure — et pas davantage les alternatives « douces » vendues comme telles. Nous traitons la cause, la peau retrouve son éclat propre.",
  },
  {
    title: "Listes INCI courtes",
    body: "Un actif dosé à 0,1 % pour figurer sur l'étiquette n'a jamais soigné personne. Nos formules comptent entre huit et douze ingrédients.",
  },
  {
    title: "Traçabilité par lot",
    body: "Chaque unité porte son numéro de lot et sa date de coulage. Envoyez-nous le numéro, nous vous disons d'où vient le karité.",
  },
  {
    title: "Sans huile de palme",
    body: "Coco, sésame, baobab, karité. Le choix coûte plus cher et complique la saponification. Il n'est pas négociable.",
  },
];

export default function MaisonPage() {
  return (
    <>
      {/* En-tête */}
      <header className="relative overflow-hidden bg-linen py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 15% 0%, rgba(228,200,140,0.3) 0%, rgba(251,248,245,0) 62%)",
          }}
        />
        <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
          <LotusMark className="w-14 text-gold" />
          <h1 className="mt-8 max-w-4xl font-display text-[clamp(2.6rem,6.4vw,5rem)] font-light leading-[0.96] text-emerald-deep text-balance">
            Née d&apos;un refus : celui des savons éclaircissants.
          </h1>
          <p className="mt-7 max-w-xl text-[15px] leading-[1.8] text-earth-soft text-pretty">
            MOZAIS a commencé dans une cuisine de Dakar, en 2019. Sept ans plus
            tard, la méthode n&apos;a pas bougé — et la liste de ce que nous
            refusons de faire s&apos;est allongée.
          </p>
        </div>
      </header>

      {/* Chronologie */}
      <section className="mx-auto max-w-[1440px] px-5 pb-8 md:px-10">
        <div className="grid gap-px bg-earth/10 lg:grid-cols-4">
          {CHAPTERS.map((chapter, i) => (
            <Reveal key={chapter.year} delay={i * 100} className="bg-linen p-8 lg:p-9">
              <p className="font-display text-4xl font-light leading-none text-gold/70">
                {chapter.year}
              </p>
              <h2 className="mt-5 font-display text-[1.6rem] font-light leading-tight text-emerald-deep">
                {chapter.title}
              </h2>
              <p className="mt-3.5 text-[13.5px] leading-[1.7] text-earth-soft">
                {chapter.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Engagements */}
      <section className="relative mt-20 overflow-hidden bg-emerald-deep py-20 text-linen md:mt-28 md:py-28">
        <div className="grain absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal>
            <p className="eyebrow text-gold/80">Ce que nous ne ferons pas</p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.4vw,3.4rem)] font-light leading-[1.02] text-linen text-balance">
              Quatre engagements, tenus depuis le premier pain.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px bg-gold/15 md:grid-cols-2">
            {ENGAGEMENTS.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 100}
                className="bg-emerald-deep p-8 md:p-10"
              >
                <h3 className="font-display text-[1.8rem] font-light leading-tight text-gold-pale">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-md text-[13.5px] leading-[1.75] text-linen/60">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ingrédients — même bloc que l'accueil, une seule source */}
      <IngredientsRail />

      {/* Contact */}
      <section id="contact" className="border-t border-earth/10 bg-linen-deep py-20 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow">Nous écrire</p>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-light leading-[1.02] text-emerald-deep text-balance">
              Une question sur votre peau ? Décrivez-la nous.
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-[1.8] text-earth-soft text-pretty">
              Nous répondons nous-mêmes, sous 48 h ouvrées. Précisez votre type
              de peau ou de cheveu, ce que vous utilisez déjà, et ce qui vous
              gêne. Il nous arrive de vous déconseiller un achat.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="mailto:bonjour@mozais.sn">Envoyer un e-mail</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="https://wa.me/221770000000" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <dl className="grid gap-px bg-earth/10 border border-earth/10">
              <ContactRow icon={MapPin} label="Atelier">
                Sacré-Cœur 3, Villa 8642
                <br />
                Dakar, Sénégal
                <br />
                <span className="text-earth-muted">
                  Visite sur rendez-vous, du lundi au vendredi
                </span>
              </ContactRow>
              <ContactRow icon={Phone} label="Téléphone">
                <a href="tel:+221338000000" className="link-draw">
                  +221 33 800 00 00
                </a>
                <br />
                <span className="text-earth-muted">9 h – 18 h, heure de Dakar</span>
              </ContactRow>
              <ContactRow icon={Mail} label="E-mail">
                <a href="mailto:bonjour@mozais.sn" className="link-draw">
                  bonjour@mozais.sn
                </a>
                <br />
                <span className="text-earth-muted">Réponse sous 48 h ouvrées</span>
              </ContactRow>
              <ContactRow icon={MessageCircle} label="Conseil personnalisé">
                <Link href="/rituels" className="link-draw">
                  Consultez d&apos;abord les protocoles
                </Link>
                <br />
                <span className="text-earth-muted">
                  Ils répondent à la majorité des questions
                </span>
              </ContactRow>
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 bg-linen-deep p-6">
      <Icon size={17} strokeWidth={1.25} className="mt-0.5 shrink-0 text-gold" />
      <div>
        <dt className="eyebrow">{label}</dt>
        <dd className="mt-2 text-[13.5px] leading-[1.7] text-earth-soft">{children}</dd>
      </div>
    </div>
  );
}
