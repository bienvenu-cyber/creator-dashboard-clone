# 🎯 Next Steps - GhostDash Landing

## ✅ Ce qui a été fait

1. **Suppression de BaseHub**
   - ✅ Dépendance `basehub` retirée du package.json
   - ✅ Tous les imports BaseHub remplacés
   - ✅ Fichiers de config BaseHub supprimés (basehub.config.ts, basehub-types.d.ts, .env.example)

2. **Création de configs statiques**
   - ✅ `src/config/site.ts` - Configuration du site (header, footer, metadata)
   - ✅ `src/config/pages.ts` - Contenu des pages (hero, features, pricing, FAQ)

3. **Remplacement des composants BaseHub**
   - ✅ `src/lib/static-pump.tsx` - Remplace Pump
   - ✅ `src/lib/static-image.tsx` - Remplace BaseHubImage
   - ✅ `src/lib/static-events.ts` - Remplace event tracking

4. **Mise à jour des composants**
   - ✅ Layout, Header, Footer
   - ✅ Newsletter, PageView
   - ✅ Tracked buttons
   - ✅ Avatar, DarkLightImage
   - ✅ Page dynamique principale

## 🚀 Pour lancer le projet

```bash
# 1. Installer les dépendances
cd landing-ghostdash-new
pnpm install

# 2. Lancer en dev
pnpm dev

# 3. Ouvrir http://localhost:3000
```

## 📝 Personnalisation du contenu

### 1. Modifier le branding
Éditer `src/config/site.ts` :
```typescript
export const siteConfig = {
  settings: {
    sitename: "GhostDash",
    defaultTitle: "GhostDash - Professional Dashboard Replicas",
    defaultDescription: "Votre description...",
    // ...
  }
}
```

### 2. Modifier le contenu des pages
Éditer `src/config/pages.ts` :
```typescript
export const pagesConfig = {
  "/": {
    sections: [
      {
        __typename: "HeroComponent",
        title: "Votre titre...",
        subtitle: "Votre sous-titre...",
        // ...
      }
    ]
  }
}
```

### 3. Ajouter les images
Placer vos images dans `public/` :
```
public/
├── logo-light.svg          # Logo mode clair
├── logo-dark.svg           # Logo mode sombre
├── og-image.jpg            # Image Open Graph
├── favicon.ico             # Favicon
├── avatars/                # Avatars utilisateurs
│   ├── avatar-1.jpg
│   └── avatar-2.jpg
├── platforms/              # Logos plateformes
│   ├── onlyfans.svg
│   ├── mym.svg
│   ├── shopify.svg
│   └── stripe.svg
└── icons/                  # Icônes réseaux sociaux
    ├── twitter.svg
    └── github.svg
```

## 🎨 Sections disponibles

Le système supporte ces types de sections (voir `src/config/pages.ts`) :

- `HeroComponent` - Section hero avec CTA
- `CompaniesComponent` - Logos de clients/plateformes
- `FeaturesGridComponent` - Grille de features
- `FeaturesCardsComponent` - Cards de features
- `FeaturesSideBySideComponent` - Features côte à côte
- `FeaturesBigImageComponent` - Feature avec grande image
- `PricingComponent` - Section pricing
- `FaqComponent` - FAQ (accordion ou list)
- `CalloutComponent` - Bannière CTA
- `TestimonialSliderComponent` - Slider de témoignages
- `TestimonialsGridComponent` - Grille de témoignages
- `FormComponent` - Formulaire
- `FreeformTextComponent` - Texte libre

## 🔧 Intégrations à faire

### Analytics
Remplacer les `console.log` dans :
- `src/lib/static-events.ts`
- `src/app/_components/page-view/index.tsx`
- `src/app/_components/tracked_button/index.tsx`

Exemple Google Analytics :
```typescript
// src/lib/static-events.ts
export async function sendEvent(ingestKey: string, data: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', ingestKey, data);
  }
}
```

### Newsletter
Intégrer votre service email dans `src/lib/static-events.ts` :
```typescript
if (ingestKey === "newsletter") {
  await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
```

## 📦 Build & Deploy

```bash
# Build
pnpm build

# Test le build
pnpm start

# Deploy sur Vercel
vercel deploy
```

## 🐛 Troubleshooting

### Erreur d'import
Si tu vois des erreurs d'import BaseHub, vérifie que tous les fichiers ont été mis à jour.

### Images manquantes
Les images dans `src/config/` pointent vers `/public/`. Assure-toi que les chemins correspondent.

### TypeScript errors
Lance `pnpm build` pour voir toutes les erreurs TypeScript.

## 📚 Documentation

- `README.md` - Guide principal
- `MIGRATION.md` - Détails de la migration BaseHub → Static
- `NEXT_STEPS.md` - Ce fichier

## 🎉 C'est prêt !

Le code est maintenant 100% indépendant de BaseHub. Tout le contenu est géré via des fichiers TypeScript dans `src/config/`.

Tu peux :
1. Lancer le projet avec `pnpm dev`
2. Personnaliser le contenu dans `src/config/`
3. Ajouter tes images dans `public/`
4. Build et deploy !
