'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const router = useRouter();

  // Fallback activities if database fails
  const fallbackActivities = [
    {
      _id: '1',
      title: 'Morning Meditation',
      description: 'Start your day with mindfulness and peace',
      category: 'Mindfulness',
      difficulty: 'Easy',
      estimatedTime: 10,
      instructions: ['Find a quiet space', 'Sit comfortably', 'Focus on your breathing', 'Clear your mind']
    },
    {
      _id: '2',
      title: 'Quick Workout',
      description: 'Get your heart pumping with exercises',
      category: 'Fitness',
      difficulty: 'Medium',
      estimatedTime: 20,
      instructions: ['Warm up for 5 minutes', 'Do jumping jacks', 'Push-ups', 'Cool down']
    },
    {
      _id: '3',
      title: 'Creative Writing',
      description: 'Express yourself through words',
      category: 'Creativity',
      difficulty: 'Easy',
      estimatedTime: 15,
      instructions: ['Choose a topic', 'Write freely', 'Don\'t worry about grammar', 'Let creativity flow']
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/');
        return;
      }
      setUser(JSON.parse(userData));
    }
    fetchActivities();
  }, [router]);

  const fetchActivities = async () => {
    try {
      console.log('Fetching activities...');
      const response = await fetch('/api/activities', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response:', data);
      
      if (data.activities && Array.isArray(data.activities) && data.activities.length > 0) {
        setActivities(data.activities);
        console.log('Activities set from API:', data.activities.length);
      } else {
        console.log('No activities from API, using fallback');
        setActivities(fallbackActivities);
      }
    } catch (err) {
      console.error('Error fetching activities, using fallback:', err);
      setActivities(fallbackActivities);
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
      console.log('Adding activity to user:', activity.title);
      const response = await fetch('/api/user-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          activityId: activity._id,
          status: 'added'
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`${activity.title} added to your activities!`);
      } else {
        alert(data.message || 'Failed to add activity');
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Error adding activity');
    }
  };

  if (loading) {
    return <div className='min-h-screen flex items-center justify-center'>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading activities...</p>
      </div>
    </div>;
  }

  console.log('Activities in render:', activities);

  return (
    <div className='min-h-screen p-6 bg-gray-50'>
      <div className='max-w-6xl mx-auto'>
                {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Available Activities</h1>
            <p className='text-gray-600 mt-2'>Choose an activity to start your wellness journey</p>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={() => router.push('/user-activity')}
              className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-2'
            >
              📋 My Activities
            </button>
            <button
              onClick={() => router.push('/settings')}
              className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2'
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('selectedActivity');
                router.push('/');
              }}
              className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Activities List */}
        {activities.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No activities available. Please check back later.</p>
          </div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {activities.map((activity) => {
              const isExpanded = expandedCards.has(activity._id);
              return (
                <div
                  key={activity._id}
                  className='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200'
                >
                  <div className='mb-4'>
                    <h3 className='text-xl font-bold mb-2 text-gray-800'>{activity.title}</h3>
                    <p className='text-gray-600 mb-3 text-sm leading-relaxed'>{activity.description}</p>
                  </div>
                  
                  {/* Activity Details */}
                  <div className='space-y-3 mb-4'>
                    <div className='flex justify-between items-center'>
                      <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
                        {activity.category}
                      </span>
                      <span className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium'>
                        {activity.difficulty}
                      </span>
                    </div>
                    
                    <div className='flex items-center text-purple-600'>
                      <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
                      </svg>
                      <span className='font-semibold'>{activity.estimatedTime} minutes</span>
                    </div>
                  </div>

                  {/* Instructions Preview/Full */}
                  {activity.instructions && activity.instructions.length > 0 && (
                    <div className='border-t pt-3 mb-4'>
                      <div className='flex justify-between items-center mb-2'>
                        <p className='text-xs text-gray-500 font-semibold'>INSTRUCTIONS:</p>
                        <button
                          onClick={() => toggleExpanded(activity._id)}
                          className='text-blue-500 text-xs hover:text-blue-700 font-medium'
                        >
                          {isExpanded ? '▲ Show Less' : '▼ Show All'}
                        </button>
                      </div>
                      <div className='text-sm text-gray-700'>
                        {isExpanded ? (
                          <ol className='list-decimal list-inside space-y-1'>
                            {activity.instructions.map((instruction, index) => (
                              <li key={index}>{instruction}</li>
                            ))}
                          </ol>
                        ) : (
                          <>
                            <p className='truncate'>1. {activity.instructions[0]}</p>
                            {activity.instructions.length > 1 && (
                              <p className='text-xs text-gray-500 mt-1'>
                                +{activity.instructions.length - 1} more steps...
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className='border-t pt-3 mb-4 space-y-3'>
                      <div>
                        <p className='text-xs text-gray-500 font-semibold mb-1'>FULL DESCRIPTION:</p>
                        <p className='text-sm text-gray-700'>{activity.description}</p>
                      </div>
                      
                      {activity.benefits && (
                        <div>
                          <p className='text-xs text-gray-500 font-semibold mb-1'>BENEFITS:</p>
                          <p className='text-sm text-gray-700'>{activity.benefits}</p>
                        </div>
                      )}
                      
                      {activity.equipment && (
                        <div>
                          <p className='text-xs text-gray-500 font-semibold mb-1'>EQUIPMENT NEEDED:</p>
                          <p className='text-sm text-gray-700'>{activity.equipment}</p>
                        </div>
                      )}
                      
                      <div className='grid grid-cols-2 gap-4 text-xs'>
                        <div>
                          <span className='text-gray-500 font-semibold'>Created:</span>
                          <p className='text-gray-700'>
                            {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className='text-gray-500 font-semibold'>Active:</span>
                          <p className='text-gray-700'>{activity.isActive ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className='flex gap-2'>
                    <button
                      onClick={() => addActivityToUser(activity)}
                      className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium'
                    >
                      + Add to My Activities
                    </button>
                    <button
                      onClick={() => toggleExpanded(activity._id)}
                      className='px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm'
                    >
                      {isExpanded ? 'Less' : 'More'}
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
