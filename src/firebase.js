// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBZxtc-FK5LGndL48JOd78ygXM75EYh3E4",
    authDomain: "suits-db11e.firebaseapp.com",
    projectId: "suits-db11e",
    storageBucket: "suits-db11e.firebasestorage.app",
    messagingSenderId: "686549587585",
    appId: "1:686549587585:web:659e46ca603a530c9f9f80",
    measurementId: "G-RJCP27RL7M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en"
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account',
    // This helps prevent COOP issues by using a more compatible authentication flow
    authType: 'signInWithPopup'
});

export { auth, provider };
