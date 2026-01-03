# 🚀 Deploy Your Library Management System

## Quick Start - Get Your Live Link in 10 Minutes!

### Method 1: Vercel + Render (Recommended - Easiest)

#### Part 1: Deploy Backend to Render (5 minutes)

1. **Visit**: https://render.com
2. **Sign up** (free, use GitHub/Google)
3. Click **"New +"** → **"Web Service"**
4. **Connect GitHub** (or upload manually)
5. **Configure**:
   ```
   Name: library-backend
   Root Directory: server
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```
6. Click **"Create Web Service"**
7. **Wait 2-3 minutes** for deployment
8. **Copy your backend URL**: `https://library-backend-xxxx.onrender.com`

#### Part 2: Deploy Frontend to Vercel (5 minutes)

1. **Visit**: https://vercel.com
2. **Sign up** with GitHub
3. Click **"Add New"** → **"Project"**
4. **Import your repository**
5. **Settings** (auto-detected):
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api`
7. Click **"Deploy"**
8. **Done!** Your app is live at: `https://your-app.vercel.app`

---

### Method 2: Railway (All-in-One)

1. **Visit**: https://railway.app
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub**
4. **Add Service 1 - Backend**:
   - Root: `server`
   - Start: `npm start`
5. **Add Service 2 - Frontend**:
   - Root: `.`
   - Build: `npm install && npm run build`
   - Start: `npx serve -s dist -l 3000`
   - Env Var: `VITE_API_URL` = `https://your-backend.railway.app/api`
6. **Get your URLs!**

---

## 📝 Important Notes

- ✅ Backend URL must end with `/api` in the environment variable
- ✅ CORS is already configured
- ✅ Data persists automatically
- ✅ Both platforms offer free hosting

---

## 🎯 Your Live Links Will Be:

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://library-backend-xxxx.onrender.com`

---

## Need Help?

See `QUICK_DEPLOY.md` or `DEPLOYMENT.md` for detailed instructions.

