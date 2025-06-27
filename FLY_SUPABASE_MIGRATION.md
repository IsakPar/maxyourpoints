# 🚀 Fly.io + Supabase Migration Plan

## 🎯 **Target Stack**
- ✅ **Frontend**: Vercel (keeping as-is)
- ✅ **Backend**: Fly.io 
- ✅ **Database**: Supabase PostgreSQL
- ✅ **Storage**: Cloudinary (free 25GB)
- ✅ **Email**: Mailgun (keeping as-is)

**Total Cost**: ~$5-8/month (vs $14+ on Render)

---

## 📅 **Migration Timeline: TODAY**

### **Phase 1: Database Setup (30 minutes)**
- [ ] Create Supabase project
- [ ] Export data from Render (if any exists)
- [ ] Import to Supabase
- [ ] Test connection

### **Phase 2: Backend Migration (45 minutes)**
- [ ] Install Fly CLI
- [ ] Create Dockerfile
- [ ] Configure Fly.io
- [ ] Deploy backend
- [ ] Test all endpoints

### **Phase 3: Frontend Update (15 minutes)**
- [ ] Update Vercel environment variables
- [ ] Test full stack connection
- [ ] Verify everything works

### **Phase 4: Cleanup (5 minutes)**
- [ ] Delete Render services
- [ ] Celebrate 🎉

---

## 🗄️ **PHASE 1: Supabase Database Setup**

### **Step 1.1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. **Organization**: Personal (or create new)
5. **Name**: `max-your-points`
6. **Database Password**: Generate strong password (save it!)
7. **Region**: Europe (Frankfurt) - closest to your users
8. Click "Create new project"
9. **Wait 2-3 minutes** for setup

### **Step 1.2: Get Connection Details**
Once project is ready:
1. Go to **Settings** → **Database**
2. Copy these values:
   ```
   Host: db.[PROJECT-REF].supabase.co
   Database name: postgres
   Port: 5432
   User: postgres
   Password: [YOUR-PASSWORD]
   ```
3. **Connection String**: 
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### **Step 1.3: Export from Render (if needed)**
If you have any data in Render PostgreSQL:
```bash
# Get Render database URL from dashboard
export RENDER_DB_URL="postgresql://cheeky_penguin_user:..."

# Export all data
pg_dump $RENDER_DB_URL > render_backup.sql

# If pg_dump not installed:
# macOS: brew install postgresql
```

### **Step 1.4: Setup Database Schema**
```bash
# Connect to Supabase and run Prisma migrations
cd backend

# Update DATABASE_URL in .env.local (for testing)
echo "DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" > .env.local

# Run Prisma migrations
pnpm dlx prisma db push --schema=./prisma/schema.prisma

# If you have backup data:
# psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" < render_backup.sql
```

### **Step 1.5: Test Database Connection**
```bash
# Test with Prisma
pnpm dlx prisma studio

# Should open browser with database UI
# If you see tables, database is working! ✅
```

---

## 🛩️ **PHASE 2: Fly.io Backend Deployment**

### **Step 2.1: Install Fly CLI**
```bash
# macOS
brew install flyctl

# Linux/WSL
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
fly auth login
```

### **Step 2.2: Create Dockerfile**
```bash
cd backend
```

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm dlx prisma generate

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start application
CMD ["pnpm", "start"]
```

### **Step 2.3: Update Package.json Start Script**
```bash
cd backend
```

Update `backend/package.json`:
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "pnpm dlx prisma generate && tsc",
    "dev": "tsx watch src/index.ts"
  }
}
```

### **Step 2.4: Initialize Fly App**
```bash
cd backend

# Initialize (don't deploy yet)
fly launch --name max-your-points-api --region fra --no-deploy

# This creates fly.toml
```

### **Step 2.5: Configure fly.toml**
Edit `backend/fly.toml`:
```toml
app = "max-your-points-api"
primary_region = "fra"

[build]

[env]
  NODE_ENV = "production"
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  memory = '512mb'
  cpu_kind = 'shared'
  cpus = 1

[[statics]]
  guest_path = "/app/uploads"
  url_prefix = "/uploads"
```

### **Step 2.6: Set Environment Variables**
```bash
cd backend

# Set Supabase database URL
fly secrets set DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Set JWT secret
fly secrets set JWT_SECRET="max-your-points-super-secret-jwt-key-2024-production"

# Set CORS/Frontend URL (we'll update this after deployment)
fly secrets set FRONTEND_URL="https://your-vercel-app.vercel.app"
fly secrets set CORS_ORIGIN="https://your-vercel-app.vercel.app"

# Set other secrets
fly secrets set LOG_LEVEL="info"

# Optional: Cloudinary (if you're using file uploads)
# fly secrets set CLOUDINARY_CLOUD_NAME="your-cloud-name"
# fly secrets set CLOUDINARY_API_KEY="your-api-key"
# fly secrets set CLOUDINARY_API_SECRET="your-api-secret"
```

### **Step 2.7: Deploy to Fly.io**
```bash
cd backend

# Deploy!
fly deploy

# Check status
fly status

# View logs
fly logs
```

### **Step 2.8: Test Backend**
```bash
# Get your app URL
fly status

# Test endpoints (replace with your actual URL)
export FLY_URL="https://max-your-points-api.fly.dev"

# Test health
curl $FLY_URL/health

# Test API
curl $FLY_URL/api/test

# Test database
curl $FLY_URL/api/database/test

# Should see: {"success": true, "database": [...], "client": "prisma"}
```

---

## 🌐 **PHASE 3: Frontend Update**

### **Step 3.1: Update Vercel Environment Variables**
1. Go to [vercel.com](https://vercel.com) dashboard
2. Find your frontend project
3. Go to **Settings** → **Environment Variables**
4. Update/Add:
   ```
   NEXT_PUBLIC_API_URL=https://max-your-points-api.fly.dev
   ```
5. **Redeploy** frontend (or it will auto-deploy on next push)

### **Step 3.2: Test Full Stack**
```bash
# Test frontend → backend connection
# Open your Vercel app in browser
# Check browser dev tools → Network tab
# Make sure API calls go to new Fly.io URL
```

---

## 🧪 **PHASE 4: Testing & Verification**

### **Checklist - Everything Should Work:**
- [ ] **Database**: Supabase connection working
- [ ] **Backend**: Fly.io app responding to all endpoints
- [ ] **Frontend**: Vercel app connecting to new backend
- [ ] **Health checks**: `/health` returns database: "connected"
- [ ] **API endpoints**: All CRUD operations working
- [ ] **File uploads**: Working (if implemented)
- [ ] **Authentication**: Login/logout working

### **Test Commands:**
```bash
export API_URL="https://max-your-points-api.fly.dev"

# Health check
curl $API_URL/health

# Database test
curl $API_URL/api/database/test

# Test articles endpoint
curl $API_URL/api/articles

# Test auth endpoint
curl $API_URL/api/auth
```

---

## 💰 **Cost Breakdown**

### **Fly.io**: ~$5-8/month
- 512MB RAM, shared CPU
- Auto-scaling (0-1 machines)
- 3GB storage included

### **Supabase**: FREE
- 500MB database
- 50MB file storage
- 2GB bandwidth

### **Vercel**: FREE
- Frontend hosting
- Serverless functions

### **Total**: $5-8/month (vs $14+ on Render)

---

## 🔧 **Troubleshooting**

### **If Fly.io deployment fails:**
```bash
# Check logs
fly logs

# SSH into machine for debugging
fly ssh console

# Check app status
fly status

# Restart app
fly machine restart
```

### **If database connection fails:**
```bash
# Test Supabase connection directly
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" -c "SELECT version();"

# Check Prisma connection
cd backend
pnpm dlx prisma db pull
```

### **If frontend can't reach backend:**
- Check CORS settings in backend
- Verify NEXT_PUBLIC_API_URL in Vercel
- Check Network tab in browser dev tools

---

## 🎉 **Success Criteria**

✅ **You're done when:**
1. Health check shows `"database": "connected"`
2. Frontend loads without API errors
3. You can create/read data through the UI
4. All endpoints return proper responses
5. Render is deleted and you're paying less money

---

## 🚀 **Ready to Start?**

Pick your starting point:
1. **I want to start with Supabase database setup**
2. **I have no existing data, let's go straight to Fly.io**
3. **Let's do everything step by step together**

**LET'S FUCKING DO THIS!** 🔥 