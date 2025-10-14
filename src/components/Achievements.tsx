import { useEffect, useState } from 'react';
import { Award, Lock } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase, Achievement, UserAchievement } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, [user]);

  const loadAchievements = async () => {
    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*')
      .order('points', { ascending: false });

    if (allAchievements) {
      setAchievements(allAchievements);
    }

    if (user) {
      const { data: earned } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id);

      if (earned) {
        setUserAchievements(new Set(earned.map((e) => e.achievement_id)));
      }
    }

    setLoading(false);
  };

  const rarityColors = {
    common: {
      bg: 'bg-slate-700/30 border-slate-600/50',
      text: 'text-slate-400',
      icon: 'text-slate-500',
    },
    rare: {
      bg: 'bg-blue-500/20 border-blue-500/50',
      text: 'text-blue-400',
      icon: 'text-blue-500',
    },
    epic: {
      bg: 'bg-purple-500/20 border-purple-500/50',
      text: 'text-purple-400',
      icon: 'text-purple-500',
    },
    legendary: {
      bg: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50',
      text: 'text-yellow-400',
      icon: 'text-yellow-500',
    },
  };

  const categoryGroups = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-slate-400">Loading achievements...</p>
        </div>
      </div>
    );
  }

  const earnedCount = userAchievements.size;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">Achievements</h2>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-300">Your Progress</p>
            <p className="text-white font-bold">
              {earnedCount} / {totalCount}
            </p>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(categoryGroups).map(([category, categoryAchievements]) => (
          <div key={category}>
            <h3 className="text-xl font-bold text-white mb-4 capitalize">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map((achievement) => {
                const isEarned = userAchievements.has(achievement.id);
                const IconComponent = (Icons as any)[achievement.icon] || Icons.Award;
                const colors = rarityColors[achievement.rarity as keyof typeof rarityColors] || rarityColors.common;

                return (
                  <div
                    key={achievement.id}
                    className={`relative rounded-xl border p-5 backdrop-blur transition-all ${
                      isEarned
                        ? `${colors.bg} hover:scale-[1.02]`
                        : 'bg-slate-800/30 border-slate-700/50 opacity-60'
                    }`}
                  >
                    {!isEarned && (
                      <div className="absolute top-3 right-3">
                        <Lock className="w-4 h-4 text-slate-600" />
                      </div>
                    )}

                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        isEarned ? colors.bg : 'bg-slate-700/30'
                      }`}
                    >
                      <IconComponent className={`w-8 h-8 ${isEarned ? colors.icon : 'text-slate-600'}`} />
                    </div>

                    <h4 className={`font-bold mb-2 ${isEarned ? 'text-white' : 'text-slate-500'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm mb-3 ${isEarned ? 'text-slate-300' : 'text-slate-600'}`}>
                      {achievement.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          isEarned ? colors.text : 'text-slate-600'
                        }`}
                      >
                        {achievement.rarity}
                      </span>
                      <span className={`text-sm font-bold ${isEarned ? colors.text : 'text-slate-600'}`}>
                        +{achievement.points} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
