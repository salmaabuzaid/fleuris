document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".nav-tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");

      // Deactivate all tabs
      tabs.forEach((btn) => btn.classList.remove("active"));

      // Hide all tab contents
      contents.forEach((content) => content.classList.add("hidden"));

      // Activate clicked tab and show related content
      tab.classList.add("active");
      document.getElementById(targetId).classList.remove("hidden");
    });
  });
});
