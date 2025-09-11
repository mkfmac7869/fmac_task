// Authentication-based fix for admin role
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

export const createAdminProfileWithAuth = async () => {
  try {
    console.log('🔧 Auth-based fix: Creating admin profile...');
    
    // Check if we're in a React component context
    if (typeof window !== 'undefined' && (window as any).React) {
      console.log('Running in React context, using auth context...');
      // This will be called from a React component with access to auth context
      return false; // Let the component handle it
    }
    
    // For direct calls, try to create the profile
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
    await setDoc(doc(db, 'profiles', '4C041gjoVQhUbZQ9QZtW1vt9Bu92'), adminProfile);
    
    console.log('✅ Admin profile created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Auth-based fix failed:', error);
    return false;
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).createAdminProfileWithAuth = createAdminProfileWithAuth;
}
