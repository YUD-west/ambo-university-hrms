# 🚨 What's Not Working? - Quick Help

## Please Tell Me:

1. **What exactly doesn't work?**
   - [ ] App won't start (`npm run dev` fails)
   - [ ] Blank page in browser
   - [ ] Errors in browser console
   - [ ] Build fails (`npm run build` fails)
   - [ ] Deployment fails
   - [ ] Something else: _______________

2. **What error message do you see?**
   - Copy the exact error message

3. **What were you trying to do?**
   - [ ] Run locally
   - [ ] Deploy to Vercel
   - [ ] Build the app
   - [ ] Use a feature

---

## 🔧 Quick Fixes (Try These First):

### Fix 1: Clean Install
```bash
# Delete and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Fix 2: Check if App Runs
```bash
# Start the app
npm run dev

# Should see:
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://0.0.0.0:5173/
```

### Fix 3: Check Browser
1. Open: http://localhost:5173
2. Press F12 (open DevTools)
3. Check Console tab for errors
4. Check Network tab for failed requests

### Fix 4: Check Backend (if using API)
```bash
# Start backend
cd server
npm install
npm start

# Should see:
# Server running on http://localhost:3001
```

---

## 📋 Common Issues:

### Issue: "Cannot find module"
**Fix:** `npm install`

### Issue: "Port already in use"
**Fix:** Kill the process or change port

### Issue: "Failed to fetch"
**Fix:** Start backend server

### Issue: Blank page
**Fix:** Check browser console (F12) for errors

---

## ✅ Test Checklist:

Run these commands one by one:

```bash
# 1. Install dependencies
npm install

# 2. Build the app
npm run build

# 3. Start dev server
npm run dev

# 4. Open browser
# Go to: http://localhost:5173
```

---

## 🆘 Need More Help?

**Share with me:**
1. The exact error message
2. Screenshot of the error
3. Browser console errors (F12 → Console)
4. Terminal output

---

## 🎯 Most Likely Issues:

1. **Missing dependencies** → Run `npm install`
2. **Port in use** → Kill process or change port
3. **Backend not running** → Start backend server
4. **Browser cache** → Hard refresh (Ctrl+Shift+R)
5. **Node version** → Need Node 18+ or 20+

---

**Try this first:**
```bash
npm install
npm run dev
```

Then open: **http://localhost:5173**

Tell me what you see!

