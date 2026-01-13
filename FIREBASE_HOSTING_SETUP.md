# Firebase Hosting Setup Guide

This guide will help you deploy your FMAC Task Manager app to Firebase Hosting and connect it to your custom domain `taskfmac.dev`.

## Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project: `fmactasks`
- Custom domain: `taskfmac.dev`

## Step 1: Build Your Application

Before deploying, you need to build your Vite React app:

```bash
npm run build
```

This will create a `dist` folder with your production-ready files.

## Step 2: Deploy to Firebase Hosting

Deploy your app along with Firestore rules and Firebase Functions:

```bash
firebase deploy
```

Or deploy only hosting:

```bash
firebase deploy --only hosting
```

## Step 3: Connect Custom Domain

### A. Add Domain in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **fmactasks** project
3. Navigate to **Hosting** in the left sidebar
4. Click **Add custom domain**
5. Enter: `taskfmac.dev`
6. Click **Continue**

### B. Verify Domain Ownership

Firebase will provide you with a TXT record. Add this to your domain's DNS settings:

**Type:** TXT  
**Name:** `@` or your domain name  
**Value:** (provided by Firebase)

### C. Add DNS Records

After verification, Firebase will provide you with DNS records to point your domain to Firebase Hosting:

**For the apex domain (taskfmac.dev):**
- **Type:** A
- **Name:** `@`
- **Value:** (Firebase will provide IP addresses like `151.101.1.195` and `151.101.65.195`)

**For www subdomain (optional):**
- **Type:** CNAME
- **Name:** `www`
- **Value:** `taskfmac.dev`

### D. Wait for SSL Certificate

Firebase will automatically provision an SSL certificate for your domain. This can take up to 24 hours.

## Step 4: Update Authentication Domain

After connecting your custom domain, add it to Firebase Authentication:

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain**
3. Add: `taskfmac.dev`
4. Click **Add**

## Deployment Commands

### Deploy Everything
```bash
firebase deploy
```

### Deploy Only Hosting
```bash
firebase deploy --only hosting
```

### Deploy Only Functions
```bash
firebase deploy --only functions
```

### Deploy Only Firestore Rules
```bash
firebase deploy --only firestore:rules
```

## Continuous Deployment Script

Create a deployment script `deploy.sh`:

```bash
#!/bin/bash

# Build the app
echo "Building application..."
npm run build

# Deploy to Firebase
echo "Deploying to Firebase..."
firebase deploy

echo "Deployment complete! Your app is now live at https://taskfmac.dev"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
```

## Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Domain Not Working
- Wait up to 24-48 hours for DNS propagation
- Verify DNS records are correctly set
- Check SSL certificate status in Firebase Console
- Clear browser cache and try incognito mode

### Authentication Errors
- Ensure `taskfmac.dev` is in Firebase Authentication → Authorized domains
- Check that the redirect URL in `ForgotPassword.tsx` matches your domain
- Verify CORS settings include your domain

## Environment Variables

Make sure your environment variables are set correctly for production:

```env
VITE_FIREBASE_API_KEY=AIzaSyC-qbrtW4VluVn-b1tfvatozee3HF5Q344
VITE_FIREBASE_AUTH_DOMAIN=fmactasks.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fmactasks
VITE_FIREBASE_STORAGE_BUCKET=fmactasks.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=289312359559
VITE_FIREBASE_APP_ID=1:289312359559:web:d91b0b241b9aece596a422
VITE_FIREBASE_MEASUREMENT_ID=G-8FGY9FGRTL
```

## Verify Deployment

After deployment, verify everything works:

1. ✅ Visit `https://taskfmac.dev`
2. ✅ Test login functionality
3. ✅ Test forgot password email
4. ✅ Test task assignment notifications
5. ✅ Check that all images and assets load correctly
6. ✅ Test Google Sign-In

## Next Steps

- Set up GitHub Actions for automatic deployment
- Configure Firebase Performance Monitoring
- Enable Firebase Analytics
- Set up custom error pages (404, 500)

## Support

If you encounter issues:
1. Check Firebase Console logs
2. Review browser console for errors
3. Verify DNS settings with your domain registrar
4. Check Firebase Hosting status page
