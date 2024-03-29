// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaNbM4PE1N1DJe-5Ct_k8VwrnDysrAmFo",
  authDomain: "loc-eat-ddb73.firebaseapp.com",
  databaseURL: "https://loc-eat-ddb73-default-rtdb.firebaseio.com",
  projectId: "loc-eat-ddb73",
  storageBucket: "loc-eat-ddb73.appspot.com",
  messagingSenderId: "218068046091",
  appId: "1:218068046091:web:cbb7d180afb5e8ad68120e",
  measurementId: "G-SJXL8MMXYH"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Initialize database
export const db = getDatabase(app);
export const db_auth = getAuth(app);
export { app, storage, firebase };
