import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCxxht9RmM5-C5kveRKvdDg9cbkD8FdIXc",
  authDomain: "styledecor-17.firebaseapp.com",
  projectId: "styledecor-17",
  storageBucket: "styledecor-17.firebasestorage.app",
  messagingSenderId: "708580334484",
  appId: "1:708580334484:web:406a1fc98a1403f8e70d81",
  measurementId: "G-V1MBQ3HZZL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);