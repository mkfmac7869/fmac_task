# 🚀 Deploy Firebase Functions for Email Notifications

The email notifications aren't working because the Firebase Functions haven't been deployed yet. Here's how to fix it:

## 🔍 Current Issue
- Firebase Console shows "Waiting for your first deploy"
- No functions are currently deployed
- Email notifications require deployed Cloud Functions

## 📋 Step-by-Step Deployment

### Option 1: Use the Deployment Script (Windows)
```bash
# Double-click the deploy-functions.bat file
# OR run in command prompt:
deploy-functions.bat
```

### Option 2: Use the Deployment Script (Mac/Linux)
```bash
# Make the script executable and run:
chmod +x deploy-functions.sh
./deploy-functions.sh
```

### Option 3: Manual Deployment
```bash
# 1. Build the functions
cd functions
npm run build

# 2. Go back to root directory
cd ..

# 3. Deploy to Firebase
firebase deploy --only functions
```

## 🔧 Prerequisites Check

Before deploying, make sure:

1. **Firebase CLI is installed and logged in:**
   ```bash
   firebase --version
   firebase login
   ```

2. **Correct project is selected:**
   ```bash
   firebase use fmactasks
   ```

3. **Resend API key is configured:**
   ```bash
   firebase functions:config:set resend.api_key="re_cvqjHHqD_JBwRaMzooy3Abwq2graP49Wk"
   ```

## 📧 What Will Be Deployed

The following functions will be deployed:

1. **`sendTaskAssignmentNotification`**
   - Triggers when a new task is created with an assignee
   - Sends email notification to the assigned user

2. **`sendTaskUpdateNotification`**
   - Triggers when a task is reassigned
   - Sends email notification to the new assignee

3. **`testEmailNotification`**
   - Test function to manually send email notifications
   - Can be called from the test page

## ✅ After Deployment

Once deployed, you should see:

1. **Firebase Console** → Functions → Dashboard shows your deployed functions
2. **Email notifications** will work automatically when tasks are assigned
3. **Test page** (`test-email.html`) can be used to test notifications

## 🧪 Testing Email Notifications

### Method 1: Create a Real Task
1. Go to your app: https://fmac-tasks.vercel.app
2. Create a new task
3. Assign it to a team member
4. Check if they receive an email

### Method 2: Use the Test Page
1. Open `test-email.html` in your browser
2. Fill in the test form
3. Click "Send Test Email"
4. Check the recipient's email

## 🔍 Troubleshooting

### If deployment fails:
1. Check Firebase CLI is logged in: `firebase login`
2. Verify project is correct: `firebase use fmactasks`
3. Check functions build: `cd functions && npm run build`
4. Check Firebase Console for any errors

### If emails don't send after deployment:
1. Check Firebase Console → Functions → Logs
2. Verify Resend API key is configured
3. Check if user profiles exist in Firestore
4. Test with the test function

## 📊 Monitoring

After deployment, monitor:
- **Firebase Console** → Functions → Logs
- **Resend Dashboard** for email delivery
- **Function execution** in Firebase Console

## 🎯 Expected Result

After successful deployment:
- ✅ Functions appear in Firebase Console
- ✅ Email notifications work automatically
- ✅ Test function works for manual testing
- ✅ Users receive emails when assigned to tasks

---

**Ready to deploy?** Run the deployment script or follow the manual steps above! 🚀
