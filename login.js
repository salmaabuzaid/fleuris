const auth = firebase.auth();

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const errorDiv = document.getElementById("loginError");

  if (!email || !password) {
    errorDiv.textContent = "Please enter both email and password.";
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      errorDiv.textContent = "";
      window.location.href = "home.html";
    })
    .catch((error) => {
      errorDiv.textContent = "Login failed: " + error.message;
    });
});
