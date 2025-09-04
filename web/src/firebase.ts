import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIXaEXayeQNiYniOhI-f2DJvdLSetVH0s",
  authDomain: "dealvox-256d2.firebaseapp.com",
  projectId: "dealvox-256d2",
  storageBucket: "dealvox-256d2.firebasestorage.app",
  messagingSenderId: "556311536192",
  appId: "1:556311536192:web:e968a6eca264b6df8575a5",
  measurementId: "G-263625S65C"
};

console.log("Firebase config", firebaseConfig); // debug

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);