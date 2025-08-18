# Professional Platform Features - Testing Guide

## 🎯 Testing Checklist

### Marketing & Integrations (/admin/marketing)
- [ ] Navigate to admin panel and find "Marketing" menu item
- [ ] Access marketing integrations page successfully
- [ ] Add Google Analytics measurement ID (format: G-XXXXXXXXXX)
- [ ] Add Google Search Console verification tag
- [ ] Add Facebook Pixel ID
- [ ] Add custom meta tags
- [ ] Add custom header scripts (e.g., Google Tag Manager)
- [ ] Save changes successfully
- [ ] Verify scripts appear in page source on public site

### Billing Settings (/admin/billing)
- [ ] Navigate to admin panel and find "Billing" menu item
- [ ] Access billing settings page successfully
- [ ] Configure Stripe publishable key
- [ ] Configure Stripe secret key (with password masking)
- [ ] Configure PayPal client ID and secret
- [ ] Set currency to AUD
- [ ] Set tax rate to 10% (GST)
- [ ] Add company ABN
- [ ] Add billing address
- [ ] Select payment terms
- [ ] Save changes successfully

### Performance Optimization
- [ ] Visit portfolio page and observe lazy loading
- [ ] Visit blog post with featured image - lazy loading works
- [ ] Check team page images load progressively
- [ ] Verify placeholder appears before image loads
- [ ] Test with slow connection (throttling)
- [ ] Verify broken images show professional placeholder

### SEO Implementation
- [ ] Visit `/sitemap.xml` - returns valid XML sitemap
- [ ] Check `/robots.txt` - returns proper robot directives
- [ ] Verify page titles include site title
- [ ] Check Open Graph meta tags in page source
- [ ] Verify canonical URLs are present
- [ ] Test Google Analytics tracking (if configured)

## 🔧 API Endpoints Testing

### Marketing Integrations API
```bash
# GET marketing integrations (requires auth)
curl -H "Authorization: Bearer [TOKEN]" \
  http://localhost:5001/api/admin/marketing-integrations

# PUT update marketing integrations (requires auth)
curl -X PUT \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"marketingIntegrations":{"googleAnalyticsId":"G-TEST123"}}' \
  http://localhost:5001/api/admin/marketing-integrations

# GET public marketing integrations (no auth)
curl http://localhost:5001/api/public/marketing-integrations
```

### Billing Settings API
```bash
# GET billing settings (requires auth)
curl -H "Authorization: Bearer [TOKEN]" \
  http://localhost:5001/api/admin/billing-settings

# PUT update billing settings (requires auth)
curl -X PUT \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"billingSettings":{"currencyCode":"AUD","taxRate":10}}' \
  http://localhost:5001/api/admin/billing-settings
```

### SEO Endpoints
```bash
# GET sitemap (public)
curl http://localhost:5001/sitemap.xml

# GET robots.txt (public)
curl http://localhost:5001/robots.txt
```

## 🖼️ Image Placeholder Testing

### Verify Placeholder System
1. **Portfolio Images:** Go to `/portfolio` - missing images show placeholder
2. **Blog Images:** Visit blog posts - missing featured images show placeholder
3. **Team Images:** Check team page - missing member photos show placeholder
4. **Fallback Testing:** Use invalid image URLs to trigger fallbacks

### CMS Integration Verification
1. **Portfolio:** Admin → Portfolio → Edit item → Change image URL → Save
2. **Blog:** Admin → Blog → Edit post → Change featured image → Save
3. **Team:** Admin → Team → Edit member → Change image URL → Save
4. **Verify:** Check public site shows new images immediately

## 🚀 Expected Behavior

### Marketing Integration
- Scripts injected into document head
- Google Analytics tracking on all pages
- Facebook Pixel tracking for conversions
- Custom meta tags visible in page source
- Search Console verification tag present

### Performance Optimization
- Images load only when scrolled into view
- Loading animations during image fetch
- Professional placeholders for missing images
- Smooth transitions and no layout shifts

### SEO Implementation
- Valid XML sitemap with all pages
- Proper robots.txt directives
- Enhanced meta tags and Open Graph
- Canonical URLs on all pages

### E-commerce Foundation
- Secure storage of payment gateway credentials
- Australian business compliance (AUD, GST, ABN)
- Ready for payment implementation

## ⚠️ Troubleshooting

### Common Issues
1. **Sitemap 404:** Restart server to regenerate sitemap
2. **Images not lazy loading:** Check Intersection Observer support
3. **Scripts not appearing:** Verify marketing settings saved correctly
4. **Admin pages 404:** Check route configuration in AnimatedRoutes

### Debug Commands
```bash
# Check sitemap generation
cd server && node scripts/generateSitemap.js

# Verify TypeScript compilation
cd client && npm run type-check

# Check for linting issues
cd client && npm run lint
```

## ✅ Success Criteria

All features are working correctly when:
- ✅ Marketing scripts appear in page source after admin configuration
- ✅ Images load lazily with smooth transitions
- ✅ Placeholders appear for missing images
- ✅ Sitemap is accessible and contains all pages
- ✅ Payment gateway fields are accessible in admin
- ✅ All existing CMS functionality remains intact
- ✅ No TypeScript or linting errors
- ✅ Professional appearance with no broken images