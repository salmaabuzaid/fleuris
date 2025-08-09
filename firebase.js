firebase.js
// firebase.js - initialize Firebase (modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
apiKey: "AIzaSyCsdhxMCfV15JCNmD6XZmfE5Z2T3E98ooY",
authDomain: "fleuris-9e1e0.firebaseapp.com",
projectId: "fleuris-9e1e0",
storageBucket: "fleuris-9e1e0.firebasestorage.app",
messagingSenderId: "12494596058",
appId: "1:12494596058:web:90261d262678abc21982e3",
measurementId: "G-QC4FZJC4XH"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
