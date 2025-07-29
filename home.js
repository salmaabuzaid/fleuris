import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAx7DAvkZupSDXg4aXWvtfSQWhqX32Kwrs",
  authDomain: "fleuris-3df99.firebaseapp.com",
  projectId: "fleuris-3df99",
  storageBucket: "fleuris-3df99.appspot.com",
  messagingSenderId: "831344111439",
  appId: "1:831344111439:web:YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

// Settings modal
const settingsBtn = document.getElementById('settings-btn');
const modal = document.getElementById('settings-modal');
const closeBtn = document.getElementById('close-settings');
settingsBtn.onclick = () => modal.classList.remove('hidden');
closeBtn.onclick = () => modal.classList.add('hidden');

// Logout
document.getElementById("logout-btn").onclick = () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
