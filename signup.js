// signup.js
const signupForm = document.getElementById("signupForm");
const signupError = document.getElementById("signupError");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Account created successfully!");
      window.location.href = "home.html"; // Redirect to homepage
    })
    .catch((error) => {
      signupError.textContent = error.message;
    });
});
