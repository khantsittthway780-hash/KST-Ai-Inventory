
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBhlCw37UfAhd1rWrk3Puii5rRdwFB6dtI",
  authDomain: "kst-ai-inventory.firebaseapp.com",
  projectId: "kst-ai-inventory",
  storageBucket: "kst-ai-inventory.firebasestorage.app",
  messagingSenderId: "249803088991",
  appId: "1:249803088991:web:bdf1ef261b7aa56176a7ea",
measurementId: "G-E29ML4KXX6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);