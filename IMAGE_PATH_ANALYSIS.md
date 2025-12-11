# Image Path Analysis for Portfolio and Blog Images

## Summary
This document analyzes how portfolio and blog images are stored, served, and displayed in the ClickBit application.

## Image Storage Locations

### Portfolio Images
- **Storage Path**: `client/public/images/uploads/portfolio/`
- **Served Path**: `/images/uploads/portfolio/{filename}`
- **Database Field**: `featured_image` (PortfolioItem model)
- **Files Found**: Multiple `.webp` files exist in the directory

### Blog Images
- **Storage Path**: `client/public/images/uploads/blog/`
- **Served Path**: `/images/uploads/blog/{filename}`
- **Database Field**: `featured_image` (BlogPost model)
- **Files Found**: Multiple `.webp` files exist in the directory

## Image Serving Configuration

### Server Configuration (server/index.js)
```javascript
// Serve images from public directory (development) or build directory (production)
const imagesPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../client/build/images')
  : path.join(__dirname, '../client/public/images');

app.use('/images', express.static(imagesPath, {
  maxAge: '30d',
  etag: true,
  lastModified: true
}));
```

**Key Points:**
- **Development**: Images served from `client/public/images/`
- **Production**: Images served from `client/build/images/`
- **Route**: `/images` maps to the images directory

## Image Upload Process

### Upload Route (server/routes/upload.js)
1. Images are uploaded via multer to `client/public/images/uploads/{type}/`
2. Images are compressed using Sharp (converted to WebP)
3. In production, images are copied to `client/build/images/uploads/{type}/`
4. API returns path: `/images/uploads/{type}/{filename}`

### Upload Configuration (server/middleware/upload.js)
- Portfolio: Max 800x600, 85% quality
- Blog: Max 1000x750, 80% quality
- All images converted to WebP format

## Frontend Image Usage

### Portfolio Images
**Component**: `PortfolioFlipCard.tsx`
```typescript
const imageUrl = item.featured_image || item.cover_image || item.image_url || '/images/placeholders/pattern.jpg';
```

**Data Mapping** (PortfolioPage.tsx):
```typescript
cover_image: item.featured_image || item.cover_image || item.image_url
```

**Display**: Uses `LazyImage` component with fallback to placeholder

### Blog Images
**Component**: `BlogPage.tsx`
```typescript
src={post.metadata?.featuredImage || (post as any).featured_image || '/images/placeholders/pattern.svg'}
```

**Component**: `BlogPostPage.tsx`
```typescript
src={post.featured_image || '/images/placeholders/pattern.svg'}
```

## Potential Issues

### 1. Production Build Directory
**Issue**: In production, images must exist in `client/build/images/` but uploads go to `client/public/images/`

**Solution**: The `copyToProduction` function in `server/middleware/upload.js` should copy files to build directory, but this only works if:
- The build directory exists
- The server has write permissions
- The copy happens after each upload

### 2. Path Mismatch
**Issue**: Database might store paths that don't match actual file locations

**Possible Path Formats**:
- ✅ Correct: `/images/uploads/portfolio/filename.webp`
- ❌ Wrong: `images/uploads/portfolio/filename.webp` (missing leading slash)
- ❌ Wrong: `/uploads/portfolio/filename.webp` (missing `/images` prefix)
- ❌ Wrong: `http://external-url.com/image.jpg` (external URLs should work but might fail)

### 3. Build Process
**Issue**: If the React app is built before images are uploaded, images won't be in the build directory

**Solution**: 
- Images should be copied to build directory during Docker build
- Or images should be served from a persistent volume
- Or the build process should include copying public images

## Verification Steps

### 1. Check Image Files Exist
```bash
# Portfolio images
ls -la client/public/images/uploads/portfolio/

# Blog images
ls -la client/public/images/uploads/blog/
```

### 2. Check Server Static Serving
```bash
# Test if server can serve images
curl http://localhost:5001/images/uploads/portfolio/{filename}
```

### 3. Check Database Paths
```sql
-- Portfolio images
SELECT id, title, featured_image FROM portfolio_items WHERE status = 'published' LIMIT 10;

-- Blog images
SELECT id, title, featured_image FROM blog_posts WHERE status = 'published' LIMIT 10;
```

### 4. Check Browser Console
- Open browser DevTools → Network tab
- Filter by "Img"
- Look for 404 errors on image requests
- Check the actual URL being requested vs. what's stored in database

## Recommended Fixes

### Fix 1: Ensure Build Directory Has Images
Add to Dockerfile or build script:
```bash
# Copy public images to build directory
cp -r client/public/images client/build/images
```

### Fix 2: Normalize Image Paths
Create a middleware or model hook to normalize image paths:
```javascript
// In PortfolioItem model
beforeFind: (options) => {
  // Normalize featured_image paths
  if (options.attributes && Array.isArray(options.attributes)) {
    // Add featured_image normalization
  }
}
```

### Fix 3: Add Image Path Validation
Add validation to ensure paths start with `/images/uploads/`:
```javascript
// In upload route
const imageUrl = `/images/uploads/${uploadType}/${req.file.filename}`;
// Ensure it's stored correctly
```

### Fix 4: Serve Images from Persistent Volume
In production, mount a volume for uploads:
```yaml
volumes:
  - ./uploads:/app/client/public/images/uploads
```

## Testing Checklist

- [ ] Portfolio images display on `/portfolio` page
- [ ] Blog images display on `/blog` page
- [ ] Individual portfolio item images display on `/portfolio/{slug}`
- [ ] Individual blog post images display on `/blog/{slug}`
- [ ] Images load in development environment
- [ ] Images load in production environment
- [ ] Image paths in database match actual file locations
- [ ] Server can serve images via `/images/uploads/` route
- [ ] Fallback placeholders work when images are missing
- [ ] LazyImage component handles errors gracefully

