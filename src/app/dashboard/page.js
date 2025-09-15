'use client';

import Link from 'next/link';
import { mockUsers, mockUserActivities } from '@/data';

export default function DashboardPage() {
  // Mock current user (Alex Johnson)
  const currentUser = mockUsers[0];
  
  // Mock user's activities
  const userActivities = mockUserActivities.filter(activity => activity.userId === 'user1');
  const completedActivities = userActivities.filter(activity => activity.status === 'completed');
  const pendingActivities = userActivities.filter(activity => activity.status === 'pending');

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold sapphire-text-gradient">Welcome back, {currentUser.name}!</h1>
            <p className="text-xl" style={{ color: '#2C444C' }}>Here's your personal growth dashboard</p>
          </div>
          <Link 
            href="/" 
            className="px-4 py-2 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #0474C4, #5379AE)' }}
          >
            ← Back to Home
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-opacity-20 transition-all duration-300 transform hover:scale-105" style={{ borderColor: '#A8C4EC' }}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #A8C4EC, #0474C4)' }}>
                <span className="text-2xl">🔥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm" style={{ color: '#2C444C' }}>Current Streak</p>
                <p className="text-2xl font-bold" style={{ color: '#262B40' }}>{currentUser.streak.current}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border border-opacity-20 transition-all duration-300 transform hover:scale-105" style={{ borderColor: '#A8C4EC' }}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #5379AE, #06457F)' }}>
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm" style={{ color: '#2C444C' }}>Completed</p>
                <p className="text-2xl font-bold" style={{ color: '#262B40' }}>{completedActivities.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border border-opacity-20 transition-all duration-300 transform hover:scale-105" style={{ borderColor: '#A8C4EC' }}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #06457F, #2C444C)' }}>
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm" style={{ color: '#2C444C' }}>Badges</p>
                <p className="text-2xl font-bold" style={{ color: '#262B40' }}>{currentUser.badges.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border border-opacity-20 transition-all duration-300 transform hover:scale-105" style={{ borderColor: '#A8C4EC' }}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #2C444C, #262B40)' }}>
                <span className="text-2xl">⏱️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm" style={{ color: '#2C444C' }}>Preferred Time</p>
                <p className="text-2xl font-bold" style={{ color: '#262B40' }}>{currentUser.preferences.availableTime}m</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
              <div className="space-y-4">
                {completedActivities.slice(-5).reverse().map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">Activity Completed</p>
                        <p className="text-sm text-gray-600">
                          {activity.timeSpent} minutes • Rating: {activity.rating}/5
                        </p>
                        {activity.feedback && (
                          <p className="text-sm text-gray-500 italic">"{activity.feedback}"</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(activity.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Your Badges</h3>
              <div className="space-y-3">
                {currentUser.badges.map((badge, index) => (
                  <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-lg mr-3">🏆</span>
                    <span className="font-medium text-yellow-800">{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Your Focus Areas</h3>
              <div className="space-y-2">
                {currentUser.preferences.skillGoals.map((goal, index) => (
                  <span key={index} className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mr-2 mb-2">
                    {goal}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Preferred Difficulty: <span className="font-medium">{currentUser.preferences.difficultyPreference}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/activities" className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors">
                  Browse Activities
                </Link>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Get Daily Suggestion
                </button>
                <Link href="/profile" className="block w-full px-4 py-2 bg-gray-200 text-gray-700 text-center rounded-lg hover:bg-gray-300 transition-colors">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}