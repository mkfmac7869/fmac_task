// Quick fix for admin role issue
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const quickFixAdmin = async () => {
  try {
    console.log('🔧 Quick fix: Creating admin profile...');
    
    // First, ensure user is authenticated
    console.log('Checking authentication...');
    if (!auth.currentUser) {
      console.log('User not authenticated, attempting to sign in...');
      try {
        // Try to sign in with the admin email
        await signInWithEmailAndPassword(auth, 'mkfmac7@gmail.com', '123456');
        console.log('✅ User authenticated successfully');
      } catch (authError) {
        console.log('Could not authenticate, proceeding with anonymous access...');
        // If authentication fails, we'll try anyway (might work with permissive rules)
      }
    } else {
      console.log('✅ User already authenticated');
    }
    
    const adminProfile = {
      name: 'Mohamed Khaled',
      email: 'mkfmac7@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=MK&background=ea384c&color=fff',
      role: 'admin',
      department: 'Management',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Creating admin profile document...');
    // Directly create the document in Firestore
    await setDoc(doc(db, 'profiles', '4C041gjoVQhUbZQ9QZtW1vt9Bu92'), adminProfile);
    
    console.log('✅ Admin profile created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Quick fix failed:', error);
    return false;
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).quickFixAdmin = quickFixAdmin;
}
