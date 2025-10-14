import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { supabase, Game } from '../lib/supabase';
import { GameCard } from './GameCard';

type GamesViewProps = {
  onPlayGame: (game: Game) => void;
};

export const GamesView = ({ onPlayGame }: GamesViewProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    filterGames();
  }, [searchQuery, categoryFilter, difficultyFilter, games]);

  const loadGames = async () => {
    const { data } = await supabase
      .from('games')
      .select('*')
      .order('play_count', { ascending: false });

    if (data) {
      setGames(data);
      setFilteredGames(data);
    }
  };

  const filterGames = () => {
    let filtered = games;

    if (searchQuery) {
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((game) => game.category === categoryFilter);
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((game) => game.difficulty === difficultyFilter);
    }

    setFilteredGames(filtered);
  };

  const categories = ['all', 'trivia', 'puzzle', 'arcade', 'creative'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-6">All Games</h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-11 pr-8 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredGames.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">No games found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} onPlay={() => onPlayGame(game)} />
          ))}
        </div>
      )}
    </div>
  );
};
