# GhostDash Landing Page

Modern Next.js landing page for GhostDash - Professional Dashboard Replicas.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
pnpm start
```

Visit http://localhost:3000

## 📁 Project Structure

```
landing-ghostdash-new/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [[...slug]]/       # Dynamic pages
│   │   ├── _components/       # Shared components
│   │   └── _sections/         # Page sections
│   ├── common/                # Common UI components
│   ├── config/                # Content configuration
│   │   ├── site.ts           # Site-wide config
│   │   └── pages.ts          # Page content
│   └── lib/                   # Utilities
├── public/                    # Static assets
└── MIGRATION.md              # Migration guide
```

## ✏️ Customization

### Update Content
Edit configuration files:
- `src/config/site.ts` - Logo, navigation, footer, metadata
- `src/config/pages.ts` - Hero, features, pricing, FAQ

### Add Images
Place images in `public/` folder:
- `/public/logo-light.svg` - Light mode logo
- `/public/logo-dark.svg` - Dark mode logo
- `/public/og-image.jpg` - Social media preview
- `/public/favicon.ico` - Browser icon

### Customize Styling
- Tailwind CSS configuration: `tailwind.config.ts`
- Global styles: `src/app/globals.css`
- Component styles: Individual component files

## 🎨 Features

- ✅ Next.js 16 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Dark/Light mode
- ✅ Responsive design
- ✅ Static site generation
- ✅ SEO optimized
- ✅ No external CMS dependencies

## 📝 Content Management

All content is managed through TypeScript configuration files in `src/config/`. This approach provides:

- Type safety
- Version control
- No runtime API calls
- Fast builds
- Easy to customize

See `MIGRATION.md` for detailed information about the content structure.

## 🔧 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Radix Icons
- **Fonts**: Geist Sans & Geist Mono

## 📦 Deployment

This is a standard Next.js application. Deploy to:

- **Vercel** (recommended): `vercel deploy`
- **Netlify**: Connect your repo
- **Self-hosted**: `pnpm build && pnpm start`

## 🤝 Contributing

1. Edit content in `src/config/`
2. Test locally with `pnpm dev`
3. Build with `pnpm build`
4. Deploy

## 📄 License

MIT
