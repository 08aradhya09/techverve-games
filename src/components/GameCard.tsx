import * as Icons from 'lucide-react';
import { Game } from '../lib/supabase';
import { Play, Users } from 'lucide-react';

type GameCardProps = {
  game: Game;
  onPlay: () => void;
};

export const GameCard = ({ game, onPlay }: GameCardProps) => {
  const IconComponent = (Icons as any)[game.icon] || Icons.Gamepad2;

  const difficultyColors = {
    easy: 'text-green-400 bg-green-500/10 border-green-500/30',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    hard: 'text-red-400 bg-red-500/10 border-red-500/30',
  };

  const categoryColors = {
    trivia: 'from-purple-500 to-pink-500',
    puzzle: 'from-blue-500 to-cyan-500',
    arcade: 'from-orange-500 to-red-500',
    creative: 'from-green-500 to-emerald-500',
  };

  return (
    <div className="group bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-[1.02]">
      <div className={`h-32 bg-gradient-to-br ${categoryColors[game.category as keyof typeof categoryColors] || 'from-slate-600 to-slate-700'} relative`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <IconComponent className="w-16 h-16 text-white/90" />
        </div>
        {game.is_multiplayer && (
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-white" />
            <span className="text-xs font-medium text-white">Multiplayer</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition">
              {game.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full border ${difficultyColors[game.difficulty as keyof typeof difficultyColors] || difficultyColors.medium}`}>
                {game.difficulty}
              </span>
              <span className="text-xs text-slate-500">{game.category}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{game.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-400">{game.play_count}</span> plays
          </div>
          <button
            onClick={onPlay}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-4 py-2 rounded-lg transition transform hover:scale-105"
          >
            <Play className="w-4 h-4" />
            Play
          </button>
        </div>
      </div>
    </div>
  );
};
