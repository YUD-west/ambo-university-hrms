# Deployment Guide

## Option 1: Deploy to Vercel (Recommended - Easiest)

### Frontend Deployment:

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Frontend**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - It will automatically detect Vite and deploy

4. **Set Environment Variable**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

5. **Redeploy** after adding environment variable

### Backend Deployment (Render):

1. **Go to**: https://render.com
2. **Sign up/Login** (free account)
3. **Click "New +"** → **"Web Service"**
4. **Connect your GitHub repository** (or use public repo)
5. **Configure**:
   - **Name**: library-backend
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. **Add Environment Variable**:
   - `NODE_ENV` = `production`
   - `PORT` = `3001` (or leave default)
7. **Click "Create Web Service"**
8. **Copy the URL** (e.g., `https://library-backend-xxxx.onrender.com`)
9. **Update Frontend**: Add this URL to Vercel environment variable `VITE_API_URL`

---

## Option 2: Deploy Both to Render

### Frontend:
1. Go to https://render.com
2. New → Static Site
3. Connect repository
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. Add Environment Variable: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

### Backend:
1. Follow Backend Deployment steps from Option 1

---

## Option 3: Deploy to Railway (Alternative)

### Both Frontend and Backend:

1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Add Service** → **GitHub Repo** (select your repo)
5. **For Backend**:
   - Root Directory: `server`
   - Start Command: `npm start`
6. **For Frontend**:
   - Root Directory: `.`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve dist`
7. **Get URLs** and update environment variables

---

## Quick Deploy Commands

### Vercel (Frontend):
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Render (Backend):
- Use the web interface at render.com

---

## After Deployment:

1. **Update API URL** in frontend environment variables
2. **Test the application**
3. **Share your live URL!**

---

## Free Hosting Options Summary:

- **Vercel**: Best for frontend (automatic deployments, fast CDN)
- **Render**: Good for backend (free tier available)
- **Railway**: Good for both (free tier with limits)
- **Netlify**: Alternative for frontend

