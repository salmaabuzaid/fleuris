import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bH-pvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJp-YXQiOjE3NDkxMjI2NDMsImV4cCI6Mj-A2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqh-mIE65VIUpZsFpTbIVBt4w';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function addPoints(userId, pointsToAdd) {
  const { data, error } = await supabase
    .from('rewards')
    .select('points')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  const newPoints = (data?.points || 0) + pointsToAdd;

  await supabase
    .from('rewards')
    .upsert({ user_id: userId, points: newPoints });
}

export async function redeemPoints(userId, pointsToUse) {
  // Similar to above but subtract points with checks
}
