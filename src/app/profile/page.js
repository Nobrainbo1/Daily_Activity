'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockUsers } from '@/data/mockUsers';

export default function ProfilePage() {
  const [user, setUser] = useState(mockUsers[0]); // Alex Johnson
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    skillGoals: user.preferences.skillGoals,
    difficultyPreference: user.preferences.difficultyPreference,
    availableTime: user.preferences.availableTime
  });

  const allSkillGoals = ['Creativity', 'Mindfulness', 'Productivity', 'Communication', 'Fitness', 'Learning', 'Social', 'Self-Care'];

  const handleSave = () => {
    // In a real app, this would update the database
    setUser({
      ...user,
      name: editForm.name,
      email: editForm.email,
      preferences: {
        ...user.preferences,
        skillGoals: editForm.skillGoals,
        difficultyPreference: editForm.difficultyPreference,
        availableTime: editForm.availableTime
      }
    });
    setIsEditing(false);
  };

  const handleSkillGoalToggle = (goal) => {
    if (editForm.skillGoals.includes(goal)) {
      setEditForm({
        ...editForm,
        skillGoals: editForm.skillGoals.filter(g => g !== goal)
      });
    } else {
      setEditForm({
        ...editForm,
        skillGoals: [...editForm.skillGoals, goal]
      });
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold sapphire-text-gradient">Profile Settings</h1>
            <p className="text-xl" style={{ color: '#2C444C' }}>Manage your personal information and preferences</p>
          </div>
          <Link 
            href="/" 
            className="px-4 py-2 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #0474C4, #5379AE)' }}
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-opacity-20" style={{ borderColor: '#A8C4EC' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold" style={{ color: '#262B40' }}>Personal Information</h2>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #0474C4, #5379AE)' }}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button 
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          name: user.name,
                          email: user.email,
                          skillGoals: user.preferences.skillGoals,
                          difficultyPreference: user.preferences.difficultyPreference,
                          availableTime: user.preferences.availableTime
                        });
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{user.email}</p>
                    )}
                  </div>
                </div>

                {/* Skill Goals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Focus Areas</label>
                  {isEditing ? (
                    <div className="grid md:grid-cols-2 gap-2">
                      {allSkillGoals.map(goal => (
                        <label key={goal} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={editForm.skillGoals.includes(goal)}
                            onChange={() => handleSkillGoalToggle(goal)}
                            className="mr-3"
                          />
                          <span>{goal}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.preferences.skillGoals.map(goal => (
                        <span key={goal} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {goal}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preferences */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Difficulty</label>
                    {isEditing ? (
                      <select 
                        value={editForm.difficultyPreference}
                        onChange={(e) => setEditForm({...editForm, difficultyPreference: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{user.preferences.difficultyPreference}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Time (minutes)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="5"
                        max="300"
                        value={editForm.availableTime}
                        onChange={(e) => setEditForm({...editForm, availableTime: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{user.preferences.availableTime} minutes</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-semibold">{user.streak.current} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longest Streak</span>
                  <span className="font-semibold">{user.streak.longest} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Badges Earned</span>
                  <span className="font-semibold">{user.badges.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              <div className="space-y-3">
                {user.badges.map((badge, index) => (
                  <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-lg mr-3">🏆</span>
                    <span className="text-sm font-medium text-yellow-800">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}