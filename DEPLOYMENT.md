# DEPLOYMENT & SETUP GUIDE

## 📦 Pre-Deployment Checklist

- [ ] All resume data updated in `src/data/resume.js`
- [ ] Contact email configured
- [ ] Social links updated (GitHub, LinkedIn)
- [ ] Project descriptions finalized
- [ ] No console errors in development
- [ ] Lighthouse audit score 90+
- [ ] All assets optimized
- [ ] Meta tags updated in `index.html`
- [ ] Favicon added to `public/`

## 🚀 Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Verify installation
npm list react three framer-motion
```

### 2. Development

```bash
# Start dev server
npm run dev

# Opens at http://localhost:3000
```

### 3. Build

```bash
# Create production build
npm run build

# Preview production build
npm preview
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Pros**: Zero-config, auto-scaling, global CDN

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel deploy

# For production
vercel deploy --prod
```

**Production Domain**:
- Points to your Vercel URL
- Auto HTTPS
- Automatic deployments on git push (with GitHub integration)

### Option 2: Netlify

**Pros**: Easy deployment, free tier generous

1. Connect GitHub repo to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Click "Deploy"

**Features**:
- Auto deploys on push
- Form handling support
- Edge functions available
- Analytics included

### Option 3: GitHub Pages

**Pros**: Free, integrated with GitHub

```bash
# Update package.json
"homepage": "https://yourusername.github.io/portfolio"

# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

### Option 4: Custom VPS (DigitalOcean, Linode, etc.)

**Steps**:

1. **Build locally**:
```bash
npm run build
```

2. **Upload to server**:
```bash
sftp -r dist/* user@server.com:/var/www/portfolio
```

3. **Configure Nginx** (or Apache):
```nginx
server {
    listen 80;
    server_name portfolio.com;
    
    root /var/www/portfolio;
    index index.html;
    
    # Route all requests to index.html for SPA
    location / {
        try_files $uri /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. **Enable HTTPS** with Let's Encrypt:
```bash
certbot --nginx -d portfolio.com
```

### Option 5: AWS S3 + CloudFront

**Setup**:

1. Create S3 bucket
2. Enable static website hosting
3. Upload build files
4. Configure CloudFront distribution
5. Set up Route 53 for domain

**Cost**: ~$1-5/month

## 🔐 Security Checklist

- [ ] HTTPS enabled on all domains
- [ ] Content Security Policy headers set
- [ ] No API keys in frontend code
- [ ] Remove sourcemaps from production
- [ ] Sanitize user inputs
- [ ] Protect contact form from spam

### Add Security Headers

**Vercel** - `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

**Netlify** - `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
```

## 🌍 Domain & DNS

### Register Domain
- GoDaddy, Namecheap, Google Domains, etc.
- Cost: $10-15/year

### Setup DNS

**For Vercel/Netlify**:
- Add CNAME record pointing to your deployment URL
- Or use nameservers (easier)

**Example DNS Records**:
```
Type: CNAME
Name: @
Value: your-site.vercel.app

Type: CNAME  
Name: www
Value: your-site.vercel.app
```

Wait 24-48 hours for DNS propagation.

## 📊 Post-Deployment

### Monitor Performance

```bash
# Run Lighthouse
npx lighthouse https://yourportfolio.com --view

# Check Core Web Vitals
# https://web.dev/measure/
```

### Setup Analytics

**Google Analytics**:

1. Create GA4 property
2. Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Setup SEO

1. **Meta Tags** - Already configured in `index.html`
2. **Sitemap** - Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourportfolio.com/</loc>
    <lastmod>2025-04-22</lastmod>
  </url>
</urlset>
```

3. **robots.txt** - Create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://yourportfolio.com/sitemap.xml
```

4. **Submit to Search Engines**:
   - Google Search Console
   - Bing Webmaster Tools

## 🔄 Continuous Deployment

### GitHub Actions (Auto Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📝 Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://api.yourportfolio.com
VITE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_CONTACT_EMAIL=your@email.com
```

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Change port in vite.config.js
server: { port: 3001 }
```

### 404 on Refresh
Ensure SPA routing is configured (included in deployment configs above)

### Slow Performance
- Check Lighthouse audit
- Optimize images
- Enable gzip compression
- Use CDN
- Minimize JavaScript

### CORS Issues
Add to `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': 'https://api.example.com'
  }
}
```

## 📞 Support Resources

- **React**: https://react.dev
- **Vite**: https://vitejs.dev  
- **Three.js**: https://threejs.org
- **Framer Motion**: https://www.framer.com/motion
- **Deployment Help**: Vercel/Netlify docs

## 🎉 Final Checklist

- [ ] Site loads without errors
- [ ] All links working
- [ ] Mobile responsive
- [ ] Performance acceptable (< 3s LCP)
- [ ] Contact form working
- [ ] Social links correct
- [ ] Analytics configured
- [ ] HTTPS working
- [ ] SEO optimized
- [ ] Accessibility checked

---

**Your portfolio is now ready for the world! 🚀**

Regularly update your resume data and keep your skills fresh.
