// app.js

// 1. Initialize Supabase client
const SUPABASE_URL = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bHpvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI2NDMsImV4cCI6MjA2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqhmIE65VIUpZsFpTbIVBt4w';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Global state
let currentUser = null;
let currentUserProfile = null;
let userRole = null; // 'buyer' or 'seller'

// ========== AUTHENTICATION ==========

// Signup user
async function signup(email, password, role) {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  }, {
    data: { role }, // store role in user_metadata
  });

  if (error) {
    alert('Signup error: ' + error.message);
    return null;
  }
  alert('Signup successful! Please check your email for confirmation.');
  return user;
}

// Login user
async function login(email, password) {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert('Login error: ' + error.message);
    return null;
  }

  currentUser = user;
  await fetchUserProfile();
  setupUIForLoggedInUser();
  return user;
}

// Logout user
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert('Logout error: ' + error.message);
    return;
  }
  currentUser = null;
  currentUserProfile = null;
  userRole = null;
  setupUIForLoggedOutUser();
}

// Password reset
async function sendPasswordReset(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    alert('Password reset error: ' + error.message);
  } else {
    alert('Password reset email sent!');
  }
}

// 3. Fetch profile data from Supabase DB
async function fetchUserProfile() {
  if (!currentUser) return;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return;
  }
  currentUserProfile = data;
  userRole = data.role; // assume 'role' column in profiles table
}

// 4. Save or update profile on signup
async function createOrUpdateProfile(userId, role, displayName = '') {
  // Try to upsert profile record
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      role,
      display_name: displayName,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Profile upsert error:', error);
  } else {
    currentUserProfile = data;
  }
}

// ========== PRODUCT CRUD (For Sellers) ==========

// Add new product (seller only)
async function addProduct(product) {
  if (userRole !== 'seller') {
    alert('Only sellers can add products');
    return;
  }

  const { data, error } = await supabase
    .from('products')
    .insert([{ ...product, seller_id: currentUser.id, created_at: new Date().toISOString() }]);

  if (error) {
    alert('Add product error: ' + error.message);
    return null;
  }
  return data[0];
}

// Edit existing product
async function editProduct(productId, updatedFields) {
  if (userRole !== 'seller') {
    alert('Only sellers can edit products');
    return;
  }

  const { data, error } = await supabase
    .from('products')
    .update(updatedFields)
    .eq('id', productId)
    .eq('seller_id', currentUser.id);

  if (error) {
    alert('Edit product error: ' + error.message);
    return null;
  }
  return data[0];
}

// Delete product
async function deleteProduct(productId) {
  if (userRole !== 'seller') {
    alert('Only sellers can delete products');
    return;
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('seller_id', currentUser.id);

  if (error) {
    alert('Delete product error: ' + error.message);
    return false;
  }
  return true;
}

// Fetch products for feed (buyers)
async function fetchProductsForFeed() {
  // For now, fetch all products, later filter by user preferences
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    alert('Fetch products error: ' + error.message);
    return [];
  }
  return data;
}

// ========== AUCTIONS ==========

// Create auction (seller only)
async function createAuction(productId, startingPrice, endTime) {
  if (userRole !== 'seller') {
    alert('Only sellers can create auctions');
    return;
  }
  const { data, error } = await supabase
    .from('auctions')
    .insert([{
      product_id: productId,
      seller_id: currentUser.id,
      starting_price: startingPrice,
      highest_bid: startingPrice,
      highest_bidder_id: null,
      end_time: endTime.toISOString(),
      created_at: new Date().toISOString(),
    }]);

  if (error) {
    alert('Create auction error: ' + error.message);
    return null;
  }
  return data[0];
}

// Place bid on auction
async function placeBid(auctionId, bidAmount) {
  // Fetch current auction data
  const { data: auction, error } = await supabase
    .from('auctions')
    .select('*')
    .eq('id', auctionId)
    .single();

  if (error) {
    alert('Auction fetch error: ' + error.message);
    return false;
  }

  if (bidAmount <= auction.highest_bid) {
    alert('Bid must be higher than current highest bid');
    return false;
  }

  // Update highest bid and bidder atomically (simplified)
  const { data, error: updateError } = await supabase
    .from('auctions')
    .update({
      highest_bid: bidAmount,
      highest_bidder_id: currentUser.id,
    })
    .eq('id', auctionId)
    .eq('highest_bid', auction.highest_bid);

  if (updateError) {
    alert('Bid update error: ' + updateError.message);
    return false;
  }

  alert('Bid placed successfully!');
  return true;
}

// ========== UI & Navigation ==========

// Setup UI when logged in
function setupUIForLoggedInUser() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('user-section').style.display = 'block';

  document.getElementById('welcome-msg').textContent = `Welcome, ${currentUser.email}`;

  // Load products feed
  loadFeed();
}

// Setup UI when logged out
function setupUIForLoggedOutUser() {
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('user-section').style.display = 'none';
}

// Load and render products feed
async function loadFeed() {
  const feedContainer = document.getElementById('feed-container');
  feedContainer.innerHTML = 'Loading...';

  const products = await fetchProductsForFeed();

  if (products.length === 0) {
    feedContainer.innerHTML = '<p>No products available</p>';
    return;
  }

  feedContainer.innerHTML = '';
  products.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('product-card');
    div.innerHTML = `
      <h4>${product.name}</h4>
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
    `;
    feedContainer.appendChild(div);
  });
}

// ========== EVENT LISTENERS ==========

// Signup form submit
document.getElementById('signup-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  const role = e.target.role.value; // 'buyer' or 'seller'
  const displayName = e.target.displayName.value || '';

  const user = await signup(email, password, role);
  if (user) {
    await createOrUpdateProfile(user.id, role, displayName);
  }
});

// Login form submit
document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  await login(email, password);
});

// Logout button
document.getElementById('logout-btn').addEventListener('click', async () => {
  await logout();
});

// Password reset form
document.getElementById('reset-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = e.target.email.value;
  await sendPasswordReset(email);
});

// On page load check session
window.onload = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    await fetchUserProfile();
    setupUIForLoggedInUser();
  } else {
    setupUIForLoggedOutUser();
  }
};
