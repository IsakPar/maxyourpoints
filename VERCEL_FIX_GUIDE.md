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

# ✅ Correct (what it should be)
NEXT_PUBLIC_SITE_URL=https://maxyourpoints-43is.vercel.app
```

**How to update:**
1. Go to https://vercel.com/dashboard
2. Select your project (`max-your-points-clean`)
3. Go to Settings → Environment Variables
4. Find `NEXT_PUBLIC_SITE_URL` and update it to: `https://maxyourpoints-43is.vercel.app`
5. Save and redeploy

### **2. Verify the Fix**

After updating the environment variable:

1. **Redeploy your application:**
   ```bash
   # Push your changes to trigger a new deployment
   git add .
   git commit -m "Fix API URL configuration for Vercel"
   git push origin main
   ```

2. **Test the health endpoint:**
   Visit: `https://maxyourpoints-43is.vercel.app/api/health`
   
   You should see something like:
   ```json
   {
     "status": "healthy",
     "envInfo": {
       "nodeEnv": "production",
       "vercelUrl": "maxyourpoints-43is.vercel.app",
       "publicSiteUrl": "https://maxyourpoints-43is.vercel.app"
     }
   }
   ```

3. **Test article fetching:**
   Visit: `https://maxyourpoints-43is.vercel.app/api/articles?limit=5`
   
   You should see your articles in JSON format.

### **3. Additional Environment Variables to Check**

Make sure these are also set correctly in Vercel:

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email (optional, for newsletters)
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
MAILJET_FROM_EMAIL=newsletter@maxyourpoints.com

# Site URL (CRITICAL - must be correct)
NEXT_PUBLIC_SITE_URL=https://maxyourpoints-43is.vercel.app
```

## 🧪 **Testing After the Fix**

### **Test 1: Health Check**
```bash
curl https://maxyourpoints-43is.vercel.app/api/health
```

### **Test 2: Articles API**
```bash
curl https://maxyourpoints-43is.vercel.app/api/articles?limit=3
```

### **Test 3: Website Loading**
Visit your website and check that:
- ✅ Homepage loads with articles
- ✅ Article pages load properly
- ✅ Admin panel works (if logged in)

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