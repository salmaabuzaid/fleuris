// --- Rewards System Logic ---

// Setup default values
if (!localStorage.getItem("points")) {
  localStorage.setItem("points", "0");
  localStorage.setItem("coins", "0");
  localStorage.setItem("level", "Rosebud");
}

// Get values
function updateRewardsDisplay() {
  const points = parseInt(localStorage.getItem("points"));
  const coins = parseInt(localStorage.getItem("coins"));
  const level = localStorage.getItem("level");
  document.getElementById("points-display").innerText = `${points} pts | ${coins} coins | Level: ${level}`;
}

// Simulate a purchase
function makePurchase(amountSpent) {
  let points = parseInt(localStorage.getItem("points")) + amountSpent * 10;
  let coins = parseInt(localStorage.getItem("coins")) + amountSpent * 2;
  localStorage.setItem("points", points);
  localStorage.setItem("coins", coins);

  // Leveling logic
  let level = "Rosebud";
  if (points >= 1000) level = "Orchid";
  else if (points >= 500) level = "Blossom";
  else level = "Rosebud";
  localStorage.setItem("level", level);

  updateRewardsDisplay();
}

// Call this when app loads
updateRewardsDisplay();

// Example: To simulate a $25 purchase, call:
makePurchase(25);