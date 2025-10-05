'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/apiClient';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userActivities, setUserActivities] = useState(new Map()); // Map of activityId -> { status, userActivityId }
  const router = useRouter();

  const categories = ['All', 'Creativity', 'Mindfulness', 'Productivity', 'Communication', 'Fitness', 'Learning', 'Social', 'Self-Care'];

  // No fallback activities - user must seed database first
  // Run: node seedActivitiesWithSteps.js

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/');
        return;
      }
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Fetch user activities when user is set
      fetchUserActivities(parsedUser._id);
    }
    fetchActivities();
  }, [router]);

  const fetchUserActivities = async (userId) => {
    try {
      const response = await fetch(apiUrl(`/api/user-activities?userId=${userId}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.userActivities && Array.isArray(data.userActivities)) {
        // Create a map of activityId -> { status, userActivityId }
        const activityMap = new Map();
        data.userActivities.forEach(ua => {
          if (ua.activityId && ua.activityId._id) {
            activityMap.set(ua.activityId._id, {
              status: ua.status,
              userActivityId: ua._id
            });
          }
        });
        setUserActivities(activityMap);
      }
    } catch (err) {
      console.error('Error fetching user activities:', err);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(apiUrl('/api/activities'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.activities && Array.isArray(data.activities) && data.activities.length > 0) {
        setActivities(data.activities);
      } else {
        console.log('No activities found in database. Please run: node seedActivitiesWithSteps.js');
        setActivities([]);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (activityId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedCards(newExpanded);
  };

  const addActivityToUser = async (activity) => {
    if (!user || !user._id) {
      alert('Please log in first');
      return;
    }

    try {
      const response = await fetch(apiUrl('/api/user-activities'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          activityId: activity._id,
          status: 'added'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Use the userActivity ID from the response (not the activity ID)
        const userActivityId = data.userActivity?._id || data._id;
        
        if (data.isReset) {
          alert(`🔄 "${activity.title}" has been reset and added to your activities!`);
        } else {
          alert(`✓ "${activity.title}" added to your activities!`);
        }
        
        // Update the userActivities map
        setUserActivities(prev => {
          const newMap = new Map(prev);
          newMap.set(activity._id, {
            status: 'added',
            userActivityId: userActivityId
          });
          return newMap;
        });
        
        // Navigate to the activity execution page with the userActivity ID
        router.push(`/activity-execute/${userActivityId}`);
      } else if (response.status === 409) {
        // Activity already exists and is not completed
        alert(data.message || 'Activity already in your list');
      } else {
        alert(data.error || 'Failed to add activity');
      }
    } catch (err) {
      console.error('Error adding activity:', err);
      alert('Network error. Please try again.');
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

  const filteredActivities = activities.filter(activity => {
    const matchesCategory = selectedCategory === 'All' || activity.category === selectedCategory;
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort activities: user's preferred categories first, then others
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    const userPreferences = user?.preferences?.skillGoals || [];
    const aIsPreferred = userPreferences.includes(a.category);
    const bIsPreferred = userPreferences.includes(b.category);
    
    // If both or neither are preferred, keep original order
    if (aIsPreferred === bIsPreferred) return 0;
    // Preferred activities come first
    return aIsPreferred ? -1 : 1;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading amazing activities...</p>
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
                  Daily Activity Tracker
                </h1>
                <p className="text-gray-600 mt-1">Welcome, <span className="font-semibold text-blue-600">{user?.name}</span>!</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/user-activity')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-102 transition"
                >
                  My Activities
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
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-lg"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl"></span>
                </div>
              </div>

              {/* Category Filters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Filter by Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full font-semibold transition transform hover:scale-102 ${
                        selectedCategory === category
                          ? category === 'All'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : `bg-gradient-to-r ${getCategoryGradient(category)} text-white shadow-lg`
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          <div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedCategory === 'All' ? 'All Activities' : `${selectedCategory} Activities`}
                <span className="ml-2 text-blue-600">({sortedActivities.length})</span>
              </h2>
            </div>

            {sortedActivities.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-white/20">
                <div className="text-6xl mb-4"></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No activities found</h3>
                <p className="text-gray-600">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
                {sortedActivities.map(activity => {
                  const isExpanded = expandedCards.has(activity._id);
                  const userActivity = userActivities.get(activity._id);
                  const isAdded = !!userActivity;
                  const isCompleted = userActivity?.status === 'completed';
                  const isInProgress = userActivity?.status === 'in-progress';
                  const isSkipped = userActivity?.status === 'skipped';
                  
                  return (
                    <div
                      key={activity._id}
                      className="transform transition-all duration-300 hover:scale-102"
                    >
                      <div className={`bg-gradient-to-br ${getCategoryGradient(activity.category)} p-0.5 rounded-2xl shadow-lg hover:shadow-2xl transition`}>
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 flex flex-col">
                          {/* Category Badge */}
                          <div className="mb-4">
                            <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getCategoryGradient(activity.category)}`}>
                              {activity.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition">
                            {activity.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 mb-4 leading-relaxed flex-1">
                            {activity.description}
                          </p>

                          {/* Expandable Details */}
                          {isExpanded && (
                            <div className="mb-4 space-y-3">
                              {/* Full Instructions */}
                              {activity.instructions && activity.instructions.length > 0 && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                  <h4 className="font-bold text-blue-800 mb-2">📝 Instructions:</h4>
                                  <ul className="space-y-1">
                                    {activity.instructions.map((instruction, idx) => (
                                      <li key={idx} className="text-sm text-gray-700">
                                        • {instruction}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* All Steps */}
                              {activity.steps && activity.steps.length > 0 && (
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                  <h4 className="font-bold text-purple-800 mb-2">📋 Steps:</h4>
                                  <div className="space-y-2">
                                    {activity.steps.map((step, idx) => (
                                      <div key={idx} className="bg-white p-3 rounded border border-purple-100">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold text-purple-600">Step {step.stepNumber}:</span>
                                          <span className="font-medium text-gray-800">{step.title}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 ml-4">{step.description}</p>
                                        {step.videoUrl && (
                                          <a
                                            href={step.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:underline ml-4 inline-block mt-1"
                                          >
                                            Watch video tutorial
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Meta Info */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(activity.difficulty)}`}>
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

                          {/* Instructions Preview */}
                          {!isExpanded && activity.instructions && activity.instructions.length > 0 && (
                            <div className="mb-4 text-sm">
                              <p className="text-gray-500 font-semibold mb-1">Quick Preview:</p>
                              <p className="text-gray-700 truncate">• {activity.instructions[0]}</p>
                              {activity.instructions.length > 1 && (
                                <p className="text-gray-500 text-xs mt-1">+{activity.instructions.length - 1} more...</p>
                              )}
                            </div>
                          )}

                          {/* Toggle Details Button */}
                          <button
                            onClick={() => toggleExpanded(activity._id)}
                            className="w-full mb-3 py-2 rounded-lg font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-300 border border-blue-200"
                          >
                            {isExpanded ? '▲ Hide Details' : '▼ Show All Details'}
                          </button>

                          {/* Action Button - Dynamic based on status */}
                          {isCompleted ? (
                            <button
                              onClick={() => addActivityToUser(activity)}
                              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-xl transform hover:scale-102 transition-all duration-300"
                            >
                              🔄 Restart Activity
                            </button>
                          ) : isAdded ? (
                            <div className="space-y-2">
                              <button
                                disabled
                                className="w-full py-3 rounded-xl font-bold text-gray-500 bg-gray-200 cursor-not-allowed"
                              >
                                ✓ Already Added
                                {isInProgress && ' (In Progress)'}
                                {isSkipped && ' (Skipped)'}
                              </button>
                              {userActivity?.userActivityId && (
                                <button
                                  onClick={() => router.push(`/activity-execute/${userActivity.userActivityId}`)}
                                  className="w-full py-2 rounded-lg font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-300 border border-blue-200"
                                >
                                  → View Activity
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => addActivityToUser(activity)}
                              className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${getCategoryGradient(activity.category)} hover:shadow-xl transform hover:scale-102 transition-all duration-300`}
                            >
                              Add to My Activities
                            </button>
                          )}
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
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

