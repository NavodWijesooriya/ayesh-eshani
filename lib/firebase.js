// Firebase web config (these values are public by design — security is enforced by firestore.rules)
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoTMgRCeRIX0fHzhGdveYgJwGWTxcuSmg",
  authDomain: "eshani-ayesh.firebaseapp.com",
  projectId: "eshani-ayesh",
  storageBucket: "eshani-ayesh.firebasestorage.app",
  messagingSenderId: "828306487362",
  appId: "1:828306487362:web:be85eeaa20bd6f6e7b95db",
  measurementId: "G-NJ3XGMX6J8",
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const RSVPS = "rsvps";
