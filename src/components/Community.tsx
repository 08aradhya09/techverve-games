import { useEffect, useState } from 'react';
import { Heart, Send, Trash2, Trophy, MessageSquare } from 'lucide-react';
import { supabase, CommunityPost } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPosts();
    if (user) {
      loadUserLikes();
    }
  }, [user]);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('community_posts')
      .select(
        `
        *,
        profile:profiles(username, avatar_color, level),
        game:games(title)
      `
      )
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setPosts(data as any);
    }
    setLoading(false);
  };

  const loadUserLikes = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id);

    if (data) {
      setLikedPosts(new Set(data.map((like) => like.post_id)));
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPost.trim()) return;

    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        author_id: user.id,
        content: newPost,
        post_type: 'discussion',
      })
      .select(
        `
        *,
        profile:profiles(username, avatar_color, level)
      `
      )
      .single();

    if (data && !error) {
      setPosts([data as any, ...posts]);
      setNewPost('');
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    const isLiked = likedPosts.has(postId);

    if (isLiked) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      await supabase.rpc('decrement_post_likes', { post_id: postId });

      setLikedPosts((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes_count: Math.max(0, post.likes_count - 1) } : post
        )
      );
    } else {
      await supabase.from('post_likes').insert({
        post_id: postId,
        user_id: user.id,
      });

      await supabase.rpc('increment_post_likes', { post_id: postId });

      setLikedPosts((prev) => new Set(prev).add(postId));

      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, likes_count: post.likes_count + 1 } : post))
      );
    }
  };

  const handleDelete = async (postId: string) => {
    await supabase.from('community_posts').delete().eq('id', postId);
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const postTypeIcons = {
    score: Trophy,
    discussion: MessageSquare,
    replay: Trophy,
    project: MessageSquare,
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-slate-400">Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Community Hub</h2>
        <p className="text-slate-400">Share your achievements and connect with other players</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-6 mb-6">
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts, scores, or achievements..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-500">{newPost.length}/500</span>
            <button
              type="submit"
              disabled={!newPost.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Post
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => {
            const TypeIcon = postTypeIcons[post.post_type as keyof typeof postTypeIcons] || MessageSquare;
            const isLiked = likedPosts.has(post.id);
            const isAuthor = user?.id === post.author_id;

            return (
              <div
                key={post.id}
                className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-6 hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: post.profile?.avatar_color }}
                    >
                      {post.profile?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{post.profile?.username}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Level {post.profile?.level}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(post.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-900/50 rounded-full px-2 py-1">
                      <TypeIcon className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-slate-400">{post.post_type}</span>
                    </div>
                    {isAuthor && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-slate-300 mb-4 whitespace-pre-wrap">{post.content}</p>

                {post.game && (
                  <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-slate-400 mb-1">Playing: {post.game.title}</p>
                    {post.score && (
                      <p className="text-2xl font-bold text-blue-400">{post.score} points</p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition ${
                      isLiked
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{post.likes_count}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
