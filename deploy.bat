@echo off
echo ========================================
echo   Library Management System Deployment
echo ========================================
echo.

echo [1/4] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please fix errors first.
    pause
    exit /b 1
)
echo Build successful!
echo.

echo [2/4] Checking Git status...
git status
echo.

echo [3/4] Ready to deploy!
echo.
echo Next steps:
echo 1. If you haven't pushed to GitHub yet:
echo    - Create a repo on GitHub
echo    - Run: git remote add origin YOUR_REPO_URL
echo    - Run: git add .
echo    - Run: git commit -m "Deploy library system"
echo    - Run: git push -u origin main
echo.
echo 2. Deploy to Vercel:
echo    Option A - Website (Easiest):
echo    - Go to: https://vercel.com
echo    - Sign up/Login with GitHub
echo    - Click "Add New" ^> "Project"
echo    - Import your repository
echo    - Click "Deploy"
echo.
echo    Option B - CLI:
echo    - Run: npm install -g vercel
echo    - Run: vercel login
echo    - Run: vercel --prod
echo.
echo ========================================
echo   Your app is ready to deploy!
echo ========================================
pause

