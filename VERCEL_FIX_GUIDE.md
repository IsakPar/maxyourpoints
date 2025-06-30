# 🚀 Vercel Production Fix Guide

## 🔍 **Root Cause**
Your Vercel deployment is trying to fetch articles from `https://www.maxyourpoints.com/api/articles/...` instead of the correct Vercel URL `https://maxyourpoints-43is.vercel.app/api/articles/...`.

This happens because the `NEXT_PUBLIC_SITE_URL` environment variable is set to the wrong domain.

## 🛠️ **Step-by-Step Fix**

### **1. Update Vercel Environment Variables**

Go to your Vercel dashboard and update these environment variables:

```bash
# ❌ Wrong (current setting)
NEXT_PUBLIC_SITE_URL=https://www.maxyourpoints.com

# ✅ Correct (what it should be) - YOUR ACTUAL VERCEL URL
NEXT_PUBLIC_SITE_URL=https://maxyourpoints-43is.vercel.app
```

**How to update:**
1. Go to https://vercel.com/dashboard
2. Select your project (`max-your-points-clean`)
3. Go to Settings → Environment Variables
4. Find `NEXT_PUBLIC_SITE_URL` and click Edit
5. Change the value to: `https://maxyourpoints-43is.vercel.app`
6. Click Save
7. Go to Deployments tab
8. Click on the latest deployment → Click the three dots → Redeploy

### **2. Verify The Fix**

After redeploying, test these URLs:

✅ **Health Check:** https://maxyourpoints-43is.vercel.app/api/health
✅ **Articles API:** https://maxyourpoints-43is.vercel.app/api/articles?limit=3  
✅ **Individual Article:** https://maxyourpoints-43is.vercel.app/api/articles/airline-loyalty-programs-skyrocket-profits
✅ **Home Page:** https://maxyourpoints-43is.vercel.app/
✅ **Blog Article:** https://maxyourpoints-43is.vercel.app/blog/airline-loyalty-programs-skyrocket-profits

### **3. Expected Results**

After the fix:
- ✅ Articles will show up on the main page
- ✅ Individual blog posts will load correctly  
- ✅ No more 404 errors in production logs
- ✅ Blog cards will be fully clickable (already working)

## 🧪 **Current Status**

**API Tests (Working):**
- Health: ✅ Returns environment info
- Articles List: ✅ Returns 5 articles 
- Individual Article: ✅ Returns article data

**Frontend Issues (To Fix):**
- Environment variable pointing to wrong domain
- Frontend making API calls to `https://www.maxyourpoints.com` instead of Vercel URL

## 🚨 **If This Doesn't Work**

1. Check the Vercel deployment logs
2. Verify the environment variable was actually saved
3. Make sure you redeployed after changing the environment variable
4. Clear your browser cache
5. Test in an incognito window

The API works perfectly - this is purely an environment configuration issue!

## 🔧 **What We Fixed**

1. **Enhanced API Client**: Now properly detects and overrides incorrect domain settings
2. **Environment Detection**: Better fallback logic for Vercel deployments
3. **Debug Logging**: Added comprehensive logging to troubleshoot issues
4. **Health Endpoint**: Enhanced to show environment configuration

## 📝 **Expected Log Output**

After the fix, you should see logs like this in Vercel:

```
🔍 Environment debug info: {
  nodeEnv: 'production',
  siteUrl: 'https://maxyourpoints-43is.vercel.app',
  vercelUrl: 'maxyourpoints-43is.vercel.app',
  hasWindow: false
}
🚀 Using Vercel URL: https://maxyourpoints-43is.vercel.app
🌐 Making API request to: https://maxyourpoints-43is.vercel.app/api/articles/test-article
📡 Response status: 200, Content-Type: application/json
```

## 🆘 **If Issues Persist**

If articles still don't load after following these steps:

1. **Check Vercel deployment logs:**
   - Go to Vercel dashboard → Deployments → Click on latest deployment → View Function Logs

2. **Verify environment variables:**
   - Visit: `https://maxyourpoints-43is.vercel.app/api/health`
   - Check the `envInfo` section

3. **Test individual API endpoints:**
   - `/api/health` - Should return status info
   - `/api/articles` - Should return your articles
   - `/api/categories` - Should return categories

4. **Database connection:**
   - Ensure your Supabase environment variables are correct
   - Check that your database has articles with `status = 'published'`

## 🎯 **Success Criteria**

Your fix is working when:
- ✅ Website loads without API errors
- ✅ Articles display on homepage and category pages
- ✅ Individual article pages load properly
- ✅ No "Expected JSON but got text/html" errors in logs
- ✅ API calls use correct Vercel URL in server logs 