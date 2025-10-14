import { Gamepad2, Trophy, Users, Award, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type NavigationProps = {
  currentView: string;
  onViewChange: (view: string) => void;
};

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const { profile, signOut } = useAuth();

  const navItems = [
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'achievements', label: 'Achievements', icon: Award },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">TechVerve Arcade</h1>
              </div>
            </div>

            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onViewChange('profile')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-white">{profile?.username}</div>
                <div className="text-xs text-slate-400">Level {profile?.level}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>

            <button
              onClick={signOut}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
