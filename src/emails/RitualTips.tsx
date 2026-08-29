import { Hr, Row, Column, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  EmailLayout,
  Eyebrow,
  GoldButton,
  Paragraph,
  Title,
  palette,
  serif,
} from "./components/EmailLayout";

export type RitualStepInput = { title: string; detail: string };

export type RitualTipsProps = {
  firstName: string;
  productName: string;
  productSlug: string;
  steps: RitualStepInput[];
  siteUrl?: string;
};

/**
 * Envoyé J+7 après la livraison.
 *
 * Le contenu est repris du rituel de la fiche produit : le client reçoit
 * exactement le protocole du produit qu'il a acheté, pas un conseil
 * générique. C'est aussi le message qui rattrape les mauvaises
 * utilisations avant qu'elles ne deviennent un avis à deux étoiles.
 */
export function RitualTips({
  firstName,
  productName,
  productSlug,
  steps,
  siteUrl = "https://mozais.sn",
}: RitualTipsProps) {
  return (
    <EmailLayout
      preview={`${firstName}, tirez le meilleur de votre ${productName}.`}
      footerNote="Vous recevez ce message une seule fois, sept jours après votre livraison. Aucune suite automatique ne s'y ajoute."
    >
      <Eyebrow>Une semaine plus tard</Eyebrow>
      <Title>Où en êtes-vous, {firstName} ?</Title>

      <Paragraph>
        Vous avez reçu votre <strong style={{ color: palette.earth }}>{productName}</strong>{" "}
        il y a une semaine. C&apos;est le moment où la plupart des routines
        déraillent — souvent parce qu&apos;on en fait trop. Voici le protocole,
        rappelé simplement.
      </Paragraph>

      <Section style={{ margin: "28px 0 8px" }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.title}>
            {i > 0 && (
              <Hr
                style={{
                  border: "none",
                  borderTop: `1px solid ${palette.earthMuted}`,
                  opacity: 0.25,
                  margin: "18px 0",
                }}
              />
            )}
            <Row>
              <Column
                style={{
                  verticalAlign: "top",
                  width: "44px",
                  fontFamily: serif,
                  fontSize: "26px",
                  color: palette.gold,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </Column>
              <Column style={{ verticalAlign: "top" }}>
                <Text
                  style={{
                    margin: 0,
                    fontFamily: serif,
                    fontSize: "19px",
                    color: palette.earth,
                  }}
                >
                  {step.title}
                </Text>
                <Text
                  style={{
                    margin: "5px 0 0",
                    fontSize: "13px",
                    lineHeight: "22px",
                    color: palette.earthSoft,
                  }}
                >
                  {step.detail}
                </Text>
              </Column>
            </Row>
          </React.Fragment>
        ))}
      </Section>

      <Section
        style={{
          backgroundColor: palette.linenDeep,
          padding: "20px 22px",
          margin: "28px 0",
        }}
      >
        <Text
          style={{
            margin: 0,
            fontFamily: serif,
            fontSize: "17px",
            fontStyle: "italic" as const,
            lineHeight: "26px",
            color: palette.emerald,
          }}
        >
          « Une peau purifiée mais déshydratée se défend en produisant davantage
          de sébum. Nettoyer sans nourrir, c&apos;est relancer le problème. »
        </Text>
        <Text
          style={{
            margin: "12px 0 0",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase" as const,
            color: palette.gold,
          }}
        >
          Le carnet MOZAIS
        </Text>
      </Section>

      <Section style={{ textAlign: "center" as const, padding: "6px 0 8px" }}>
        <GoldButton href={`${siteUrl}/produits/${productSlug}`}>
          Revoir le rituel complet
        </GoldButton>
      </Section>
    </EmailLayout>
  );
}

RitualTips.PreviewProps = {
  firstName: "Aïssatou",
  productName: "Perfect Skin",
  productSlug: "perfect-skin",
  steps: [
    {
      title: "Faire mousser à part",
      detail:
        "Entre les paumes humides, jamais directement sur le visage. On veut la mousse, pas le frottement du pain.",
    },
    {
      title: "Poser 60 secondes",
      detail:
        "Appliquer en mouvements circulaires légers et laisser agir une minute pleine : c'est là que le soufre travaille.",
    },
    {
      title: "Rincer à l'eau tiède",
      detail: "Jamais chaude. Sécher en tamponnant, sans frotter la zone des imperfections.",
    },
    {
      title: "Hydrater dans la foulée",
      detail:
        "Une huile légère sur peau encore humide. Une peau purifiée mais déshydratée sur-produira du sébum.",
    },
  ],
} satisfies RitualTipsProps;

export default RitualTips;
