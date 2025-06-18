<script>
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const targetId = btn.textContent.toLowerCase().replace(/\s+/g, '') + 'Tab';

      // Toggle active state on nav buttons
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle visible tab content
      tabContents.forEach(content => {
        if (content.id === targetId) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });
</script>
