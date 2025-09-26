# Meta Tag Testing Documentation

This document explains how to test and validate meta tags for social media previews in the ClickBIT application.

## Overview

The ClickBIT application includes comprehensive meta tag testing utilities to ensure proper social media previews across different platforms. This is crucial for React applications that rely on client-side rendering, as social media crawlers need server-rendered meta tags.

## Features

### 1. Meta Tag Validator (`server/utils/metaTagValidator.js`)

A comprehensive utility class that validates:
- Required Open Graph meta tags
- Twitter Card meta tags
- Structured data (JSON-LD)
- Meta tag content quality
- URL formats and image URLs

### 2. Testing Script (`scripts/test-meta-tags.js`)

A command-line tool that tests meta tags across different user agents:
- Facebook External Hit
- Twitter Bot
- LinkedIn Bot
- Google Bot
- Generic crawlers

## Usage

### Testing All URLs

```bash
# Test all configured URLs with different user agents
npm run test:meta-tags
```

### Testing Specific URL

```bash
# Test a specific URL
npm run test:meta-tags:url https://clickbit.com.au/blog/some-post
```

### Programmatic Usage

```javascript
const MetaTagValidator = require('./server/utils/metaTagValidator');

const validator = new MetaTagValidator();

// Validate HTML content
const html = '<html>...</html>';
const validation = validator.validateMetaTags(html, 'https://example.com');

// Test a URL
const result = await validator.testUrl('https://clickbit.com.au/blog/post');
```

## Validation Criteria

### Required Meta Tags (10 points each)
- `og:title` - Open Graph title
- `og:description` - Open Graph description
- `og:image` - Open Graph image URL
- `og:url` - Open Graph URL
- `og:type` - Open Graph type
- `twitter:card` - Twitter card type
- `twitter:title` - Twitter title
- `twitter:description` - Twitter description
- `twitter:image` - Twitter image URL

### Optional Meta Tags (5 points each)
- `og:image:width` - Image width
- `og:image:height` - Image height
- `og:image:alt` - Image alt text
- `og:site_name` - Site name
- `twitter:image:alt` - Twitter image alt
- `twitter:site` - Twitter handle
- `description` - Meta description
- `robots` - Robots directive
- `canonical` - Canonical URL

### Content Quality Checks
- Title length (30-60 characters recommended)
- Description length (120-160 characters recommended)
- Absolute image URLs
- Valid URL formats
- Matching Open Graph and Twitter content

## Scoring System

- **90-100 points**: Excellent meta tag implementation
- **70-89 points**: Good implementation with minor improvements needed
- **50-69 points**: Fair implementation with several issues
- **Below 50 points**: Poor implementation requiring significant work

## Common Issues and Solutions

### 1. Missing Meta Tags
**Issue**: Required meta tags are missing
**Solution**: Ensure all required Open Graph and Twitter Card tags are present

### 2. Relative Image URLs
**Issue**: Image URLs are relative instead of absolute
**Solution**: Use absolute URLs starting with `http://` or `https://`

### 3. Mismatched Content
**Issue**: Open Graph and Twitter content doesn't match
**Solution**: Use the same title and description for both platforms

### 4. Poor Content Length
**Issue**: Titles or descriptions are too short/long
**Solution**: Optimize content length for better social media display

### 5. Missing Structured Data
**Issue**: No JSON-LD structured data
**Solution**: Add appropriate structured data for better SEO

## Server-Side Meta Tag Injection

The application includes middleware (`server/middleware/socialMediaCrawler.js`) that:
- Detects social media crawlers
- Generates dynamic meta tags based on content
- Injects meta tags server-side before serving HTML
- Provides fallback meta tags for unknown routes

## Testing Different User Agents

The testing script simulates different crawlers:

```javascript
const USER_AGENTS = {
  facebook: 'facebookexternalhit/1.1',
  twitter: 'Twitterbot/1.0',
  linkedin: 'LinkedInBot/1.0',
  google: 'Googlebot/2.1',
  generic: 'Mozilla/5.0 (compatible; MetaTagTester/1.0)'
};
```

## Best Practices

1. **Always use absolute URLs** for images and canonical links
2. **Keep titles between 30-60 characters** for optimal display
3. **Keep descriptions between 120-160 characters** for best results
4. **Use consistent content** across Open Graph and Twitter Card tags
5. **Add structured data** for better search engine understanding
6. **Test regularly** with different user agents
7. **Monitor social media previews** using platform-specific tools

## Troubleshooting

### Meta Tags Not Updating
- Check if the social media crawler middleware is enabled
- Verify that the correct user agent is being detected
- Ensure the HTML file exists and is readable

### Low Validation Scores
- Review the validation report for specific issues
- Check content length and format requirements
- Verify all required meta tags are present

### Social Media Previews Still Showing Defaults
- Clear social media platform caches
- Use platform-specific debugging tools (Facebook Sharing Debugger, Twitter Card Validator)
- Verify meta tags are being injected correctly

## Related Files

- `server/middleware/socialMediaCrawler.js` - Server-side meta tag injection
- `server/middleware/botDetection.js` - Bot detection utilities
- `client/src/components/SiteHead.tsx` - Client-side meta tag management
- `client/public/index.html` - Base HTML template

## Monitoring

Regular testing is recommended to ensure meta tags remain effective:
- Run tests after content updates
- Test new pages and routes
- Monitor social media platform changes
- Validate after deployments
