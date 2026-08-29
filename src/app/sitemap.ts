import type { MetadataRoute } from "next";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mozais.sn";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics = ["", "/boutique", "/rituels", "/maison"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const products = PRODUCTS.map((p) => ({
    url: `${BASE}/produits/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const collections = CATEGORIES.map((c) => ({
    url: `${BASE}/boutique?categorie=${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const help = ["livraison", "paiement", "conseils", "cgv"].map((slug) => ({
    url: `${BASE}/aide/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...statics, ...products, ...collections, ...help];
}
