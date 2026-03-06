# Migration from BaseHub to Static Content

This project has been migrated from using BaseHub CMS to static content configuration files.

## What Changed

### ✅ Removed
- `basehub` dependency from package.json
- All BaseHub API queries
- BaseHub token requirement (.env.example)
- basehub-types.d.ts (no longer needed)
- basehub.config.ts (no longer needed)

### ✅ Added
- `/src/config/site.ts` - Site-wide configuration (header, footer, settings)
- `/src/config/pages.ts` - Page content and sections
- `/src/lib/static-pump.tsx` - Replacement for Pump component
- `/src/lib/static-image.tsx` - Replacement for BaseHubImage
- `/src/lib/static-events.ts` - Replacement for event tracking

### ✅ Modified
- All components now use static imports instead of GraphQL queries
- Event tracking now logs to console (ready for your analytics integration)
- Images use Next.js Image component directly

## How to Use

### 1. Install Dependencies
```bash
cd landing-ghostdash-new
pnpm install
```

### 2. Update Content
Edit the configuration files to customize your content:

**Site Configuration** (`src/config/site.ts`):
- Logo URLs
- Navigation menu
- Footer links
- Social media links
- Metadata (title, description, OG image)

**Page Content** (`src/config/pages.ts`):
- Hero section
- Features
- Pricing
- FAQ
- All page sections

### 3. Add Images
Place your images in the `public/` folder:
- `/public/logo-light.svg` - Light mode logo
- `/public/logo-dark.svg` - Dark mode logo
- `/public/og-image.jpg` - Open Graph image
- `/public/avatars/` - User avatars
- `/public/platforms/` - Platform logos
- `/public/icons/` - Social media icons

### 4. Run Development Server
```bash
pnpm dev
```

Visit http://localhost:3000

### 5. Build for Production
```bash
pnpm build
pnpm start
```

## Customization Guide

### Adding a New Section
1. Add the section data to `src/config/pages.ts`
2. Create the section component in `src/app/_sections/`
3. Add the case to `SectionsUnion` in `src/app/[[...slug]]/page.tsx`

### Adding a New Page
1. Add the page route to `src/config/pages.ts`
2. The page will be automatically generated

### Integrating Analytics
Replace console.log calls in:
- `src/lib/static-events.ts` - Form submissions, events
- `src/app/_components/page-view/index.tsx` - Page views
- `src/app/_components/tracked_button/index.tsx` - Button clicks

Example with Google Analytics:
```typescript
// src/lib/static-events.ts
export async function sendEvent(ingestKey: string, data: any): Promise<void> {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', ingestKey, data);
  }
}
```

### Integrating Newsletter
Update `src/lib/static-events.ts` to connect with your email service:
```typescript
if (ingestKey === "newsletter") {
  // Example: Mailchimp, SendGrid, ConvertKit, etc.
  await fetch('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

## Benefits of This Approach

✅ No external dependencies for content
✅ No API tokens required
✅ Faster build times
✅ Type-safe content with TypeScript
✅ Easy to version control
✅ No runtime API calls
✅ Better performance (static generation)

## Need Help?

All the original components and styling are preserved. Only the data source changed from BaseHub API to local configuration files.
