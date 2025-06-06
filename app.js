//Initialize Supabase Client
const SUPABASE_URL = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bHpvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI2NDMsImV4cCI6MjA2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqhmIE65VIUpZsFpTbIVBt4w';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Grab UI elements
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const loginClose = document.getElementById('login-close');
const signupClose = document.getElementById('signup-close');

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

const productsList = document.getElementById('products-list');

// Show modals
loginBtn.addEventListener('click', () => {
  loginModal.classList.remove('hidden');
});

signupBtn.addEventListener('click', () => {
  signupModal.classList.remove('hidden');
});

// Open modals
loginBtn.addEventListener ('click', () => {
  loginModal.classList.remove('hidden');
});

signupBtn.addEventListener('click', () => {
  signupModal.classList.remove('hidden');
});

// Close modals
loginClose.addEventListener('click', () => {
  loginModal.classList.add('hidden');
  loginError.textContent = '';
  loginForm.reset();
});

signupClose.addEventListener('click', () => {
  signupModal.classList.add('hidden');
  signupError.textContent = '';
  signupForm.reset();
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    loginError.textContent = error.message;
  } else {
    loginError.textContent = '';
    loginForm.reset();
    loginModal.classList.add('hidden');
    // Save session if needed
    localStorage.setItem('supabaseSession', JSON.stringify(data.session));
    updateUIAfterLogin(data.user);
  }
});

// Check if user is already logged in on page load
window.addEventListener('load', async () => {
  const session = supabase.auth.getSession();
  if ((await session).data.session) {
    updateUIAfterLogin((await session).data.session.user);
  }

// Handle Signup
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    signupError.textContent = error.message;
  } else {
    signupError.textContent = 'Sign up successful! Please check your email to confirm.';
    signupForm.reset();
    // Optionally close the modal after some delay
    setTimeout(() => signupModal.classList.add('hidden'), 3000);
  }
});

// Update UI after login/logout
function updateUIAfterLogin(user) {
  // Hide login/signup buttons
  loginBtn.style.display = 'none';
  signupBtn.style.display = 'none';

  // Show welcome message or user profile (you can customize this)
  const header = document.querySelector('header');
  let userDiv = document.getElementById('user-info');
  if (!userDiv) {
    userDiv = document.createElement('div');
    userDiv.id = 'user-info';
    userDiv.style.marginLeft = 'auto';
    userDiv.style.color = '#333';
    header.appendChild(userDiv);
  }
  userDiv.textContent = `Welcome, ${user.email}`;

  // Optionally add logout button
  let logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) {
    logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.marginLeft = '10px';
    header.appendChild(logoutBtn);

    logoutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      localStorage.removeItem('supabaseSession');
      userDiv.remove();
      logoutBtn.remove();
      loginBtn.style.display = 'inline-block';
      signupBtn.style.display = 'inline-block';
    });
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
