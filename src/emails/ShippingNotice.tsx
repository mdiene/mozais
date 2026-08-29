import { Column, Row, Section, Text } from "@react-email/components";
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

export type ShippingNoticeProps = {
  reference: string;
  firstName: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
  address: { street: string; city: string; region: string };
};

export function ShippingNotice({
  reference,
  firstName,
  carrier,
  trackingNumber,
  trackingUrl,
  estimatedDelivery,
  address,
}: ShippingNoticeProps) {
  return (
    <EmailLayout
      preview={`Votre commande ${reference} est partie de Dakar.`}
      footerNote="Le livreur vous appellera avant de se présenter. Si vous êtes absente, il repassera le lendemain sans frais supplémentaires."
    >
      <Eyebrow>Commande {reference}</Eyebrow>
      <Title>C&apos;est parti, {firstName}.</Title>

      <Paragraph>
        Votre colis a quitté l&apos;atelier ce matin. Chaque pain part avec son
        numéro de lot et sa date de coulage — vous les trouverez sous
        l&apos;étiquette.
      </Paragraph>

      <Section
        style={{
          border: `1px solid ${palette.gold}`,
          padding: "22px",
          margin: "26px 0",
        }}
      >
        <Row>
          <Column style={{ verticalAlign: "top", paddingRight: "14px" }}>
            <Eyebrow>Transporteur</Eyebrow>
            <Text style={{ margin: 0, fontSize: "14px", color: palette.earth }}>
              {carrier}
            </Text>
          </Column>
          <Column style={{ verticalAlign: "top" }}>
            <Eyebrow>Suivi</Eyebrow>
            <Text
              style={{
                margin: 0,
                fontFamily: serif,
                fontSize: "17px",
                letterSpacing: "1px",
                color: palette.emerald,
              }}
            >
              {trackingNumber}
            </Text>
          </Column>
        </Row>

        <Row style={{ marginTop: "18px" }}>
          <Column>
            <Eyebrow>Livraison estimée</Eyebrow>
            <Text style={{ margin: 0, fontSize: "14px", color: palette.earth }}>
              {estimatedDelivery}
            </Text>
            <Text
              style={{
                margin: "6px 0 0",
                fontSize: "12px",
                lineHeight: "20px",
                color: palette.earthMuted,
              }}
            >
              {address.street} · {address.city}, {address.region}
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{ textAlign: "center" as const, padding: "6px 0 8px" }}>
        <GoldButton href={trackingUrl}>Suivre mon colis</GoldButton>
      </Section>
    </EmailLayout>
  );
}

ShippingNotice.PreviewProps = {
  reference: "MZ-4F7A21",
  firstName: "Aïssatou",
  carrier: "Yobante Express",
  trackingNumber: "YB-882 004 116",
  trackingUrl: "https://mozais.sn/suivi/YB-882004116",
  estimatedDelivery: "Demain avant 18 h",
  address: {
    street: "Rue GY-118, Villa 42",
    city: "Sacré-Cœur 3",
    region: "Dakar",
  },
} satisfies ShippingNoticeProps;

export default ShippingNotice;
