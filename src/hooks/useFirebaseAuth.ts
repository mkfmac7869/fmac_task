import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseClient';
import { User, UserRole } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { mockUsers } from '@/data/mockUsers';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Convert Firebase user to our User type
  const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    try {
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const profileData = userDoc.data();
        // Check if user is approved
        if (!profileData.isApproved) {
          throw new Error('Your account is pending approval. Please contact your department head or admin.');
        }
        
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: profileData.name || firebaseUser.displayName || 'User',
          avatar: profileData.avatar || firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=ea384c&color=fff`,
          roles: profileData.roles || (profileData.role ? [profileData.role] : ['member']),
          department: profileData.department || 'General',
          isApproved: profileData.isApproved || false,
          approvedBy: profileData.approvedBy,
          approvedAt: profileData.approvedAt?.toDate(),
          createdAt: profileData.createdAt?.toDate() || new Date()
        };
      } else {
        // Create profile if it doesn't exist
        const isAdmin = firebaseUser.email === 'mkfmac7@gmail.com' || firebaseUser.email === 'mk7869148e@gmail.com';
        const newProfile = {
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=ea384c&color=fff`,
          roles: isAdmin ? ['admin'] : ['member'],
          department: isAdmin ? 'Management' : 'General',
          isApproved: isAdmin,
          approvedBy: isAdmin ? firebaseUser.uid : null,
          approvedAt: isAdmin ? new Date() : null,
          createdAt: new Date()
        };

        await setDoc(doc(db, 'profiles', firebaseUser.uid), newProfile);
        
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: newProfile.name,
          avatar: newProfile.avatar,
          roles: newProfile.roles as UserRole[],
          department: newProfile.department,
          isApproved: newProfile.isApproved,
          approvedBy: newProfile.approvedBy,
          approvedAt: newProfile.approvedAt,
          createdAt: newProfile.createdAt
        };
      }
    } catch (error) {
      console.error('Error converting Firebase user:', error);
      // Return basic user data if Firestore fails
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=ea384c&color=fff`,
        roles: ['member'],
        department: 'General',
        isApproved: false,
        createdAt: new Date()
      };
    }
  };

  // Login function
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);

    try {
      // Check mock users first for predefined test accounts
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser && foundUser.password === password) {
        // Use mock user data
        const { password: _, ...safeUser } = foundUser;
        
        // Ensure admin role for specific emails
        if (email === 'mkfmac7@gmail.com' || email === 'mk7869148e@gmail.com') {
          safeUser.roles = ['admin'];
          safeUser.department = 'Management';
        }
        
        setUser(safeUser);
        
        if (rememberMe) {
          localStorage.setItem('fmacUser', JSON.stringify(safeUser));
        }
        
        setLoading(false);
        navigate('/dashboard');
        return;
      }

      // Try Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userData = await convertFirebaseUser(firebaseUser);
      setUser(userData);
      
      if (rememberMe) {
        localStorage.setItem('fmacUser', JSON.stringify(userData));
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setLoading(false);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later');
      } else {
        throw new Error('Login failed. Please check your credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string, department: string) => {
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase user profile
      await updateFirebaseProfile(firebaseUser, {
        displayName: name
      });

      // Create user profile in Firestore with approval system
      const isAdmin = email === 'mkfmac7@gmail.com' || email === 'mk7869148e@gmail.com';
      const userProfile = {
        name: name,
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ea384c&color=fff`,
        roles: isAdmin ? ['admin'] : ['member'],
        department: department,
        isApproved: isAdmin, // Admin emails are auto-approved
        approvedBy: isAdmin ? firebaseUser.uid : null,
        approvedAt: isAdmin ? new Date() : null,
        createdAt: new Date()
      };

      await setDoc(doc(db, 'profiles', firebaseUser.uid), userProfile);

      // If admin, convert to our User type and set state
      if (isAdmin) {
        const userData = await convertFirebaseUser(firebaseUser);
        setUser(userData);
        
        toast({
          title: "Registration successful",
          description: "Your account has been created",
        });
        
        navigate('/dashboard');
      } else {
        // For regular users, sign them out and show approval message
        await signOut(auth);
        setUser(null);
        // Don't navigate to dashboard, let the signup page handle the success message
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setLoading(false);
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      } else {
        throw new Error('Registration failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }

    // Always clear local state
    setUser(null);
    localStorage.removeItem('fmacUser');
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (userData: Partial<User>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Cannot update profile when not logged in.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Update Firebase user profile
      if (userData.name) {
        await updateFirebaseProfile(auth.currentUser!, {
          displayName: userData.name
        });
      }

      // Update Firestore profile
      const profileData: any = {};
      if (userData.name) profileData.name = userData.name;
      if (userData.avatar) profileData.avatar = userData.avatar;
      if (userData.department) profileData.department = userData.department;
      
      // Only admins can update roles
      if (user.roles.includes('admin') && userData.roles) {
        profileData.roles = userData.roles;
      }

      await updateDoc(doc(db, 'profiles', user.id), profileData);

      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('fmacUser', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await convertFirebaseUser(firebaseUser);
          setUser(userData);
          localStorage.setItem('fmacUser', JSON.stringify(userData));
        } catch (error) {
          console.error('Error in auth state change:', error);
        }
      } else {
        // Check localStorage for stored user (for mock users)
        const storedUser = localStorage.getItem('fmacUser');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error('Failed to parse stored user:', error);
            localStorage.removeItem('fmacUser');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    register,
    signup: register, // Alias for register
    updateProfile
  };
};

