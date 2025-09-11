#!/bin/bash

echo "🚀 Deploying Firebase Functions for Email Notifications..."
echo

echo "📦 Building functions..."
cd functions
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo
echo "🚀 Deploying to Firebase..."
cd ..
firebase deploy --only functions
if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo
echo "✅ Functions deployed successfully!"
echo "📧 Email notifications should now work."
echo
echo "🔍 To test:"
echo "1. Create a task in your app"
echo "2. Assign it to a team member"
echo "3. Check if they receive an email"
echo
