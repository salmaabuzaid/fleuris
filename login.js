document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const loginError = document.getElementById('loginError');

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      loginError.textContent = '';
      alert('Login successful!');
      document.getElementById('loginModal').classList.remove('active');
      // You can redirect or update the UI here
    })
    .catch((error) => {
      loginError.textContent = error.message;
    });
});
