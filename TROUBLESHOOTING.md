# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: App Won't Start Locally

**Symptoms:**
- `npm run dev` fails
- Blank page
- Console errors

**Solutions:**

1. **Clear cache and reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

2. **Check Node version:**
```bash
node --version
# Should be Node 18+ or 20+
```

3. **Check if port is in use:**
```bash
# Windows
netstat -ano | findstr :5173
# Kill process if needed
```

---

### Issue 2: Build Fails

**Symptoms:**
- `npm run build` shows errors
- TypeScript errors

**Solutions:**

1. **Fix TypeScript errors:**
```bash
npm run build
# Fix any errors shown
```

2. **Check for missing dependencies:**
```bash
npm install
```

---

### Issue 3: Backend Not Connecting

**Symptoms:**
- API calls fail
- Network errors in console
- "Failed to fetch" errors

**Solutions:**

1. **Start backend server:**
```bash
cd server
npm install
npm run dev
```

2. **Check backend is running:**
- Open: http://localhost:3001/api/health
- Should return: `{"status":"ok"}`

3. **Check CORS settings** in `server/server.js`

---

### Issue 4: Deployment Fails on Vercel

**Symptoms:**
- Build fails on Vercel
- Deployment errors

**Solutions:**

1. **Check build logs in Vercel dashboard**

2. **Verify build command:**
- Should be: `npm run build`

3. **Check environment variables:**
- Go to Vercel → Settings → Environment Variables
- Add `VITE_API_URL` if using backend

4. **Check Node version:**
- Vercel → Settings → Node.js Version
- Set to 18.x or 20.x

---

### Issue 5: Blank Page After Deployment

**Symptoms:**
- Page loads but shows blank
- No errors in console

**Solutions:**

1. **Check routing:**
- Verify `vercel.json` exists
- Should have rewrite rules

2. **Check browser console:**
- Look for JavaScript errors
- Check network tab

3. **Verify build output:**
```bash
npm run build
ls dist/
# Should see index.html and assets/
```

---

### Issue 6: Language/Theme Not Working

**Symptoms:**
- Language switcher doesn't work
- Theme toggle doesn't work

**Solutions:**

1. **Check localStorage:**
- Open browser DevTools
- Application → Local Storage
- Check for `i18nextLng` and `theme`

2. **Clear browser cache:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Quick Fixes

### Reset Everything:
```bash
# Delete node_modules
rm -rf node_modules
rm -rf server/node_modules

# Delete build
rm -rf dist

# Reinstall
npm install
cd server && npm install && cd ..

# Rebuild
npm run build
```

### Test Locally:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### Check for Errors:
```bash
# TypeScript check
npx tsc --noEmit

# Lint check
npm run lint
```

---

## Still Not Working?

1. **Check browser console** for specific errors
2. **Check terminal** for build/run errors
3. **Share the error message** you're seeing
4. **Check network tab** for failed requests

---

## Common Error Messages

### "Cannot find module"
→ Run `npm install`

### "Port already in use"
→ Change port in `vite.config.ts` or kill the process

### "Failed to fetch"
→ Start backend server or check API URL

### "Module not found"
→ Check import paths and file names

---

## Need More Help?

Share:
1. The exact error message
2. What you were trying to do
3. Browser console errors
4. Terminal output

