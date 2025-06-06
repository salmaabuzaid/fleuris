// === Modal Handling ===
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const loginClose = document.getElementById('login-close');
const signupClose = document.getElementById('signup-close');

// Open modals
loginBtn.addEventListener('click', () => {
  loginModal.classList.remove('hidden');
});

signupBtn.addEventListener('click', () => {
  signupModal.classList.remove('hidden');
});

// Close modals
loginClose.addEventListener('click', () => {
  loginModal.classList.add('hidden');
});

signupClose.addEventListener('click', () => {
  signupModal.classList.add('hidden');
});

// Optional: Close modals when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === loginModal) loginModal.classList.add('hidden');
  if (e.target === signupModal) signupModal.classList.add('hidden');
});

// === Authentication Handling ===

// Sign Up
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const { user, error } = await signUp(email, password);

  if (error) {
    signupError.textContent = error.message;
  } else {
    signupError.textContent = '';
    signupForm.reset();
    signupModal.classList.add('hidden');
    window.location.href = "home.html"; // 🔄 Redirect after signup
  }
});

// Log In
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { data, error } = await signIn(email, password);

  if (error) {
    loginError.textContent = error.message;
  } else {
    loginError.textContent = '';
    loginForm.reset();
    loginModal.classList.add('hidden');
    window.location.href = "home.html"; // 🔄 Redirect after login
  }
});
