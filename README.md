# MOZAIS — boutique en ligne

Plateforme e-commerce de la marque MOZAIS : savons purifiants, soins
capillaires afro, huiles pressées à froid et skincare naturel.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Zustand · React Email + Resend.

---

## Démarrer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Le site tourne sur <http://localhost:3000>. Aucune variable
d'environnement n'est obligatoire pour développer : sans clé Resend, les
e-mails sont écrits dans la console au lieu d'être envoyés.

| Commande        | Effet                       |
| --------------- | --------------------------- |
| `npm run dev`   | Serveur de développement    |
| `npm run build` | Build de production         |
| `npm start`     | Sert le build de production |
| `npm run lint`  | ESLint                      |

---

## Vos photos

Déposez vos originaux pleine résolution dans `assets/photos/`, en nommant
chaque fichier d'après le `slug` du produit, puis :

```bash
npm run photos
```

Le script redimensionne, recadre au bon format et compresse vers
`public/products/` — sans jamais toucher aux originaux, donc relançable
autant de fois que voulu. En pratique il divise le poids par quinze
(2 885 ko → 162 ko sur la première photo), ce qui compte beaucoup sur les
connexions mobiles sénégalaises.

| Nom du fichier source        | Format produit | Usage                  |
| ---------------------------- | -------------- | ---------------------- |
| `perfect-skin.jpg`           | 4:5, 1200×1500 | Vignette et fiche      |
| `perfect-skin-macro-1.jpg`   | 1:1, 900×900   | Miniature de galerie   |

Il reste ensuite à pointer le champ `image` du produit vers le `.jpg` dans
`src/lib/products.ts`, et à lister les macros dans `gallery`.

Les fichiers de `public/products/` encore en `.svg` sont des compositions
générées aux couleurs de la marque, en attendant vos photos. Pour les
régénérer après avoir ajouté une référence au catalogue :

```bash
npm run placeholders
```

Les prompts de génération d'images correspondant exactement à ces formats
sont réunis dans la **Direction photo MOZAIS**, publiée à part.

## Architecture

```
src/
├── app/
│   ├── page.tsx                    Accueil (hero + 7 sections)
│   ├── boutique/                   Catalogue filtrable (facettes dans l'URL)
│   ├── produits/[slug]/            Fiche produit + JSON-LD
│   ├── rituels/                    Les quatre protocoles de soin
│   ├── maison/                     Histoire, engagements, contact
│   ├── commande/                   Tunnel + page de confirmation
│   ├── aide/[slug]/                Livraison, paiement, conseils, CGV
│   └── api/
│       ├── checkout/               Validation + recalcul + e-mails
│       ├── newsletter/             Inscription à l'audience Resend
│       └── emails/preview/         Aperçu des gabarits (dev uniquement)
├── components/
│   ├── hero/SoapFoamCanvas.tsx     Mousse réactive au curseur
│   ├── commerce/                   Panier, fiche d'achat, tunnel
│   ├── sections/                   Blocs éditoriaux de l'accueil
│   └── ui/                         Primitives (bouton, étoiles, reveal)
├── emails/                         Gabarits React Email
├── lib/
│   ├── products.ts                 Catalogue — source de vérité
│   └── commerce.ts                 Seuils de livraison, partagés
└── store/cart.ts                   Panier Zustand, persisté
```

### Design system

Les jetons sont déclarés dans `src/app/globals.css`, bloc `@theme` :

| Rôle             | Jeton                   | Valeur    |
| ---------------- | ----------------------- | --------- |
| Émeraude profond | `--color-emerald-deep`  | `#1B3022` |
| Or brossé        | `--color-gold`          | `#C5A059` |
| Or lumineux      | `--color-gold-bright`   | `#D4AF37` |
| Lin / crème      | `--color-linen`         | `#FBF8F5` |
| Lin ombré        | `--color-linen-deep`    | `#F4EFEA` |
| Brun terreux     | `--color-earth`         | `#2E1911` |

Titres en **Cormorant Garamond**, interface en **Plus Jakarta Sans**,
chargées par `next/font` (aucune requête vers Google au runtime).

**Parti pris à conserver :** l'or ne remplit jamais une grande surface.
Il sert en filet, en soulignement, en petites capitales et sur des
micro-surfaces. Un bouton doré plein fait basculer la page du luxe au
clinquant — c'est pourquoi l'action principale est en émeraude avec un
filet or au survol.

---

## La mousse du hero

`src/components/hero/SoapFoamCanvas.tsx` — Canvas 2D, pas WebGL.

Three.js aurait ajouté ~600 ko au bundle pour un résultat moins juste :
la mousse de savon n'est pas un fluide continu, c'est un amas de bulles
discrètes. Un système de particules avec répulsion douce s'en approche
davantage et tient 60 fps sur mobile.

Le curseur est suivi par un point à inertie (ressort amorti). L'émission
est proportionnelle à la vitesse du geste : un mouvement rapide laisse
une traînée abondante, un curseur immobile ne laisse que la mousse
d'ambiance. Chaque bulle monte, dérive vers le socle du produit, se
repousse de ses voisines, puis se résorbe.

Garde-fous : plafond de particules réduit sur mobile, boucle arrêtée
hors écran et onglet masqué, rendu statique si `prefers-reduced-motion`
est actif.

Réglages disponibles en props : `focus` (point d'accumulation, en
coordonnées 0-1) et `density`.

---

## E-mails

Trois gabarits dans `src/emails/`, tous construits sur la même coquille
(`components/EmailLayout.tsx`) : fond lin, encadré or, mot-marque en
serif.

| Gabarit                 | Déclencheur                                   |
| ----------------------- | --------------------------------------------- |
| `OrderConfirmation.tsx` | Commande validée, immédiat                    |
| `ShippingNotice.tsx`    | Expédition — à brancher sur votre back-office |
| `RitualTips.tsx`        | J+7, programmé via l'envoi différé de Resend  |

Aperçu dans le navigateur pendant le développement :

- <http://localhost:3000/api/emails/preview?template=order>
- <http://localhost:3000/api/emails/preview?template=shipping>
- <http://localhost:3000/api/emails/preview?template=ritual>

La route est fermée en production.

Le J+7 n'a pas besoin de planificateur : il est programmé au moment de
la commande via `scheduledAt`, côté Resend.

---

## Ce qui reste à brancher

Le tunnel est complet côté client et côté validation. Trois raccords
métier restent à faire :

1. **Persistance des commandes.** `src/app/api/checkout/route.ts`
   journalise la commande dans la console. Le point d'accroche est
   signalé par un commentaire : une seule écriture à ajouter vers votre
   base ou votre back-office.
2. **Paiement réel.** Les quatre moyens (Wave, Orange Money, carte,
   espèces) sont proposés et transmis, mais aucune transaction n'est
   initiée. Il faut appeler l'API du prestataire après validation.
3. **Stock.** `inStock` est un booléen figé dans `src/lib/products.ts`.
   À relier à votre gestion de stock si vous en avez une.

> **Sécurité déjà en place :** les prix envoyés par le navigateur sont
> ignorés. La route `/api/checkout` recalcule chaque ligne depuis le
> catalogue serveur, refuse les produits épuisés et borne les quantités.
> Un panier trafiqué dans `localStorage` n'a aucun effet sur le total.

---

## Déploiement — GitHub + Vercel

Le dépôt est sur [github.com/mdiene/mozais](https://github.com/mdiene/mozais).
Le projet est prêt pour Vercel sans configuration particulière : Next.js y
est détecté automatiquement, `next build` passe, 28 routes dont 21
pré-rendues en statique.

### Connecter Vercel au dépôt

1. Sur [vercel.com/new](https://vercel.com/new), choisir **Import Git
   Repository** et sélectionner `mdiene/mozais`.
2. Vercel détecte le framework Next.js tout seul — aucun réglage de build
   à changer (`next build`, dossier `.next`, etc.).
3. Renseigner les variables d'environnement de production (Project
   Settings → Environment Variables), reprises de `.env.example` :

   | Variable | Obligatoire | Rôle |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | Non | Domaine utilisé par le sitemap, `robots.txt` et les liens des e-mails. Sans elle, retombe sur `https://mozais.sn`. |
   | `RESEND_API_KEY` | Non | Sans elle, le site fonctionne normalement : les e-mails sont journalisés dans les logs Vercel au lieu d'être envoyés. |
   | `MOZAIS_FROM_EMAIL` | Non | Expéditeur des e-mails transactionnels. |
   | `MOZAIS_REPLY_TO` | Non | Adresse de réponse. |
   | `RESEND_AUDIENCE_ID` | Non | Audience Resend pour l'infolettre du pied de page. |

   Aucune n'est strictement requise pour un premier déploiement — le site
   se construit et se sert sans elles, les fonctionnalités liées à Resend
   se dégradant proprement (voir [E-mails](#e-mails)).
4. **Deploy.** Chaque push sur `main` republie automatiquement ensuite ;
   chaque pull request reçoit son propre aperçu.

### Intégration continue

`.github/workflows/ci.yml` fait tourner TypeScript, ESLint et `next
build` sur chaque push et chaque pull request vers `main` — un contrôle
qui échoue en quelques minutes plutôt que de découvrir un build Vercel
cassé après coup.

### Avant la mise en ligne réelle

- faire rédiger les CGV — `src/app/aide/[slug]/page.tsx` ne contient
  qu'un canevas ;
- vérifier les coordonnées dans `src/components/layout/Footer.tsx` et
  `src/app/maison/page.tsx` (téléphone, adresse, WhatsApp) : ce sont des
  valeurs d'exemple ;
- relire les textes produits de `src/lib/products.ts` — descriptions,
  actifs, prix et avis sont des propositions rédactionnelles, à valider
  ou remplacer par vos contenus réels ;
- si `RESEND_API_KEY` est renseignée, vérifier le domaine d'envoi (SPF,
  DKIM, DMARC) dans Resend avant le premier envoi réel ;
- relier un domaine personnalisé dans Vercel (Project Settings →
  Domains) et mettre à jour `NEXT_PUBLIC_SITE_URL` en conséquence.
