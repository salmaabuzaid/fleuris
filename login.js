// login.js
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Login successful!");
      window.location.href = "home.html"; // Redirect to homepage
    })
    .catch((error) => {
      loginError.textContent = error.message;
    });
});
