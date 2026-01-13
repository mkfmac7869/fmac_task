@echo off
echo ================================================
echo FMAC Task Manager - Full Deployment
echo (Hosting + Functions + Firestore Rules)
echo ================================================
echo.

echo [1/4] Building application...
call npm run build
if errorlevel 1 (
    echo Build failed! Please fix errors and try again.
    pause
    exit /b 1
)
echo Build completed successfully!
echo.

echo [2/4] Building Firebase Functions...
cd functions
call npm run build
if errorlevel 1 (
    echo Functions build failed! Please fix errors and try again.
    cd ..
    pause
    exit /b 1
)
cd ..
echo Functions build completed successfully!
echo.

echo [3/4] Deploying to Firebase...
call firebase deploy
if errorlevel 1 (
    echo Deployment failed! Please check your Firebase configuration.
    pause
    exit /b 1
)
echo.

echo [4/4] Deployment complete!
echo.
echo ================================================
echo Successfully deployed:
echo  - Web App: https://taskfmac.dev
echo  - Firebase Functions
echo  - Firestore Rules
echo ================================================
echo.
pause
