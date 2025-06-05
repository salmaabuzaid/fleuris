import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bH-pvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJp-YXQiOjE3NDkxMjI2NDMsImV4cCI6Mj-A2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqh-mIE65VIUpZsFpTbIVBt4w';
const supabase = createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('auction-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = supabase.auth.user();
  if (!user) {
    alert('Please login to create an auction.');
    return;
  }

  const product_id = document.getElementById('product_id').value.trim();
  const start_price = parseFloat(document.getElementById('start_price').value);
  const start_time = new Date(document.getElementById('start_time').value).toISOString();
  const end_time = new Date(document.getElementById('end_time').value).toISOString();

  if (new Date(start_time) >= new Date(end_time)) {
    alert('End time must be after start time.');
    return;
  }

  const { data, error } = await supabase
    .from('auctions')
    .insert([
      {
        product_id,
        seller_id: user.id,
        start_price,
        current_bid: start_price,
        start_time,
        end_time,
        status: 'active'
      }
    ]);

  if (error) {
    alert('Error creating auction: ' + error.message);
  } else {
    alert('Auction created successfully!');
    form.reset();
  }
});
