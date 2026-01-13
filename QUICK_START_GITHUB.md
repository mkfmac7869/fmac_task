# 🚀 Quick Start: GitHub Deployment

Get your FMAC Task Manager deployed to Firebase via GitHub Actions in **5 minutes**.

## ✅ What You Need

- [ ] GitHub account
- [ ] Git installed on your computer
- [ ] Firebase project (`fmactasks`) already set up
- [ ] 5 minutes of your time

## 📋 Step-by-Step Guide

### Step 1: Get Firebase Token (2 minutes)

Open your terminal and run:

```bash
firebase login:ci
```

**Copy the token** that appears - you'll need it in Step 3!

### Step 2: Create GitHub Repository (1 minute)

1. Go to [github.com](https://github.com)
2. Click **New repository** (green button)
3. Repository name: `fmac-task-manager` (or any name you like)
4. Set to **Private** (recommended)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **Create repository**
7. **Copy the repository URL** (looks like `https://github.com/username/fmac-task-manager.git`)

### Step 3: Add GitHub Secrets (2 minutes)

1. In your GitHub repository, click **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add each of these:

| Secret Name | Value |
|------------|-------|
| `FIREBASE_TOKEN` | Token from Step 1 |
| `VITE_FIREBASE_API_KEY` | `AIzaSyC-qbrtW4VluVn-b1tfvatozee3HF5Q344` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `fmactasks.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `fmactasks` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `fmactasks.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `289312359559` |
| `VITE_FIREBASE_APP_ID` | `1:289312359559:web:d91b0b241b9aece596a422` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-8FGY9FGRTL` |

**For FIREBASE_SERVICE_ACCOUNT_FMACTASKS:**

Run this command to generate a service account:
```bash
firebase init hosting:github
```

Follow the prompts and it will automatically create the service account and add it to your GitHub secrets!

### Step 4: Push to GitHub (1 minute)

**Option A: Use the Setup Script (Easiest)**

Just double-click: `setup-github.bat`

**Option B: Manual Commands**

```bash
# Initialize git (if not already done)
git init
git branch -M main

# Add your repository
git remote add origin YOUR_GITHUB_REPO_URL

# Commit and push
git add .
git commit -m "Initial commit - FMAC Task Manager"
git push -u origin main
```

Replace `YOUR_GITHUB_REPO_URL` with the URL from Step 2.

## 🎉 You're Done!

**GitHub Actions will automatically:**
- Build your app
- Deploy to Firebase Hosting
- Deploy to your custom domain: `https://taskfmac.dev`

### Check Deployment Status

1. Go to your GitHub repository
2. Click the **Actions** tab
3. Watch the deployment progress
4. Once complete (green checkmark), visit `https://taskfmac.dev`

## 🔄 From Now On

Every time you push code to the `main` branch:
- GitHub Actions automatically builds and deploys your app
- No manual deployment needed!
- Get deployment notifications in the Actions tab

## ⚡ Quick Deploy Commands

After initial setup, just use:

```bash
git add .
git commit -m "Your changes description"
git push
```

GitHub Actions handles the rest!

## 📝 Create Pull Requests

Want to test changes before deploying?

```bash
# Create a new branch
git checkout -b feature/my-new-feature

# Make your changes, then commit
git add .
git commit -m "Add new feature"

# Push to GitHub
git push -u origin feature/my-new-feature
```

Then on GitHub:
1. Click **Compare & pull request**
2. GitHub will automatically create a **preview deployment**
3. Test your changes on the preview URL
4. Merge when ready → Auto-deploys to production!

## 🆘 Troubleshooting

### "Permission denied" error?
- Make sure you added `FIREBASE_TOKEN` secret in GitHub

### "Build failed"?
- Check that all 8 secrets are added correctly
- Verify secret names match exactly (case-sensitive)

### Can't push to GitHub?
- Create a Personal Access Token: GitHub → Settings → Developer settings → Personal access tokens
- Use the token as your password when pushing

## 📚 Need More Help?

See detailed guides:
- **Full GitHub setup:** `GITHUB_SETUP.md`
- **Firebase hosting:** `FIREBASE_HOSTING_SETUP.md`
- **Email notifications:** `NOTIFICATION_SETUP.md`

## 🎯 Summary

```
1. Get Firebase token
2. Create GitHub repo  
3. Add 8 secrets to GitHub
4. Push code (use setup-github.bat)
5. Done! ✨
```

Your app auto-deploys to `https://taskfmac.dev` every time you push code!
