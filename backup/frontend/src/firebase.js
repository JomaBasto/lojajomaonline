import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwKdkDJCViVvvcfaxZ35_GGnRl5KQUKOU",
  authDomain: "loja-online-a21b1.firebaseapp.com",
  projectId: "loja-online-a21b1",
  storageBucket: "loja-online-a21b1.firebasestorage.app",
  messagingSenderId: "392700891313",
  appId: "1:392700891313:web:d89997a94e6136a5289290",
  measurementId: "G-DZ1NCEKG3B"
};

// 🚀 Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 📦 Firestore (produtos)
export const db = getFirestore(app);

// 🖼️ Storage (imagens)
export const storage = getStorage(app);

// 🔐 Authentication (login)
export const auth = getAuth(app);