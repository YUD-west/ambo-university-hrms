# PowerShell script to upload to GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Upload Library System to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Git not initialized. Initializing..." -ForegroundColor Yellow
    git init
}

# Check if files are committed
$status = git status --porcelain
if ($status) {
    Write-Host "Uncommitted changes found. Committing..." -ForegroundColor Yellow
    git add .
    git commit -m "Library Management System - Ready for deployment"
}

Write-Host ""
Write-Host "✅ Code is ready to push!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Create a repository on GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. After creating, run these commands:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Deploy on Vercel:" -ForegroundColor White
Write-Host "   https://vercel.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

