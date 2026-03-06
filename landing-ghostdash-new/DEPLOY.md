# 🚀 Deploy to Vercel

## ✅ Pre-deployment Checklist

- [x] BaseHub removed from dependencies
- [x] All imports updated to use static configs
- [x] next.config.ts cleaned (BaseHub domains removed)
- [ ] Images added to `/public/` folder
- [ ] Content customized in `/src/config/`
- [ ] Test build locally: `pnpm build`

## 📦 Deployment Options

### Option 1: Deploy via Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI (if not already installed)
npm i -g vercel

# 2. Navigate to the project
cd landing-ghostdash-new

# 3. Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No (or Yes if you have one)
# - What's your project's name? ghostdash-landing
# - In which directory is your code located? ./
# - Want to override settings? No

# 4. Deploy to production
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: migrate landing to static content"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select `landing-ghostdash-new` as root directory
   - Click "Deploy"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `landing-ghostdash-new`
   - Build Command: `pnpm build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `pnpm install` (auto-detected)

### Option 3: Deploy Entire Monorepo

If you want to deploy both the dashboard AND the landing:

```bash
# In vercel.json at project root
{
  "builds": [
    {
      "src": "landing-ghostdash-new/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "landing-ghostdash-new/$1"
    }
  ]
}
```

## 🔧 Vercel Configuration

### No vercel.json needed!

Next.js projects on Vercel work automatically. The `vercel.json` from the old `ghostdash-landing` was for static HTML, but Next.js handles routing automatically.

### Environment 