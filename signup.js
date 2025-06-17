const auth = firebase.auth();

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log("Redirecting to home.html...")
      window.location.href = "home.html"; // ✅ redirect immediately
    })
    .catch((error) => {
      document.getElementById("signupError").textContent = "Signup failed: " + error.message;
    });
});
