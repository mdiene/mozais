"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CartButton } from "@/components/commerce/CartButton";
import { publishedCategories } from "@/lib/products";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/boutique", label: "Boutique" },
  { href: "/senteurs", label: "Senteurs" },
  { href: "/rituels", label: "Rituels" },
  { href: "/maison", label: "La Maison" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Le menu mobile se referme au clic sur un lien plutôt qu'en réaction
     au changement de `pathname` : la fermeture part du geste, sans passer
     par un rendu supplémentaire. */
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Bandeau d'annonce — porte le principe fondateur plutôt qu'une
          info logistique : la livraison a sa place dans le panier et
          sur les fiches produit, pas ici. */}
      <div className="bg-emerald-deep text-center">
        <p className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.24em] text-gold-pale">
          Notre principe : jamais d&apos;agent éclaircissant. Jamais.
        </p>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "border-b border-earth/10 bg-linen/90 backdrop-blur-md"
            : "border-b border-transparent bg-linen",
        )}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 md:px-10 lg:py-5">
          {/* Navigation gauche — bureau */}
          <nav className="hidden flex-1 items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "link-draw text-[11px] font-medium uppercase tracking-[0.2em] transition-colors",
                  pathname.startsWith(item.href)
                    ? "text-emerald-deep"
                    : "text-earth-soft hover:text-earth",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-ml-2 p-2 text-earth lg:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
          >
            <Menu size={20} strokeWidth={1.25} />
          </button>

          <Link
            href="/"
            aria-label="MOZAIS, accueil"
            className="text-gold transition-opacity hover:opacity-70"
          >
            {/* Mot-marque agrandi d'un cran (text-lg → text-xl) sans
                toucher au padding vertical du bandeau (py-4 md:py-5,
                ci-dessus) : la hauteur du bandeau ne bouge pas.
                Couleur passée en or pour s'harmoniser avec la vraie
                marque lotus, qui l'est toujours — plus d'émeraude ici,
                le seul endroit du site qui différait du footer et du
                menu mobile. */}
            <Logo className="text-lg tracking-[0.22em] md:text-xl" />
          </Link>

          {/* Droite */}
          <div className="flex flex-1 items-center justify-end gap-6">
            <Link
              href="/maison#contact"
              className="link-draw hidden text-[11px] font-medium uppercase tracking-[0.2em] text-earth-soft hover:text-earth lg:inline-block"
            >
              Contact
            </Link>
            <CartButton />
          </div>
        </div>
      </header>

      {/* Menu mobile plein écran */}
      <div
        className={cn(
          "fixed inset-0 z-[60] transition-[opacity,visibility] duration-500 lg:hidden",
          /* `invisible` autant que `opacity-0` : sans lui, le panneau reste
             rendu par-dessus la page et son texte se superpose au contenu,
             le fond seul étant transparent. */
          menuOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
        aria-hidden={!menuOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-emerald-deep transition-opacity duration-500",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={cn(
            "relative flex h-full flex-col px-6 py-5 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            menuOpen ? "translate-y-0" : "-translate-y-4",
          )}
        >
          <div className="flex items-center justify-between">
            <Logo className="text-base text-gold-pale" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="p-2 text-gold-pale"
              aria-label="Fermer le menu"
            >
              <X size={20} strokeWidth={1.25} />
            </button>
          </div>

          <nav className="mt-14 flex flex-col gap-1">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="font-display text-4xl font-light text-linen transition-colors hover:text-gold-pale"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 rule-gold" />

          <div className="mt-8 flex flex-col gap-4">
            <p className="eyebrow text-gold/70">Collections</p>
            {publishedCategories().map((c) => (
              <Link
                key={c.slug}
                href={`/boutique?categorie=${c.slug}`}
                onClick={closeMenu}
                className="text-sm text-linen/70 transition-colors hover:text-gold-pale"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <p className="mt-auto pt-8 text-[10px] uppercase tracking-[0.24em] text-gold/60">
            Made with love in Senegal
          </p>
        </div>
      </div>
    </>
  );
}
