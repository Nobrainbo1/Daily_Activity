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

  // Refresh data when page becomes visible (e.g., returning from activity execution)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?._id) {
        fetchUserActivities(user._id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const calculateStats = (activities) => {
    if (!activities || activities.length === 0) {
      return {
        total: 0,
        inProgress: 0,
        completed: 0,
        skipped: 0,
        averageProgress: 0
      };
    }

    const total = activities.length;
    const completed = activities.filter(a => a.status === 'completed').length;
    const skipped = activities.filter(a => a.status === 'skipped').length;
    
    // Fix: Count activities that are actually in progress (have started but not completed)
    const inProgress = activities.filter(a => {
      return a.status === 'in-progress' || 
             (a.progress && a.progress.startedAt && a.status !== 'completed' && a.status !== 'skipped');
    }).length;

    // Calculate average progress
    const totalProgress = activities.reduce((sum, activity) => {
      return sum + (activity.progress?.percentComplete || 0);
    }, 0);
    const averageProgress = total > 0 ? Math.round(totalProgress / total) : 0;

    return {
      total,
      inProgress,
      completed,
      skipped,
      averageProgress
    };
  };

  const fetchUserActivities = async (userId) => {
    try {
      console.log('Fetching user activities for userId:', userId);
      const response = await fetch(`/api/user-activities?userId=${userId}`);
      const data = await response.json();
      
      console.log('User activities response:', data);
      
      if (response.ok) {
        const activities = data.userActivities || [];
        console.log('Number of activities:', activities.length);
        console.log('Activities data:', activities);
        
        // Filter out activities where activityId is null (deleted activities)
        const validActivities = activities.filter(ua => ua.activityId != null);
        console.log('Valid activities (with activityId):', validActivities.length);
        
        if (validActivities.length !== activities.length) {
          console.warn(`Found ${activities.length - validActivities.length} activities with missing activityId (likely deleted activities)`);
        }
        
        setUserActivities(validActivities);
        const newStats = calculateStats(validActivities);
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
    if (!confirm('Are you sure you want to remove this activity from your list?')) {
      return;
    }

    try {
      console.log('Deleting user activity:', userActivityId);
      const response = await fetch(`/api/user-activities?id=${userActivityId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('Delete response:', data);

      if (response.ok) {
        alert('✅ Activity removed successfully!');
        // Refresh the list
        fetchUserActivities(user._id);
      } else {
        console.error('Delete failed:', data);
        alert(`Failed to remove activity: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error removing activity:', error);
      alert('Error removing activity. Please try again.');
    }
  };

  const skipActivity = async (userActivityId) => {
    if (!confirm('Skip this activity for now? You can come back to it later.')) {
      return;
    }

    try {
      const response = await fetch('/api/user-activities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userActivityId,
          updates: {
            status: 'skipped'
          }
        })
      });

      if (response.ok) {
        alert('⏭️ Activity skipped!');
        fetchUserActivities(user._id);
      } else {
        alert('Failed to skip activity. Please try again.');
      }
    } catch (error) {
      console.error('Error skipping activity:', error);
      alert('Error skipping activity. Please try again.');
    }
  };

  const resumeSkippedActivity = async (userActivityId, activityId) => {
    try {
      const response = await fetch('/api/user-activities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userActivityId,
          updates: {
            status: 'added'
          }
        })
      });

      if (response.ok) {
        // Navigate to the execution page after status update
        router.push(`/activity-execute/${userActivityId}`);
      } else {
        alert('Failed to resume activity. Please try again.');
      }
    } catch (error) {
      console.error('Error resuming activity:', error);
      alert('Error resuming activity. Please try again.');
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

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Hard: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status, progress) => {
    if (status === 'completed') {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
          <span className="text-lg">✅</span>
          <span>Completed</span>
        </div>
      );
    } else if (status === 'in-progress' || (progress && progress.startedAt)) {
      const percent = progress?.percentComplete || 0;
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
          <span>In Progress ({percent}%)</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold">
          <span className="text-lg">⏸️</span>
          <span>Not Started</span>
        </div>
      );
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
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-102 transition"
                >
                  ➕ Add Activities
                </button>
                <button
                  onClick={() => router.push('/settings')}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-102 transition"
                >
                  ⚙️ Settings
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => router.push('/admin/edit-activities')}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-102 transition"
                  >
                    Admin Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Overall Statistics Dashboard */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Overall Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Activities */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Activities</p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{stats.total}</p>
                    <p className="text-xs text-gray-500 mt-1">Activities in your list</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                    📚
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">In Progress</p>
                    <p className="text-4xl font-bold text-orange-600 mt-2">{stats.inProgress}</p>
                    <p className="text-xs text-gray-500 mt-1">Currently working on</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                    🔄
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Completed</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">{stats.completed}</p>
                    <p className="text-xs text-gray-500 mt-1">Successfully finished</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                    ✅
                  </div>
                </div>
              </div>

              {/* Skipped */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Skipped</p>
                    <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.skipped}</p>
                    <p className="text-xs text-gray-500 mt-1">Passed for now</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-3xl shadow-lg">
                    ⏭️
                  </div>
                </div>
              </div>
            </div>

            {/* Average Progress Bar */}
            <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-800">Average Completion</h3>
                <span className="text-2xl font-bold text-purple-600">{stats.averageProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 transition-all duration-500 rounded-full"
                  style={{ width: `${stats.averageProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Overall progress across all activities</p>
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
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-102 transition"
                >
                  Browse Activities
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-auto">
                {userActivities.map((userActivity) => {
                  const activity = userActivity.activityId;
                  if (!activity) return null;

                  return (
                    <div
                      key={userActivity._id}
                      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                    >
                      {/* Header with gradient */}
                      <div className={`bg-gradient-to-r ${getCategoryGradient(activity.category)} p-4`}>
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold text-sm uppercase tracking-wide">
                            {activity.category}
                          </span>
                          {getStatusBadge(userActivity.status, userActivity.progress)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Title */}
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                          {activity.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                          {activity.description}
                        </p>

                        {/* Progress Bar */}
                        {userActivity.progress && userActivity.progress.percentComplete > 0 && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-700 mb-2 font-medium">
                              <span>Progress</span>
                              <span>{userActivity.progress.percentComplete || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                              <div
                                className={`h-full bg-gradient-to-r ${getCategoryGradient(activity.category)} transition-all duration-500`}
                                style={{ width: `${userActivity.progress.percentComplete || 0}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                              <span>
                                {userActivity.progress.completedSteps?.length || 0} of {activity.steps?.length || 0} steps
                              </span>
                              {userActivity.progress.startedAt && (
                                <span>
                                  Started {new Date(userActivity.progress.startedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-2 mb-4 pt-2 border-t border-gray-100">
                          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getDifficultyColor(activity.difficulty)}`}>
                            {activity.difficulty}
                          </span>
                          <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                            <span>⏱️</span>
                            <span>{activity.estimatedTime} min</span>
                          </div>
                          {activity.steps && activity.steps.length > 0 && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                              <span>📋</span>
                              <span>{activity.steps.length} steps</span>
                            </div>
                          )}
                        </div>

                        {/* Spacer to push buttons to bottom */}
                        <div className="flex-grow"></div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                          {userActivity.status !== 'completed' && userActivity.status !== 'skipped' && (
                            <button
                              onClick={() => startActivity(userActivity._id, activity._id)}
                              className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg transform hover:scale-102 transition-all duration-300"
                            >
                              {userActivity.status === 'in-progress' || (userActivity.progress && userActivity.progress.startedAt) ? 'Continue' : '🚀 Start'}
                            </button>
                          )}
                          
                          {userActivity.status === 'completed' && (
                            <button
                              onClick={() => startActivity(userActivity._id, activity._id)}
                              className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg transform hover:scale-102 transition-all duration-300"
                            >
                              ✅ View Details
                            </button>
                          )}

                          {userActivity.status === 'skipped' && (
                            <button
                              onClick={() => resumeSkippedActivity(userActivity._id, activity._id)}
                              className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:shadow-lg transform hover:scale-102 transition-all duration-300"
                            >
                              Resume
                            </button>
                          )}

                          {userActivity.status !== 'completed' && userActivity.status !== 'skipped' && (
                            <button
                              onClick={() => skipActivity(userActivity._id)}
                              className="px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:shadow-lg transform hover:scale-102 transition-all duration-300"
                              title="Skip activity"
                            >
                              ⏭️
                            </button>
                          )}

                          <button
                            onClick={() => removeActivity(userActivity._id)}
                            className="px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-lg transform hover:scale-102 transition-all duration-300"
                            title="Remove activity"
                          >
                            🗑️
                          </button>
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

