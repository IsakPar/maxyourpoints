# Max Your Points CMS

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# TinyPNG API (Optional - for image compression)
TINYPNG_API_KEY=your-tinypng-api-key

# Admin User (for setup script)
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-password
```

### TinyPNG Setup (Optional)
To enable advanced image compression with TinyPNG:

1. Sign up for a free account at [TinyPNG](https://tinypng.com/developers)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file as `TINYPNG_API_KEY`
4. Free accounts get 500 compressions per month

**Features with TinyPNG:**
- Advanced compression for PNG and JPEG files
- Better compression ratios than Sharp alone
- Automatic fallback to Sharp if TinyPNG fails
- Usage tracking and quota monitoring

**Without TinyPNG:**
- Images are still optimized using Sharp
- HEIC conversion still works
- Slightly larger file sizes compared to TinyPNG 