// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCSHROdIT3cB82Ho0MLjoFpiUK_PWK6x3E',
  authDomain: 'collab-docs-f9243.firebaseapp.com',
  projectId: 'collab-docs-f9243',
  storageBucket: 'collab-docs-f9243.firebasestorage.app',
  messagingSenderId: '801480606494',
  appId: '1:801480606494:web:806b582693a1d64f8ebf0f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
