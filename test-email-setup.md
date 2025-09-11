# Email Setup Test Guide

## Current Status ✅

The Firebase Cloud Functions for email notifications have been successfully set up! Here's what's been completed:

### ✅ Completed Steps:
1. **Firebase CLI installed** - ✅ Done
2. **Firebase Functions initialized** - ✅ Done  
3. **Dependencies installed** - ✅ Done
4. **TypeScript configuration fixed** - ✅ Done
5. **Functions built successfully** - ✅ Done

### 🔧 Next Steps (Manual Setup):

#### 1. Get Resend API Key
- Go to https://resend.com
- Sign up for a free account
- Go to API Keys section
- Create a new API key

#### 2. Configure Firebase with Resend API Key
```bash
firebase functions:config:set resend.api_key="your_resend_api_key_here"
```

#### 3. Set App URL (Optional)
```bash
firebase functions:config:set app.public_url="https://your-domain.com"
```

#### 4. Deploy Functions
```bash
firebase deploy --only functions
```

#### 5. Test the Setup
1. Create a new task in your app
2. Assign it to a team member
3. Check if they receive an email notification
4. Check Firebase Console > Functions > Logs for any errors

## 🧪 Testing Locally (Optional)

You can test the functions locally before deploying:

```bash
# Start Firebase emulator
firebase emulators:start --only functions,firestore

# In another terminal, create a test task
# The function will trigger and send an email
```

## 📧 Email Features

When deployed, the system will automatically send emails when:
- ✅ **New task assigned** - When someone is assigned a new task
- ✅ **Task reassigned** - When a task is moved to a different person

Email includes:
- ✅ **Professional design** with FMAC branding
- ✅ **Complete task details** (title, description, priority, due date, project)
- ✅ **Direct link** to view the task
- ✅ **Priority colors** and status indicators

## 🔍 Troubleshooting

If emails aren't sending:
1. Check Firebase Console > Functions > Logs
2. Verify Resend API key is correct
3. Ensure user profiles exist in Firestore
4. Check Resend dashboard for delivery status

## 📁 Files Created

- `functions/src/index.ts` - Cloud Functions code
- `functions/package.json` - Dependencies
- `functions/tsconfig.json` - TypeScript config
- `firebase.json` - Firebase configuration
- `setup-email.cjs` - Setup helper script

## 🚀 Ready to Deploy!

Your email notification system is ready! Just add your Resend API key and deploy.
