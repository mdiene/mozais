import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mozais.sn";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Le tunnel de commande n'a rien à faire dans l'index.
      disallow: ["/commande", "/api/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
