# Vercel Environment Setup Guide

## 🎯 Problem Solved

This guide fixes the cross-origin API issue where the app was making requests to `https://www.maxyourpoints.com` when running on different domains like `https://maxyourpoints.vercel.app`.

## 🔧 Environment Variable Configuration

### Production Environment

Set these variables in your Vercel production environment:

```bash
NEXT_PUBLIC_SITE_URL=https://www.maxyourpoints.com
```

### Preview Environment

Set these variables in your Vercel preview environment:

```bash
NEXT_PUBLIC_SITE_URL=https://maxyourpoints.vercel.app
```

### Development Environment

Set these variables in your `.env.local` file:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🚀 How to Set Environment Variables in Vercel

1. Go to your Vercel Dashboard
2. Select your project (max-your-points-clean)
3. Go to Settings → Environment Variables
4. Add the `NEXT_PUBLIC_SITE_URL` variable for each environment:
   - **Production**: `https://www.maxyourpoints.com`
   - **Preview**: `https://maxyourpoints.vercel.app`
   - **Development**: `http://localhost:3000`

## ✅ What This Fixes

### Before (Problem)
- API calls hardcoded to `https://www.maxyourpoints.com`
- CORS issues when testing on preview domains
- 404 errors when fetching from wrong API endpoints
- Inconsistent behavior across environments

### After (Solution)
- ✅ API calls dynamically use the correct domain
- ✅ No CORS issues - all requests stay on same origin
- ✅ Preview deployments work correctly
- ✅ Development environment works seamlessly
- ✅ Production uses the correct custom domain

## 🔄 Auto-Detection Fallback

If `NEXT_PUBLIC_SITE_URL` is not set, the app will automatically detect:

1. **Development**: `http://localhost:3000`
2. **Vercel Deployments**: `https://${VERCEL_URL}` (automatically provided by Vercel)
3. **Fallback**: `https://maxyourpoints.vercel.app`

## 📝 Implementation Details

### API Client Changes
- ✅ Client-side requests always use relative URLs (`/api/...`)
- ✅ Server-side requests use `NEXT_PUBLIC_SITE_URL` when available
- ✅ Automatic environment detection as fallback

### Metadata Updates
- ✅ OpenGraph URLs use dynamic site URL
- ✅ Twitter card images use dynamic site URL
- ✅ Canonical URLs use dynamic site URL
- ✅ JSON-LD structured data uses dynamic site URL

### Files Updated
- `lib/api.ts` - Dynamic URL construction
- `app/layout.tsx` - Metadata configuration
- `next.config.mjs` - Removed hardcoded fallbacks
- `app/metadata.ts` - Dynamic canonical URLs
- `public/robots.txt` - Relative sitemap URL

## 🧪 Testing

After setting up the environment variables:

1. **Local Development**:
   ```bash
   pnpm dev
   # API calls should go to http://localhost:3000/api/...
   ```

2. **Preview Deployment**:
   - API calls should go to `https://maxyourpoints.vercel.app/api/...`
   - No CORS errors in browser console

3. **Production**:
   - API calls should go to `https://www.maxyourpoints.com/api/...`
   - All metadata should use production URLs

## 🎉 Benefits

- **No More CORS Issues**: All API calls stay on the same origin
- **Seamless Previews**: Vercel preview deployments work perfectly
- **Environment Isolation**: Each environment uses its own correct URLs
- **Future-Proof**: Easy to change domains or add new environments
- **SEO Optimized**: Correct canonical URLs and metadata for each environment

## 🔍 Troubleshooting

If you still see issues:

1. Check Vercel environment variables are set correctly
2. Verify the deployment is using the right environment
3. Clear browser cache and hard refresh
4. Check browser network tab to see actual API URLs being called

The API client will log the URLs it's using, so check the console for:
```
🌐 Making API request to: [URL]
```

This should match your expected environment URL. 