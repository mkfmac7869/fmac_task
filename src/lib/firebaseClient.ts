import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC-qbrtW4VluVn-b1tfvatozee3HF5Q344",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fmactasks.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fmactasks",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fmactasks.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "289312359559",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:289312359559:web:d91b0b241b9aece596a422",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8FGY9FGRTL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics and get a reference to the service
export const analytics = getAnalytics(app);

// Connect to emulators in development (optional)
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if you want to use Firebase emulators
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

export default app;
