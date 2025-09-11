// Utility to ensure admin roles are properly set
import { AdminService } from '@/lib/firebaseService';

export const setupAdminRoles = async () => {
  try {
    console.log('Setting up admin roles...');
    
    // First try the normal method
    let result = await AdminService.makeMkfmacAdmin();
    
    if (!result) {
      // If normal method failed, try force update with known UID
      console.log('Trying force update for mkfmac7@gmail.com...');
      result = await AdminService.forceUpdateUserToAdmin('4C041gjoVQhUbZQ9QZtW1vt9Bu92', 'mkfmac7@gmail.com');
    }
    
    if (result) {
      console.log('✅ mkfmac7@gmail.com is now an admin');
    } else {
      console.log('ℹ️ mkfmac7@gmail.com user not found or already admin');
    }
    
    return result;
  } catch (error) {
    console.error('Error setting up admin roles:', error);
    return false;
  }
};

// Auto-run when this module is imported (for development)
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setupAdminRoles();
  
  // Make it available globally for manual execution
  (window as any).setupAdminRoles = setupAdminRoles;
  (window as any).makeMkfmacAdmin = AdminService.makeMkfmacAdmin;
  (window as any).forceUpdateMkfmacAdmin = () => AdminService.forceUpdateUserToAdmin('4C041gjoVQhUbZQ9QZtW1vt9Bu92', 'mkfmac7@gmail.com');
}
