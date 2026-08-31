import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { publishedCategories } from "@/lib/products";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const MAISON = [
  { href: "/maison", label: "Notre histoire" },
  { href: "/rituels", label: "Les rituels" },
  { href: "/maison#ingredients", label: "Nos ingrédients" },
  { href: "/maison#contact", label: "Contact" },
];

const AIDE = [
  { href: "/aide/livraison", label: "Livraison & retours" },
  { href: "/aide/paiement", label: "Moyens de paiement" },
  { href: "/aide/conseils", label: "Conseils d'utilisation" },
  { href: "/aide/cgv", label: "Conditions de vente" },
];

export function Footer() {
  return (
    <footer className="relative mt-28 overflow-hidden bg-emerald-deep text-linen">
      <div className="grain absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1440px] px-5 pb-10 pt-20 md:px-10 md:pt-24">
        {/* Infolettre */}
        <div className="grid gap-10 border-b border-gold/20 pb-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-gold/70">Le carnet de rituels</p>
            <h2 className="mt-4 max-w-lg font-display text-4xl font-light leading-[1.05] text-linen md:text-5xl">
              Un geste, une plante, une fois par mois.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-linen/60">
              Nos protocoles de soin détaillés, l&apos;origine de nos matières
              premières, et les nouveautés avant tout le monde. Jamais plus
              d&apos;un envoi par mois.
            </p>
          </div>
          <div className="lg:pt-14">
            <NewsletterForm />
          </div>
        </div>

        {/* Colonnes */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo stacked className="items-start text-lg text-gold" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-linen/55">
              Soins naturels formulés et coulés en petits lots à Dakar. Karité,
              baobab, neem et soufre — des matières premières ouest-africaines,
              travaillées sans compromis.
            </p>
            <div className="mt-7 space-y-2.5 text-[13px] text-linen/55">
              <p className="flex items-start gap-2.5">
                <MapPin size={14} strokeWidth={1.25} className="mt-0.5 shrink-0 text-gold" />
                68, Villa Cité Adama Diop, Golf Nord, Guédiawaye, Sénégal
              </p>
              <a
                href="tel:+221788353636"
                className="flex items-center gap-2.5 transition-colors hover:text-gold-pale"
              >
                <Phone size={14} strokeWidth={1.25} className="shrink-0 text-gold" />
                +221 78 835 36 36
              </a>
              <a
                href="mailto:bonjour@mozais.sn"
                className="flex items-center gap-2.5 transition-colors hover:text-gold-pale"
              >
                <Mail size={14} strokeWidth={1.25} className="shrink-0 text-gold" />
                bonjour@mozais.sn
              </a>
            </div>
          </div>

          <FooterColumn title="Collections">
            {publishedCategories().map((c) => (
              <FooterLink key={c.slug} href={`/boutique?categorie=${c.slug}`}>
                {c.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="La Maison">
            {MAISON.map((l) => (
              <FooterLink key={l.href + l.label} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Aide">
            {AIDE.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        {/* Bas de page */}
        <div className="flex flex-col-reverse items-center gap-6 border-t border-gold/15 pt-8 md:flex-row md:justify-between">
          <p className="text-[11px] text-linen/40">
            © {new Date().getFullYear()} MOZAIS. Tous droits réservés.
          </p>

          <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-gold">
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            Made with love in Senegal
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
          </p>

          <a
            href="https://instagram.com/mozais"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[11px] text-linen/50 transition-colors hover:text-gold-pale"
          >
            <InstagramGlyph />
            @mozais
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow text-gold/70">{title}</p>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="link-draw text-[13px] text-linen/60 transition-colors hover:text-gold-pale"
      >
        {children}
      </Link>
    </li>
  );
}

/** lucide-react a retiré ses icônes de marque : glyphe maison. */
function InstagramGlyph() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
