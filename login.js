// login.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your real Supabase URL and anon key
const supabaseUrl = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bHpvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI2NDMsImV4cCI6MjA2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqhmIE65VIUpZsFpTbIVBt4w';
const supabase = createClient(supabaseUrl, supabaseKey);

// Auto-redirect if already logged in
supabase.auth.getSession().then(({ data }) => {
  if (data.session) {
    window.location.href = 'index.html';
  }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert('Login failed: ' + error.message);
  } else {
    alert('Login successful!');
    window.location.href = 'index.html'; // Change to your main page
  }
});
