'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    skillGoals: [],
    difficultyPreference: 'Medium',
    availableTime: 30
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/');
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData(prev => ({
        ...prev,
        name: parsedUser.name || '',
        skillGoals: parsedUser.preferences?.skillGoals || [],
        difficultyPreference: parsedUser.preferences?.difficultyPreference || 'Medium',
        availableTime: parsedUser.preferences?.availableTime || 30
      }));
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          name: formData.name,
          preferences: {
            skillGoals: formData.skillGoals,
            difficultyPreference: formData.difficultyPreference,
            availableTime: formData.availableTime
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { 
          ...user, 
          name: formData.name,
          preferences: {
            skillGoals: formData.skillGoals,
            difficultyPreference: formData.difficultyPreference,
            availableTime: formData.availableTime
          }
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        showMessage('Profile and preferences updated successfully!', 'success');
      } else {
        showMessage(data.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkillGoal = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillGoals: prev.skillGoals.includes(skill)
        ? prev.skillGoals.filter(s => s !== skill)
        : [...prev.skillGoals, skill]
    }));
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (formData.newPassword !== formData.confirmPassword) {
      showMessage('New passwords do not match', 'error');
      return;
    }

    if (formData.newPassword.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        showMessage('Password updated successfully!', 'success');
      } else {
        showMessage(data.error || 'Failed to update password', 'error');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showMessage('Error updating password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will remove all your data.'
    );
    
    if (!confirmed) return;
    
    const doubleConfirm = confirm(
      'This will permanently delete your account and all associated data. Are you absolutely sure?'
    );
    
    if (!doubleConfirm) return;

    setLoading(true);
    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id
        }),
      });

      if (response.ok) {
        localStorage.removeItem('user');
        alert('Account deleted successfully');
        router.push('/');
      } else {
        const data = await response.json();
        showMessage(data.message || 'Failed to delete account', 'error');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      showMessage('Error deleting account', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-gray-600 mt-1">Manage your account and preferences</p>
              </div>
              <div className="flex gap-3">
                {user?.role === 'admin' && (
                  <button
                    onClick={() => router.push('/admin/edit-activities')}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-102 transition"
                  >
                    Admin Edit
                  </button>
                )}
                <button
                  onClick={() => router.push('/activities')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-102 transition"
                >
                  ← Back to Activities
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl shadow-lg ${
              messageType === 'success' 
                ? 'bg-green-50 text-green-700 border-2 border-green-200' 
                : 'bg-red-50 text-red-700 border-2 border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{messageType === 'success' ? '✓' : '⚠️'}</span>
                <span className="font-semibold">{message}</span>
              </div>
            </div>
          )}

          {/* Profile Information */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Profile Information
            </h2>
            <form onSubmit={updateProfile}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>

              {/* Skill Goals / Interests */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  🎯 Skill Goals & Interests
                </label>
                <p className="text-xs text-gray-500 mb-3">Select the categories you're interested in (can select multiple)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Creativity', 'Mindfulness', 'Productivity', 'Communication', 'Fitness', 'Learning', 'Social', 'Self-Care'].map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkillGoal(skill)}
                      className={`p-3 rounded-lg font-semibold text-sm transition-all ${
                        formData.skillGoals.includes(skill)
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Preference */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📊 Preferred Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Easy', 'Medium', 'Hard'].map(diff => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, difficultyPreference: diff }))}
                      className={`p-3 rounded-lg font-semibold transition-all ${
                        formData.difficultyPreference === diff
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Time */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ⏱️ Available Time (minutes)
                </label>
                <input
                  type="number"
                  value={formData.availableTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, availableTime: parseInt(e.target.value) }))}
                  min="5"
                  max="300"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
                <p className="text-xs text-gray-500 mt-1">How much time you typically have for activities (5-300 minutes)</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg transform hover:scale-102'
                }`}
              >
                {loading ? 'Updating...' : 'Update Profile & Preferences'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Change Password
            </h2>
            <form onSubmit={updatePassword}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg transform hover:scale-102'
                }`}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 border-red-200">
            <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
              <span>⚠️</span> Danger Zone
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <h3 className="font-bold text-gray-800">Logout</h3>
                  <p className="text-sm text-gray-600">Sign out of your account</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                  Logout
                </button>
              </div>

              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <h3 className="font-bold text-red-700">Delete Account</h3>
                  <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={deleteAccount}
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    loading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

