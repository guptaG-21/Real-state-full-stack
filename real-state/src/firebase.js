// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-5699d.firebaseapp.com",
  projectId: "real-estate-5699d",
  storageBucket: "real-estate-5699d.appspot.com",
  messagingSenderId: "11708235646",
  appId: "1:11708235646:web:d46388b7c832e313f2fd2f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
