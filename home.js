import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAx7DAvkZupSDXg4aXWvtfSQWhqX32Kwrs",
  authDomain: "fleuris-3df99.firebaseapp.com",
  projectId: "fleuris-3df99",
  storageBucket: "fleuris-3df99.appspot.com",
  messagingSenderId: "831344111439",
  appId: "1:831344111439:web:YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

// Settings modal
const settingsBtn = document.getElementById('settings-btn');
const modal = document.getElementById('settings-modal');
const closeBtn = document.getElementById('close-settings');
settingsBtn.onclick = () => modal.classList.remove('hidden');
closeBtn.onclick = () => modal.classList.add('hidden');

// Logout
document.getElementById("logout-btn").onclick = () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

async function floraAsk() {
  const desc = document.getElementById('floraInput').value;
  const img = document.getElementById('floraImage').files[0];
  let imageUrl = null;
  if (img) {
    const imgRef = ref(storage, `floraSearch/${auth.currentUser.uid}/${Date.now()}_${img.name}`);
    await uploadBytes(imgRef, img);
    imageUrl = await getDownloadURL(imgRef);
  }
  const prompt = { description: desc || null, imageUrl };
  const resBox = document.getElementById('floraResponses');
  resBox.innerHTML = `<p>Processing…</p>`;
  // Call your AI backend (e.g. cloud function) - you need to implement on server
  // Example: call fetch('/api/flora', { method:'POST', body: JSON.stringify(prompt) })
  // After response:
  // const suggestions = await fetch... res.json();
  // For demo:
  const suggestions = [
    { title: 'Matching Floral Dress', imageUrl: 'https://via.placeholder.com/120', price: 45 },
    { title: 'Green Scarf', imageUrl: 'https://via.placeholder.com/120', price: 20 }
  ];
  resBox.innerHTML = suggestions.map(p =>
    `<div class="product-card"><img src="${p.imageUrl}"><div class="product-info"><h3>${p.title}</h3><p>$${p.price}</p></div></div>`
  ).join('');
}

function toggleFlora() {
  document.getElementById('floraModal').classList.toggle('hidden');
}

async function showSellerProfile(sellerId) {
  const doc = await getDoc(doc(db, 'sellerProfiles', sellerId));
  const data = doc.data();
  document.getElementById('sellerName').textContent = data.name;
  const uid = auth.currentUser.uid;
  const userDoc = await getDoc(doc(db, 'users', uid));
  const following = userDoc.data().following || [];
  document.getElementById('followBtn').textContent = following.includes(sellerId) ? 'Unfollow' : 'Follow';

  const productsSnap = await getDocs(query(collection(db, 'products'), where('sellerId','==',sellerId)));
  const feed = document.getElementById('sellerFeed');
  feed.innerHTML = '';
  productsSnap.forEach(d => {
    const p = d.data();
    feed.innerHTML += `
      <div class="product-card"><img src="${p.imageUrl}"><div class="product-info"><h3>${p.title}</h3><p>$${p.price}</p></div></div>`;
  });
  document.getElementById('sellerProfile').classList.remove('hidden');
}

async function toggleFollow() {
  const sellerId = /* captured when profile opened */;
  const uid = auth.currentUser.uid;
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  const following = snap.data().following || [];
  if (following.includes(sellerId)) {
    const updated = following.filter(x => x !== sellerId);
    await updateDoc(userRef, { following: updated });
    document.getElementById('followBtn').textContent = 'Follow';
  } else {
    following.push(sellerId);
    await updateDoc(userRef, { following });
    document.getElementById('followBtn').textContent = 'Unfollow';
  }
}

await setDoc(doc(db, 'users', user.uid), {
  role: 'buyer',
  level: 'Rosebud',
  coins: 0,
  badges: [],
  wishlist: [],
  following: []
});
async function recordPurchase(amountUsd) {
  const uid = auth.currentUser.uid;
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  const data = snap.data();
  const newCoins = (data.coins || 0) + Math.floor(amountUsd);
  await updateDoc(userRef, { coins: newCoins });
}
onAuthStateChanged(auth, async user => {
  if (!user) return;
  const snap = await getDoc(doc(db, 'users', user.uid));
  const data = snap.data();
  document.getElementById('userLevel').textContent = data.level;
  document.getElementById('userCoins').textContent = (data.coins || 0);
  (data.badges || []).forEach(b => {
    document.getElementById('badgesContainer').innerHTML += `<span class="badge">${b}</span>`;
  });
});
async function imageSearch() {
  const file = document.getElementById('imgSearchFile').files[0];
  if (!file) return alert('Select image');
  const refPath = `searchUploads/${auth.currentUser.uid}/${Date.now()}_${file.name}`;
  const imgRef = ref(storage, refPath);
  await uploadBytes(imgRef, file);
  const imageUrl = await getDownloadURL(imgRef);

  // Send to AI backend to detect similar products
  // Here, mock the response:
  const sims = [
    { title: 'Similar Item 1', imageUrl: 'https://via.placeholder.com/120', price: 35 },
    { title: 'Similar Item 2', imageUrl: 'https://via.placeholder.com/120', price: 50 }
  ];
  const grid = document.getElementById('imgSearchResults');
  grid.innerHTML = sims.map(p =>
    `<div class="product-card"><img src="${p.imageUrl}"><div class="product-info"><h3>${p.title}</h3><p>$${p.price}</p></div></div>`
  ).join('');
}

const badgeThresholds = [
  { key: 'first', label: 'First Purchase', condition: u => u.coins >= 1 },
  { key: 'enthusiast', label: 'Fashion Enthusiast', condition: u => u.coins >= 50 },
  { key: 'curator', label: 'Collection Curator', condition: u => (u.wishlist || []).length >= 10 },
];

async function updateBadges(userData, uid) {
  const userRef = doc(db, 'users', uid);
  const current = userData.badges || [];
  let changed = false;
  badgeThresholds.forEach(b => {
    if (b.condition(userData) && !current.includes(b.key)) {
      current.push(b.key);
      changed = true;
    }
  });
  if (changed) {
    await updateDoc(userRef, { badges: current });
    loadBadges(current);
  }
}

function loadBadges(badges) {
  const container = document.getElementById('badgesContainer');
  container.innerHTML = '';
  badges.forEach(b => {
    container.innerHTML += `<div class="badge">${badgeThresholds.find(x=>x.key===b).label}</div>`;
  });
}

updateBadges(data, user.uid);
loadBadges(data.badges || []);

async function loadFeed() {
  const uid = auth.currentUser.uid;
  // Placeholder: load recently purchased categories
  const purchasesSnap = await getDocs(collection(db, 'purchases', uid, 'items'));
  const purchasedCategories = new Set();
  purchasesSnap.forEach(d => purchasedCategories.add(d.data().category));

  // Query products in those categories
  let products = [];
  for (const cat of purchasedCategories) {
    const snap = await getDocs(query(collection(db, 'products'), where('category', '==', cat), limit(5)));
    snap.forEach(d => products.push(d.data()));
  }

  // Render
  const feedEl = document.getElementById('personalFeed');
  if (!feedEl) return;
  feedEl.innerHTML = products.map(p =>
    `<div class="product-card"><img src="${p.imageUrl}"><div class="product-info"><h3>${p.title}</h3><p>$${p.price}</p></div></div>`
  ).join('');
}

async function createLookbook() {
  const title = prompt('Title your lookbook:');
  if (!title) return;
  const docRef = await addDoc(collection(db, 'lookbooks', auth.currentUser.uid, 'boards'), {
    title, createdAt: serverTimestamp()
  });
  loadLookbooks();
}

async function loadLookbooks() {
  const snap = await getDocs(collection(db, 'lookbooks', auth.currentUser.uid, 'boards'));
  const list = document.getElementById('lookbookList');
  list.innerHTML = '';
  for (const d of snap.docs) {
    const lb = d.data();
    list.innerHTML += `<div class="lookbook-card" onclick="viewLookbook('${d.id}','${lb.title}')"><h4>${lb.title}</h4></div>`;
  }
}

async function viewLookbook(boardId, title) {
  const snap = await getDocs(collection(db, 'lookbooks', auth.currentUser.uid, 'boards', boardId, 'items'));
  const items = snap.docs.map(d=>d.data());
  const list = document.getElementById('lookbookList');
  list.innerHTML = `<h3>${title}</h3>`;
  items.forEach(p => {
    list.innerHTML += `<div class="product-card"><img src="${p.imageUrl}"><div class="product-info"><h3>${p.title}</h3><p>$${p.price}</p></div></div>`;
  });
}

async function addToLookbook(boardId, product) {
  await addDoc(collection(db, 'lookbooks', auth.currentUser.uid, 'boards', boardId, 'items'), product);
}
