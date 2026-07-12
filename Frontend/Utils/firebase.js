// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "multi-agent-chatbot-e91ec.firebaseapp.com",
  projectId: "multi-agent-chatbot-e91ec",
  storageBucket: "multi-agent-chatbot-e91ec.firebasestorage.app",
  messagingSenderId: "760257928263",
  appId: "1:760257928263:web:bc9a4fbb8ee8f074406562"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
