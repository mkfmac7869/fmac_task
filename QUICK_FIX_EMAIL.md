# 🚀 Quick Fix: Deploy Email Notifications

## The Problem
- Firebase Functions show "Waiting for your first deploy"
- Email notifications aren't working because functions aren't deployed
- Resend API key needs to be properly configured

## ✅ Solution Steps

### Step 1: Configure Resend API Key
```bash
firebase functions:config:set resend.api_key="re_cvqjHHqD_JBwRaMzooy3Abwq2graP49Wk"
```

### Step 2: Build Functions
```bash
cd functions
npm run build
cd ..
```

### Step 3: Deploy Functions
```bash
firebase deploy --only functions
```

## 🔧 Alternative: Manual Deployment

If the above doesn't work, try this:

### 1. Open Firebase Console
- Go to https://console.firebase.google.com
- Select your project: `fmactasks`
- Go to Functions section

### 2. Deploy via Firebase Console
- Click "Get started" or "Deploy your first function"
- Follow the setup wizard
- Or use the Firebase CLI commands above

### 3. Verify Deployment
- Functions should appear in Firebase Console
- Check Functions → Dashboard
- Should see: `sendTaskAssignmentNotification` and `sendTaskUpdateNotification`

## 🧪 Test Email Notifications

### Method 1: Create a Task
1. Go to https://fmac-tasks.vercel.app
2. Create a new task
3. Assign it to someone
4. Check if they receive an email

### Method 2: Use Test Function
1. Open `test-email.html` in your browser
2. Fill in the form
3. Click "Send Test Email"

## 🔍 Troubleshooting

### If deployment fails:
1. Check if Firebase CLI is logged in: `firebase login`
2. Verify project: `firebase use fmactasks`
3. Check for errors in the terminal output

### If emails don't work after deployment:
1. Check Firebase Console → Functions → Logs
2. Verify the Resend API key is correct
3. Test with the test function first

## 📊 Expected Result

After successful deployment:
- ✅ Functions appear in Firebase Console
- ✅ Email notifications work automatically
- ✅ Users receive emails when assigned to tasks
- ✅ Test function works for manual testing

---

**Ready to fix it?** Run the commands above! 🚀
