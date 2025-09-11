# Email Notifications Setup Guide

This guide will help you set up email notifications for task assignments using Firebase Cloud Functions and Resend.

## Prerequisites

1. Firebase CLI installed (`npm install -g firebase-tools`)
2. Resend account and API key
3. Firebase project with Firestore enabled

## Setup Steps

### 1. Install Firebase CLI and Login

```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize Firebase Functions

```bash
firebase init functions
# Select your existing Firebase project
# Choose TypeScript
# Install dependencies when prompted
```

### 3. Install Dependencies

```bash
cd functions
npm install firebase-admin firebase-functions resend
npm install --save-dev typescript @types/node
```

### 4. Configure Resend API Key

#### Option A: Using Firebase Config (Recommended for production)

```bash
firebase functions:config:set resend.api_key="your_resend_api_key_here"
```

#### Option B: Using Environment Variables (For local development)

Create a `.env` file in the functions directory:

```bash
cd functions
echo "RESEND_API_KEY=your_resend_api_key_here" > .env
```

### 5. Set Public URL (Optional)

If your app is not running on localhost:5173, set the public URL:

```bash
firebase functions:config:set app.public_url="https://your-domain.com"
```

### 6. Deploy Functions

```bash
# Build and deploy
firebase deploy --only functions

# Or deploy specific functions
firebase deploy --only functions:sendTaskAssignmentNotification
firebase deploy --only functions:sendTaskUpdateNotification
```

### 7. Test the Functions

You can test the functions locally using the Firebase emulator:

```bash
firebase emulators:start --only functions,firestore
```

## How It Works

### Task Assignment Notifications

1. When a new task is created with an assignee, the `sendTaskAssignmentNotification` function triggers
2. The function fetches the assignee's profile information from Firestore
3. It sends a formatted email using Resend with task details
4. The email includes a direct link to view the task

### Task Reassignment Notifications

1. When a task is updated and the assignee changes, the `sendTaskUpdateNotification` function triggers
2. The function sends a notification to the new assignee
3. It includes all task details and a link to view the task

## Email Template Features

- **Professional Design**: Clean, responsive HTML email template
- **Task Details**: Title, description, priority, due date, project, and status
- **Direct Links**: One-click access to view task details
- **Priority Colors**: Visual indicators for task priority levels
- **Status Indicators**: Clear status display with appropriate colors

## Configuration Options

### Resend Configuration

The functions use Resend for email delivery. Make sure to:

1. Verify your domain in Resend (or use the default onboarding@resend.dev)
2. Set up proper SPF, DKIM, and DMARC records for better deliverability
3. Monitor your Resend dashboard for delivery statistics

### Firebase Configuration

You can customize the following settings:

```bash
# Set custom public URL
firebase functions:config:set app.public_url="https://your-app.com"

# Set custom email sender
# (Modify the 'from' field in the functions/src/index.ts file)
```

## Troubleshooting

### Common Issues

1. **Functions not triggering**: Check Firestore security rules allow writes
2. **Emails not sending**: Verify Resend API key is correct
3. **Missing user data**: Ensure user profiles exist in the 'profiles' collection

### Debugging

Check function logs:

```bash
firebase functions:log
```

Or view logs in the Firebase Console under Functions > Logs.

### Testing Locally

1. Start the emulator: `firebase emulators:start --only functions,firestore`
2. Create a task in your app (pointing to the emulator)
3. Check the emulator logs for function execution

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Firestore Rules**: Ensure proper security rules are in place
3. **Rate Limiting**: Consider implementing rate limiting for email functions
4. **User Privacy**: Only send emails to verified users

## Monitoring

Monitor your email delivery:

1. **Resend Dashboard**: Check delivery rates and bounce handling
2. **Firebase Console**: Monitor function execution and errors
3. **User Feedback**: Track user complaints about email frequency

## Customization

### Email Templates

Modify the HTML templates in `functions/src/index.ts` to match your brand:

- Update colors to match your theme
- Add your logo
- Customize the email content
- Add unsubscribe links if needed

### Function Triggers

You can add more triggers for different events:

- Task status changes
- Due date reminders
- Comment notifications
- Project updates

## Support

For issues with:

- **Firebase Functions**: Check the [Firebase documentation](https://firebase.google.com/docs/functions)
- **Resend**: Check the [Resend documentation](https://resend.com/docs)
- **This Implementation**: Check the function logs and Firestore data
