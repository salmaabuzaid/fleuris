//Initialize Supabase Client
const SUPABASE_URL = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bHpvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI2NDMsImV4cCI6MjA2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqhmIE65VIUpZsFpTbIVBt4w';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Grab UI elements
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const loginCloseBtn = document.getElementById('login-close');
const signupCloseBtn = document.getElementById('signup-close');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');
const productsList = document.getElementById('products-list');

// Show modals
loginBtn.onclick = () => {
  loginError.textContent = '';
  loginModal.classList.remove('hidden');
};

signupBtn.onclick = () => {
  signupError.textContent = '';
  signupModal.classList.remove('hidden');
};
// Open modals
loginBtn.addEventListener ('click', () => {
  loginModal.classList.remove('hidden');
});

signupBtn.addEventListener('click', () => {
  signupModal.classList.remove('hidden');
});

// Close modals
loginCloseBtn.onclick = () => loginModal.classList.add('hidden');
signupCloseBtn.onclick = () => signupModal.classList.add('hidden');

// Handle Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  const { data, error } = await signIn(email, password);
  if (error) {
    loginError.textContent = error.message;
  } else {
    loginModal.classList.add('hidden');
    alert('Login successful!');
    loadProducts();
    updateAuthUI();
  }
});

// Handle Signup
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  signupError.textContent = '';
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  const { user, error } = await signUp(email, password);
  if (error) {
    signupError.textContent = error.message;
  } else {
    signupModal.classList.add('hidden');
    alert('Signup successful! Please check your email to confirm.');
  }
});

// Update UI after login/logout
async function updateAuthUI() {
  const user = await getCurrentUser();
  if (user) {
    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    // Show logout button or user info here
  } else {
    loginBtn.style.display = 'inline-block';
    signupBtn.style.display = 'inline-block';
  }
}

// Load products and display
async function loadProducts() {
  const { data, error } = await fetchProducts();
  if (error) {
    productsList.innerHTML = `<p>Error loading products: ${error.message}</p>`;
    return;
  }
  productsList.innerHTML = '';

  if (!data || data.length === 0) {
    productsList.innerHTML = '<p>No products found.</p>';
    return;
  }

  data.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.image_url || 'https://via.placeholder.com/300x180?text=No+Image'}" alt="${product.name}" class="product-image" />
      <h3 class="product-title">${product.name}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
    `;
    productsList.appendChild(card);
  });
}

// Initial load
updateAuthUI();
loadProducts();
