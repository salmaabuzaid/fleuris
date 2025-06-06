// Initialize Supabase client - replace with your own Supabase URL and anon key
const SUPABASE_URL = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bHpvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjI2NDMsImV4cCI6MjA2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqhmIE65VIUpZsFpTbIVBt4w';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentication APIs
async function signUp(email, password) {
  const { user, error } = await supabase.auth.signUp({ email, password });
  return { user, error };
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  return error;
}

// Fetch featured products from Supabase
async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return { data, error };
}

// Get current user session
async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
