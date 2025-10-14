import { X, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Game } from '../lib/supabase';
import { TechTrivia } from './games/TechTrivia';
import { CodeRush } from './games/CodeRush';
import { MemeGenerator } from './games/MemeGenerator';
import { BinaryBlast } from './games/BinaryBlast';

type GameModalProps = {
  game: Game;
  onClose: () => void;
};

export const GameModal = ({ game, onClose }: GameModalProps) => {
  const { user, profile, updateProfile } = useAuth();
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({ score: 0, duration: 0 });

  const handleGameComplete = async (score: number, duration: number) => {
    setResults({ score, duration });
    setShowResults(true);

    if (user && profile) {
      await supabase.from('game_sessions').insert({
        game_id: game.id,
        player_id: user.id,
        score,
        duration_seconds: duration,
        completed: true,
      });

      await supabase
        .from('games')
        .update({ play_count: game.play_count + 1 })
        .eq('id', game.id);

      const newTotalPoints = profile.total_points + score;
      const newLevel = Math.floor(newTotalPoints / 1000) + 1;

      await updateProfile({
        total_points: newTotalPoints,
        level: newLevel,
      });
    }
  };

  const renderGame = () => {
    switch (game.title) {
      case 'Tech Trivia Showdown':
        return <TechTrivia onComplete={handleGameComplete} onClose={onClose} />;
      case 'Code Rush':
        return <CodeRush onComplete={handleGameComplete} onClose={onClose} />;
      case 'Meme Generator Pro':
        return <MemeGenerator onComplete={handleGameComplete} onClose={onClose} />;
      case 'Binary Blast':
        return <BinaryBlast onComplete={handleGameComplete} onClose={onClose} />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-slate-400">Game coming soon!</p>
          </div>
        );
    }
  };

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Game Complete!</h2>
            <p className="text-slate-400 mb-6">Great job playing {game.title}</p>

            <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Score</p>
                  <p className="text-3xl font-bold text-blue-400">{results.score}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Time</p>
                  <p className="text-3xl font-bold text-cyan-400">{results.duration}s</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-6xl my-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {renderGame()}
      </div>
    </div>
  );
};
