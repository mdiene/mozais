import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

/* ============================================================
   Coquille commune à tous les e-mails MOZAIS.

   Contraintes propres à l'e-mail, qui expliquent les choix ici :
   — pas de SVG (Gmail et Outlook les suppriment) : le lotus est
     remplacé par le mot-marque en serif lettré ;
   — pas de flexbox ni de grid : Outlook desktop utilise le moteur
     de rendu de Word, on reste en tables et en styles en ligne ;
   — pas de webfont fiable : on retombe sur Georgia, qui a la même
     couleur de gris à l'écran que Cormorant.
   ============================================================ */

export const palette = {
  linen: "#FBF8F5",
  linenDeep: "#F4EFEA",
  emerald: "#1B3022",
  gold: "#C5A059",
  goldBright: "#D4AF37",
  earth: "#2E1911",
  earthSoft: "#7A5A4A",
  earthMuted: "#A08A7C",
};

export const serif = "Georgia, 'Times New Roman', Times, serif";
export const sans =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export function EmailLayout({
  preview,
  children,
  footerNote,
}: {
  preview: string;
  children: React.ReactNode;
  footerNote?: string;
}) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: "32px 12px",
          backgroundColor: palette.linenDeep,
          fontFamily: sans,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: palette.linen,
            border: `1px solid ${palette.gold}`,
          }}
        >
          {/* — Bandeau — */}
          <Section
            style={{
              backgroundColor: palette.emerald,
              padding: "30px 32px 26px",
              textAlign: "center" as const,
            }}
          >
            <Text
              style={{
                margin: 0,
                fontFamily: serif,
                fontSize: "27px",
                fontWeight: 400,
                letterSpacing: "7px",
                color: palette.goldBright,
                textIndent: "7px",
              }}
            >
              MOZAIS
            </Text>
            <Text
              style={{
                margin: "10px 0 0",
                fontSize: "9px",
                letterSpacing: "3.4px",
                textTransform: "uppercase" as const,
                color: "rgba(227,205,155,0.65)",
              }}
            >
              Made with love in Senegal
            </Text>
          </Section>

          {/* — Corps — */}
          <Section style={{ padding: "36px 32px 8px" }}>{children}</Section>

          {/* — Pied — */}
          <Section style={{ padding: "8px 32px 34px" }}>
            <Hr
              style={{
                border: "none",
                borderTop: `1px solid ${palette.gold}`,
                opacity: 0.4,
                margin: "26px 0 22px",
              }}
            />

            {footerNote && (
              <Text
                style={{
                  margin: "0 0 18px",
                  fontSize: "12px",
                  lineHeight: "20px",
                  color: palette.earthSoft,
                }}
              >
                {footerNote}
              </Text>
            )}

            <Text
              style={{
                margin: 0,
                fontSize: "11px",
                lineHeight: "19px",
                color: palette.earthMuted,
              }}
            >
              MOZAIS · Guédiawaye, Sénégal
              <br />
              <Link
                href="mailto:bonjour@mozais.sn"
                style={{ color: palette.earthSoft, textDecoration: "underline" }}
              >
                bonjour@mozais.sn
              </Link>
              {" · "}
              <Link
                href="https://mozais.sn"
                style={{ color: palette.earthSoft, textDecoration: "underline" }}
              >
                mozais.sn
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ---------- Fragments réutilisables ---------- */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        margin: "0 0 12px",
        fontSize: "10px",
        letterSpacing: "3px",
        textTransform: "uppercase" as const,
        color: palette.gold,
      }}
    >
      {children}
    </Text>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        margin: "0 0 18px",
        fontFamily: serif,
        fontSize: "31px",
        lineHeight: "36px",
        fontWeight: 400,
        color: palette.emerald,
      }}
    >
      {children}
    </Text>
  );
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        margin: "0 0 16px",
        fontSize: "14px",
        lineHeight: "24px",
        color: palette.earthSoft,
      }}
    >
      {children}
    </Text>
  );
}

export function GoldButton({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        backgroundColor: palette.emerald,
        border: `1px solid ${palette.gold}`,
        color: palette.linen,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "2.6px",
        textTransform: "uppercase" as const,
        textDecoration: "none",
        padding: "15px 30px",
      }}
    >
      {children}
    </Link>
  );
}
