# FMAC Task Manager - Notification Setup Guide

This guide covers both **Email Notifications** and **Push Notifications** setup for your FMAC Task Manager application.

## 📧 Email Notifications (Resend) - ✅ CONFIGURED

### Current Status
- **Service**: Resend
- **API Key**: `re_cvqjHHqD_JBwRaMzooy3Abwq2graP49Wk`
- **App URL**: `https://fmac-tasks.vercel.app`
- **Status**: ✅ Ready to use

### How It Works
- Automatically sends emails when tasks are assigned
- Professional email templates with task details
- Direct links to view tasks in your app

## 🔔 Push Notifications (Firebase Cloud Messaging) - ✅ CONFIGURED

### Your FCM Credentials
- **Sender ID**: `289312359559`
- **Web Push Key**: `iut8rVwjmxfJ1ZNZ0-3yVBwA-3z37I8ZkYeNXIPVxq8`
- **Project ID**: `fmactasks`

### Features Added
- **Foreground Notifications**: Show notifications when app is open
- **Background Notifications**: Show notifications when app is closed
- **Click Actions**: Navigate to specific tasks when clicked
- **Permission Handling**: Request notification permission from users

## 🚀 How to Deploy the Updated Functions

### 1. Update Firebase Functions
The email notification functions have been updated to use your live app URL. To deploy:

```bash
# Navigate to functions directory
cd functions

# Build the functions
npm run build

# Deploy to Firebase
firebase deploy --only functions --project fmactasks
```

### 2. Configure Firebase Functions (if needed)
```bash
# Set Resend API key
firebase functions:config:set resend.api_key="re_cvqjHHqD_JBwRaMzooy3Abwq2graP49Wk"

# Set app URL
firebase functions:config:set app.public_url="https://fmac-tasks.vercel.app"
```

## 📱 Push Notification Features

### What Users Will Experience
1. **Permission Request**: First-time users will be asked to allow notifications
2. **Task Assignment Alerts**: Real-time notifications when assigned to tasks
3. **Click to View**: Click notifications to open specific tasks
4. **Background Support**: Notifications work even when app is closed

### Technical Implementation
- **Service Worker**: Handles background notifications
- **FCM Integration**: Uses your Firebase credentials
- **Token Management**: Automatically saves FCM tokens to user profiles
- **Cross-Platform**: Works on desktop and mobile browsers

## 🔧 Testing Notifications

### Test Email Notifications
1. Create a new task in your app
2. Assign it to a team member
3. Check if they receive an email notification
4. Verify the email contains correct task details and links

### Test Push Notifications
1. Open your app in a browser
2. Allow notification permissions when prompted
3. Create a task and assign it to yourself
4. Check if you receive a push notification
5. Click the notification to verify it opens the correct task

## 📊 Monitoring

### Email Notifications
- **Resend Dashboard**: Monitor email delivery rates
- **Firebase Console**: Check function execution logs
- **Function Logs**: `firebase functions:log`

### Push Notifications
- **Firebase Console**: FCM delivery reports
- **Browser DevTools**: Check for FCM token and permission status
- **Service Worker**: Monitor background message handling

## 🛠️ Troubleshooting

### Email Notifications Not Working
1. Check Firebase Functions logs
2. Verify Resend API key is correct
3. Ensure user profiles exist in Firestore
4. Check if functions are deployed

### Push Notifications Not Working
1. Check browser notification permissions
2. Verify FCM token is generated
3. Check service worker is registered
4. Ensure HTTPS is enabled (required for push notifications)

### Common Issues
- **No notifications**: Check browser permissions
- **Wrong URLs**: Verify app URL configuration
- **Token issues**: Clear browser data and retry
- **Service worker**: Check browser console for errors

## 📋 Files Created/Updated

### New Files
- `src/lib/pushNotificationService.ts` - Push notification service
- `public/firebase-messaging-sw.js` - Service worker for background notifications
- `NOTIFICATION_SETUP.md` - This setup guide

### Updated Files
- `src/App.tsx` - Added push notification initialization
- `functions/src/index.ts` - Updated email URLs to use live app
- `src/lib/firebaseClient.ts` - Already configured with your FCM credentials

## 🎯 Next Steps

1. **Deploy the updated functions** to enable email notifications with correct URLs
2. **Test both notification types** to ensure they work properly
3. **Monitor usage** through Firebase Console and Resend Dashboard
4. **Customize notifications** if needed (templates, timing, etc.)

## 📞 Support

If you encounter any issues:
1. Check the Firebase Console for function logs
2. Verify all credentials are correct
3. Test in different browsers
4. Check browser console for errors

Your notification system is now fully configured and ready to use! 🚀
