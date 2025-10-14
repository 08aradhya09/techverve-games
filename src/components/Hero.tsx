import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Users as UsersIcon } from 'lucide-react';
import { supabase, Game } from '../lib/supabase';
import { GameCard } from './GameCard';

type HeroProps = {
  onPlayGame: (game: Game) => void;
};

export const Hero = ({ onPlayGame }: HeroProps) => {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [stats, setStats] = useState({ totalPlayers: 0, gamesPlayed: 0 });

  useEffect(() => {
    loadFeaturedGames();
    loadStats();
  }, []);

  const loadFeaturedGames = async () => {
    const { data } = await supabase
      .from('games')
      .select('*')
      .eq('is_featured', true)
      .order('play_count', { ascending: false })
      .limit(3);

    if (data) setFeaturedGames(data);
  };

  const loadStats = async () => {
    const [playersResult, sessionsResult] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('game_sessions').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      totalPlayers: playersResult.count || 0,
      gamesPlayed: sessionsResult.count || 0,
    });
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-cyan-600/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Where Skill Meets Play</span>
          </div>

          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Level Up Your
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Tech Skills
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Challenge yourself with interactive games, compete with peers, and master technology
            through playful learning
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur rounded-xl px-6 py-3 border border-slate-700/50">
              <UsersIcon className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-white">{stats.totalPlayers}</div>
                <div className="text-xs text-slate-400">Active Players</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur rounded-xl px-6 py-3 border border-slate-700/50">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-white">{stats.gamesPlayed}</div>
                <div className="text-xs text-slate-400">Games Played</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Featured Games</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} onPlay={() => onPlayGame(game)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
