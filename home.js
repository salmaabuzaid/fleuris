import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabase = createClient('https://ervcbdxtlzomgbbfwncl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bHpvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI2NDMsImV4cCI6MjA2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqhmIE65VIUpZsFpTbIVBt4w');

async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

window.logout = logout;

function joinWaitlist() {
  alert('You’ve been added to the waitlist! You’ll be notified when this is back.');
}

window.joinWaitlist = joinWaitlist;
