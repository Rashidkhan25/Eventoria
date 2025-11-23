
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCgQhUe2F6T59chhkPDHZ0QgjPJpe6Pz_0",
  authDomain: "eventoria-9da08.firebaseapp.com",
  projectId: "eventoria-9da08",
  storageBucket: "eventoria-9da08.firebasestorage.app",
  messagingSenderId: "1081916400444",
  appId: "1:1081916400444:web:f28cd875473e04b5bd3439",
  measurementId: "G-YE8TKZ66BX"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
