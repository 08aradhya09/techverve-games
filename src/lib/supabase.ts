import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  avatar_type: string;
  avatar_color: string;
  bio: string;
  total_points: number;
  level: number;
  created_at: string;
  updated_at: string;
};

export type Game = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  icon: string;
  is_multiplayer: boolean;
  is_featured: boolean;
  play_count: number;
  created_at: string;
};

export type GameSession = {
  id: string;
  game_id: string;
  player_id: string;
  score: number;
  duration_seconds: number;
  completed: boolean;
  multiplayer_room_id?: string;
  created_at: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  rarity: string;
  created_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
};

export type CommunityPost = {
  id: string;
  author_id: string;
  content: string;
  post_type: string;
  game_id?: string;
  score?: number;
  likes_count: number;
  created_at: string;
  profile?: Profile;
  game?: Game;
};
