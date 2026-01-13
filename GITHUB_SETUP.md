# GitHub Actions Setup Guide

This guide will help you set up automatic deployment to Firebase Hosting and Functions using GitHub Actions.

## Overview

Three GitHub Actions workflows have been configured:

1. **`firebase-hosting-merge.yml`** - Deploys to production when code is pushed to main/master
2. **`firebase-hosting-pull-request.yml`** - Creates preview deployments for pull requests
3. **`deploy-functions.yml`** - Deploys Firebase Functions when changes are made

## Prerequisites

- GitHub repository for your code
- Firebase project: `fmactasks`
- Firebase CLI installed locally

## Step 1: Generate Firebase Service Account

You need a service account key for GitHub Actions to deploy to Firebase.

### Option A: Using Firebase CLI (Recommended)

1. Run this command in your terminal:
   ```bash
   firebase login:ci
   ```

2. This will open a browser for authentication
3. After authentication, you'll receive a token
4. **Copy this token** - you'll need it for GitHub Secrets

### Option B: Using Firebase Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your `fmactasks` project
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Click **Create Service Account**
5. Name: `github-actions`
6. Grant role: **Firebase Admin**
7. Click **Create Key** → **JSON**
8. Download and save the JSON file securely

## Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Add the following secrets:

#### 1. FIREBASE_SERVICE_ACCOUNT_FMACTASKS
- **Name:** `FIREBASE_SERVICE_ACCOUNT_FMACTASKS`
- **Value:** (paste the entire content of the service account JSON file)

#### 2. FIREBASE_TOKEN
- **Name:** `FIREBASE_TOKEN`
- **Value:** (paste the token from `firebase login:ci`)

#### 3. Firebase Environment Variables

Add these secrets with your Firebase configuration:

- **VITE_FIREBASE_API_KEY**
  ```
  AIzaSyC-qbrtW4VluVn-b1tfvatozee3HF5Q344
  ```

- **VITE_FIREBASE_AUTH_DOMAIN**
  ```
  fmactasks.firebaseapp.com
  ```

- **VITE_FIREBASE_PROJECT_ID**
  ```
  fmactasks
  ```

- **VITE_FIREBASE_STORAGE_BUCKET**
  ```
  fmactasks.firebasestorage.app
  ```

- **VITE_FIREBASE_MESSAGING_SENDER_ID**
  ```
  289312359559
  ```

- **VITE_FIREBASE_APP_ID**
  ```
  1:289312359559:web:d91b0b241b9aece596a422
  ```

- **VITE_FIREBASE_MEASUREMENT_ID**
  ```
  G-8FGY9FGRTL
  ```

## Step 3: Push Code to GitHub

### Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit with GitHub Actions"
```

### Connect to GitHub Repository

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 4: Verify Deployment

After pushing to GitHub:

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You should see the workflows running
4. Once complete, your app will be deployed to:
   - Production: `https://taskfmac.dev`
   - Firebase default: `https://fmactasks.web.app`

## How It Works

### Production Deployment
When you push to `main` or `master` branch:
1. GitHub Actions triggers
2. Installs dependencies
3. Builds your React app
4. Deploys to Firebase Hosting (live)

### Pull Request Previews
When you create a pull request:
1. GitHub Actions triggers
2. Builds your app
3. Creates a preview URL
4. Posts the preview URL as a comment on the PR

### Function Deployment
When you modify files in `functions/` folder:
1. GitHub Actions triggers
2. Builds the functions
3. Deploys to Firebase Functions

## Manual Deployment

You can still deploy manually using:

```bash
# Windows
deploy-all.bat

# Or using Firebase CLI
firebase deploy
```

## Troubleshooting

### Workflow Fails with "Permission Denied"
- Check that `FIREBASE_SERVICE_ACCOUNT_FMACTASKS` secret is set correctly
- Verify the service account has Firebase Admin role

### Build Fails
- Ensure all environment variable secrets are set
- Check the build logs in GitHub Actions
- Verify `package.json` scripts are correct

### Functions Don't Deploy
- Check that `FIREBASE_TOKEN` secret is set
- Verify functions build successfully locally: `cd functions && npm run build`

### Preview URLs Don't Work
- Check that Firebase Hosting is enabled in Firebase Console
- Verify the service account has correct permissions

## Branch Protection (Optional)

To require successful builds before merging:

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Check **Require status checks to pass**
5. Select your workflows
6. Click **Create**

## Monitoring Deployments

### View Deployment History
1. Firebase Console → Hosting
2. Click on your site
3. View **Release history**

### View GitHub Actions Logs
1. GitHub repository → Actions
2. Click on any workflow run
3. View detailed logs for each step

## Best Practices

1. **Always test locally** before pushing
2. **Use pull requests** for code review
3. **Monitor GitHub Actions** for failures
4. **Keep secrets secure** - never commit them to code
5. **Update dependencies** regularly

## Deployment Checklist

Before pushing to production:

- [ ] Code builds successfully locally
- [ ] All tests pass
- [ ] Environment variables are set in GitHub Secrets
- [ ] Firebase service account is configured
- [ ] `.gitignore` excludes sensitive files
- [ ] Custom domain is connected
- [ ] SSL certificate is active

## Next Steps

- Set up staging environment with separate branch
- Add automated testing to workflows
- Configure deployment notifications (Slack, Discord, etc.)
- Set up monitoring and alerts

## Support

If you encounter issues:
1. Check GitHub Actions logs
2. Review Firebase Console deployment logs
3. Verify all secrets are correctly set
4. Test manual deployment locally
