// Firebase Signup Script

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

// Sign Up
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById("signupError").textContent = "Account created successfully!";
      console.log("Redirecting to home...");
      location.replace("home.html");
    })
    .catch((error) => {
      document.getElementById("signupError").textContent = "Signup failed: " + error.message;
    });
});
