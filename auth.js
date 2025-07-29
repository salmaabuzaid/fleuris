function toggleLogin() {
  document.getElementById('auth-modal').classList.toggle('hidden');
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCred) => {
      db.collection("users").doc(userCred.user.uid).get().then(doc => {
        const role = doc.data().role;
        window.location.href = role === 'seller' ? "seller.html" : "home.html";
      });
    })
    .catch((error) => alert(error.message));
}

function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCred) => {
      return db.collection("users").doc(userCred.user.uid).set({ role });
    })
    .then(() => alert("Signed up successfully!"))
    .catch((error) => alert(error.message));
}
