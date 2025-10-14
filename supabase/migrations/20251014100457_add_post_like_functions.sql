/*
  # Add RPC functions for post likes

  ## New Functions
  - `increment_post_likes` - Increments the likes count for a post
  - `decrement_post_likes` - Decrements the likes count for a post

  ## Notes
  - These functions ensure atomic updates to the likes_count
  - They prevent race conditions when multiple users like/unlike simultaneously
*/

CREATE OR REPLACE FUNCTION increment_post_likes(post_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE community_posts
  SET likes_count = likes_count + 1
  WHERE id = post_id;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_post_likes(post_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE community_posts
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = post_id;
END;
$$;