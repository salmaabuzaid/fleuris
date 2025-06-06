// Initialize Supabase Client
const SUPABASE_URL = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_REAL_SUPABASE_KEY'; // Replace this with the real key (you already have it)
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
loginBtn?.addEventListener('click', () => loginModal.classList.remove('hidden'));
signupBtn?.addEventListener('click', () => signupModal.classList.remove('hidden'));

// Close modals
loginClose?.addEventListener('click', () => {
  loginModal.classList.add('hidden');
  loginError.textContent = '';
  loginForm.reset();
});
signupClose?.addEventListener('click', () => {
  signupModal.classList.add('hidden');
  signupError.textContent = '';
  signupForm.reset();
});

// Handle Login
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    loginError.textContent = error.message;
  } else {
    loginError.textContent = '';
    loginForm.reset();
    loginModal.classList.add('hidden');
    updateUIAfterLogin(data.user);
  }
});

// Handle Signup
signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    signupError.textContent = error.message;
  } else {
    signupError.textContent = 'Sign up successful! Check your email to confirm.';
    signupForm.reset();
    setTimeout(() => signupModal.classList.add('hidden'), 3000);
  }
});

// Check session on load
window.addEventListener('load', async () => {
  const { data, error } = await supabase.auth.getSession();
  if (data.session) {
    updateUIAfterLogin(data.session.user);
  }
  loadProducts(); // Load products on page load
});

// Update UI after login
function updateUIAfterLogin(user) {
  loginBtn.style.display = 'none';
  signupBtn.style.display = 'none';

  let userDiv = document.getElementById('user-info');
  if (!userDiv) {
    userDiv = document.createElement('div');
    userDiv.id = 'user-info';
    userDiv.textContent = `Welcome, ${user.email}`;
    userDiv.style.marginLeft = 'auto';
    document.querySelector('header').appendChild(userDiv);
  }

  let logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) {
    logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.marginLeft = '10px';
    document.querySelector('header').appendChild(logoutBtn);

    logoutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      userDiv.remove();
      logoutBtn.remove();
      loginBtn.style.display = 'inline-block';
      signupBtn.style.display = 'inline-block';
    });
  }
}

// Fetch products from Supabase
async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  return { data, error };
}

// Load and display products
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
      <img src="${product.image_url || 'https://via.placeholder.com/300x180'}" alt="${product.name}" class="product-image">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
    `;
    productsList.appendChild(card);
  });
}
