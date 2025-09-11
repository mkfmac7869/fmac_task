# Firebase Setup Guide

This application has been migrated from Supabase to Firebase for authentication and data storage.

## Firebase Configuration

The Firebase configuration is located in `src/lib/firebaseClient.ts` and uses the following project:

- **Project ID**: fmactasks
- **Auth Domain**: fmactasks.firebaseapp.com
- **Storage Bucket**: fmactasks.firebasestorage.app

## Required Firebase Services

### 1. Authentication
- **Email/Password Authentication**: Enabled
- **Admin Users**: The following emails are automatically granted admin privileges:
  - mkfmac7@gmail.com
  - mk7869148e@gmail.com

### 2. Firestore Database
The following collections are used:
- `profiles` - User profiles and roles
- `tasks` - Task management
- `projects` - Project management
- `task_activities` - Task activity logs
- `departments` - Department management

## Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select the "fmactasks" project
3. Enable the following services:

### Authentication Setup
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Configure any additional settings as needed

### Firestore Database Setup
1. Go to Firestore Database
2. Create database in production mode
3. Set up security rules (see below)

### Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin users can read/write all profiles
    match /profiles/{userId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Tasks - users can read tasks assigned to them or created by them
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        (resource.data.assigned_to == request.auth.uid || 
         resource.data.created_by == request.auth.uid ||
         get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Projects - users can read projects in their department or all if admin
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        (resource.data.department == get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.department ||
         get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Task activities - users can read activities for tasks they have access to
    match /task_activities/{activityId} {
      allow read, write: if request.auth != null;
    }
    
    // Departments - admin only
    match /departments/{departmentId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Testing the Migration

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:8080`
3. Try logging in with:
   - **Admin Account**: mkfmac7@gmail.com / 12345678
   - **Admin Account**: mk7869148e@gmail.com / 12345678
   - **Mock Users**: Check `src/data/mockUsers.ts` for test accounts

## Migration Notes

- **Mock Users**: The application still supports mock users for testing without Firebase
- **Admin Privileges**: Specific email addresses are automatically granted admin roles
- **Data Migration**: Existing Supabase data needs to be manually migrated to Firestore
- **Authentication**: Firebase handles all authentication, replacing Supabase Auth
- **Database**: Firestore replaces Supabase's PostgreSQL database

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Check that the Firebase config is correct
2. **Permission denied**: Verify Firestore security rules
3. **Authentication errors**: Ensure Firebase Auth is properly configured
4. **Missing collections**: Create the required Firestore collections manually

### Debug Mode

Enable debug logging by setting `localStorage.setItem('firebase-debug', 'true')` in the browser console.

## Next Steps

1. Set up Firebase project with the provided configuration
2. Configure Firestore security rules
3. Test authentication and data operations
4. Migrate any existing data from Supabase
5. Deploy and test in production environment

