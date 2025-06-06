import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bHpvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI2NDMsImV4cCI6MjA2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqhmIE65VIUpZsFpTbIVBt4w';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  loadOffers();
  loadProducts();

  document.getElementById('loginBtn').addEventListener('click', () => {
    // Show login modal
    showAuthModal('login');
  });
  document.getElementById('signupBtn').addEventListener('click', () => {
    // Show signup modal
    showAuthModal('signup');
  });
});

async function loadOffers() {
  let { data: offers, error } = await supabase
    .from('offers')
    .select('*')
    .order('start_date', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error loading offers:', error);
    return;
  }

  const container = document.getElementById('offersContainer');
  container.innerHTML = '';

  offers.forEach(offer => {
    const offerCard = document.createElement('div');
    offerCard.className = 'offer-card';
    offerCard.innerHTML = `
      <h3>Bundle Discount: ${offer.discount_percentage}% Off</h3>
      <p>Valid from ${new Date(offer.start_date).toLocaleDateString()} to ${offer.end_date ? new Date(offer.end_date).toLocaleDateString() : 'Ongoing'}</p>
    `;
    container.appendChild(offerCard);
  });
}

async function loadProducts() {
  let { data: products, error } = await supabase
    .from('products')
    .select('*')
    .limit(20);

  if (error) {
    console.error('Error loading products:', error);
    return;
  }

  const container = document.getElementById('productsContainer');
  container.innerHTML = '';

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';

    productCard.innerHTML = `
      <img src="${product.image_urls?.[0] || 'placeholder.jpg'}" alt="${product.name}" class="product-image" />
      <h4 class="product-name">${product.name}</h4>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <button onclick="addToWishlist('${product.id}')">Add to Wishlist</button>
    `;

    container.appendChild(productCard);
  });
}

function showAuthModal(type) {
  // Implement modal showing login/signup forms, handled in auth.js
}
