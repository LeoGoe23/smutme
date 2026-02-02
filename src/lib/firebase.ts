import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD8hvBG3P5wdeHh62FxguI-ORMdvjHi1kY",
  authDomain: "smutje-3a843.firebaseapp.com",
  projectId: "smutje-3a843",
  storageBucket: "smutje-3a843.firebasestorage.app",
  messagingSenderId: "927990934045",
  appId: "1:927990934045:web:208e1ee74f137e74abf4f4",
  measurementId: "G-1ZRWJPKBVD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only in browser
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
