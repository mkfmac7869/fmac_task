# 🚀 START HERE - FMAC Task Manager Deployment

## 👋 Welcome!

Your FMAC Task Manager is **100% configured and ready to deploy** to `https://taskfmac.dev`

---

## ⚡ FASTEST PATH TO DEPLOYMENT (5 Minutes)

### Step 1: Get Firebase Token
Open terminal:
```bash
firebase login:ci
```
📋 **Copy the token!**

### Step 2: Setup GitHub
**Double-click:** `setup-github.bat`

Enter when prompted:
- Your GitHub repository URL
- Confirm to push code

### Step 3: Add Secrets to GitHub
Go to: **GitHub Repo → Settings → Secrets → Actions**

Click "New repository secret" and add **9 secrets**:

```
FIREBASE_TOKEN → (token from Step 1)
VITE_FIREBASE_API_KEY → AIzaSyC-qbrtW4VluVn-b1tfvatozee3HF5Q344
VITE_FIREBASE_AUTH_DOMAIN → fmactasks.firebaseapp.com
VITE_FIREBASE_PROJECT_ID → fmactasks
VITE_FIREBASE_STORAGE_BUCKET → fmactasks.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID → 289312359559
VITE_FIREBASE_APP_ID → 1:289312359559:web:d91b0b241b9aece596a422
VITE_FIREBASE_MEASUREMENT_ID → G-8FGY9FGRTL
```

For the 9th secret, run:
```bash
firebase init hosting:github
```
(This automatically adds `FIREBASE_SERVICE_ACCOUNT_FMACTASKS`)

### Step 4: Watch Deployment
- Go to: **GitHub Repo → Actions**
- Wait 2-3 minutes
- ✅ **Visit https://taskfmac.dev**

---

## ✅ What's Already Configured

### Forget Password Feature ✓
- Reset password page created
- Email integration working
- Redirects to https://taskfmac.dev

### Email Notifications ✓
- All emails use https://taskfmac.dev
- Task assignments send emails
- Beautiful email templates

### Firebase Hosting ✓
- Optimized caching
- Security headers
- Custom domain ready

### GitHub Actions ✓
- Auto-deploy on push
- PR preview URLs
- Function deployment

---

## 📚 Need Help?

| Topic | Document |
|-------|----------|
| **GitHub Setup (5 min)** | `QUICK_START_GITHUB.md` |
| **Manual Deployment** | `FIREBASE_HOSTING_SETUP.md` |
| **Complete Overview** | `DEPLOYMENT_COMPLETE.md` |
| **Email Setup** | `NOTIFICATION_SETUP.md` |

---

## 🎯 Choose Your Method

### Method 1: GitHub (Recommended) ⭐
- **Pros:** Auto-deploy, version control, team collaboration
- **Time:** 5-10 minutes setup, then automatic forever
- **Guide:** `QUICK_START_GITHUB.md`
- **Script:** `setup-github.bat`

### Method 2: Manual Deploy
- **Pros:** Simple, no GitHub needed
- **Time:** 2-3 minutes per deployment
- **Guide:** `FIREBASE_HOSTING_SETUP.md`
- **Script:** `deploy-all.bat`

---

## 🔥 Quick Scripts Available

Double-click to run:

- **`setup-github.bat`** - Push code to GitHub
- **`deploy-all.bat`** - Deploy everything manually
- **`deploy-hosting.bat`** - Deploy only website
- **`deploy-functions.bat`** - Deploy only functions

---

## ✅ Post-Deployment Testing

After deployment, test:
- [ ] Login works
- [ ] Forgot password sends email
- [ ] Password reset link works
- [ ] Task creation works
- [ ] Email notifications work
- [ ] Google sign-in works

---

## 🆘 Quick Troubleshooting

**Build fails?**
→ Run `npm install` first

**Can't push to GitHub?**
→ Create GitHub Personal Access Token

**Emails not working?**
→ Check `NOTIFICATION_SETUP.md`

**Domain not connected?**
→ Follow steps in `FIREBASE_HOSTING_SETUP.md`

---

## 🎉 Ready?

**Pick your deployment method above and follow the guide!**

Your app will be live at **https://taskfmac.dev** in minutes!

---

<p align="center">
  <strong>Questions? Check DEPLOYMENT_COMPLETE.md for full details!</strong>
</p>
