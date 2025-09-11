import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-qbrtW4VluVn-b1tfvatozee3HF5Q344",
  authDomain: "fmactasks.firebaseapp.com",
  projectId: "fmactasks",
  storageBucket: "fmactasks.firebasestorage.app",
  messagingSenderId: "289312359559",
  appId: "1:289312359559:web:d91b0b241b9aece596a422",
  measurementId: "G-8FGY9FGRTL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics and get a reference to the service
export const analytics = getAnalytics(app);

// Connect to emulators in development (optional)
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if you want to use Firebase emulators
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

export default app;
