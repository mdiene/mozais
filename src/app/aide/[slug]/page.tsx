import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd } from "@/lib/seo";

type Article = {
  title: string;
  lede: string;
  sections: { heading: string; body: string[] }[];
};

const ARTICLES: Record<string, Article> = {
  livraison: {
    title: "Livraison & retours",
    lede: "Expédition sous 24 h depuis l'atelier de Dakar, livraison offerte dès 25 000 F CFA.",
    sections: [
      {
        heading: "Délais",
        body: [
          "Dakar et banlieue : livraison en 24 h, du lundi au samedi. Le livreur vous appelle avant de se présenter.",
          "Régions du Sénégal : 2 à 4 jours ouvrés selon la destination, via nos transporteurs partenaires.",
          "International : 5 à 12 jours ouvrés. Les droits de douane éventuels restent à votre charge.",
        ],
      },
      {
        heading: "Frais",
        body: [
          "Forfait unique de 2 500 F CFA, offert dès 25 000 F CFA d'achat.",
          "Pour l'international, les frais sont calculés au moment de la commande selon le poids réel du colis.",
        ],
      },
      {
        heading: "Retours",
        body: [
          "Un produit d'hygiène ouvert ne peut pas être repris : c'est une contrainte sanitaire, pas une politique commerciale.",
          "Produit non ouvert : retour accepté sous 14 jours, remboursement intégral hors frais de renvoi.",
          "Produit abîmé ou erreur de notre part : nous réexpédions à nos frais, sans retour à effectuer. Une photo suffit.",
        ],
      },
    ],
  },
  paiement: {
    title: "Moyens de paiement",
    lede: "Wave, Orange Money, carte bancaire, ou espèces à la livraison sur Dakar.",
    sections: [
      {
        heading: "Mobile money",
        body: [
          "Wave : vous recevez un lien de paiement par SMS immédiatement après la commande. Aucun frais supplémentaire.",
          "Orange Money : un code de paiement vous est envoyé sur votre mobile. Les frais opérateur habituels s'appliquent.",
        ],
      },
      {
        heading: "Carte bancaire",
        body: [
          "Visa et Mastercard, en francs CFA. La transaction est traitée par notre prestataire de paiement ; nous ne conservons aucune donnée bancaire.",
        ],
      },
      {
        heading: "À la livraison",
        body: [
          "Paiement en espèces, disponible uniquement sur Dakar et sa banlieue. Prévoyez l'appoint : nos livreurs ne transportent pas de monnaie.",
        ],
      },
    ],
  },
  conseils: {
    title: "Conseils d'utilisation",
    lede: "Les erreurs qui reviennent le plus souvent, et comment les éviter.",
    sections: [
      {
        heading: "Les savons",
        body: [
          "Faites toujours mousser entre les paumes, jamais en frottant le pain directement sur la peau.",
          "Rangez le pain sur un porte-savon drainant. Un savon saponifié à froid laissé dans l'eau fond trois fois plus vite.",
          "L'odeur franche du soufre est normale et disparaît au rinçage. Elle est le signe qu'il est présent en quantité utile.",
        ],
      },
      {
        heading: "Les huiles",
        body: [
          "Appliquez sur peau humide, dans les trois minutes suivant la douche. Une huile posée sur peau sèche nourrit sans hydrater.",
          "Trois à cinq gouttes suffisent pour le corps entier. L'excès ne pénètre pas, il tache les vêtements.",
          "Les huiles essentielles se diluent toujours : trois gouttes maximum dans une cuillère d'huile végétale.",
        ],
      },
      {
        heading: "Précautions",
        body: [
          "Testez tout nouveau produit au pli du coude 48 h avant la première application sur le visage.",
          "Nos produits ne remplacent pas un avis dermatologique. Une acné kystique ou une dermatose installée relève d'un médecin.",
          "Femmes enceintes ou allaitantes : évitez le neem et les huiles essentielles, demandez conseil à votre médecin.",
        ],
      },
    ],
  },
  cgv: {
    title: "Conditions générales de vente",
    lede: "Le cadre contractuel de vos achats sur mozais.sn.",
    sections: [
      {
        heading: "Modèle à compléter",
        body: [
          "Ce document doit être rédigé avec votre conseil juridique avant l'ouverture de la boutique : les mentions obligatoires dépendent de votre forme sociale, de votre NINEA et des marchés que vous desservez.",
          "Doivent y figurer au minimum : identité et coordonnées du vendeur, prix et devise, modalités de paiement et de livraison, droit de rétractation et ses exceptions pour les produits d'hygiène descellés, garanties légales, traitement des données personnelles, et juridiction compétente.",
        ],
      },
      {
        heading: "Données personnelles",
        body: [
          "Les informations collectées lors d'une commande servent uniquement à son traitement et à son suivi. Elles ne sont ni revendues, ni transmises à des tiers en dehors du transporteur.",
          "Pour toute demande d'accès, de rectification ou de suppression : bonjour@mozais.sn.",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return { title: "Page introuvable" };
  return { title: article.title, description: article.lede };
}

export default async function AidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  /* Pas de crumb intermédiaire « Aide » : il n'existe aucune page /aide
     (seules les fiches /aide/[slug] existent) — un BreadcrumbList ne doit
     pointer que vers de vraies URL. */
  const breadcrumb = breadcrumbJsonLd([
    { name: "Accueil", href: "/" },
    { name: article.title, href: `/aide/${slug}` },
  ]);

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <nav aria-label="Fil d'Ariane" className="text-[11px] tracking-[0.14em] text-earth-muted">
        <Link href="/" className="link-draw hover:text-earth">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <span className="text-earth">Aide</span>
      </nav>

      <h1 className="mt-6 font-display text-[clamp(2.3rem,5vw,3.6rem)] font-light leading-[1] text-emerald-deep text-balance">
        {article.title}
      </h1>
      <p className="mt-5 text-[15px] leading-[1.8] text-earth-soft text-pretty">
        {article.lede}
      </p>

      <div className="rule-gold mt-10" />

      {article.sections.map((section) => (
        <section key={section.heading} className="mt-12">
          <h2 className="font-display text-[1.9rem] font-light leading-tight text-earth">
            {section.heading}
          </h2>
          <div className="mt-4 space-y-4">
            {section.body.map((paragraph, i) => (
              <p key={i} className="text-[14.5px] leading-[1.8] text-earth-soft text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-16 border-t border-earth/10 pt-10">
        <p className="text-[14px] text-earth-soft">
          Une question que cette page ne couvre pas ?
        </p>
        <Button asChild variant="outline" className="mt-5">
          <Link href="/maison#contact">Nous écrire</Link>
        </Button>
      </div>
    </article>
  );
}
