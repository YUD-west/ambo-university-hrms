# 🚀 Quick Deployment Guide

## Easiest Way: Deploy to Vercel (Frontend) + Render (Backend)

### Step 1: Deploy Backend to Render (FREE)

1. **Go to**: https://render.com
2. **Sign up** (free account with GitHub/Google)
3. Click **"New +"** → **"Web Service"**
4. **Connect your GitHub** (or upload code manually)
5. **Settings**:
   - **Name**: `library-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. Click **"Create Web Service"**
7. **Wait for deployment** (2-3 minutes)
8. **Copy your backend URL** (e.g., `https://library-backend-xxxx.onrender.com`)

### Step 2: Deploy Frontend to Vercel (FREE)

#### Option A: Using Vercel Website (Easiest)

1. **Go to**: https://vercel.com
2. **Sign up** with GitHub
3. Click **"Add New"** → **"Project"**
4. **Import your GitHub repository**
5. **Configure**:
   - Framework Preset: `Vite`
   - Root Directory: `.` (leave default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
6. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api` (from Step 1)
7. Click **"Deploy"**
8. **Wait 1-2 minutes** → Your app is live! 🎉

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variable
vercel env add VITE_API_URL
# Enter: https://your-backend-url.onrender.com/api

# Deploy to production
vercel --prod
```

### Step 3: Get Your Live Link! 🎊

After deployment:
- **Frontend URL**: `https://your-app-name.vercel.app`
- **Backend URL**: `https://library-backend-xxxx.onrender.com`

---

## Alternative: Deploy Everything to Railway (One Platform)

1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub**
4. **Add 2 Services**:

   **Service 1 - Backend:**
   - Root Directory: `server`
   - Start Command: `npm start`
   
   **Service 2 - Frontend:**
   - Root Directory: `.`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -l 3000`
   - Add Environment Variable: `VITE_API_URL` = `https://your-backend-service.railway.app/api`

5. **Get your URLs** and share!

---

## Important Notes:

- **Backend URL**: Make sure to add `/api` at the end in the environment variable
- **CORS**: Already configured in backend
- **Data**: Backend uses `data.json` file (persists on Render/Railway)
- **Free Tiers**: Both Vercel and Render offer free hosting with some limits

---

## Need Help?

Check `DEPLOYMENT.md` for detailed instructions.

