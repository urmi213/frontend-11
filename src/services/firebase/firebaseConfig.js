// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRRKfotFjJ87MPM97zWh_YQaPXZRMhv2k",
  authDomain: "blood-donation-app-ce260.firebaseapp.com",
  projectId: "blood-donation-app-ce260",
  storageBucket: "blood-donation-app-ce260.firebasestorage.app",
  messagingSenderId: "666472718706",
  appId: "1:666472718706:web:083e15dbb48f05a0e7bdeb",
  measurementId: "G-5808VQTF0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);