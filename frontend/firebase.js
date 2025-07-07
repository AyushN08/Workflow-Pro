import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAuvSfgoU7z3p02B9iv3ItvC6p4OuZDCdU",
  authDomain: "workflowpro-4ffd2.firebaseapp.com",
  projectId: "workflowpro-4ffd2",
  storageBucket: "workflowpro-4ffd2.firebasestorage.app",
  messagingSenderId: "290161992841",
  appId: "1:290161992841:web:4b1eeb8bb8c6456e461258"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
