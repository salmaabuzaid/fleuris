// Firebase Login Script

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAx7DAvkZupSDXg4aXWvtfSQWhqX32Kwrs",
  authDomain: "fleuris-3df99.firebaseapp.com",
  projectId: "fleuris-3df99",
  storageBucket: "fleuris-3df99.appspot.com",
  messagingSenderId: "831344111439",
  appId: "1:831344111439:web:YOUR_APP_ID" // Optional
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Debug: catch all errors
window.addEventListener("error", function(e) {
  alert("JavaScript Error: " + e.message);
});

// Login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById("loginError").textContent = "Login successful!";
      console.log("Redirecting to home...");
      location.replace("home.html");
    })
    .catch((error) => {
      document.getElementById("loginError").textContent = "Login failed: " + error.message;
    });
});
