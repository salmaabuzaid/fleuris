// app.js

import { signUp, signIn, signOut, fetchProducts, getCurrentUser } from './api.js';

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginClose = document.getElementById('login-close');
const signupClose = document.getElementById('signup-close');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');
const productsList = document.getElementById('products-list');

// Show/Hide modals
function toggleModal(modal, show) {
  if (show) modal.classList.remove('hidden');
  else modal.classList.add('hidden');
}

// Clear form errors and inputs
function clearLoginForm() {
  loginForm.reset();
  loginError.textContent = '';
}
function clearSignupForm() {
  signupForm.reset();
  signupError.textContent = '';
}

// Event listeners to open modals
loginBtn.addEventListener('click', () => {
  toggleModal(loginModal, true);
  clearLoginForm();
});
signupBtn.addEventListener('click', () => {
  toggleModal(signupModal, true);
  clearSignupForm();
});

// Event listeners to close modals
loginClose.addEventListener('click', () => toggleModal(loginModal, false));
signupClose.addEventListener('click', () => toggleModal(signupModal, false));

// Login form submit
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';

  const email = loginForm['login-email'].value.trim();
  const password = loginForm['login-password'].value;

  const { data, error } = await signIn(email, password);

  if (error) {
    loginError.textContent = error.message;
  } else {
    toggleModal(loginModal, false);
    alert('Login successful!');
    updateUIAfterLogin();
  }
});

// Signup form submit
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  signupError.textContent = '';

  const email = signupForm['signup-email'].value.trim();
  const password = signupForm['signup-password'].value;

  const { user, error } = await signUp(email, password);

  if (error) {
    signupError.textContent = error.message;
  } else {
    toggleModal(signupModal, false);
    alert('Sign up successful! Please check your email to confirm.');
  }
});

// Update UI after login
async function updateUIAfterLogin() {
  const user = await getCurrentUser();
  if (user) {
    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';

    // Add logout button
    let logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) {
      logoutBtn = document.createElement('button');
      logoutBtn.id = 'logout-btn';
      logoutBtn.textContent = 'Logout';
      logoutBtn.style.marginLeft = '10px';
      document.querySelector('.auth-buttons').appendChild(logoutBtn);

      logoutBtn.addEventListener('click', async () => {
        await signOut();
        logoutBtn.remove();
        loginBtn.style.display = 'inline-block';
        signupBtn.style.display = 'inline-block';
        alert('Logged out successfully!');
      });
    }
  }
}

// Display products in the feed
async function displayProducts() {
  const { data: products, error } = await fetchProducts();
  if (error) {
    productsList.innerHTML = `<p class="error-msg">Failed to load products: ${error.message}</p>`;
    return;
  }
  if (!products || products.length === 0) {
    productsList.innerHTML = '<p>No products found.</p>';
    return;
  }

  productsList.innerHTML = '';
  products.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
      <img src="${product.image_url || 'placeholder.png'}" alt="${product.name}" class="product-image" />
      <h3>${product.name}</h3>
      <p class="product-description">${product.description || ''}</p>
      <p class="product-price">$${product.price.toFixed(2)}</p>
    `;

    productsList.appendChild(productCard);
  });
}

// Initial load
window.addEventListener('DOMContentLoaded', async () => {
  await updateUIAfterLogin();
  await displayProducts();
});
