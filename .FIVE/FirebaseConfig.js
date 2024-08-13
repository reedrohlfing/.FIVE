// Import Firebase dependencies for web
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhP6HaQSOu4PG6juXCyKBKENRimWVMdwI",
  authDomain: "dotfive-df9ca.firebaseapp.com",
  projectId: "dotfive-df9ca",
  storageBucket: "dotfive-df9ca.appspot.com",
  messagingSenderId: "516953156478",
  appId: "1:516953156478:web:ee8aa30c83a2bd6ea4212f",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const FIREBASE_FUNCS = getFunctions(FIREBASE_APP);
