import { Column, Hr, Row, Section, Text } from "@react-email/components";
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

export type OrderLine = {
  name: string;
  line?: string;
  variantLabel: string;
  fragranceName?: string;
  quantity: number;
  unitPrice: number;
};

export type OrderConfirmationProps = {
  reference: string;
  firstName: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  address: { street: string; detail?: string; city: string; region: string };
  paymentLabel: string;
  siteUrl?: string;
};

const fmt = new Intl.NumberFormat("fr-SN", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});
const price = (n: number) => fmt.format(n).replace(/ | /g, " ");

export function OrderConfirmation({
  reference,
  firstName,
  lines,
  subtotal,
  shipping,
  total,
  address,
  paymentLabel,
  siteUrl = "https://mozais.sn",
}: OrderConfirmationProps) {
  return (
    <EmailLayout
      preview={`Commande ${reference} confirmée — merci ${firstName}.`}
      footerNote="Une question sur cette commande ? Répondez simplement à cet e-mail, une personne de la maison vous lira."
    >
      <Eyebrow>Commande {reference}</Eyebrow>
      <Title>Merci, {firstName}.</Title>

      <Paragraph>
        Votre commande est enregistrée. Nous la préparons à l&apos;atelier de
        Dakar et vous recevrez un second message dès qu&apos;elle partira — avec
        le numéro de suivi.
      </Paragraph>

      {/* — Détail — */}
      <Section
        style={{
          backgroundColor: palette.linenDeep,
          padding: "22px 22px 6px",
          margin: "26px 0",
        }}
      >
        {lines.map((line, i) => (
          <Row key={i} style={{ marginBottom: "16px" }}>
            <Column style={{ verticalAlign: "top" }}>
              {line.line && (
                <Text
                  style={{
                    margin: 0,
                    fontSize: "9px",
                    letterSpacing: "2.4px",
                    textTransform: "uppercase" as const,
                    color: palette.gold,
                  }}
                >
                  {line.line}
                </Text>
              )}
              <Text
                style={{
                  margin: "2px 0 0",
                  fontFamily: serif,
                  fontSize: "17px",
                  color: palette.earth,
                }}
              >
                {line.name}
              </Text>
              <Text
                style={{ margin: "3px 0 0", fontSize: "12px", color: palette.earthMuted }}
              >
                {line.variantLabel}
                {line.fragranceName ? ` · ${line.fragranceName}` : ""} · ×{line.quantity}
              </Text>
            </Column>
            <Column
              style={{
                verticalAlign: "top",
                textAlign: "right" as const,
                width: "110px",
                fontSize: "14px",
                color: palette.earth,
              }}
            >
              {price(line.unitPrice * line.quantity)}
            </Column>
          </Row>
        ))}

        <Hr
          style={{
            border: "none",
            borderTop: `1px solid ${palette.earthMuted}`,
            opacity: 0.3,
            margin: "18px 0 14px",
          }}
        />

        <SummaryRow label="Sous-total" value={price(subtotal)} />
        <SummaryRow
          label="Livraison"
          value={shipping === 0 ? "Offerte" : price(shipping)}
        />

        <Hr
          style={{
            border: "none",
            borderTop: `1px solid ${palette.gold}`,
            margin: "14px 0",
          }}
        />

        <Row style={{ marginBottom: "18px" }}>
          <Column
            style={{ fontFamily: serif, fontSize: "20px", color: palette.emerald }}
          >
            Total
          </Column>
          <Column
            style={{
              textAlign: "right" as const,
              fontFamily: serif,
              fontSize: "20px",
              color: palette.emerald,
            }}
          >
            {price(total)}
          </Column>
        </Row>
      </Section>

      {/* — Livraison & paiement — */}
      <Row>
        <Column style={{ verticalAlign: "top", paddingRight: "16px" }}>
          <Eyebrow>Livraison</Eyebrow>
          <Text
            style={{
              margin: 0,
              fontSize: "13px",
              lineHeight: "21px",
              color: palette.earthSoft,
            }}
          >
            {address.street}
            {address.detail ? <><br />{address.detail}</> : null}
            <br />
            {address.city}, {address.region}
          </Text>
        </Column>
        <Column style={{ verticalAlign: "top" }}>
          <Eyebrow>Paiement</Eyebrow>
          <Text
            style={{
              margin: 0,
              fontSize: "13px",
              lineHeight: "21px",
              color: palette.earthSoft,
            }}
          >
            {paymentLabel}
          </Text>
        </Column>
      </Row>

      <Section style={{ textAlign: "center" as const, padding: "32px 0 8px" }}>
        <GoldButton href={`${siteUrl}/boutique`}>Continuer vos achats</GoldButton>
      </Section>
    </EmailLayout>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Row style={{ marginBottom: "6px" }}>
      <Column style={{ fontSize: "13px", color: palette.earthSoft }}>{label}</Column>
      <Column
        style={{
          textAlign: "right" as const,
          fontSize: "13px",
          color: palette.earthSoft,
        }}
      >
        {value}
      </Column>
    </Row>
  );
}

OrderConfirmation.PreviewProps = {
  reference: "MZ-4F7A21",
  firstName: "Aïssatou",
  lines: [
    {
      name: "Perfect Skin",
      variantLabel: "150 g",
      quantity: 2,
      unitPrice: 8500,
    },
    {
      name: "Huile de Baobab",
      variantLabel: "50 ml",
      fragranceName: "Néroli",
      quantity: 1,
      unitPrice: 12000,
    },
  ],
  subtotal: 29000,
  shipping: 0,
  total: 29000,
  address: {
    street: "Rue GY-118, Villa 42",
    detail: "En face de la pharmacie Mermoz",
    city: "Sacré-Cœur 3",
    region: "Dakar",
  },
  paymentLabel: "Wave — lien envoyé par SMS",
} satisfies OrderConfirmationProps;

export default OrderConfirmation;
