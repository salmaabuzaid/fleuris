document.getElementById('signupForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const signupError = document.getElementById('signupError');

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      signupError.textContent = '';
      alert('Account created successfully!');
      document.getElementById('signupModal').classList.remove('active');
      // Optionally redirect or show user info
    })
    .catch((error) => {
      signupError.textContent = error.message;
    });
});
