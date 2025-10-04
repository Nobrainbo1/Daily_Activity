'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserActivity() {
  const [userActivities, setUserActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    notStarted: 0,
    totalTimeInvested: 0,
    averageProgress: 0
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        router.push('/');
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchUserActivities(parsedUser._id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/');
      }
    }
  }, [router]);

  const calculateStats = (activities) => {
    if (!activities || activities.length === 0) {
      return {
        total: 0,
        inProgress: 0,
        completed: 0,
        notStarted: 0,
        totalTimeInvested: 0,
        averageProgress: 0
      };
    }

    const total = activities.length;
    const completed = activities.filter(a => a.status === 'completed').length;
    const inProgress = activities.filter(a => a.status === 'in-progress').length;
    const notStarted = activities.filter(a => a.status === 'added' || !a.status).length;
    
    // Calculate total time invested (sum of completed activities' time)
    const totalTimeInvested = activities.reduce((sum, activity) => {
      if (activity.activityId?.estimatedTime && activity.status === 'completed') {
        return sum + activity.activityId.estimatedTime;
      }
      return sum;
    }, 0);

    // Calculate average progress
    const totalProgress = activities.reduce((sum, activity) => {
      return sum + (activity.progress?.percentComplete || 0);
    }, 0);
    const averageProgress = total > 0 ? Math.round(totalProgress / total) : 0;

    return {
      total,
      inProgress,
      completed,
      notStarted,
      totalTimeInvested,
      averageProgress
    };
  };

  const fetchUserActivities = async (userId) => {
    try {
      const response = await fetch(`/api/user-activities?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        const activities = data.userActivities || [];
        setUserActivities(activities);
        const newStats = calculateStats(activities);
        setStats(newStats);
      } else {
        console.error('Error fetching user activities:', data);
        setUserActivities([]);
      }
    } catch (error) {
      console.error('Error fetching user activities:', error);
      setUserActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const startActivity = (userActivityId, activityId) => {
    // Navigate to the execution page
    router.push(`/activity-execute/${userActivityId}`);
  };

  const removeActivity = async (userActivityId) => {
    if (!confirm('Are you sure you want to remove this activity?')) {
      return;
    }

    try {
      const response = await fetch(`/api/user-activities?id=${userActivityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Activity removed successfully!');
        fetchUserActivities(user._id);
      } else {
        alert('Failed to remove activity');
      }
    } catch (error) {
      console.error('Error removing activity:', error);
      alert('Error removing activity');
    }
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      Creativity: 'from-purple-500 via-pink-500 to-rose-500',
      Mindfulness: 'from-blue-500 via-cyan-500 to-teal-500',
      Productivity: 'from-orange-500 via-amber-500 to-yellow-500',
      Communication: 'from-indigo-500 via-purple-500 to-pink-500',
      Fitness: 'from-green-500 via-emerald-500 to-teal-500',
      Learning: 'from-blue-600 via-indigo-600 to-purple-600',
      Social: 'from-pink-500 via-rose-500 to-red-500',
      'Self-Care': 'from-violet-500 via-purple-500 to-fuchsia-500',
    };
    return gradients[category] || 'from-blue-500 via-purple-500 to-pink-500';
  };

  const getStatusBadge = (status, progress) => {
    if (status === 'completed') {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">✅ Completed</span>;
    } else if (status === 'in-progress') {
      return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">🔄 In Progress ({progress?.percentComplete || 0}%)</span>;
    } else {
      return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">⏸️ Not Started</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your activities...</p>
        </div>
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

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  My Activities
                </h1>
                <p className="text-gray-600 mt-1">Track your progress and manage your activities</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/activities')}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition"
                >
                  ➕ Add Activities
                </button>
                <button
                  onClick={() => router.push('/settings')}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition"
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('user');
                    router.push('/');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Overall Statistics Dashboard */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Overall Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Total Activities */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Activities</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                    📚
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Completed</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-2xl">
                    ✅
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">In Progress</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl">
                    🔄
                  </div>
                </div>
              </div>

              {/* Not Started */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Not Started</p>
                    <p className="text-3xl font-bold text-gray-600 mt-2">{stats.notStarted}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-2xl">
                    ⏸️
                  </div>
                </div>
              </div>

              {/* Time Invested */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Time Invested</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalTimeInvested}</p>
                    <p className="text-xs text-gray-500">minutes</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                    ⏱️
                  </div>
                </div>
              </div>

              {/* Average Progress */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Avg Progress</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{stats.averageProgress}%</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-2xl">
                    📈
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Activities ({userActivities.length})
            </h2>

            {userActivities.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-white/20">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No activities yet</h3>
                <p className="text-gray-600 mb-6">Start adding activities to track your progress!</p>
                <button
                  onClick={() => router.push('/activities')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition"
                >
                  Browse Activities
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userActivities.map((userActivity) => {
                  const activity = userActivity.activityId;
                  if (!activity) return null;

                  return (
                    <div
                      key={userActivity._id}
                      className="group transform transition-all duration-300 hover:scale-102"
                    >
                      <div className={`bg-gradient-to-br ${getCategoryGradient(activity.category)} p-0.5 rounded-2xl shadow-lg hover:shadow-2xl transition h-full`}>
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col">
                          {/* Category Badge & Status */}
                          <div className="flex justify-between items-start mb-4">
                            <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getCategoryGradient(activity.category)}`}>
                              {activity.category}
                            </span>
                            {getStatusBadge(userActivity.status, userActivity.progress)}
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition">
                            {activity.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 mb-4 leading-relaxed flex-1">
                            {activity.description}
                          </p>

                          {/* Progress Bar */}
                          {userActivity.progress && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Progress</span>
                                <span className="font-semibold">{userActivity.progress.percentComplete || 0}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${getCategoryGradient(activity.category)} transition-all duration-500`}
                                  style={{ width: `${userActivity.progress.percentComplete || 0}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Step {userActivity.progress.currentStep || 1} of {userActivity.progress.totalSteps || activity.steps?.length || 0}</span>
                                <span>{userActivity.progress.completedSteps?.length || 0} steps completed</span>
                              </div>
                            </div>
                          )}

                          {/* Meta Info */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                              {activity.difficulty}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold flex items-center">
                              ⏱️ {activity.estimatedTime} min
                            </span>
                            {activity.steps && activity.steps.length > 0 && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold flex items-center">
                                📋 {activity.steps.length} steps
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {userActivity.status !== 'completed' && (
                              <button
                                onClick={() => startActivity(userActivity._id, activity._id)}
                                className={`flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${getCategoryGradient(activity.category)} hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                              >
                                {userActivity.status === 'in-progress' ? '▶️ Continue' : '🚀 Start Activity'}
                              </button>
                            )}
                            
                            {userActivity.status === 'completed' && (
                              <button
                                onClick={() => startActivity(userActivity._id, activity._id)}
                                className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                              >
                                ✅ View Completed
                              </button>
                            )}

                            <button
                              onClick={() => removeActivity(userActivity._id)}
                              className="px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                              title="Remove activity"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
