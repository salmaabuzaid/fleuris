// app.js

// Get buttons and modals
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

// Optional: Close modal when clicking outside modal content
window.addEventListener('click', (e) => {
  if (e.target === loginModal) loginModal.classList.add('hidden');
  if (e.target === signupModal) signupModal.classList.add('hidden');
});
