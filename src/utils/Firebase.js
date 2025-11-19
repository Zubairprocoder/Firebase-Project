import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAksCRZD9zh3CVA75g9AeD9x5NtH3DX5zk",
  authDomain: "fir-setup-d85be.firebaseapp.com",
  projectId: "fir-setup-d85be",
  storageBucket: "fir-setup-d85be.firebasestorage.app",
  messagingSenderId: "111834511852",
  appId: "1:111834511852:web:797893484c91e6e9db68c9",
  measurementId: "G-60RDVVWK7E",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getDatabase(app);

export { auth, firestore, db };
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export default app;
