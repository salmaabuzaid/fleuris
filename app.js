// Firebase config - replace with your own
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Elements
const btnLogout = document.getElementById("btnLogout");
const pointsCount = document.getElementById("pointsCount");
const coinsCount = document.getElementById("coinsCount");
const userLevel = document.getElementById("userLevel");
const userLevelMe = document.getElementById("userLevelMe");
const pointsCountMe = document.getElementById("pointsCountMe");
const coinsCountMe = document.getElementById("coinsCountMe");
const badgeContainer = document.getElementById("badgeContainer");
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.querySelectorAll(".filter-btn");
const feedItemsDiv = document.getElementById("feedItems");
const auctionListDiv = document.getElementById("auctionList");
const aiGetStyle = document.getElementById("aiGetStyle");
const aiResults = document.getElementById("aiResults");
const lookbookGrid = document.getElementById("lookbookGrid");
const bundleGrid = document.getElementById("bundleGrid");
const wishlistItems = document.getElementById("wishlistItems");
const imageSearchInput = document.getElementById('imageSearchInput');
const btnImageSearch = document.getElementById('btnImageSearch');
const imageSearchResult = document.getElementById('imageSearchResult');

const navButtons = document.querySelectorAll(".nav-btn");
const sections = {
  explore: document.getElementById("exploreSection"),
  aiStylist: document.getElementById("aiStylistSection"),
  following: document.getElementById("followingSection"),
  me: document.getElementById("meSection"),
};

let currentUser = null;
let currentUserData = null;
let products = [];

// Navigation logic
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    sections.explore.classList.add("hidden");
    sections.aiStylist.classList.add("hidden");
    sections.following.classList.add("hidden");
    sections.me.classList.add("hidden");

    switch (btn.dataset.target) {
      case "exploreSection":
        sections.explore.classList.remove("hidden");
        break;
      case "aiStylistSection":
        sections.aiStylist.classList.remove("hidden");
        break;
      case "followingSection":
        sections.following.classList.remove("hidden");
        break;
      case "meSection":
        sections.me.classList.remove("hidden");
        break;
    }
  });
});

// Logout
btnLogout.onclick = async () => {
  await auth.signOut();
  window.location.href = "index.html";
};

// Load user data
async function loadUserData(uid) {
  const userDoc = await db.collection("users").doc(uid).get();
  if (!userDoc.exists) return;
  currentUserData = userDoc.data();

  pointsCount.textContent = currentUserData.points || 0;
  coinsCount.textContent = currentUserData.coins || 0;
  userLevel.textContent = currentUserData.level || "Beginner";

  pointsCountMe.textContent = currentUserData.points || 0;
  coinsCountMe.textContent = currentUserData.coins || 0;
  userLevelMe.textContent = currentUserData.level || "Beginner";

  // Badges
  badgeContainer.innerHTML = "";
  if (currentUserData.badges && currentUserData.badges.length > 0) {
    currentUserData.badges.forEach((badge) => {
      const badgeEl = document.createElement("div");
      badgeEl.textContent = badge;
      badgeEl.style.background = "#91b89a";
      badgeEl.style.color = "white";
      badgeEl.style.padding = "5px 10px";
      badgeEl.style.borderRadius = "10px";
      badgeEl.style.marginRight = "5px";
      badgeContainer.appendChild(badgeEl);
    });
  } else {
    badgeContainer.textContent = "No badges yet";
  }
}

// Load products
async function loadProducts() {
  const snapshot = await db.collection("products").get();
  products = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    products.push(data);
  });
  renderProducts(products);
}

// Render product cards
function renderProducts(prods) {
  productGrid.innerHTML = "";
  prods.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.imageUrl || "https://via.placeholder.com/150"}" alt="${product.name}" />
      <div class="product-title">${product.name}</div>
      <div class="product-price">EGP ${product.price}</div>
      <button class="orderBtn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
        Order Now
      </button>
    `;
    productGrid.appendChild(card);
  });

  // Add click listeners for order buttons
  document.querySelectorAll(".orderBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openCheckoutModal(btn.dataset);
    });
  });
}

// Elements for modal
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutProductName = document.getElementById("checkoutProductName");
const checkoutProductPrice = document.getElementById("checkoutProductPrice");

let selectedProduct = null;

function openCheckoutModal(productData) {
  selectedProduct = productData;
  checkoutProductName.textContent = productData.name;
  checkoutProductPrice.textContent = productData.price;
  checkoutModal.classList.remove("hidden");
}

// Close modal event
closeCheckout.onclick = () => {
  checkoutModal.classList.add("hidden");
  checkoutForm.reset();
};

// Handle form submit - create order in Firestore
checkoutForm.onsubmit = async (e) => {
  e.preventDefault();
  if (!currentUser) {
    alert("You must be logged in to place an order.");
    checkoutModal.classList.add("hidden");
    return;
  }

  const name = document.getElementById("buyerName").value.trim();
  const phone = document.getElementById("buyerPhone").value.trim();
  const address = document.getElementById("buyerAddress").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill all fields.");
    return;
  }

  try {
    // Fetch sellerId of product
    const productDoc = await db.collection("products").doc(selectedProduct.id).get();
    if (!productDoc.exists) throw new Error("Product not found");
    const sellerId = productDoc.data().sellerId;

    await db.collection("orders").add({
      buyerId: currentUser.uid,
      buyerEmail: currentUser.email || "",
      buyerName: name,
      buyerPhone: phone,
      buyerAddress: address,
      productIds: [selectedProduct.id],
      productNames: [selectedProduct.name],
      totalPrice: Number(selectedProduct.price),
      sellerId,
      status: "Pending",
      createdAt: new Date(),
    });

    alert("Order placed successfully! You will pay on delivery.");
    checkoutModal.classList.add("hidden");
    checkoutForm.reset();
  } catch (error) {
    alert("Failed to place order: " + error.message);
  }
};

// Filters & search
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
  });
});

function applyFilters() {
  const activeFilterBtn = document.querySelector(".filter-btn.active");
  const filter = activeFilterBtn ? activeFilterBtn.dataset.filter : "all";
  const searchTerm = searchInput.value.trim().toLowerCase();

  let filtered = products;

  if (filter && filter !== "all") {
    if (filter === "eco-friendly") {
      filtered = filtered.filter((p) => p.ecoFriendly === true);
    } else {
      filtered = filtered.filter((p) => p.category === filter);
    }
  }

  if (searchTerm) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm));
  }

  renderProducts(filtered);
}

searchInput.addEventListener("input", applyFilters);

// Personalized feed - products from followed sellers
async function loadFeed() {
  if (!currentUserData) return;
  const following = currentUserData.following || [];
  if (following.length === 0) {
    feedItemsDiv.textContent = "Follow sellers to see products here.";
    return;
  }
  const feedSnapshot = await db.collection("products").where("sellerId", "in", following).get();
  feedItemsDiv.innerHTML = "";
  feedSnapshot.forEach((doc) => {
    const product = doc.data();
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.imageUrl || "https://via.placeholder.com/150"}" alt="${product.name}" />
      <div class="product-title">${product.name}</div>
      <div class="product-price">EGP ${product.price}</div>
    `;
    feedItemsDiv.appendChild(card);
  });
}

// Auctions
async function loadAuctions() {
  const auctionsSnapshot = await db.collection("auctions").get();
  auctionListDiv.innerHTML = "";
  auctionsSnapshot.forEach((doc) => {
    const auction = doc.data();
    const card = document.createElement("div");
    card.className = "auction-card";

    const endTime = auction.endTime.toDate();
    const now = new Date();

    let timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
    let timerDisplay = formatTimeLeft(timeLeft);

    card.innerHTML = `
      <div><strong>${auction.productName}</strong></div>
      <div>Current Bid: EGP ${auction.currentBid}</div>
      <div>Ends in: <span id="timer-${doc.id}">${timerDisplay}</span></div>
      <button id="bidBtn-${doc.id}">Place Bid</button>
    `;

    auctionListDiv.appendChild(card);

    // Countdown timer update
    const timerSpan = document.getElementById(`timer-${doc.id}`);
    let interval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(interval);
        timerSpan.textContent = "Ended";
        document.getElementById(`bidBtn-${doc.id}`).disabled = true;
        return;
      }
      timerSpan.textContent = formatTimeLeft(timeLeft);
    }, 1000);

    // Bid button handler
    document.getElementById(`bidBtn-${doc.id}`).onclick = async () => {
      const newBid = auction.currentBid + 10; // fixed increment
      try {
        await db.collection("auctions").doc(doc.id).update({
          currentBid: newBid,
          highestBidder: currentUser.uid,
        });
        alert(`You placed a bid of EGP ${newBid}`);
        loadAuctions();
      } catch (error) {
        alert("Bid failed: " + error.message);
      }
    };
  });
}

function formatTimeLeft(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

// AI Stylist basic demo
aiGetStyle.onclick = () => {
  aiResults.textContent = "Processing your style... (demo)";
  setTimeout(() => {
    aiResults.innerHTML = `<p>Try pairing a floral top with white jeans and pastel accessories!</p>`;
  }, 2000);
};

// Load Lookbooks
async function loadLookbooks() {
  const lookbooksSnap = await db.collection("lookbooks").get();
  lookbookGrid.innerHTML = "";
  lookbooksSnap.forEach((doc) => {
    const lb = doc.data();
    const div = document.createElement("div");
    div.className = "lookbook-card";
    div.innerHTML = `
      <img src="${lb.coverImage || "https://via.placeholder.com/200x120"}" alt="${lb.title}" />
      <h3>${lb.title}</h3>
      <video controls width="250" src="${lb.storyVideoUrl || ""}"></video>
    `;
    lookbookGrid.appendChild(div);
  });
}

// Load Bundles
async function loadBundles() {
  const bundlesSnap = await db.collection("bundles").get();
  bundleGrid.innerHTML = "";
  bundlesSnap.forEach((doc) => {
    const bundle = doc.data();
    const div = document.createElement("div");
    div.className = "bundle-card";
    div.innerHTML = `
      <h3>${bundle.title}</h3>
      <p>Includes: ${bundle.productNames.join(", ")}</p>
      <p>Discount: ${bundle.discountPercent}% off</p>
      <p>Price after discount: EGP ${bundle.priceAfterDiscount}</p>
    `;
    bundleGrid.appendChild(div);
  });
}

// Wishlist
async function loadWishlist() {
  if (!currentUserData || !currentUserData.wishlist) {
    wishlistItems.textContent = "Your wishlist is empty.";
    return;
  }
  const productsRef = db.collection("products");
  wishlistItems.innerHTML = "";
  for (const prodId of currentUserData.wishlist) {
    const prodDoc = await productsRef.doc(prodId).get();
    if (prodDoc.exists) {
      const p = prodDoc.data();
      const div = document.createElement("div");
      div.textContent = `${p.name} - EGP ${p.price}`;
      wishlistItems.appendChild(div);
    }
  }
}

// Image-based search (demo)
btnImageSearch.onclick = () => {
  if (!imageSearchInput.files.length) {
    alert("Please upload an image for search.");
    return;
  }
  const file = imageSearchInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    imageSearchResult.innerHTML = `
      <img src="${reader.result}" alt="Search Query" style="max-width:150px; border-radius:10px;" />
      <p>Showing results similar to your image (demo only)</p>
    `;
  };
  reader.readAsDataURL(file);
};

// Init
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    await loadUserData(user.uid);
    await loadProducts();
    applyFilters();
    await loadFeed();
    await loadAuctions();
    await loadLookbooks();
    await loadBundles();
    await loadWishlist();
  } else {
    window.location.href = "index.html";
  }
});
