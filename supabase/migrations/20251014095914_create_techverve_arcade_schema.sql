/*
  # TechVerve Arcade Database Schema

  ## Overview
  Complete database structure for a technology-focused gaming platform for teenagers,
  supporting user profiles, games, achievements, leaderboards, and community features.

  ## New Tables

  ### 1. profiles
  Extended user profile information linked to Supabase auth
  - `id` (uuid, primary key) - References auth.users
  - `username` (text, unique) - Display name
  - `avatar_type` (text) - Avatar persona (coder, gamer, designer, hacker, innovator)
  - `avatar_color` (text) - Primary avatar color
  - `bio` (text) - User biography
  - `total_points` (integer) - Cumulative points across all games
  - `level` (integer) - User level based on points
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. games
  Catalog of available games on the platform
  - `id` (uuid, primary key) - Game identifier
  - `title` (text) - Game name
  - `description` (text) - Game description
  - `category` (text) - Game type (trivia, puzzle, arcade, creative)
  - `difficulty` (text) - Difficulty level (easy, medium, hard)
  - `icon` (text) - Lucide icon name
  - `is_multiplayer` (boolean) - Supports multiplayer
  - `is_featured` (boolean) - Featured on homepage
  - `play_count` (integer) - Total times played
  - `created_at` (timestamptz) - Game addition date

  ### 3. game_sessions
  Individual gameplay records
  - `id` (uuid, primary key) - Session identifier
  - `game_id` (uuid) - References games table
  - `player_id` (uuid) - References profiles table
  - `score` (integer) - Points earned in session
  - `duration_seconds` (integer) - Time spent playing
  - `completed` (boolean) - Session completion status
  - `multiplayer_room_id` (uuid) - For multiplayer sessions
  - `created_at` (timestamptz) - Session start time

  ### 4. achievements
  Available achievement badges
  - `id` (uuid, primary key) - Achievement identifier
  - `title` (text) - Achievement name
  - `description` (text) - How to earn it
  - `icon` (text) - Lucide icon name
  - `category` (text) - Achievement type (skill, social, milestone)
  - `points` (integer) - Points awarded
  - `rarity` (text) - Common, rare, epic, legendary
  - `created_at` (timestamptz) - Achievement creation date

  ### 5. user_achievements
  Tracks which users earned which achievements
  - `id` (uuid, primary key) - Record identifier
  - `user_id` (uuid) - References profiles table
  - `achievement_id` (uuid) - References achievements table
  - `earned_at` (timestamptz) - When achievement was earned
  - Unique constraint on (user_id, achievement_id)

  ### 6. community_posts
  Social wall posts for sharing and discussion
  - `id` (uuid, primary key) - Post identifier
  - `author_id` (uuid) - References profiles table
  - `content` (text) - Post text content
  - `post_type` (text) - Type (score, replay, discussion, project)
  - `game_id` (uuid, nullable) - Associated game if applicable
  - `score` (integer, nullable) - Score if sharing achievement
  - `likes_count` (integer) - Number of likes
  - `created_at` (timestamptz) - Post creation time

  ### 7. post_likes
  Tracks user likes on community posts
  - `id` (uuid, primary key) - Like record identifier
  - `post_id` (uuid) - References community_posts table
  - `user_id` (uuid) - References profiles table
  - `created_at` (timestamptz) - When liked
  - Unique constraint on (post_id, user_id)

  ## Security
  - All tables have Row Level Security (RLS) enabled
  - Users can read their own profile and all other profiles
  - Users can only update their own profile
  - All users can read games, achievements, and community posts
  - Users can create their own game sessions and community posts
  - Users can only update/delete their own posts
  - Leaderboard data is publicly readable

  ## Notes
  - Default values ensure data integrity
  - Timestamps use `now()` for automatic tracking
  - Foreign keys maintain relational integrity
  - Indexes on frequently queried columns for performance
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_type text DEFAULT 'coder' NOT NULL,
  avatar_color text DEFAULT '#3b82f6' NOT NULL,
  bio text DEFAULT '' NOT NULL,
  total_points integer DEFAULT 0 NOT NULL,
  level integer DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  difficulty text DEFAULT 'medium' NOT NULL,
  icon text NOT NULL,
  is_multiplayer boolean DEFAULT false NOT NULL,
  is_featured boolean DEFAULT false NOT NULL,
  play_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score integer DEFAULT 0 NOT NULL,
  duration_seconds integer DEFAULT 0 NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  multiplayer_room_id uuid,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL,
  points integer DEFAULT 10 NOT NULL,
  rarity text DEFAULT 'common' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, achievement_id)
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  post_type text DEFAULT 'discussion' NOT NULL,
  game_id uuid REFERENCES games(id) ON DELETE SET NULL,
  score integer,
  likes_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(post_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Games policies (public read)
CREATE POLICY "Anyone can view games"
  ON games FOR SELECT
  TO authenticated
  USING (true);

-- Game sessions policies
CREATE POLICY "Users can view own sessions"
  ON game_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = player_id);

CREATE POLICY "Users can create own sessions"
  ON game_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Users can update own sessions"
  ON game_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = player_id)
  WITH CHECK (auth.uid() = player_id);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- User achievements policies
CREATE POLICY "Anyone can view user achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Community posts policies
CREATE POLICY "Anyone can view posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Post likes policies
CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_player_id ON game_sessions(player_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);

-- Insert initial games
INSERT INTO games (title, description, category, difficulty, icon, is_multiplayer, is_featured) VALUES
  ('Code Rush', 'Race against time to solve JavaScript challenges and debug code snippets', 'puzzle', 'medium', 'Code2', true, true),
  ('Tech Trivia Showdown', 'Test your knowledge across programming, hardware, and tech history', 'trivia', 'easy', 'Brain', true, true),
  ('Meme Generator Pro', 'Create viral tech memes using templates and custom captions', 'creative', 'easy', 'Laugh', false, true),
  ('Binary Blast', 'Convert numbers at lightning speed in this arcade challenge', 'arcade', 'hard', 'Zap', true, false),
  ('Algorithm Arena', 'Compete to write the most efficient sorting algorithm', 'puzzle', 'hard', 'Cpu', true, false),
  ('CSS Battle Royale', 'Recreate designs using minimal CSS code', 'puzzle', 'medium', 'Palette', false, false)
ON CONFLICT DO NOTHING;

-- Insert initial achievements
INSERT INTO achievements (title, description, icon, category, points, rarity) VALUES
  ('First Steps', 'Complete your first game', 'Award', 'milestone', 10, 'common'),
  ('Speed Demon', 'Complete any game in under 60 seconds', 'Zap', 'skill', 25, 'rare'),
  ('Social Butterfly', 'Make your first community post', 'Users', 'social', 15, 'common'),
  ('Perfect Score', 'Achieve 100% in any game', 'Trophy', 'skill', 50, 'epic'),
  ('Team Player', 'Win 5 multiplayer matches', 'Users', 'social', 30, 'rare'),
  ('Code Master', 'Complete all coding puzzles', 'Code', 'milestone', 100, 'legendary'),
  ('Trivia King', 'Answer 100 trivia questions correctly', 'Crown', 'milestone', 75, 'epic'),
  ('Consistency', 'Play games for 7 days in a row', 'Calendar', 'milestone', 40, 'rare')
ON CONFLICT DO NOTHING;