# 🚀 Quick Deployment - Get Your Live Link in 5 Minutes!

## Option 1: Deploy to Vercel (Easiest - Recommended)

### Step 1: Push to GitHub (if not already)

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel Website (No CLI needed)**
1. Go to: https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Settings (auto-detected):
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"
7. **Your app will be live in 1-2 minutes!** 🎉

**Option B: Using Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Step 3: Get Your Link!
After deployment, Vercel will give you a link like:
- `https://your-app-name.vercel.app`

---

## Option 2: Deploy Backend to Render (For Full Functionality)

1. Go to: https://render.com
2. Sign up (free)
3. New → Web Service
4. Connect GitHub or upload code
5. Settings:
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`
6. Copy backend URL
7. Add to Vercel Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`

---

## Quick Commands

```bash
# Build for production
npm run build

# Test locally
npm run preview
```

