document.addEventListener('DOMContentLoaded', () => {
  const supabase = window.supabase.createClient(
    'https://ervcbdxtlzomgbbfwncl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bHpvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI2NDMsImV4cCI6MjA2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqhmIE65VIUpZsFpTbIVBt4w'
  );

  const signupBtn = document.getElementById('signupBtn');
  const signupModal = document.getElementById('signupModal');
  const closeBtn = signupModal.querySelector('.close-btn');
  const signupForm = document.getElementById('signupForm');
  const signupError = document.getElementById('signupError');

  signupBtn.addEventListener('click', () => {
    signupModal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    signupModal.classList.remove('active');
    signupForm.reset();
    signupError.textContent = '';
  });

  signupModal.addEventListener('click', (e) => {
    if (e.target === signupModal) {
      signupModal.classList.remove('active');
      signupForm.reset();
      signupError.textContent = '';
    }
  });

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    signupError.textContent = '';

    if (!email || !password) {
      signupError.textContent = 'Please enter both email and password.';
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      signupError.textContent = error.message;
    } else {
      alert('Sign up successful! Please check your email to confirm your account.');
      signupModal.classList.remove('active');
      signupForm.reset();
    }
  });
});
