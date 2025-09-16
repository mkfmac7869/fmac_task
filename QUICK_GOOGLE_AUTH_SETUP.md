# Quick Google Auth Setup for tasks.fmac.dev

## URGENT: Follow these steps in order

### Step 1: Add Authorized Domains (MOST IMPORTANT!)

1. **Click this link**: [Firebase Auth Settings](https://console.firebase.google.com/u/0/project/fmactasks/authentication/settings)
2. Find the **"Authorized domains"** section
3. Click **"Add domain"** and add each of these:
   - `tasks.fmac.dev`
   - `fmac.dev`
   - `fmac-task.vercel.app`

### Step 2: Enable Google Sign-In

1. **Click this link**: [Firebase Auth Providers](https://console.firebase.google.com/u/0/project/fmactasks/authentication/providers)
2. Find **Google** in the list
3. Click on it and then click **Enable**
4. Fill in:
   - **Public-facing name**: FMAC Task Manager
   - **Support email**: Your email address
5. Click **Save**

### Step 3: Configure Google Cloud OAuth (if needed)

1. **Click this link**: [Google Cloud Console OAuth](https://console.cloud.google.com/apis/credentials/consent?project=fmactasks)
2. If prompted to configure OAuth consent screen:
   - **App name**: FMAC Task Manager
   - **User support email**: Your email
   - **Authorized domains**: Click "ADD DOMAIN" and add:
     - `tasks.fmac.dev`
     - `fmac.dev`
   - **Developer contact**: Your email
3. Click **Save**

### Step 4: Update Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these (if not already there):

```
VITE_FIREBASE_API_KEY=AIzaSyC-qbrtW4VluVn-b1tfvatozee3HF5Q344
VITE_FIREBASE_AUTH_DOMAIN=fmactasks.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fmactasks
VITE_FIREBASE_STORAGE_BUCKET=fmactasks.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=289312359559
VITE_FIREBASE_APP_ID=1:289312359559:web:d91b0b241b9aece596a422
VITE_FIREBASE_MEASUREMENT_ID=G-8FGY9FGRTL
```

5. Click **Save** for each variable

### Step 5: Redeploy on Vercel

1. In Vercel dashboard, go to **Deployments**
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 6: Test

1. Go to https://tasks.fmac.dev/
2. Clear your browser cache (Ctrl+Shift+Delete)
3. Try signing in with Google

## If it still doesn't work:

Check the browser console (F12) for error messages and look for:
- `auth/unauthorized-domain` - Domain not added to Firebase
- `auth/operation-not-allowed` - Google provider not enabled
- `popup-blocked` - Browser blocking popups

## Common Issues:

1. **"Unauthorized domain" error**: You missed adding the domain in Step 1
2. **"Google sign-in not enabled"**: You missed enabling Google in Step 2
3. **Popup blocked**: Allow popups for tasks.fmac.dev in your browser

## Need More Help?

The most critical step is **Step 1** - adding the authorized domains. Without this, Google auth will not work on your custom domain.
