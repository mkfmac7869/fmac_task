@echo off
echo ================================
echo FMAC Task Manager - Deployment
echo ================================
echo.

echo [1/3] Building application...
call npm run build
if errorlevel 1 (
    echo Build failed! Please fix errors and try again.
    pause
    exit /b 1
)
echo Build completed successfully!
echo.

echo [2/3] Deploying to Firebase Hosting...
call firebase deploy --only hosting
if errorlevel 1 (
    echo Deployment failed! Please check your Firebase configuration.
    pause
    exit /b 1
)
echo.

echo [3/3] Deployment complete!
echo.
echo ================================
echo Your app is now live at:
echo https://taskfmac.dev
echo ================================
echo.
pause
