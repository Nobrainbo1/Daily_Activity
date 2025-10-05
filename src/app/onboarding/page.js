'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/apiClient';

export default function Onboarding() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    skillGoals: [],
    difficultyPreference: '',
    availableTime: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/');
        return;
      }
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const skillOptions = [
    'Creativity',
    'Mindfulness',
    'Productivity',
    'Communication',
    'Fitness',
    'Learning',
    'Social',
    'Self-Care'
  ];

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillGoals: prev.skillGoals.includes(skill)
        ? prev.skillGoals.filter(s => s !== skill)
        : [...prev.skillGoals, skill]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.skillGoals.length === 0 || !formData.difficultyPreference || !formData.availableTime) {
      alert('Please complete all fields before continuing');
      return;
    }

    setLoading(true);
    try {
      // Convert time string to number (in minutes)
      const timeMap = {
        '15 mins': 15,
        '30 mins': 30,
        '1 hour': 60,
        '2+ hours': 120
      };
      
      const response = await fetch(apiUrl('/api/users/update'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          preferences: {
            ...formData,
            availableTime: timeMap[formData.availableTime] || 30
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to activities page
        router.push('/activities');
      } else {
        alert('Failed to save preferences. Please try again.');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Error saving preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/activities');
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
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Welcome, {user.name}! 🎉
            </h1>
            <p className="text-xl text-gray-700 font-medium">
              Let's personalize your experience
            </p>
            <p className="text-sm text-gray-500 mt-2">
              💡 Don't worry, you can always change these later in Settings
            </p>
          </div>

          {/* Onboarding Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Skill Goals */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  🎯 What skills would you like to develop?
                </label>
                <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all transform hover:scale-102 ${
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
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  📊 What difficulty level do you prefer?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Easy', 'Medium', 'Hard'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, difficultyPreference: level }))}
                      className={`py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-102 ${
                        formData.difficultyPreference === level
                          ? level === 'Easy'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                            : level === 'Medium'
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                            : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Time */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  ⏰ How much time can you dedicate daily?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['15 mins', '30 mins', '1 hour', '2+ hours'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, availableTime: time }))}
                      className={`py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-102 ${
                        formData.availableTime === time
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-102 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : '🚀 Get Started'}
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="py-4 px-8 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300"
                >
                  Skip for now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
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
