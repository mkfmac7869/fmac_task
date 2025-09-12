// Utility to fix admin user profiles in Firebase
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

export const fixAdminProfile = async (userId: string) => {
  try {
    console.log('🔧 Fixing admin profile for user:', userId);
    
    // Get the current profile
    const userDoc = await getDoc(doc(db, 'profiles', userId));
    
    if (userDoc.exists()) {
      const profileData = userDoc.data();
      console.log('📊 Current profile data:', profileData);
      
      // Check if this is an admin user
      const isAdmin = profileData.role === 'admin' || profileData.roles?.includes('admin');
      
      if (isAdmin) {
        // Update the profile to ensure it has the correct structure
        const updates = {
          isApproved: true,
          roles: profileData.roles || (profileData.role ? [profileData.role] : ['admin']),
          approvedBy: profileData.approvedBy || userId,
          approvedAt: profileData.approvedAt || new Date(),
          updatedAt: new Date()
        };
        
        console.log('🔄 Updating profile with:', updates);
        await updateDoc(doc(db, 'profiles', userId), updates);
        console.log('✅ Admin profile fixed successfully');
        
        return true;
      } else {
        console.log('❌ User is not an admin, no changes needed');
        return false;
      }
    } else {
      console.log('❌ User profile not found');
      return false;
    }
  } catch (error) {
    console.error('💥 Error fixing admin profile:', error);
    return false;
  }
};

// Function to fix all admin profiles
export const fixAllAdminProfiles = async () => {
  try {
    console.log('🔧 Fixing all admin profiles...');
    
    // List of known admin emails
    const adminEmails = ['mkfmac7@gmail.com', 'mk7869148e@gmail.com'];
    
    // You would need to query all profiles and check for admin users
    // For now, we'll just log the admin emails
    console.log('📧 Admin emails to check:', adminEmails);
    
    return true;
  } catch (error) {
    console.error('💥 Error fixing admin profiles:', error);
    return false;
  }
};
