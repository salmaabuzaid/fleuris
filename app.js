import { signUp, signIn, signOut, fetchProducts, getCurrentUser } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('app.js loaded ✅');

  // Auth buttons
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');

  // Modals
  const loginModal = document.getElementById('login-modal');
  const signupModal = document.getElementById('signup-modal');
  const loginClose = document.getElementById('login-close');
  const signupClose = document.getElementById('signup-close');

  // Forms
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loginError = document.getElementById('login-error');
  const signupError = document.getElementById('signup-error');

  // Show modals
  loginBtn?.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
  });

  signupBtn?.addEventListener('click', () => {
    signupModal.classList.remove('hidden');
  });

  // Hide modals
  loginClose?.addEventListener('click', () => {
    loginModal.classList.add('hidden');
  });

  signupClose?.addEventListener('click', () => {
    signupModal.classList.add('hidden');
  });

  // Login handler
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const { data, error } = await signIn(email, password);

    if (error) {
      loginError.textContent = error.message;
    } else {
      loginError.textContent = '';
      loginModal.classList.add('hidden');
      alert('Logged in!');
      // Optional: Refresh products or show user data
    }
  });

  // Signup handler
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const { user, error } = await signUp(email, password);

    if (error) {
      signupError.textContent = error.message;
    } else {
      signupError.textContent = '';
      signupModal.classList.add('hidden');
      alert('Signup successful!');
    }
  });

  // Fetch products
  async function loadProducts() {
    const { data, error } = await fetchProducts();
    const container = document.getElementById('products-list');
    if (error) {
      container.innerHTML = `<p>Error loading products: ${error.message}</p>`;
    } else {
      container.innerHTML = data
        .map(
          (product) => `
        <div class="product-card">
          <h4>${product.name}</h4>
          <p>${product.description}</p>
          <strong>${product.price} coins</strong>
        </div>
      `
        )
        .join('');
    }
  }

  loadProducts();
});
