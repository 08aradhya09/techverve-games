import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { GamesView } from './components/GamesView';
import { Leaderboard } from './components/Leaderboard';
import { Achievements } from './components/Achievements';
import { Community } from './components/Community';
import { Profile } from './components/Profile';
import { GameModal } from './components/GameModal';
import { Game } from './lib/supabase';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="animate-pulse">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4"></div>
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('games');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Auth />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'leaderboard':
        return <Leaderboard />;
      case 'community':
        return <Community />;
      case 'achievements':
        return <Achievements />;
      case 'profile':
        return <Profile />;
      case 'games':
      default:
        return (
          <>
            <Hero onPlayGame={setSelectedGame} />
            <GamesView onPlayGame={setSelectedGame} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main>{renderView()}</main>
      {selectedGame && <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
