import { useEffect, useState } from 'react';
import { Trophy, Crown, Medal, TrendingUp } from 'lucide-react';
import { supabase, Profile } from '../lib/supabase';

export const Leaderboard = () => {
  const [topPlayers, setTopPlayers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(50);

    if (data) {
      setTopPlayers(data);
    }
    setLoading(false);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-slate-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-orange-400" />;
    return <span className="text-slate-500 font-bold">#{index + 1}</span>;
  };

  const getRankBg = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
    if (index === 1) return 'bg-slate-700/30 border-slate-500/30';
    if (index === 2) return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30';
    return 'bg-slate-800/30 border-slate-700/30';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-slate-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
        </div>
        <p className="text-slate-400">Top players ranked by total points</p>
      </div>

      {topPlayers.length === 0 ? (
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-12 text-center">
          <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No players yet. Be the first to play!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur transition-all hover:scale-[1.01] ${getRankBg(
                index
              )}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  {getRankIcon(index)}
                </div>

                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: player.avatar_color }}
                >
                  {player.username.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="font-bold text-white text-lg">{player.username}</p>
                  <p className="text-sm text-slate-400">Level {player.level}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">{player.total_points}</p>
                <p className="text-xs text-slate-500">points</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
