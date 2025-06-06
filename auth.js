const authModal = document.getElementById('authModal');

export function showAuthModal(type) {
  authModal.classList.remove('hidden');
  authModal.innerHTML = type === 'login' ? getLoginForm() : getSignupForm();

  document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (type === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else window.location.reload();
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert('Check your email for verification link!');
    }
  });
}

function getLoginForm() {
  return `
    <form id="authForm">
      <h2>Login</h2>
      <input type="email" name="email" placeholder="Email" required/>
      <input type="password" name="password" placeholder="Password" required/>
      <button type="submit">Login</button>
      <button type="button" onclick="closeAuthModal()">Cancel</button>
    </form>
  `;
}

function getSignupForm() {
  return `
    <form id="authForm">
      <h2>Sign Up</h2>
      <input type="email" name="email" placeholder="Email" required/>
      <input type="password" name="password" placeholder="Password" required/>
      <button type="submit">Sign Up</button>
      <button type="button" onclick="closeAuthModal()">Cancel</button>
    </form>
  `;
}

export function closeAuthModal() {
  authModal.classList.add('hidden');
  authModal.innerHTML = '';
}
