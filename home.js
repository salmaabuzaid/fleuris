// Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc,
  collection, addDoc, getDocs, query, where, limit, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAx7DAvkZupSDXg4aXWvtfSQWhqX32Kwrs",
  authDomain: "fleuris-3df99.firebaseapp.com",
  projectId: "fleuris-3df99",
  storageBucket: "fleuris-3df99.appspot.com",
  messagingSenderId: "831344111439",
  appId: "1:831344111439:web:XXXX"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let currentUserId = null;
let currentSellerId = null;

// Listen for user login
onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  currentUserId = user.uid;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      role: 'buyer',
      level: 'Rosebud',
      coins: 0,
      badges: [],
      wishlist: [],
      following: []
    });
  }

  const userData = (await getDoc(userRef)).data();

  // Update UI
  document.getElementById('userLevel').textContent = userData.level || 'Rosebud';
  document.getElementById('userCoins').textContent = userData.coins || 0;

  loadBadges(userData.badges || []);
  updateBadges(userData, user.uid);
  loadWishlist(userData.wishlist || []);
  loadPersonalizedFeed(userData);
});

// Load user badges
function loadBadges(badges) {
  const container = document.getElementById('badgesContainer');
  container.innerHTML = '';
  badges.forEach(b => {
    container.innerHTML += `<span class="badge">${b}</span>`;
  });
}

// Load wishlist items (placeholder logic)
function loadWishlist(wishlist) {
  const container = document.getElementById('wishlistContainer');
  container.innerHTML = wishlist.map(item => `<div>${item}</div>`).join('');
}

// Load personalized feed (basic version)
function loadPersonalizedFeed(userData) {
  const container = document.getElementById('personalizedFeed');
  container.innerHTML = `<p>Showing personalized content for: ${userData.level}</p>`;
}

// Update badges and levels based on coins
async function updateBadges(data, uid) {
  let badges = data.badges || [];
  let coins = data.coins || 0;

  if (coins >= 100 && !badges.includes("100 Coins Club")) badges.push("100 Coins Club");
  if (coins >= 250 && !badges.includes("Shopaholic")) badges.push("Shopaholic");

  let level = "Rosebud";
  if (coins >= 1000) level = "Orchid";
  else if (coins >= 500) level = "Blossom";

  await updateDoc(doc(db, 'users', uid), { badges, level });
}

// Toggle wishlist
async function toggleWishlist(productId) {
  const userRef = doc(db, 'users', currentUserId);
  const snap = await getDoc(userRef);
  let wishlist = snap.data().wishlist || [];

  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(p => p !== productId);
  } else {
    wishlist.push(productId);
  }

  await updateDoc(userRef, { wishlist });
  loadWishlist(wishlist);
}

// Show seller profile
async function showSellerProfile(sellerId) {
  currentSellerId = sellerId;
  const sellerRef = doc(db, 'users', sellerId);
  const sellerSnap = await getDoc(sellerRef);

  if (!sellerSnap.exists()) return;

  const data = sellerSnap.data();
  document.getElementById('sellerProfile').innerHTML = `
    <h3>${data.username || 'Seller'}</h3>
    <button onclick="toggleFollow()">Follow</button>
  `;
}

// Toggle follow/unfollow
async function toggleFollow() {
  const userRef = doc(db, 'users', currentUserId);
  const snap = await getDoc(userRef);
  let following = snap.data().following || [];

  if (following.includes(currentSellerId)) {
    following = following.filter(id => id !== currentSellerId);
  } else {
    following.push(currentSellerId);
  }

  await updateDoc(userRef, { following });
}

// Upload photo for AI search
async function handlePhotoUpload(file) {
  const filePath = `search-uploads/${currentUserId}/${file.name}`;
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  document.getElementById('searchResults').innerHTML = `<p>Photo uploaded. Searching...</p>`;
  // Placeholder for AI result
}

// Earn coins on purchase
async function earnCoins(amount) {
  const userRef = doc(db, 'users', currentUserId);
  const snap = await getDoc(userRef);
  const coins = (snap.data().coins || 0) + amount;
  await updateDoc(userRef, { coins });
  updateBadges({ ...snap.data(), coins }, currentUserId);
  document.getElementById('userCoins').textContent = coins;
}
