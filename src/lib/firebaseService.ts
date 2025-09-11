import { 
  collection, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  or,
  and,
  limit,
  startAfter,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebaseClient';
import { auth } from './firebaseClient';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Generic CRUD operations for Firestore
export class FirebaseService {
  // Add a document to a collection
  static async addDocument(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  }

  // Update a document
  static async updateDocument(collectionName: string, docId: string, data: any) {
    try {
      console.log(`Updating document in ${collectionName} with ID: ${docId}`, data);
      const docRef = doc(db, collectionName, docId);
      console.log('Document reference:', docRef.path);
      
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      console.log(`Successfully updated document ${docId} in ${collectionName}`);
      return { id: docId, ...data };
    } catch (error) {
      console.error(`Error updating document in ${collectionName} with ID ${docId}:`, error);
      throw error;
    }
  }

  // Delete a document
  static async deleteDocument(collectionName: string, docId: string) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      return true;
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }

  // Get all documents from a collection
  static async getDocuments(collectionName: string, conditions?: any[]) {
    try {
      let q;
      
      if (conditions && conditions.length > 0) {
        const whereConditions = conditions.map(condition => where(condition.field, condition.operator, condition.value));
        q = query(collection(db, collectionName), ...whereConditions);
      } else {
        q = query(collection(db, collectionName));
      }
      
      const querySnapshot = await getDocs(q);
      const documents: any[] = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...(doc.data() as any) });
      });
      
      return documents;
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  // Get documents with ordering
  static async getDocumentsOrdered(collectionName: string, orderByField: string, orderDirection: 'asc' | 'desc' = 'desc', conditions?: any[]) {
    try {
      let q;
      
      if (conditions && conditions.length > 0) {
        const whereConditions = conditions.map(condition => where(condition.field, condition.operator, condition.value));
        q = query(collection(db, collectionName), ...whereConditions, orderBy(orderByField, orderDirection));
      } else {
        q = query(collection(db, collectionName), orderBy(orderByField, orderDirection));
      }
      
      const querySnapshot = await getDocs(q);
      const documents: any[] = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...(doc.data() as any) });
      });
      
      return documents;
    } catch (error) {
      console.error(`Error getting ordered documents from ${collectionName}:`, error);
      throw error;
    }
  }

  // Get a single document by ID
  static async getDocument(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }

  // Get documents with OR conditions
  static async getDocumentsWithOr(collectionName: string, conditions: any[]) {
    try {
      const q = query(collection(db, collectionName), or(...conditions.map(c => where(c.field, c.operator, c.value))));
      const querySnapshot = await getDocs(q);
      const documents: any[] = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...(doc.data() as any) });
      });
      
      return documents;
    } catch (error) {
      console.error(`Error getting documents with OR from ${collectionName}:`, error);
      throw error;
    }
  }

  // Upsert a document (update if exists, create if not)
  static async upsertDocument(collectionName: string, docId: string, data: any) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          ...data,
          updatedAt: serverTimestamp()
        });
        return { id: docId, ...data };
      } else {
        await setDoc(docRef, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return { id: docId, ...data };
      }
    } catch (error) {
      console.error(`Error upserting document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Batch operations
  static async batchWrite(operations: Array<{type: 'add' | 'update' | 'delete', collection: string, id?: string, data?: any}>) {
    try {
      const batch = writeBatch(db);
      
      operations.forEach(op => {
        if (op.type === 'add' && op.data) {
          const docRef = doc(collection(db, op.collection));
          batch.set(docRef, { ...op.data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        } else if (op.type === 'update' && op.id && op.data) {
          const docRef = doc(db, op.collection, op.id);
          batch.update(docRef, { ...op.data, updatedAt: serverTimestamp() });
        } else if (op.type === 'delete' && op.id) {
          const docRef = doc(db, op.collection, op.id);
          batch.delete(docRef);
        }
      });
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error in batch write:', error);
      throw error;
    }
  }
}

// Specific service methods for common operations
export const TaskService = {
  // Add task activity
  addActivity: async (taskId: string, userId: string, action: string, details?: any) => {
    return FirebaseService.addDocument('task_activities', {
      task_id: taskId,
      user_id: userId,
      action,
      details: details || {},
      timestamp: serverTimestamp()
    });
  },

  // Get task activities
  getActivities: async (taskId: string) => {
    return FirebaseService.getDocuments('task_activities', [
      { field: 'task_id', operator: '==', value: taskId }
    ]);
  }
};

export const ProjectService = {
  // Get projects for user
  getProjects: async (userId: string, userRole: string, userDepartment?: string) => {
    try {
      console.log('ProjectService.getProjects called with:', { userId, userRole, userDepartment });
      
      if (userRole === 'admin') {
        console.log('Admin user - fetching all projects');
        const projects = await FirebaseService.getDocuments('projects');
        console.log('Admin projects fetched:', projects);
        return projects;
      } else {
        // For non-admin users, get projects where:
        // 1. User is a member of the project
        // 2. Project belongs to user's department (if user has department)
        // 3. User created the project
        
        console.log('Non-admin user - fetching projects where user is member, department matches, or user created');
        
        // Get all projects first
        const allProjects = await FirebaseService.getDocuments('projects');
        console.log('All projects fetched:', allProjects);
        
        // Filter projects based on user access
        const userProjects = allProjects.filter(project => {
          // Check if user is a member of the project
          const isMember = project.members && project.members.some((member: any) => 
            member.id === userId || (typeof member === 'string' && member === userId)
          );
          
          // Check if project belongs to user's department
          const isDepartmentProject = userDepartment && project.department === userDepartment;
          
          // Check if user created the project
          const isCreatedByUser = project.created_by === userId;
          
          return isMember || isDepartmentProject || isCreatedByUser;
        });
        
        console.log('Filtered user projects:', userProjects);
        return userProjects;
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }
};

// Authentication Service
export const AuthService = {
  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Get current session
  getSession: async () => {
    const user = auth.currentUser;
    return {
      data: {
        session: user ? {
          user: {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          }
        } : null
      }
    };
  },

  // Sign up with email and password
  signUp: async (email: string, password: string, userData?: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile
      if (userData) {
        const isAdmin = user.email === 'mkfmac7@gmail.com' || user.email === 'mk7869148e@gmail.com';
        await FirebaseService.upsertDocument('profiles', user.uid, {
          email: user.email,
          name: userData.name || user.displayName || 'User',
          role: isAdmin ? 'admin' : (userData.role || 'member'),
          department: isAdmin ? 'Management' : (userData.department || 'General'),
          avatar: userData.avatar || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=ea384c&color=fff`
        });
      }
      
      return { data: { user }, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { data: { user: userCredential.user }, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};

// User/Profile Service
export const UserService = {
  // Get all users
  getUsers: async () => {
    return FirebaseService.getDocuments('profiles');
  },

  // Get users by department
  getUsersByDepartment: async (department: string) => {
    return FirebaseService.getDocuments('profiles', [
      { field: 'department', operator: '==', value: department }
    ]);
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<any> => {
    const user = await FirebaseService.getDocument('profiles', userId);
    return user || null;
  },

  // Create or update user profile
  upsertProfile: async (userId: string, profileData: any) => {
    return FirebaseService.upsertDocument('profiles', userId, profileData);
  },

  // Update user profile
  updateProfile: async (userId: string, profileData: any) => {
    return FirebaseService.updateDocument('profiles', userId, profileData);
  },

  // Delete user profile
  deleteProfile: async (userId: string) => {
    return FirebaseService.deleteDocument('profiles', userId);
  }
};

// Department Service
export const DepartmentService = {
  // Get all departments
  getDepartments: async () => {
    return FirebaseService.getDocumentsOrdered('departments', 'name', 'asc');
  },

  // Get department by ID
  getDepartmentById: async (departmentId: string) => {
    return FirebaseService.getDocument('departments', departmentId);
  },

  // Create department
  createDepartment: async (departmentData: any) => {
    return FirebaseService.addDocument('departments', departmentData);
  },

  // Update department
  updateDepartment: async (departmentId: string, departmentData: any) => {
    return FirebaseService.updateDocument('departments', departmentId, departmentData);
  },

  // Delete department
  deleteDepartment: async (departmentId: string) => {
    return FirebaseService.deleteDocument('departments', departmentId);
  }
};

// Comment Service
export const CommentService = {
  // Get comments for a task
  getComments: async (taskId: string) => {
    return FirebaseService.getDocumentsOrdered('comments', 'createdAt', 'asc', [
      { field: 'taskId', operator: '==', value: taskId }
    ]);
  },

  // Add comment
  addComment: async (commentData: any) => {
    return FirebaseService.addDocument('comments', commentData);
  },

  // Update comment
  updateComment: async (commentId: string, commentData: any) => {
    return FirebaseService.updateDocument('comments', commentId, commentData);
  },

  // Delete comment
  deleteComment: async (commentId: string) => {
    return FirebaseService.deleteDocument('comments', commentId);
  }
};

// Notification Service (for email notifications)
export const NotificationService = {
  // Send task notification (mock implementation)
  sendTaskNotification: async (taskId: string, userId: string, type: string) => {
    // This would integrate with your email service
    console.log(`Sending ${type} notification for task ${taskId} to user ${userId}`);
    return { success: true };
  }
};

// Admin Management Service
export const AdminService = {
  // Ensure specific email addresses are admin
  ensureAdminRole: async (email: string) => {
    try {
      // Get all users and find the one with this email
      const users = await UserService.getUsers();
      const user = users.find(u => u.email === email);
      
      if (user) {
        // Update the user to be admin
        await UserService.updateProfile(user.id, {
          role: 'admin',
          department: 'Management'
        });
        console.log(`Updated ${email} to admin role`);
        return true;
      } else {
        console.log(`User with email ${email} not found`);
        return false;
      }
    } catch (error) {
      console.error('Error ensuring admin role:', error);
      return false;
    }
  },

  // Make mkfmac7@gmail.com admin
  makeMkfmacAdmin: async () => {
    return AdminService.ensureAdminRole('mkfmac7@gmail.com');
  },

  // Force update specific user by UID to admin
  forceUpdateUserToAdmin: async (uid: string, email: string) => {
    try {
      await FirebaseService.updateDocument('profiles', uid, {
        role: 'admin',
        department: 'Management',
        email: email
      });
      console.log(`Force updated user ${email} (${uid}) to admin role`);
      return true;
    } catch (error) {
      console.error('Error force updating user to admin:', error);
      return false;
    }
  }
};

