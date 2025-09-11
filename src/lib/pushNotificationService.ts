import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

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

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

// VAPID key for web push notifications
const VAPID_KEY = 'iut8rVwjmxfJ1ZNZ0-3yVBwA-3z37I8ZkYeNXIPVxq8';

// Request permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });
      
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Listen for foreground messages
export const onForegroundMessage = () => {
  return onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    
    // Show notification
    if (payload.notification) {
      const notification = new Notification(payload.notification.title || 'New Notification', {
        body: payload.notification.body,
        icon: payload.notification.icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: payload.data?.taskId || 'default',
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'View Task',
            icon: '/favicon.ico'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/favicon.ico'
          }
        ]
      });

      notification.onclick = () => {
        window.focus();
        if (payload.data?.taskId) {
          window.location.href = `/tasks/${payload.data.taskId}`;
        }
        notification.close();
      };
    }
  });
};

// Save FCM token to user profile
export const saveFCMToken = async (userId: string, token: string) => {
  try {
    const { FirebaseService } = await import('./firebaseService');
    await FirebaseService.updateDocument('profiles', userId, {
      fcmToken: token,
      lastTokenUpdate: new Date().toISOString()
    });
    console.log('FCM token saved to user profile');
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

// Initialize push notifications
export const initializePushNotifications = async (userId: string) => {
  try {
    // Request permission and get token
    const token = await requestNotificationPermission();
    
    if (token) {
      // Save token to user profile
      await saveFCMToken(userId, token);
      
      // Set up foreground message listener
      onForegroundMessage();
      
      console.log('Push notifications initialized successfully');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return false;
  }
};
