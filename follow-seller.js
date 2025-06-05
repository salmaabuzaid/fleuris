import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bH-pvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJp-YXQiOjE3NDkxMjI2NDMsImV4cCI6Mj-A2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqh-mIE65VIUpZsFpTbIVBt4w';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function followSeller(sellerId) {
  const user = supabase.auth.user();
  if (!user) {
    alert('Login required');
    return;
  }

  // Check if already following
  const { data: existing } = await supabase
    .from('seller_followers')
    .select('*')
    .eq('follower_id', user.id)
    .eq('seller_id', sellerId)
    .single();

  if (existing) {
    alert('You already follow this seller');
    return;
  }

  const { error } = await supabase
    .from('seller_followers')
    .insert([{ follower_id: user.id, seller_id: sellerId }]);

  if (error) {
    alert('Error following seller: ' + error.message);
  } else {
    alert('Seller followed!');
  }
}

export async function unfollowSeller(sellerId) {
  const user = supabase.auth.user();
  if (!user) {
    alert('Login required');
    return;
  }

  const { error } = await supabase
    .from('seller_followers')
    .delete()
    .eq('follower_id', user.id)
    .eq('seller_id', sellerId);

  if (error) {
    alert('Error unfollowing seller: ' + error.message);
  } else {
    alert('Seller unfollowed!');
  }
}
