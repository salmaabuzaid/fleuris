const auth = firebase.auth();

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const errorDiv = document.getElementById("signupError");

  if (!email || !password) {
    errorDiv.textContent = "Please enter both email and password.";
    return;
  }

  if (password.length < 6) {
    errorDiv.textContent = "Password must be at least 6 characters long.";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      errorDiv.textContent = "";
      window.location.href = "home.html";
    })
    .catch((error) => {
      errorDiv.textContent = "Signup failed: " + error.message;
    });
});
