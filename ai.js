const recommended = ["Pastel Skirt", "Rose Gold Ring", "Vintage Purse"];

function showAIRecommendations() {
  const container = document.createElement("div");
  container.innerHTML = "<h3>💡 AI Recommendations</h3><ul>" + 
    recommended.map(item => `<li>${item}</li>`).join('') + "</ul>";
  document.body.appendChild(container);
}
