import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB8eGdqVwm7NmugLQRt4poS50D000bGAqg',
  authDomain: 'nwitter-reloaded-389b2.firebaseapp.com',
  projectId: 'nwitter-reloaded-389b2',
  storageBucket: 'nwitter-reloaded-389b2.appspot.com',
  messagingSenderId: '650332771822',
  appId: '1:650332771822:web:2da75dde6347218d876aff',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); //우리의 app

export const auth = getAuth(app); // app에 대한 인증 서비스를 사용하고 싶다
export const db = getFirestore(app);

export const storage = getStorage(app);
