@echo off
echo 🚀 Deploying Firebase Functions for Email Notifications...
echo.

echo 📦 Building functions...
cd functions
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo 🚀 Deploying to Firebase...
cd ..
call firebase deploy --only functions
if %errorlevel% neq 0 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo ✅ Functions deployed successfully!
echo 📧 Email notifications should now work.
echo.
echo 🔍 To test:
echo 1. Create a task in your app
echo 2. Assign it to a team member
echo 3. Check if they receive an email
echo.
pause
