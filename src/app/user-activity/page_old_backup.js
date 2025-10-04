'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserActivity() {
  const [userActivities, setUserActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [stats, setStats] = useState({
    completedToday: 0,
    currentStreak: 0,
    totalCompleted: 0,
    badges: []
  });
  const router = useRouter();

  // Time slots for scheduling
  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        console.log('No user data, redirecting to login');
        router.push('/');
        return;
      }
      
      try {
        const user = JSON.parse(userData);
        setUser(user);
        fetchUserActivities(user._id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/');
      }
    }
  }, [router]);

  const calculateStats = (activities) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completed = activities.filter(a => a.status === 'completed');
    const skipped = activities.filter(a => a.status === 'skipped');
    
    // Count completed today
    const completedToday = completed.filter(a => {
      const activityDate = new Date(a.updatedAt || a.createdAt);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === today.getTime();
    }).length;
    
    // Calculate streak (simplified - consecutive days with completed activities)
    let currentStreak = 0;
    const sortedCompleted = completed
      .map(a => new Date(a.updatedAt || a.createdAt))
      .sort((a, b) => b - a);
    
    if (sortedCompleted.length > 0) {
      currentStreak = 1; // At least 1 if there are any completed
    }
    
    return {
      completedToday,
      currentStreak,
      totalCompleted: completed.length,
      totalSkipped: skipped.length,
      totalActivities: activities.length,
      badges: [] // Removed badges as requested
    };
  };

  const fetchUserActivities = async (userId) => {
    try {
      console.log('Fetching user activities for user:', userId);
      const response = await fetch(`/api/user-activities?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        const activities = data.userActivities || [];
        setUserActivities(activities);
        // Calculate and update stats
        const newStats = calculateStats(activities);
        setStats(newStats);
        console.log('User activities loaded:', activities.length);
        console.log('Stats calculated:', newStats);
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

  const fetchUserStats = async (userId) => {
    try {
      const response = await fetch(`/api/user-activities?userId=${userId}&stats=true`);
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUserActivity = async (userId, activityId) => {
    try {
      const response = await fetch(`/api/user-activities?userId=${userId}&activityId=${activityId}`);
      const data = await response.json();
      if (response.ok && data.userActivity) {
        setUserActivity(data.userActivity);
        setSelectedTimeSlot(data.userActivity.scheduledTime || '');
        setNotes(data.userActivity.notes || '');
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusBackground = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200 shadow-green-100';
      case 'skipped': return 'bg-yellow-50 border-yellow-200 shadow-yellow-100';
      case 'added': return 'bg-white border-gray-200 shadow-gray-100';
      default: return 'bg-white border-gray-200 shadow-gray-100';
    }
  };

  // Helper functions - moved before JSX to avoid hoisting issues
  const toggleExpanded = (activityId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedCards(newExpanded);
  };

  const updateActivityStatus = async (userActivityId, status) => {
    try {
      const response = await fetch('/api/user-activities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userActivityId, status }),
      });

      if (response.ok) {
        alert(`Activity ${status}!`);
        // Refresh data and recalculate stats
        fetchUserActivities(user._id);
      } else {
        alert('Error updating activity');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating activity');
    }
  };

  const deleteUserActivity = async (userActivityId) => {
    if (confirm('Are you sure you want to remove this activity?')) {
      try {
        const response = await fetch('/api/user-activities', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userActivityId }),
        });

        if (response.ok) {
          alert('Activity removed!');
          // Refresh data and recalculate stats
          fetchUserActivities(user._id);
        } else {
          alert('Error removing activity');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error removing activity');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your activities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Activities</h1>
            <p className="text-gray-600 mt-2">Manage your selected activities</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/activities')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              + Add More Activities
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                router.push('/');
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.completedToday}</div>
            <div className="text-sm text-gray-600">Completed Today</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600">{stats.totalCompleted}</div>
            <div className="text-sm text-gray-600">Total Completed</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.totalSkipped}</div>
            <div className="text-sm text-gray-600">Total Skipped</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.totalActivities}</div>
            <div className="text-sm text-gray-600">Total Activities</div>
          </div>
        </div>

        {/* User Activities List */}
        {userActivities.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">No Activities Added Yet</h3>
            <p className="text-gray-600 mb-6">You haven't added any activities to your list yet.</p>
            <button
              onClick={() => router.push('/activities')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Browse Activities
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {userActivities.map((userActivity) => {
              const isExpanded = expandedCards.has(userActivity._id);
              return (
                <div key={userActivity._id} className={`p-6 rounded-lg shadow-lg border-2 transition-all duration-300 ${getStatusBackground(userActivity.status)}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{userActivity.activity?.title || 'Activity'}</h3>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          userActivity.status === 'completed' ? 'bg-green-200 text-green-800' :
                          userActivity.status === 'skipped' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {userActivity.status === 'completed' ? '✓ COMPLETED' :
                           userActivity.status === 'skipped' ? '⏭ SKIPPED' :
                           '📋 PENDING'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(userActivity.activity?.difficulty)}`}>
                        {userActivity.activity?.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {userActivity.activity?.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{userActivity.activity?.description}</p>

                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      ⏱️ {userActivity.activity?.estimatedTime} minutes
                    </span>
                    {userActivity.scheduledTime && (
                      <span className="ml-4 text-sm text-blue-600">
                        📅 Scheduled: {userActivity.scheduledTime}
                      </span>
                    )}
                  </div>

                  {/* Instructions Preview/Full */}
                  {userActivity.activity?.instructions && userActivity.activity.instructions.length > 0 && (
                    <div className='border-t pt-3 mb-4'>
                      <div className='flex justify-between items-center mb-2'>
                        <p className='text-xs text-gray-500 font-semibold'>INSTRUCTIONS:</p>
                        <button
                          onClick={() => toggleExpanded(userActivity._id)}
                          className='text-blue-500 text-xs hover:text-blue-700 font-medium'
                        >
                          {isExpanded ? '▲ Show Less' : '▼ Show All'}
                        </button>
                      </div>
                      <div className='text-sm text-gray-700'>
                        {isExpanded ? (
                          <ol className='list-decimal list-inside space-y-1'>
                            {userActivity.activity.instructions.map((instruction, index) => (
                              <li key={index}>{instruction}</li>
                            ))}
                          </ol>
                        ) : (
                          <>
                            <p className='truncate'>1. {userActivity.activity.instructions[0]}</p>
                            {userActivity.activity.instructions.length > 1 && (
                              <p className='text-xs text-gray-500 mt-1'>
                                +{userActivity.activity.instructions.length - 1} more steps...
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {userActivity.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">📝 {userActivity.notes}</p>
                    </div>
                  )}

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className='border-t pt-3 mb-4 space-y-3'>
                      <div>
                        <p className='text-xs text-gray-500 font-semibold mb-1'>ACTIVITY HISTORY:</p>
                        <div className='text-sm space-y-1'>
                          <p><span className='text-gray-500'>Added:</span> {new Date(userActivity.createdAt || Date.now()).toLocaleDateString()}</p>
                          <p><span className='text-gray-500'>Status:</span> <span className="capitalize font-medium">{userActivity.status}</span></p>
                          {userActivity.completedAt && (
                            <p><span className='text-gray-500'>Completed:</span> {new Date(userActivity.completedAt).toLocaleDateString()}</p>
                          )}
                          {userActivity.updatedAt && (
                            <p><span className='text-gray-500'>Last Updated:</span> {new Date(userActivity.updatedAt).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      
                      {userActivity.activity?.benefits && (
                        <div>
                          <p className='text-xs text-gray-500 font-semibold mb-1'>BENEFITS:</p>
                          <p className='text-sm text-gray-700'>{userActivity.activity.benefits}</p>
                        </div>
                      )}
                      
                      {userActivity.activity?.equipment && (
                        <div>
                          <p className='text-xs text-gray-500 font-semibold mb-1'>EQUIPMENT NEEDED:</p>
                          <p className='text-sm text-gray-700'>{userActivity.activity.equipment}</p>
                        </div>
                      )}

                      <div className='grid grid-cols-2 gap-4 text-xs'>
                        <div>
                          <span className='text-gray-500 font-semibold'>User Activity ID:</span>
                          <p className='text-gray-700 font-mono text-xs break-all'>{userActivity._id}</p>
                        </div>
                        <div>
                          <span className='text-gray-500 font-semibold'>Activity Active:</span>
                          <p className='text-gray-700'>{userActivity.activity?.isActive ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap mb-2">
                    <button
                      onClick={() => updateActivityStatus(userActivity._id, 'completed')}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      ✓ Complete
                    </button>
                    <button
                      onClick={() => updateActivityStatus(userActivity._id, 'skipped')}
                      className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                    >
                      ⏭ Skip
                    </button>
                    <button
                      onClick={() => deleteUserActivity(userActivity._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      🗑 Delete
                    </button>
                    <button
                      onClick={() => toggleExpanded(userActivity._id)}
                      className='px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200'
                    >
                      {isExpanded ? 'Less' : 'Details'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}