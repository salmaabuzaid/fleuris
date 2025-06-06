// Initialize Supabase client
const SUPABASE_URL = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bHpvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI2NDMsImV4cCI6MjA2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqhmIE65VIUpZsFpTbIVBt4w';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ======= AI Assistant =======
const aiTextarea = document.querySelector('#ai-assistant textarea');
const aiButton = document.querySelector('#ai-assistant button');
aiButton.addEventListener('click', async () => {
  const question = aiTextarea.value.trim();
  if (!question) return alert('Please type a question for the AI assistant.');

  aiButton.disabled = true;
  aiButton.textContent = 'Thinking...';

  // Dummy AI response (replace with actual API call)
  setTimeout(() => {
    alert(`AI Response: Sorry, this is a placeholder answer for "${question}"`);
    aiButton.disabled = false;
    aiButton.textContent = 'Ask';
    aiTextarea.value = '';
  }, 1500);
});

// ======= Personalized Feed =======
async function loadPersonalFeed() {
  const feedContainer = document.querySelector('#personal-feed .scroll-feed');
  feedContainer.innerHTML = 'Loading...';

  // Fetch featured or personalized products from Supabase
  let { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    feedContainer.textContent = 'Failed to load feed.';
    console.error(error);
    return;
  }

  feedContainer.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p>$${product.price}</p>
      <button data-id="${product.id}" class="add-to-lookbook">Add to Lookbook</button>
    `;
    feedContainer.appendChild(card);
  });

  // Add listeners to "Add to Lookbook" buttons
  document.querySelectorAll('.add-to-lookbook').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.id;
      addToLookbook(productId);
    });
  });
}

// ======= Lookbooks =======
const lookbookBoard = document.querySelector('#lookbooks .lookbook-board');
const createLookbookBtn = document.querySelector('#lookbooks button');

createLookbookBtn.addEventListener('click', () => {
  const name = prompt('Enter a name for your new Lookbook:');
  if (name) {
    createLookbook(name);
  }
});

async function createLookbook(name) {
  // Save lookbook to Supabase or local storage (placeholder)
  alert(`Lookbook "${name}" created!`);
  // Reload or update lookbook list
  loadLookbooks();
}

async function loadLookbooks() {
  lookbookBoard.innerHTML = 'Loading lookbooks...';
  // Fetch user's lookbooks here
  // Placeholder example:
  lookbookBoard.innerHTML = `
    <div class="lookbook-card">Summer Vibes</div>
    <div class="lookbook-card">Winter Collection</div>
  `;
}

async function addToLookbook(productId) {
  // Let user pick a lookbook or create new
  const lookbookName = prompt('Add to which Lookbook? (Type name)');
  if (lookbookName) {
    // Save product to lookbook (placeholder)
    alert(`Product ${productId} added to Lookbook "${lookbookName}"`);
  }
}

// ======= Seller Stories =======
async function loadSellerStories() {
  const storiesContainer = document.querySelector('#seller-stories .stories-carousel');
  storiesContainer.innerHTML = 'Loading stories...';

  // Fetch stories metadata from supabase
  // Placeholder stories:
  const stories = [
    { id: 1, video_url: 'https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4', seller: 'LilyBrand' },
    { id: 2, video_url: 'https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4', seller: 'OrchidJewels' }
  ];

  storiesContainer.innerHTML = '';
  stories.forEach(story => {
    const video = document.createElement('video');
    video.src = story.video_url;
    video.width = 100;
    video.height = 180;
    video.controls = false;
    video.muted = true;
    video.loop = true;
    video.title = `Story from ${story.seller}`;
    storiesContainer.appendChild(video);
  });
}

// ======= Auctions =======
async function loadAuctions() {
  const auctionGrid = document.querySelector('#auctions .auction-grid');
  auctionGrid.innerHTML = 'Loading auctions...';

  // Fetch auction products
  let { data: auctions, error } = await supabase
    .from('auctions')
    .select('*')
    .order('end_time', { ascending: true })
    .limit(10);

  if (error) {
    auctionGrid.textContent = 'Failed to load auctions.';
    return;
  }

  auctionGrid.innerHTML = '';
  auctions.forEach(auction => {
    const card = document.createElement('div');
    card.className = 'auction-card';
    card.innerHTML = `
      <img src="${auction.image_url}" alt="${auction.name}" />
      <h4>${auction.name}</h4>
      <p>Current Bid: $${auction.current_bid}</p>
      <p>Auction Ends: ${new Date(auction.end_time).toLocaleString()}</p>
      <button data-id="${auction.id}" class="place-bid-btn">Place Bid</button>
    `;
    auctionGrid.appendChild(card);
  });

  // Handle bid button clicks (placeholder)
  document.querySelectorAll('.place-bid-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const auctionId = btn.dataset.id;
      const bid = prompt('Enter your bid amount:');
      if (bid) {
        alert(`Your bid of $${bid} for auction ${auctionId} has been placed! (Placeholder)`);
      }
    });
  });
}

// ======= Buyer Rewards =======
async function loadBuyerRewards() {
  const rewardsSection = document.querySelector('#rewards');
  // Fetch user points and level from DB (placeholder values)
  const points = 120;
  const level = 'Rosebud';
  const nextLevelPoints = 500;

  rewardsSection.querySelector('h2').textContent = `Your Level: 🌹 ${level}`;
  rewardsSection.querySelector('p').textContent = `You have ${points} coins. Spend more to reach Blossom 🌸!`;
  rewardsSection.querySelector('progress').value = points;
  rewardsSection.querySelector('progress').max = nextLevelPoints;
}

// ======= Upload Photo for Search =======
const uploadInput = document.querySelector('#upload-search input[type=file]');
const uploadSearchBtn = document.querySelector('#upload-search button');

uploadSearchBtn.addEventListener('click', () => {
  if (uploadInput.files.length === 0) {
    alert('Please select an image to search.');
    return;
  }
  // Placeholder: upload image and trigger search
  alert('Image search is not yet implemented.');
});

// ======= Waitlist Notifications =======
async function loadWaitlistNotifications() {
  const waitlistSection = document.querySelector('#waitlist-products');
  // Fetch waitlist items user signed up for (placeholder)
  waitlistSection.innerHTML = '<p>You are on the waitlist for 2 items. We will notify you when back in stock.</p>';
}

// ======= Bundle Discounts =======
async function loadBundleDiscounts() {
  const bundlesContainer = document.querySelector('#bundles .bundle-list');
  bundlesContainer.innerHTML = 'Loading bundles...';

  // Fetch bundle deals (placeholder)
  const bundles = [
    { id: 1, name: 'Spring Jewelry Set', discount: '15%', products: ['Necklace', 'Earrings'] },
    { id: 2, name: 'Accessory Pack', discount: '20%', products: ['Bracelet', 'Ring'] },
  ];

  bundlesContainer.innerHTML = '';
  bundles.forEach(bundle => {
    const div = document.createElement('div');
    div.className = 'bundle-card';
    div.innerHTML = `
      <h4>${bundle.name}</h4>
      <p>Discount: ${bundle.discount}</p>
      <p>Includes: ${bundle.products.join(', ')}</p>
      <button>Shop Bundle</button>
    `;
    bundlesContainer.appendChild(div);
  });
}

// ======= Style Photo Gallery Uploads =======
async function loadStyleGallery() {
  const gallery = document.querySelector('#buyer-style-gallery .style-gallery');
  gallery.innerHTML = 'Loading your styled photos...';

  // Fetch style photos (placeholder)
  gallery.innerHTML = `
    <img src="https://via.placeholder.com/100" alt="Styled look 1" />
    <img src="https://via.placeholder.com/100" alt="Styled look 2" />
  `;
}

// ======= Eco-Friendly Filters =======
document.querySelectorAll('#eco-friendly .eco-tags button').forEach(button => {
  button.addEventListener('click', () => {
    alert(`Filtering products by "${button.textContent}" (Not implemented)`);
  });
});

// ======= Wishlist Notifications =======
async function loadWishlistNotifications() {
  const list = document.querySelector('#wishlist-alerts ul');
  // Fetch notifications (placeholder)
  list.innerHTML = `
    <li>💖 Bracelet Set is now 20% off!</li>
    <li>🌿 Vintage Tote is back in stock!</li>
  `;
}

// ======= Initialization =======
async function init() {
  await loadPersonalFeed();
  await loadLookbooks();
  await loadSellerStories();
  await loadAuctions();
  await loadBuyerRewards();
  await loadWaitlistNotifications();
  await loadBundleDiscounts();
  await loadStyleGallery();
  await loadWishlistNotifications();
}

init();
