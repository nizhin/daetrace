// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCG5rGAtx0reT03xXM7Q9_epwd3HkLJEOE",
  authDomain: "daetrace1.firebaseapp.com",
  projectId: "daetrace1",
  storageBucket: "daetrace1.firebasestorage.app",
  messagingSenderId: "359895119451",
  appId: "1:359895119451:web:4e03b950c4bae8f1a8f17e"
};
// Initialize Firebase

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
