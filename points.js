import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ervcbdxtlzomgbbfwncl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydmNiZHh0bH-pvbWdiYmZ3bmNsIiwicm9sZSI6ImFub24iLCJp-YXQiOjE3NDkxMjI2NDMsImV4cCI6Mj-A2NDY5ODY0M30.rr2hpt4QtBK2US92bzYQqh-mIE65VIUpZsFpTbIVBt4w';
const supabase = createClient(supabaseUrl, supabaseKey);

const levels = [
  { name: 'Rosebud', minPoints: 0 },
  { name: 'Blossom', minPoints: 100 },
  { name: 'Orchid', minPoints: 250 },
  { name: 'Gardenia', minPoints: 500 }
];

export async function addPoints(userId, pointsToAdd) {
  let { data: reward, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // Not found, create new record
    reward = { user_id: userId, points: 0, level: 'Rosebud' };
  } else if (error) {
    console.error(error);
    return;
  }

  const newPoints = (reward.points || 0) + pointsToAdd;

  // Calculate new level
  let newLevel = reward.level;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (newPoints >= levels[i].minPoints) {
      newLevel = levels[i].name;
      break;
    }
  }

  const { error: upsertError } = await supabase
    .from('rewards')
    .upsert({ user_id: userId, points: newPoints, level: newLevel });

  if (upsertError) {
    console.error(upsertError);
  }
}
