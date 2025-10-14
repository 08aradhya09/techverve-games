import { useState } from 'react';
import { User, Palette, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const avatarTypes = [
  { id: 'coder', label: 'Coder', icon: '💻' },
  { id: 'gamer', label: 'Gamer', icon: '🎮' },
  { id: 'designer', label: 'Designer', icon: '🎨' },
  { id: 'hacker', label: 'Hacker', icon: '🔐' },
  { id: 'innovator', label: 'Innovator', icon: '💡' },
];

const avatarColors = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#ef4444',
  '#6366f1',
];

export const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarType, setAvatarType] = useState(profile?.avatar_type || 'coder');
  const [avatarColor, setAvatarColor] = useState(profile?.avatar_color || '#3b82f6');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        username,
        bio,
        avatar_type: avatarType,
        avatar_color: avatarColor,
      });
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUsername(profile?.username || '');
    setBio(profile?.bio || '');
    setAvatarType(profile?.avatar_type || 'coder');
    setAvatarColor(profile?.avatar_color || '#3b82f6');
    setEditing(false);
  };

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Profile</h2>
        <p className="text-slate-400">Customize your avatar and profile information</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-8">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 transition-all"
            style={{ backgroundColor: editing ? avatarColor : profile.avatar_color }}
          >
            {editing
              ? avatarTypes.find((t) => t.id === avatarType)?.icon
              : avatarTypes.find((t) => t.id === profile.avatar_type)?.icon}
          </div>

          <h3 className="text-2xl font-bold text-white mb-1">
            {editing ? username : profile.username}
          </h3>
          <p className="text-slate-400 mb-2">Level {profile.level}</p>
          <p className="text-blue-400 font-semibold">{profile.total_points} total points</p>
        </div>

        {!editing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
              <p className="text-white">{profile.bio || 'No bio yet'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Avatar Type</label>
              <p className="text-white capitalize">{profile.avatar_type}</p>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                placeholder="Tell us about yourself..."
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-slate-500 mt-1">{bio.length}/200</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Avatar Type</label>
              <div className="grid grid-cols-5 gap-3">
                {avatarTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setAvatarType(type.id)}
                    className={`p-4 rounded-lg border-2 transition ${
                      avatarType === type.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-3xl mb-1">{type.icon}</div>
                    <p className="text-xs text-white">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Avatar Color
              </label>
              <div className="grid grid-cols-8 gap-3">
                {avatarColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAvatarColor(color)}
                    className={`w-12 h-12 rounded-full transition ${
                      avatarColor === color ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-800' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
