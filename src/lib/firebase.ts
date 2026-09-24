import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAcmXOGYwzEt6DyBornKcgVoMy8het4CBs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "infinitygram916-40f78.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "infinitygram916-40f78",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "infinitygram916-40f78.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "905035058108",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:905035058108:web:e4b2ebb90458a4fdc539b9",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-8K8R4WB1F8"
};

// Initialize Firebase App singleton for Next.js SSR/CSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = typeof window !== "undefined" 
  ? initializeFirestore(app, { experimentalForceLongPolling: true }) 
  : getFirestore(app);
export const storage = getStorage(app);

// Analytics runs only on client browser
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
