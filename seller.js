// Use the same Firebase config as home.js - initialize only once
// Assuming firebase already initialized

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const btnLogout = document.getElementById("btnLogout");

const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productCategory = document.getElementById("productCategory");
const productEco = document.getElementById("productEco");
const productImage = document.getElementById("productImage");
const btnAddProduct = document.getElementById("btnAddProduct");

const auctionListSeller = document.getElementById("auctionListSeller");
const auctionProductName = document.getElementById("auctionProductName");
const auctionStartBid = document.getElementById("auctionStartBid");
const auctionEndTime = document.getElementById("auctionEndTime");
const btnCreateAuction = document.getElementById("btnCreateAuction");

const bundleListSeller = document.getElementById("bundleListSeller");
const bundleTitle = document.getElementById("bundleTitle");
const bundleProducts = document.getElementById("bundleProducts");
const bundleDiscount = document.getElementById("bundleDiscount");
const bundlePrice = document.getElementById("bundlePrice");
const btnCreateBundle = document.getElementById("btnCreateBundle");

const lookbookListSeller = document.getElementById("lookbookListSeller");
const lookbookTitle = document.getElementById("lookbookTitle");
const lookbookCover = document.getElementById("lookbookCover");
const lookbookVideo = document.getElementById("lookbookVideo");
const btnCreateLookbook = document.getElementById("btnCreateLookbook");

const ordersListSeller = document.getElementById("ordersListSeller");

let currentUser = null;

// Logout
btnLogout.onclick = async () => {
  await auth.signOut();
  window.location.href = "index.html";
};

// Check auth state
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  currentUser = user;

  // Check role is seller
  const userDoc = await db.collection("users").doc(user.uid).get();
  if (!userDoc.exists || userDoc.data().role !== "seller") {
    alert("You must be a seller to access this page.");
    await auth.signOut();
    window.location.href = "index.html";
    return;
  }

  loadSellerProducts();
  loadSellerAuctions();
  loadSellerBundles();
  loadSellerLookbooks();
  loadSellerOrders();
});

// Add product
btnAddProduct.onclick = async () => {
  const name = productName.value.trim();
  const price = Number(productPrice.value);
  const category = productCategory.value;
  const ecoFriendly = productEco.checked;
  const imageFile = productImage.files[0];

  if (!name || !price || !category || !imageFile) {
    alert("Please fill all product fields and select an image.");
    return;
  }

  const imageRef = storage.ref().child(`products/${currentUser.uid}_${Date.now()}.jpg`);
  await imageRef.put(imageFile);
  const imageUrl = await imageRef.getDownloadURL();

  await db.collection("products").add({
    name,
    price,
    category,
    ecoFriendly,
    imageUrl,
    sellerId: currentUser.uid,
    createdAt: new Date(),
  });

  alert("Product added!");
  productName.value = "";
  productPrice.value = "";
  productEco.checked = false;
  productImage.value = "";
  loadSellerProducts();
};

// Load seller products
async function loadSellerProducts() {
  const productsSnap = await db.collection("products").where("sellerId", "==", currentUser.uid).get();
  auctionListSeller.innerHTML = "<h3>Your Products</h3>";
  productsSnap.forEach((doc) => {
    const p = doc.data();
    const div = document.createElement("div");
    div.textContent = `${p.name} - EGP ${p.price} (${p.category}) ${p.ecoFriendly ? "🌿" : ""}`;
    auctionListSeller.appendChild(div);
  });
}

// Create auction
btnCreateAuction.onclick = async () => {
  const productNameVal = auctionProductName.value.trim();
  const startBidVal = Number(auctionStartBid.value);
  const endTimeVal = auctionEndTime.value;

  if (!productNameVal || !startBidVal || !endTimeVal) {
    alert("Please fill all auction fields.");
    return;
  }

  const endTimestamp = new Date(endTimeVal);
  if (endTimestamp <= new Date()) {
    alert("End time must be in the future.");
    return;
  }

  await db.collection("auctions").add({
    productName: productNameVal,
    currentBid: startBidVal,
    highestBidder: null,
    endTime: firebase.firestore.Timestamp.fromDate(endTimestamp),
    sellerId: currentUser.uid,
    createdAt: new Date(),
  });

  alert("Auction created!");
  auctionProductName.value = "";
  auctionStartBid.value = "";
  auctionEndTime.value = "";
  loadSellerAuctions();
};

// Load auctions by seller
async function loadSellerAuctions() {
  const snap = await db.collection("auctions").where("sellerId", "==", currentUser.uid).get();
  auctionListSeller.innerHTML = "<h3>Your Auctions</h3>";
  snap.forEach((doc) => {
    const a = doc.data();
    const div = document.createElement("div");
    div.textContent = `${a.productName} - Current Bid: EGP ${a.currentBid} - Ends: ${a.endTime.toDate().toLocaleString()}`;
    auctionListSeller.appendChild(div);
  });
}

// Create bundle
btnCreateBundle.onclick = async () => {
  const titleVal = bundleTitle.value.trim();
  const productsVal = bundleProducts.value.trim();
  const discountVal = Number(bundleDiscount.value);
  const priceVal = Number(bundlePrice.value);

  if (!titleVal || !productsVal || !discountVal || !priceVal) {
    alert("Please fill all bundle fields.");
    return;
  }

  const productNamesArr = productsVal.split(",").map((p) => p.trim());

  await db.collection("bundles").add({
    title: titleVal,
    productNames: productNamesArr,
    discountPercent: discountVal,
    priceAfterDiscount: priceVal,
    sellerId: currentUser.uid,
    createdAt: new Date(),
  });

  alert("Bundle created!");
  bundleTitle.value = "";
  bundleProducts.value = "";
  bundleDiscount.value = "";
  bundlePrice.value = "";
  loadSellerBundles();
};

// Load bundles by seller
async function loadSellerBundles() {
  const snap = await db.collection("bundles").where("sellerId", "==", currentUser.uid).get();
  bundleListSeller.innerHTML = "<h3>Your Bundles</h3>";
  snap.forEach((doc) => {
    const b = doc.data();
    const div = document.createElement("div");
    div.textContent = `${b.title} - Discount: ${b.discountPercent}% - Price: EGP ${b.priceAfterDiscount}`;
    bundleListSeller.appendChild(div);
  });
}

// Create lookbook/story
btnCreateLookbook.onclick = async () => {
  const titleVal = lookbookTitle.value.trim();
  const coverFile = lookbookCover.files[0];
  const videoFile = lookbookVideo.files[0];

  if (!titleVal || !coverFile || !videoFile) {
    alert("Please fill all lookbook fields and select files.");
    return;
  }

  // Upload cover
  const coverRef = storage.ref().child(`lookbooks/covers/${currentUser.uid}_${Date.now()}.jpg`);
  await coverRef.put(coverFile);
  const coverUrl = await coverRef.getDownloadURL();

  // Upload video
  const videoRef = storage.ref().child(`lookbooks/videos/${currentUser.uid}_${Date.now()}.mp4`);
  await videoRef.put(videoFile);
  const videoUrl = await videoRef.getDownloadURL();

  await db.collection("lookbooks").add({
    title: titleVal,
    coverImage: coverUrl,
    storyVideoUrl: videoUrl,
    sellerId: currentUser.uid,
    createdAt: new Date(),
  });

  alert("Lookbook/story created!");
  lookbookTitle.value = "";
  lookbookCover.value = "";
  lookbookVideo.value = "";
  loadSellerLookbooks();
};

// Load lookbooks by seller
async function loadSellerLookbooks() {
  const snap = await db.collection("lookbooks").where("sellerId", "==", currentUser.uid).get();
  lookbookListSeller.innerHTML = "<h3>Your Lookbooks & Stories</h3>";
  snap.forEach((doc) => {
    const lb = doc.data();
    const div = document.createElement("div");
    div.textContent = lb.title;
    lookbookListSeller.appendChild(div);
  });
}

// Load orders (COD)
async function loadSellerOrders() {
  const snap = await db.collection("orders").where("sellerId", "==", currentUser.uid).get();
  ordersListSeller.innerHTML = "<h3>Orders</h3>";
  snap.forEach((doc) => {
    const o = doc.data();
    const div = document.createElement("div");
    div.innerHTML = `
      <p>Order ID: ${doc.id}</p>
      <p>Buyer: ${o.buyerEmail || 'Unknown'}</p>
      <p>Products: ${o.productNames.join(", ")}</p>
      <p>Total: EGP ${o.totalPrice}</p>
      <p>Status: ${o.status}</p>
      <hr/>
    `;
    ordersListSeller.appendChild(div);
  });
}
