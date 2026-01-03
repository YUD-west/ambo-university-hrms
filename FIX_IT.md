# 🔧 Quick Fix Guide

## What's Not Working? Choose Your Issue:

### ❌ App Won't Start
```bash
# Fix 1: Clean install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ❌ Blank Page
```bash
# Fix 2: Check browser console
# Press F12 → Console tab
# Look for red errors
```

### ❌ API Not Working
```bash
# Fix 3: Start backend
cd server
npm install
npm start
# Then in another terminal:
npm run dev
```

### ❌ Build Fails
```bash
# Fix 4: Check TypeScript
npx tsc --noEmit
# Fix any errors shown
```

### ❌ Deployment Fails
```bash
# Fix 5: Check vercel.json exists
# Fix 6: Verify build command in package.json
```

---

## 🚀 Quick Test

Run this to test everything:

```bash
# Test 1: Build
npm run build

# Test 2: Preview
npm run preview

# Test 3: Dev mode
npm run dev
```

---

## 📋 Most Common Fixes

### 1. Port Already in Use
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### 2. Missing Dependencies
```bash
npm install
cd server && npm install && cd ..
```

### 3. Clear Cache
```bash
# Browser: Ctrl+Shift+Delete
# Or: Hard refresh (Ctrl+Shift+R)
```

### 4. Check Node Version
```bash
node --version
# Should be 18+ or 20+
```

---

## 🆘 Still Not Working?

**Tell me:**
1. What error message do you see?
2. What were you trying to do?
3. Browser console errors (F12 → Console)
4. Terminal output

---

## ✅ Quick Checklist

- [ ] Node.js installed (v18+)
- [ ] `npm install` completed
- [ ] `npm run build` succeeds
- [ ] Backend running (if using API)
- [ ] Browser console has no errors
- [ ] Port 5173 is free

---

**Run this first:**
```bash
npm install
npm run build
npm run dev
```

Then open: http://localhost:5173

