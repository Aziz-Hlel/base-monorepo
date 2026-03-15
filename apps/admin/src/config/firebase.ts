// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
// ! fix this it s wrong it can get you this erro in production :
// Uncaught FirebaseError: Firebase: No Firebase App '[DEFAULT]' has been created - call initializeApp() first (app/no-app).

const firebaseConfig = {
  apiKey: 'AIzaSyDWKplAl5Vp43pG0j5j3vnThRJIPwv1E44',
  authDomain: 'uber-588cf.firebaseapp.com',
  projectId: 'uber-588cf',
  storageBucket: 'uber-588cf.firebasestorage.app',
  messagingSenderId: '371351638566',
  appId: '1:371351638566:web:16c040ae9fb03d5382cce7',
  measurementId: 'G-DH71YEDZKQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

export const firebaseAuth = getAuth(app);
