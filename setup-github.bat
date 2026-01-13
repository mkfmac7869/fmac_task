@echo off
echo ========================================
echo GitHub Repository Setup
echo ========================================
echo.

echo This script will help you set up your GitHub repository
echo and push your code for automatic deployment.
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Git is installed.
echo.

REM Check if already a git repository
if exist .git (
    echo This is already a Git repository.
    echo.
    git remote -v
    echo.
    echo Current remotes shown above.
    echo.
) else (
    echo Initializing Git repository...
    git init
    git branch -M main
    echo.
    
    set /p REPO_URL="Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): "
    
    if "%REPO_URL%"=="" (
        echo No URL provided. Skipping remote setup.
    ) else (
        git remote add origin %REPO_URL%
        echo Remote 'origin' added: %REPO_URL%
    )
    echo.
)

echo Checking current status...
git status
echo.

set /p CONTINUE="Do you want to commit and push all changes? (Y/N): "
if /i "%CONTINUE%"=="Y" (
    echo.
    echo Adding all files...
    git add .
    
    echo.
    set /p COMMIT_MSG="Enter commit message (or press Enter for default): "
    if "%COMMIT_MSG%"=="" (
        set COMMIT_MSG=Setup GitHub Actions and Firebase deployment
    )
    
    echo.
    echo Committing changes...
    git commit -m "%COMMIT_MSG%"
    
    echo.
    echo Pushing to GitHub...
    git push -u origin main
    
    if errorlevel 1 (
        echo.
        echo Push failed. You may need to:
        echo 1. Create the repository on GitHub first
        echo 2. Set up authentication (Personal Access Token or SSH)
        echo 3. Check if the remote URL is correct
        echo.
        echo Try pushing manually with: git push -u origin main
    ) else (
        echo.
        echo ========================================
        echo SUCCESS!
        echo ========================================
        echo Your code has been pushed to GitHub.
        echo.
        echo Next steps:
        echo 1. Go to your GitHub repository
        echo 2. Navigate to Settings ^> Secrets and variables ^> Actions
        echo 3. Add the required secrets (see GITHUB_SETUP.md)
        echo 4. GitHub Actions will automatically deploy your app
        echo.
    )
) else (
    echo.
    echo Commit and push skipped.
    echo You can do this manually later with:
    echo   git add .
    echo   git commit -m "Your message"
    echo   git push -u origin main
    echo.
)

echo ========================================
echo Important: Don't forget to set up GitHub Secrets!
echo See GITHUB_SETUP.md for detailed instructions.
echo ========================================
echo.
pause
