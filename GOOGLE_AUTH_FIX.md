# Google Authentication Fix for Vercel Deployment

## Problem
Google Sign-In fails on Vercel deployment with error: "Failed to sign in with Google. Please try again."

## Solution

### 1. Add Vercel Domain to Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **fmactasks**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domains:
   - `fmac-task.vercel.app`
   - `*.vercel.app` (for preview deployments)
   - `tasks.fmac.dev` (your custom domain)
   - `fmac.dev` (root domain)

### 2. Enable Google Sign-In Provider

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Click **Enable**
4. Set the **Project public-facing name** (e.g., "FMAC Task Manager")
5. Set the **Project support email** (your email)
6. Click **Save**

### 3. Configure OAuth Consent Screen (if needed)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **OAuth consent screen**
4. Configure the consent screen:
   - App name: FMAC Task Manager
   - User support email: Your email
   - Authorized domains: Add `vercel.app` and your custom domain
   - Developer contact information: Your email
5. Save the configuration

### 4. Update Firebase Configuration (if needed)

If you're using environment variables for Firebase config in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables (if not already present):
   ```
   VITE_FIREBASE_API_KEY=AIzaSyC-qbrtW4VluVn-b1tfvatozee3HF5Q344
   VITE_FIREBASE_AUTH_DOMAIN=fmactasks.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=fmactasks
   VITE_FIREBASE_STORAGE_BUCKET=fmactasks.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=289312359559
   VITE_FIREBASE_APP_ID=1:289312359559:web:d91b0b241b9aece596a422
   VITE_FIREBASE_MEASUREMENT_ID=G-8FGY9FGRTL
   ```

### 5. Check CORS Settings

Ensure your Firebase Storage CORS configuration allows your Vercel domain:

```json
[
  {
    "origin": ["https://fmac-task.vercel.app", "https://*.vercel.app", "http://localhost:*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

### 6. Verify Production Build

Make sure the production build includes the Google Auth provider:

```javascript
// This should already be in your useFirebaseAuth.ts
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
```

### 7. Clear Browser Cache

After making these changes:
1. Clear your browser cache
2. Try signing in with Google again

## Troubleshooting

If the issue persists:

1. Check the browser console for specific error messages
2. Verify the Firebase project is active and not suspended
3. Check if there are any quotas exceeded in Firebase Console
4. Ensure the Google provider is properly enabled in Firebase Authentication

## Quick Test

To quickly test if the configuration is correct:

1. Open browser developer tools
2. Go to Console tab
3. Try to sign in with Google
4. Look for any specific error messages about:
   - Redirect URI mismatch
   - Unauthorized domain
   - Missing configuration

The error message will help identify the exact issue.
