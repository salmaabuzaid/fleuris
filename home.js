// home.js
function openSettings() {
  document.getElementById("settingsModal").classList.remove("hidden");
}

function closeSettings() {
  document.getElementById("settingsModal").classList.add("hidden");
}

function signOut() {
  alert("Signing out...");
  // redirect to login later
}
