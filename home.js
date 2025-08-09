// home.js
// Main client logic for Fleuris home page
// Expects ./firebase.js which exports: app, auth, db, storage

import { app, auth, db, storage } from './firebase.js';
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection, doc, getDoc, setDoc, addDoc, onSnapshot,
  query, orderBy, updateDoc, arrayUnion, arrayRemove,
  serverTimestamp, where, getDocs, limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  ref as storageRef, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/* ---------------------------
   DOM references
   --------------------------- */
const productGrid = document.getElementById('productGrid');
const wishlistContainer = document.getElementById('wishlistContainer'); // may be missing on some pages
const badgesContainer = document.getElementById('badgesContainer');
const meLevelEl = document.getElementById('meLevel');
const meCoinsEl = document.getElementById('meCoins');
const searchInput = document.getElementById('searchInput');
const imgSearchFile = document.getElementById('imgSearchFile'); // optional file input
const floraInput = document.getElementById('floraInput');
const floraImage = document.getElementById('floraImage');
const floraResponses = document.getElementById('floraResponses');

/* ---------------------------
   State
   --------------------------- */
let currentUser = null;
let unsubscribeProducts = null;
let lastProductPrices = {}; // track prices to detect price drops

/* ---------------------------
   Helpers
   --------------------------- */
function openSettings() {
  document.getElementById('settingsModal').style.display = 'block';
}
function closeSettings() {
  document.getElementById('settingsModal').style.display = 'none';
}
async function logout() {
  await signOut(auth);
  window.location.href = 'index.html';
}

function switchTab(tabId) {
  // page-level tabs (explore, aiStylist, following, me)
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(tabId) || document.querySelector(`#${tabId}`);
  if (el) el.classList.add('active');
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
  // highlight button by matching dataset or text
  document.querySelectorAll('.bottom-nav button').forEach(b => {
    if ((b.textContent || '').toLowerCase().includes(tabId.toLowerCase())) {
      b.classList.add('active');
    }
  });
}

/* ---------------------------
   Auth & user init
   --------------------------- */
onAuthStateChanged(auth, async user => {
  if (!user) {
    // not logged in -> redirect to landing
    window.location.href = 'index.html';
    return;
  }
  currentUser = user;
  await ensureUserDoc(user);
  subscribeProductsRealtime();
  loadUserUI();
  // subscribe to user doc changes (badges, coins, wishlist changes from other devices)
  const uDocRef = doc(db, 'users', currentUser.uid);
  onSnapshot(uDocRef, snap => {
    if (!snap.exists()) return;
    const data = snap.data();
    updateUserUIFromData(data);
  });
});

async function ensureUserDoc(user) {
  const uref = doc(db, 'users', user.uid);
  const snap = await getDoc(uref);
  if (!snap.exists()) {
    // default user shape
    await setDoc(uref, {
      email: user.email || null,
      role: 'buyer',
      name: user.displayName || null,
      coins: 0,
      points: 0,
      level: 'Rosebud',
      badges: [],
      wishlist: [],
      following: [],
      notifications: [],
      createdAt: serverTimestamp()
    });
  }
}

/* ---------------------------
   Products - realtime
   --------------------------- */
function subscribeProductsRealtime() {
  if (unsubscribeProducts) unsubscribeProducts();
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  unsubscribeProducts = onSnapshot(q, snap => {
    productGrid.innerHTML = '';
    // Detect price changes to notify wishlisters
    const newPrices = {};
    snap.forEach(docSnap => {
      const p = docSnap.data();
      p.id = docSnap.id;
      newPrices[p.id] = p.price;
      renderProductCard(p);
      // detect price drop
      const old = lastProductPrices[p.id];
      if (old !== undefined && p.price < old) {
        handlePriceDrop(p.id, p, old, p.price);
      }
    });
    lastProductPrices = newPrices;
  }, err => {
    console.error('Products subscription error', err);
  });
}

/* Notify users who wishlisted this product about a sale/price drop.
   This simply adds a notification entry to each user's document (inefficient for massive scale - you should use cloud functions). */
async function handlePriceDrop(productId, productData, oldPrice, newPrice) {
  try {
    const wishQuery = query(collection(db, 'users'), where('wishlist', 'array-contains', productId));
    const snaps = await getDocs(wishQuery);
    snaps.forEach(async (uSnap) => {
      const uref = doc(db, 'users', uSnap.id);
      await updateDoc(uref, {
        notifications: arrayUnion({
          type: 'price_drop',
          productId,
          title: productData.title,
          oldPrice,
          newPrice,
          createdAt: serverTimestamp(),
          read: false
        })
      });
    });
  } catch (e) {
    console.error('handlePriceDrop error', e);
  }
}

/* ---------------------------
   Render product
   --------------------------- */
function renderProductCard(p) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <img src="${(p.images && p.images[0]) || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${escapeHtml(p.title || '')}">
    <div class="info">
      <div class="title">${escapeHtml(p.title || 'Untitled')}</div>
      <div class="price">$${Number(p.price || 0).toFixed(2)}</div>
      <div class="meta">
        <button class="btn-wishlist" data-id="${p.id}">♡</button>
        <button class="btn-view" data-id="${p.id}">View</button>
      </div>
      <div class="tags">${p.ecoTag ? '<span class="badge">Eco</span>' : ''} ${p.bundleDiscount ? '<span class="badge">Bundle</span>' : ''}</div>
    </div>
  `;
  productGrid.appendChild(card);

  // event listeners
  card.querySelector('.btn-view').addEventListener('click', () => openProduct(p.id));
  card.querySelector('.btn-wishlist').addEventListener('click', () => toggleWishlist(p.id));
}

/* ---------------------------
   View & buy product
   --------------------------- */
async function openProduct(productId) {
  const pDoc = await getDoc(doc(db, 'products', productId));
  if (!pDoc.exists()) return alert('Product not found');
  const p = pDoc.data();
  // simple modal content
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" role="dialog">
      <button class="close" id="closeModalBtn">&times;</button>
      <h3>${escapeHtml(p.title)}</h3>
      <img src="${(p.images&&p.images[0]) || 'https://via.placeholder.com/600x400'}" style="width:100%;height:auto;border-radius:8px" />
      <p>${escapeHtml(p.description || '')}</p>
      <p>Price: <strong>$${Number(p.price).toFixed(2)}</strong></p>
      <p>Stock: <strong>${p.stock ?? 0}</strong></p>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button id="buyBtn">Buy</button>
        <button id="waitlistBtn">${(p.stock ?? 0) > 0 ? 'Add to Wishlist' : 'Join Waitlist'}</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#closeModalBtn').onclick = () => modal.remove();

  modal.querySelector('#buyBtn').onclick = async () => {
    if ((p.stock ?? 0) <= 0) {
      alert('Out of stock — join the waitlist instead.');
      return;
    }
    try {
      await buyProduct(productId, p.price, p.sellerId);
      alert('Purchase completed — coins awarded.');
      modal.remove();
    } catch (e) {
      console.error(e);
      alert('Purchase failed: ' + e.message);
    }
  };

  modal.querySelector('#waitlistBtn').onclick = async () => {
    if ((p.stock ?? 0) > 0) {
      // toggle wishlist if in stock
      await toggleWishlist(productId);
      alert('Added to wishlist.');
    } else {
      // add to waitlist array on product doc
      await updateDoc(doc(db, 'products', productId), { waitlist: arrayUnion(currentUser.uid) });
      alert('You joined the waitlist. You will be notified if the product is restocked.');
    }
  };
}

async function buyProduct(productId, price, sellerId) {
  // very simple purchase: create orders doc, decrement stock (optimistic), award coins
  // For production use transactions and server-side validation!
  // Create order
  await addDoc(collection(db, 'orders'), {
    buyerId: currentUser.uid,
    sellerId: sellerId || null,
    products: [{ productId, price, quantity: 1 }],
    total: price,
    status: 'completed',
    createdAt: serverTimestamp()
  });
  // decrement stock (naive)
  const pRef = doc(db, 'products', productId);
  const pSnap = await getDoc(pRef);
  if (pSnap.exists()) {
    const p = pSnap.data();
    const newStock = Math.max(0, (p.stock || 0) - 1);
    await updateDoc(pRef, { stock: newStock });
    // if newStock === 0 you might want to move waitlist or other logic
  }
  // award coins (floor of price)
  const uRef = doc(db, 'users', currentUser.uid);
  const uSnap = await getDoc(uRef);
  const currentCoins = (uSnap.data().coins || 0);
  const awarded = Math.floor(price);
  await updateDoc(uRef, { coins: currentCoins + awarded });
  await recalcBadgesAndLevel(currentUser.uid);
}

/* ---------------------------
   Wishlist functions
   --------------------------- */
async function toggleWishlist(productId) {
  const uRef = doc(db, 'users', currentUser.uid);
  const uSnap = await getDoc(uRef);
  const wish = uSnap.exists() ? (uSnap.data().wishlist || []) : [];
  if (wish.includes(productId)) {
    await updateDoc(uRef, { wishlist: arrayRemove(productId) });
  } else {
    await updateDoc(uRef, { wishlist: arrayUnion(productId) });
  }
  await loadWishlistUI();
}

async function loadWishlistUI() {
  try {
    if (!wishlistContainer) return;
    wishlistContainer.innerHTML = '';
    const uSnap = await getDoc(doc(db, 'users', currentUser.uid));
    const wish = (uSnap.exists() && uSnap.data().wishlist) || [];
    for (const pid of wish) {
      const pSnap = await getDoc(doc(db, 'products', pid));
      if (!pSnap.exists()) continue;
      const p = pSnap.data();
      const el = document.createElement('div');
      el.textContent = `${p.title} — $${Number(p.price).toFixed(2)}`;
      wishlistContainer.appendChild(el);
    }
  } catch (e) {
    console.error('loadWishlistUI error', e);
  }
}

/* ---------------------------
   Following sellers
   --------------------------- */
async function toggleFollowSeller(sellerId) {
  const uRef = doc(db, 'users', currentUser.uid);
  const uSnap = await getDoc(uRef);
  const following = (uSnap.exists() && uSnap.data().following) || [];
  if (following.includes(sellerId)) {
    await updateDoc(uRef, { following: arrayRemove(sellerId) });
  } else {
    await updateDoc(uRef, { following: arrayUnion(sellerId) });
  }
}

/* ---------------------------
   Lookbooks
   --------------------------- */
async function createLookbook() {
  const title = prompt('Enter lookbook title:');
  if (!title) return;
  const lbRef = await addDoc(collection(db, 'lookbooks'), {
    ownerId: currentUser.uid,
    title,
    products: [],
    createdAt: serverTimestamp()
  });
  alert('Lookbook created: ' + title);
  return lbRef.id;
}

async function addToLookbook(lookbookId, product) {
  const lbRef = doc(db, 'lookbooks', lookbookId);
  await updateDoc(lbRef, { products: arrayUnion(product) });
  alert('Added to lookbook');
}

/* ---------------------------
   Comments with images
   --------------------------- */
async function postComment(productId, text, imageFile) {
  let imageUrl = null;
  if (imageFile) {
    const path = `comments/${currentUser.uid}/${Date.now()}_${imageFile.name}`;
    const sRef = storageRef(storage, path);
    await uploadBytes(sRef, imageFile);
    imageUrl = await getDownloadURL(sRef);
  }
  await addDoc(collection(db, 'comments'), {
    productId, userId: currentUser.uid, text: text || '', imageUrl, createdAt: serverTimestamp()
  });
  alert('Comment posted');
}

/* ---------------------------
   Badges & Level calculation
   --------------------------- */
async function recalcBadgesAndLevel(uid) {
  const uRef = doc(db, 'users', uid);
  const uSnap = await getDoc(uRef);
  const data = uSnap.data() || {};
  const coins = data.coins || 0;
  let badges = data.badges || [];

  if (coins >= 1 && !badges.includes('first_purchase')) badges.push('first_purchase');
  if (coins >= 50 && !badges.includes('fashion_enthusiast')) badges.push('fashion_enthusiast');
  if ((data.wishlist || []).length >= 10 && !badges.includes('curator')) badges.push('curator');

  let level = 'Rosebud';
  if (coins >= 1000) level = 'Garden Queen';
  else if (coins >= 500) level = 'Orchid';
  else if (coins >= 250) level = 'Blossom';

  await updateDoc(uRef, { badges, level });
}

/* ---------------------------
   Waitlist notification helper
   (Run when seller restocks — ideally in Cloud Function)
   --------------------------- */
async function notifyWaitlist(productId) {
  const pRef = doc(db, 'products', productId);
  const pSnap = await getDoc(pRef);
  if (!pSnap.exists()) return;
  const data = pSnap.data();
  const waitlist = data.waitlist || [];
  for (const uid of waitlist) {
    await updateDoc(doc(db, 'users', uid), {
      notifications: arrayUnion({
        type: 'back_in_stock',
        productId,
        title: data.title,
        createdAt: serverTimestamp(),
        read: false
      })
    });
  }
  // clear waitlist (optional) or keep it
  await updateDoc(pRef, { waitlist: [] });
}

/* ---------------------------
   Image/Text Search (Flora hooks)
   --------------------------- */
async function triggerPhotoSearch() {
  const file = imgSearchFile && imgSearchFile.files && imgSearchFile.files[0];
  if (!file && (!searchInput || !searchInput.value.trim())) {
    return alert('Choose a photo or enter text to search');
  }
  if (file) {
    // upload photo, then call AI endpoint (placeholder)
    const path = `searchUploads/${currentUser.uid}/${Date.now()}_${file.name}`;
    const sRef = storageRef(storage, path);
    await uploadBytes(sRef, file);
    const imageUrl = await getDownloadURL(sRef);
    // TODO: call your AI function with imageUrl to get similar product IDs
    alert('Image uploaded for search (AI backend required).');
  } else {
    // text search placeholder
    triggerTextSearch();
  }
}

async function triggerTextSearch() {
  const q = searchInput.value.trim();
  if (!q) return alert('Enter search text');
  // simple client-side: fetch all products and filter title / description
  const snaps = await getDocs(collection(db, 'products'));
  const results = [];
  snaps.forEach(s => {
    const p = s.data();
    p.id = s.id;
    const hay = `${p.title} ${p.description}`.toLowerCase();
    if (hay.includes(q.toLowerCase())) results.push(p);
  });
  productGrid.innerHTML = '';
  results.forEach(r => renderProductCard(r));
}

/* ---------------------------
   Utility helpers
   --------------------------- */
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, tag => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[tag]));
}

async function loadUserUI() {
  try {
    const uSnap = await getDoc(doc(db, 'users', currentUser.uid));
    if (!uSnap.exists()) return;
    const data = uSnap.data();
    updateUserUIFromData(data);
  } catch (e) {
    console.error('loadUserUI', e);
  }
}

function updateUserUIFromData(data) {
  if (meLevelEl) meLevelEl.textContent = data.level || 'Rosebud';
  if (meCoinsEl) meCoinsEl.textContent = data.coins ?? 0;
  if (badgesContainer) {
    badgesContainer.innerHTML = '';
    (data.badges || []).forEach(b => {
      const el = document.createElement('span');
      el.className = 'badge';
      el.textContent = b.replace(/_/g, ' ');
      badgesContainer.appendChild(el);
    });
  }
  loadWishlistUI().catch(()=>{});
}

/* ---------------------------
   Filters UI binding (basic)
   --------------------------- */
document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', async (e) => {
  document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cat = btn.getAttribute('data-cat') || '';
  // simple filtered query by category
  if (!cat) {
    subscribeProductsRealtime();
    return;
  }
  const q = query(collection(db, 'products'), where('category', '==', cat), orderBy('createdAt', 'desc'));
  if (unsubscribeProducts) unsubscribeProducts();
  unsubscribeProducts = onSnapshot(q, snap => {
    productGrid.innerHTML = '';
    snap.forEach(d => {
      const p = d.data(); p.id = d.id;
      renderProductCard(p);
    });
  });
}));

/* ---------------------------
   Export some functions to global for inline HTML calls (if used)
   --------------------------- */
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.logout = logout;
window.switchTab = switchTab;
window.filterProducts = (cat) => {
  document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
  const btn = Array.from(document.querySelectorAll('.filter')).find(x => x.getAttribute('data-cat') === (cat === 'all' ? '' : cat));
  if (btn) btn.classList.add('active');
  // call the click handler
  document.querySelectorAll('.filter').forEach(b => b.dispatchEvent(new Event('click')));
};
window.triggerPhotoSearch = triggerPhotoSearch;
window.triggerTextSearch = triggerTextSearch;
window.createLookbook = createLookbook;
window.addToLookbook = addToLookbook;
window.toggleWishlist = toggleWishlist;
window.postComment = postComment;
window.toggleFollowSeller = toggleFollowSeller;

/* ---------------------------
   End of file
   --------------------------- */
