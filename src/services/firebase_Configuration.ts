// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHKRwKq8e9Q5s7aScR3vkAWJn8glSyROg",
  authDomain: "the-vintage-car-community.firebaseapp.com",
  projectId: "the-vintage-car-community",
  storageBucket: "the-vintage-car-community.appspot.com",
  messagingSenderId: "615107530483",
  appId: "1:615107530483:web:9bbd741cf84d4218e57186",
  measurementId: "G-CW6TH4DXKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };