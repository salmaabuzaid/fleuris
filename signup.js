// signup.js

const supabaseUrl = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bHpvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI2NDMsImV4cCI6MjA2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqhmIE65VIUpZsFpTbIVBt4w';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const signupModal = document.getElementById('signupModal');
const signupBtn = document.getElementById('signupBtn');

// Open signup modal
signupBtn.addEventListener('click', () => {
  signupModal.classList.add('active');
});

// Close button
signupModal.querySelector('.close-btn').addEventListener('click', () => {
  signupModal.classList.remove('active');
  clearSignupForm();
});

// Clear signup form
function clearSignupForm() {
  document.getElementById('signupError').textContent = '';
  document.getElementById('signupEmail').value = '';
  document.getElementById('signupPassword').value = '';
}

// Signup form submit
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const errorEl = document.getElementById('signupError');
  errorEl.textContent = '';

  if (!email || !password) {
    errorEl.textContent = 'Please enter both email and password.';
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      errorEl.textContent = error.message;
      return;
    }
    alert('Sign up successful! Please check your email to confirm your account.');
    signupModal.classList.remove('active');
    clearSignupForm();
  } catch (err) {
    errorEl.textContent = 'Unexpected error: ' + err.message;
  }
});

// Close modal on clicking outside the modal content
signupModal.addEventListener('click', (e) => {
  if (e.target === signupModal) {
    signupModal.classList.remove('active');
    clearSignupForm();
  }
});
