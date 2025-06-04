let points = 0;
let coins = 0;
let level = "Rosebud";

function updateDisplay() {
  const display = document.getElementById("points-display");
  if (display) {
    display.textContent = `${points} pts | ${coins} coins | Level: ${level}`;
  }
}

updateDisplay();