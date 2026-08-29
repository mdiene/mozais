import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mozais.sn"),
  title: {
    default: "MOZAIS — Soins naturels d'exception, faits au Sénégal",
    template: "%s · MOZAIS",
  },
  description:
    "Savons purifiants, soins capillaires afro, huiles pressées à froid et skincare naturel. Formulés et coulés à Dakar, en petits lots. Made with love in Senegal.",
  keywords: [
    "savon purifiant",
    "soin capillaire afro",
    "huile de baobab",
    "karité",
    "neem",
    "skincare naturel Sénégal",
  ],
  openGraph: {
    type: "website",
    locale: "fr_SN",
    siteName: "MOZAIS",
    title: "MOZAIS — Soins naturels d'exception, faits au Sénégal",
    description:
      "Savons purifiants, soins capillaires afro, huiles pressées à froid et skincare naturel.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B3022",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="min-h-dvh bg-linen antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-emerald-deep focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-linen"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
