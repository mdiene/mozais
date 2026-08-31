"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { publishedCategories } from "@/lib/products";
import { cn } from "@/lib/utils";

export const SORTS = [
  { id: "populaire", label: "Les plus adoptés" },
  { id: "prix-asc", label: "Prix croissant" },
  { id: "prix-desc", label: "Prix décroissant" },
  { id: "note", label: "Mieux notés" },
] as const;

export type SortId = (typeof SORTS)[number]["id"];

/**
 * Facettes du catalogue. L'état vit dans l'URL, pas dans React : le tri et
 * les filtres restent partageables, indexables et fonctionnent avec le
 * bouton « précédent » du navigateur.
 */
export function CatalogFilters({ concerns }: { concerns: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);

  const activeCategory = params.get("categorie");
  const activeConcern = params.get("besoin");
  const activeSort = (params.get("tri") as SortId) ?? "populaire";
  const filterCount = [activeCategory, activeConcern].filter(Boolean).length;

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || next.get(key) === value) next.delete(key);
      else next.set(key, value);
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  return (
    <div className="border-y border-earth/10">
      {/* Barre principale */}
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 md:px-10">
        {/* Catégories — visibles directement sur grand écran */}
        <div className="no-scrollbar -mx-1 hidden gap-1 overflow-x-auto px-1 lg:flex">
          <FacetChip
            active={!activeCategory}
            onClick={() => setParam("categorie", null)}
          >
            Tout
          </FacetChip>
          {publishedCategories().map((c) => (
            <FacetChip
              key={c.slug}
              active={activeCategory === c.slug}
              onClick={() => setParam("categorie", c.slug)}
            >
              {c.name}
            </FacetChip>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          aria-expanded={panelOpen}
          className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-earth transition-colors hover:text-emerald-deep lg:hidden"
        >
          <SlidersHorizontal size={15} strokeWidth={1.25} />
          Filtrer
          {filterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-deep text-[9px] text-gold-pale">
              {filterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            aria-expanded={panelOpen}
            className="hidden items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-earth-soft transition-colors hover:text-emerald-deep lg:flex"
          >
            <SlidersHorizontal size={15} strokeWidth={1.25} />
            Besoin
            {activeConcern && (
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            )}
          </button>

          <label className="flex items-center gap-2">
            <span className="sr-only">Trier par</span>
            <select
              value={activeSort}
              onChange={(e) => setParam("tri", e.target.value)}
              className="cursor-pointer border-0 bg-transparent py-1 pr-6 text-[11px] font-medium uppercase tracking-[0.18em] text-earth focus:outline-none focus-visible:ring-0"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Panneau dépliant */}
      <div
        className={cn(
          "grid overflow-hidden border-t border-earth/10 bg-linen-deep transition-[grid-template-rows] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]",
          panelOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-transparent",
        )}
      >
        <div className="min-h-0">
          <div className="mx-auto max-w-[1440px] space-y-7 px-5 py-7 md:px-10">
            <div className="lg:hidden">
              <p className="eyebrow">Collection</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <FacetChip
                  active={!activeCategory}
                  onClick={() => setParam("categorie", null)}
                >
                  Tout
                </FacetChip>
                {publishedCategories().map((c) => (
                  <FacetChip
                    key={c.slug}
                    active={activeCategory === c.slug}
                    onClick={() => setParam("categorie", c.slug)}
                  >
                    {c.name}
                  </FacetChip>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow">Besoin de peau ou de cheveu</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {concerns.map((concern) => (
                  <FacetChip
                    key={concern}
                    active={activeConcern === concern}
                    onClick={() => setParam("besoin", concern)}
                  >
                    {concern}
                  </FacetChip>
                ))}
              </div>
            </div>

            {filterCount > 0 && (
              <button
                type="button"
                onClick={() => router.replace(pathname, { scroll: false })}
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-earth-soft transition-colors hover:text-earth"
              >
                <X size={13} strokeWidth={1.5} />
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FacetChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "whitespace-nowrap border px-3.5 py-2 text-[11px] tracking-[0.06em] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
        active
          ? "border-emerald-deep bg-emerald-deep text-linen"
          : "border-earth/18 text-earth-soft hover:border-earth/45 hover:text-earth",
      )}
    >
      {children}
    </button>
  );
}
