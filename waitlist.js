import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bH-pvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJp-YXQiOjE3NDkxMjI2NDMsImV4cCI6Mj-A2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqh-mIE65VIUpZsFpTbIVBt4w';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function joinWaitlist(productId) {
  const user = supabase.auth.user();
  if (!user) {
    alert('Please login to join waitlist');
    return;
  }

  const { data: existing } = await supabase
    .from('waitlist')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single();

  if (existing) {
    alert('You are already on the waitlist for this product.');
    return;
  }

  const { error } = await supabase
    .from('waitlist')
    .insert([{ user_id: user.id, product_id: productId }]);

  if (error) {
    alert('Error joining waitlist: ' + error.message);
  } else {
    alert('Added to waitlist. You will be notified when back in stock.');
