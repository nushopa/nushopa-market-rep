import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA0PjctaYaZhaN0iTx0CYa3XjqKpmE5HHk",
  authDomain: "nushopa-3e02e.firebaseapp.com",
  projectId: "nushopa-3e02e",
  storageBucket: "nushopa-3e02e.firebasestorage.app",
  messagingSenderId: "53761534400",
  appId: "1:53761534400:web:03a379bd8cb94adaed4025",
  measurementId: "G-97JZ3DP6CE",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
let messagingPromise: Promise<ReturnType<typeof getMessaging> | null> | null =
  null;

export function getMessagingIfSupported() {
  if (!messagingPromise) {
    messagingPromise = isSupported().then((supported) =>
      supported ? getMessaging(app) : null,
    );
  }
  return messagingPromise;
}
