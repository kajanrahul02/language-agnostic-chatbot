import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  signInAnonymously,
  User 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRDclyySTjp37RcBCziU1vS_nmefUochE",
  authDomain: "theta-mesh-jcf5x.firebaseapp.com",
  projectId: "theta-mesh-jcf5x",
  storageBucket: "theta-mesh-jcf5x.firebasestorage.app",
  messagingSenderId: "216181710259",
  appId: "1:216181710259:web:af1eee3a57ae982c0f3fc6"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-6e0902cc-21f3-479a-9fe9-2c979a93979d");
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously
};
export type { User };
