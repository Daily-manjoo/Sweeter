import { initializeApp, FirebaseApp, getApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

export let app: FirebaseApp; 

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

try { //처음 초기화가 됐으면 getApp을 가져오고 아니면 초기화
    app = getApp("app")
} catch(e){
    app= initializeApp(firebaseConfig, "app")
}
export const firebase = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default firebase;