import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBnK4q3-fA2BSq34MVbSn0pfFQcbA-cpCY",
  authDomain: "shsreg-bb2a1.firebaseapp.com",
  projectId: "shsreg-bb2a1",
  storageBucket: "shsreg-bb2a1.appspot.com",
  messagingSenderId: "13044370794",
  appId: "1:13044370794:web:7c0b67563fa6cd235ea913",
  measurementId: "G-22Z1363F66",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
const analytics = getAnalytics(app);
