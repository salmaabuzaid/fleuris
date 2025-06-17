const auth = firebase.auth();

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log("Redirecting to home.html...");
      window.location.href = "home.html"; // ✅ redirect immediately
    })
    .catch((error) => {
      document.getElementById("loginError").textContent = "Login failed: " + error.message;
    });
});
