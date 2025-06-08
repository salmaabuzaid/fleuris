// login.js

const supabaseUrl = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bHpvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI2NDMsImV4cCI6MjA2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqhmIE65VIUpZsFpTbIVBt4w';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');

// Open login modal
loginBtn.addEventListener('click', () => {
  loginModal.classList.add('active');
});

// Close button
loginModal.querySelector('.close-btn').addEventListener('click', () => {
  loginModal.classList.remove('active');
  clearLoginForm();
});

// Clear login form
function clearLoginForm() {
  document.getElementById('loginError').textContent = '';
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
}

// Login form submit
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorEl = document.getElementById('loginError');
  errorEl.textContent = '';

  if (!email || !password) {
    errorEl.textContent = 'Please enter both email and password.';
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      errorEl.textContent = error.message;
      return;
    }
    // Successful login - redirect
    window.location.href = 'home.html';
  } catch (err) {
    errorEl.textContent = 'Unexpected error: ' + err.message;
  }
});

// Close modal on clicking outside the modal content
loginModal.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    loginModal.classList.remove('active');
    clearLoginForm();
  }
});
