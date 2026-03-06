# 🖼️ Images Required for GhostDash Landing

Place these images in the `/public/` folder to complete the landing page.

## 📁 Required Images

### Logos
```
/public/
├── logo-light.svg          # Logo for light mode (recommended: SVG, ~150x40px)
├── logo-dark.svg           # Logo for dark mode (recommended: SVG, ~150x40px)
└── favicon.ico             # Browser favicon (16x16, 32x32, 48x48)
```

### Social Media
```
/public/
└── og-image.jpg            # Open Graph image for social sharing
                            # Recommended: 1200x630px, JPG or PNG
```

### User Avatars (for testimonials/hero)
```
/public/avatars/
├── avatar-1.jpg            # User avatar 1 (recommended: 40x40px, square)
└── avatar-2.jpg            # User avatar 2 (recommended: 40x40px, square)
```

### Platform Logos
```
/public/platforms/
├── onlyfans.svg            # OnlyFans logo
├── mym.svg                 # MYM logo
├── shopify.svg             # Shopify logo
└── stripe.svg              # Stripe logo
```

### Social Icons
```
/public/icons/
├── twitter.svg             # Twitter/X icon (24x24px)
└── github.svg              # GitHub icon (24x24px)
```

## 🎨 Image Specifications

### Logos
- **Format**: SVG (preferred) or PNG with transparency
- **Size**: ~150x40px (will auto-scale based on aspect ratio)
- **Colors**: 
  - Light mode: Dark logo on transparent background
  - Dark mode: Light logo on transparent background

### Favicon
- **Format**: ICO or PNG
- **Sizes**: 16x16, 32x32, 48x48 (multi-size ICO recommended)
- **Tool**: Use https://realfavicongenerator.net/

### OG Image
- **Format**: JPG or PNG
- **Size**: 1200x630px (Facebook/Twitter recommended)
- **Content**: Logo + tagline + visual
- **File size**: < 1MB

### Avatars
- **Format**: JPG or PNG
- **Size**: 40x40px minimum (will be displayed as circles)
- **Quality**: High quality, clear faces

### Platform Logos
- **Format**: SVG (preferred) or PNG with transparency
- **Size**: Variable (will auto-scale)
- **Style**: Official brand logos

### Social Icons
- **Format**: SVG (preferred)
- **Size**: 24x24px
- **Style**: Simple, monochrome

## 🔧 Quick Setup

### Option 1: Use Placeholders
```bash
# Create placeholder images for testing
touch public/logo-light.svg
touch public/logo-dark.svg
touch public/favicon.ico
touch public/og-image.jpg
mkdir -p public/avatars public/platforms public/icons
```

### Option 2: Use Existing Images
If you have images from the old `ghostdash-landing/` folder:
```bash
# Copy from old landing
cp ../ghostdash-landing/heroghost.png public/logo-light.png
# ... etc
```

### Option 3: Generate with AI
Use tools like:
- **Logos**: Canva, Figma, or AI logo generators
- **OG Images**: https://og-playground.vercel.app/
- **Icons**: https://heroicons.com/ or https://lucide.dev/

## 📝 After Adding Images

1. Update paths in `src/config/site.ts` if needed
2. Update paths in `src/config/pages.ts` if needed
3. Test with `pnpm dev`
4. Check all pages render correctly

## 🎯 Priority Order

1. **Critical** (site won't look right without these):
   - logo-light.svg
   - logo-dark.svg
   - favicon.ico

2. **Important** (for social sharing):
   - og-image.jpg

3. **Nice to have** (for complete experience):
   - avatars/
   - platforms/
   - icons/

## 💡 Tips

- Use consistent style across all images
- Optimize images before adding (use tools like TinyPNG)
- SVG is preferred for logos and icons (scalable, small file size)
- Test in both light and dark modes
- Check mobile responsiveness

## 🔗 Resources

- **Free Icons**: https://heroicons.com/, https://lucide.dev/
- **Logo Maker**: https://www.canva.com/create/logos/
- **Image Optimizer**: https://tinypng.com/
- **Favicon Generator**: https://realfavicongenerator.net/
- **OG Image Generator**: https://og-playground.vercel.app/
