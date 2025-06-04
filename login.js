document.getElementById("login-form")?.addEventListener("submit", e => {
  e.preventDefault();
  alert("Logged in as " + document.getElementById("login-username").value);
});
document.getElementById("signup-form")?.addEventListener("submit", e => {
  e.preventDefault();
  alert("Signed up as " + document.getElementById("signup-username").value);
});