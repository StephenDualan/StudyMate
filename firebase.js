// firebase/index.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPk60oFbDIjGm8e4kOrCUScGCh7L6r1BY",
  authDomain: "studymate-5bb3d.firebaseapp.com",
  projectId: "studymate-5bb3d",
  storageBucket: "studymate-5bb3d.firebasestorage.app",
  messagingSenderId: "842541554550",
  appId: "1:842541554550:web:036b52c4bdb925bbbd7857",
};

// Initialize Firebase only if no app exists
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);
export const firebase = app;

// Export collections
export const tasksCol = collection(db, "tasks");
export const usersCol = collection(db, "users");