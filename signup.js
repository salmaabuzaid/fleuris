const auth = firebase.auth();

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("signupError").textContent = "Account created successfully!";
      setTimeout(() => {
        window.location.href = "home.html"; // ensure correct path!
      }, 1000);
    })
    .catch((error) => {
      document.getElementById("signupError").textContent = "Signup failed: " + error.message;
    });
});
