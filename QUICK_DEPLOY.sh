#!/bin/bash

# Quick Deployment Script
# Run this script to deploy your app step by step

echo "🚀 Library Management System - Deployment Script"
echo "================================================"
echo ""

# Step 1: Build
echo "📦 Step 1: Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please fix errors first."
    exit 1
fi

echo ""
echo "📝 Step 2: Git Status"
echo "---------------------"
git status

echo ""
echo "📤 Step 3: Ready to push to GitHub"
echo "----------------------------------"
echo "Run these commands:"
echo "  git add ."
echo "  git commit -m 'Ready for deployment'"
echo "  git push origin main"
echo ""

echo "🌐 Step 4: Deploy to Vercel"
echo "---------------------------"
echo "Option A - Website (Recommended):"
echo "  1. Go to: https://vercel.com"
echo "  2. Import your GitHub repository"
echo "  3. Click Deploy"
echo ""
echo "Option B - CLI:"
echo "  npm install -g vercel"
echo "  vercel login"
echo "  vercel --prod"
echo ""

echo "✅ Deployment steps complete!"
echo "Your app will be live at: https://your-app-name.vercel.app"

