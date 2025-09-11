const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 FMAC Task Manager - Email Notifications Setup');
console.log('================================================\n');

console.log('This script will help you set up email notifications for task assignments.');
console.log('You will need a Resend API key to continue.\n');

console.log('To get a Resend API key:');
console.log('1. Go to https://resend.com');
console.log('2. Sign up for a free account');
console.log('3. Go to API Keys section');
console.log('4. Create a new API key\n');

rl.question('Enter your Resend API key (or press Enter to skip): ', (apiKey) => {
  if (apiKey.trim()) {
    try {
      console.log('\n📧 Setting up Resend API key...');
      
      // Set Firebase config
      execSync(`firebase functions:config:set resend.api_key="${apiKey.trim()}"`, { stdio: 'inherit' });
      
      console.log('✅ Resend API key configured successfully!');
      
      // Set public URL (optional)
      rl.question('\nEnter your app URL (or press Enter for localhost:5173): ', (appUrl) => {
        if (appUrl.trim()) {
          try {
            execSync(`firebase functions:config:set app.public_url="${appUrl.trim()}"`, { stdio: 'inherit' });
            console.log('✅ App URL configured successfully!');
          } catch (error) {
            console.log('⚠️  Could not set app URL:', error.message);
          }
        }
        
        console.log('\n🎉 Setup complete! Next steps:');
        console.log('1. Deploy the functions: firebase deploy --only functions');
        console.log('2. Test by creating a task with an assignee');
        console.log('3. Check Firebase Console > Functions > Logs for any issues\n');
        
        rl.close();
      });
      
    } catch (error) {
      console.log('❌ Error setting up API key:', error.message);
      console.log('\nYou can manually set it later with:');
      console.log('firebase functions:config:set resend.api_key="your_key_here"');
      rl.close();
    }
  } else {
    console.log('\n⏭️  Skipping API key setup.');
    console.log('\nTo set it up later, run:');
    console.log('firebase functions:config:set resend.api_key="your_key_here"');
    console.log('\nThen deploy with: firebase deploy --only functions');
    rl.close();
  }
});
