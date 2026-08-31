/**
 * Données structurées partagées entre gabarits.
 *
 * Extrait dans un module dédié pour que le fil d'Ariane visuel (le `<nav>`
 * de chaque page) et son pendant en JSON-LD ne puissent pas diverger :
 * les deux passent par les mêmes libellés et les mêmes chemins.
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mozais.sn").replace(/\/$/, "");

export type Crumb = { name: string; href: string };

/** BreadcrumbList — le fil d'Ariane, pour l'affichage enrichi dans les résultats Google. */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.href}`,
    })),
  };
}

export type ListedItem = { name: string; href: string; image?: string };

/**
 * ItemList — décrit l'ordre des produits d'une page de collection.
 * Sans ce schéma, Google voit une page de liens mais ne sait pas qu'elle
 * représente un catalogue ordonné.
 */
export function itemListJsonLd(items: ListedItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${SITE_URL}${it.href}`,
      ...(it.image && { image: it.image.startsWith("http") ? it.image : `${SITE_URL}${it.image}` }),
    })),
  };
}
