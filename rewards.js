import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
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
