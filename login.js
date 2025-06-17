document.addEventListener('DOMContentLoaded', () => {
  const supabase = window.supabase.createClient(
    'https://ervcbdxtlzomgbbfwncl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bHpvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI2NDMsImV4cCI6MjA2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqhmIE65VIUpZsFpTbIVBt4w'
  );

  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeBtn = loginModal.querySelector('.close-btn');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    loginModal.classList.remove('active');
    loginForm.reset();
    loginError.textContent = '';
  });

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.classList.remove('active');
      loginForm.reset();
      loginError.textContent = '';
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    loginError.textContent = '';

    if (!email || !password) {
      loginError.textContent = 'Please enter both email and password.';
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      loginError.textContent = error.message;
    } else {
      window.location.href = 'home.html';
    }
  });
});
