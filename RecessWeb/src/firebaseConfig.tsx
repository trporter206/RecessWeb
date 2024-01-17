// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDBexMC6W-8xyUZcMVQ7sgK-sym-x-s29Y",
  authDomain: "recessweb.firebaseapp.com",
  projectId: "recessweb",
  storageBucket: "recessweb.appspot.com",
  messagingSenderId: "1052373042964",
  appId: "1:1052373042964:web:6ce37c369edcf5fddee401",
  measurementId: "G-HY20Y0WCFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);