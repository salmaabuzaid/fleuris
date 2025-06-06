// Phase 3 Advanced features for Fleuris PWA

// Reuse data from Phase 2 (assuming products array exists from before)
// Add auction info to some products
products[0].auction = { active: true, highestBid: 20, highestBidder: null };
products[1].auction = { active: true, highestBid: 15, highestBidder: null };
products[2].auction = { active: false };

// Buyer Levels
const LEVELS = [
  { name: "Rosebud", minCoins: 0 },
  { name: "Blossom", minCoins: 50 },
  { name: "Orchid", minCoins: 150 },
  { name: "Gardenia", minCoins: 300 }
];

// Elements
const langBtn = document.getElementById("lang-btn");
const photoSearchBtn = document.getElementById("photo-search-btn");
const auctionBtn = document.getElementById("auction-btn");
const liveShoppingBtn = document.getElementById("live-shopping-btn");
const auctionModal = document.getElementById("auction-modal");
const auctionList = document.getElementById("auction-list");
const closeAuctionBtn = document.getElementById("close-auction");
const photoSearchModal = document.getElementById("photo-search-modal");
const closePhotoSearchBtn = document.getElementById("close-photo-search");
const photoUpload = document.getElementById("photo-upload");
const searchPhotoBtn = document.getElementById("search-photo-btn");
const photoSearchResults = document.getElementById("photo-search-results");
const liveShoppingModal = document.getElementById("live-shopping-modal");
const closeLiveShoppingBtn = document.getElementById("close-live-shopping");
const bookLiveBtn = document.getElementById("book-live-btn");
const liveShoppingConfirmation = document.getElementById("live-shopping-confirmation");
const levelDisplay = document.getElementById("level-display");

// --- LANGUAGE TOGGLE (English/French) ---
let currentLang = localStorage.getItem("fleuris_lang") || "en";

function toggleLanguage() {
  currentLang = currentLang === "en" ? "fr" : "en";
  localStorage.setItem("fleuris_lang", currentLang);
  langBtn.textContent = currentLang === "en" ? "FR" : "EN";
  alert(currentLang === "en" ? "Switched to English" : "Passé en français");
  // Ideally, reload translations here or re-render UI text
}
langBtn.textContent = currentLang === "en" ? "FR" : "EN";
langBtn.addEventListener("click", toggleLanguage);

// --- AUCTIONS ---

function openAuctions() {
  auctionModal.classList.remove("hidden");
  renderAuctions();
}

function closeAuctions() {
  auctionModal.classList.add("hidden");
}

function renderAuctions() {
  auctionList.innerHTML = "";
  products.forEach(product => {
    if (product.auction && product.auction.active) {
      const auctionItem = document.createElement("div");
      auctionItem.className = "auction-item";
      auctionItem.innerHTML = `
        <h4>${product.name}</h4>
        <p>Current Bid: $${product.auction.highestBid.toFixed(2)}</p>
        <button data-id="${product.id}">Place Bid +$5</button>
      `;
      auctionList.appendChild(auctionItem);

      auctionItem.querySelector("button").addEventListener("click", () => {
        placeBid(product.id, 5);
      });
    }
  });
}

function placeBid(productId, amount) {
  if (!currentUser) {
    alert("Please login to place bids!");
    return;
  }
  const product = products.find(p => p.id === productId);
  if (!product || !product.auction.active) return;

  const newBid = product.auction.highestBid + amount;
  if (currentUser.coins < newBid) {
    alert("You don't have enough coins to bid this amount.");
    return;
  }
  product.auction.highestBid = newBid;
  product.auction.highestBidder = currentUser.username;
  alert(`You placed a bid of $${newBid.toFixed(2)} on ${product.name}`);

  // Deduct coins as escrow (simplified)
  currentUser.coins -= newBid;
  updateUserStorage();
  updateUI();

  renderAuctions();
}

// --- PHOTO SEARCH MOCK ---

function openPhotoSearch() {
  photoSearchModal.classList.remove("hidden");
  photoSearchResults.innerHTML = "";
}

function closePhotoSearch() {
  photoSearchModal.classList.add("hidden");
  photoUpload.value = "";
  photoSearchResults.innerHTML = "";
}

function searchByPhoto() {
  if (!photoUpload.files.length) {
    alert
