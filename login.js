const auth = firebase.auth();

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("loginError").textContent = "Login successful!";
      setTimeout(() => {
        window.location.href = "home.html"; // ensure correct path!
      }, 1000);
    })
    .catch((error) => {
      document.getElementById("loginError").textContent = "Login failed: " + error.message;
    });
});
