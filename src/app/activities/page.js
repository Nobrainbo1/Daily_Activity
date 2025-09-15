'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockActivities } from '@/data/mockActivities';

export default function ActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  
  const categories = ['All', 'Mindfulness', 'Creativity', 'Productivity', 'Learning', 'Fitness', 'Social', 'Self-Care'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  
  const filteredActivities = mockActivities.filter(activity => {
    const categoryMatch = selectedCategory === 'All' || activity.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'All' || activity.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold sapphire-text-gradient">Browse Activities</h1>
            <Link 
              href="/" 
              className="px-4 py-2 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #0474C4, #5379AE)' }}
            >
              ← Back to Home
            </Link>
          </div>
          <p className="text-xl" style={{ color: '#2C444C' }}>Discover activities to boost your personal growth and well-being</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-opacity-20" style={{ borderColor: '#A8C4EC' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#262B40' }}>Filter Activities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2C444C' }}>Category</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border rounded-lg transition-all duration-200"
                style={{ 
                  borderColor: '#A8C4EC',
                  focusRingColor: '#0474C4'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2C444C' }}>Difficulty</label>
              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-3 border rounded-lg transition-all duration-200"
                style={{ 
                  borderColor: '#A8C4EC',
                  focusRingColor: '#0474C4'
                }}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-opacity-20" style={{ borderColor: '#A8C4EC' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#262B40' }}>{activity.title}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 text-xs rounded-full text-white" 
                          style={{ background: 'linear-gradient(135deg, #5379AE, #0474C4)' }}>
                      {activity.category}
                    </span>
                    <span className={`px-3 py-1 text-xs rounded-full text-white ${
                      activity.difficulty === 'Easy' ? '' :
                      activity.difficulty === 'Medium' ? '' : ''
                    }`}
                    style={{ 
                      background: activity.difficulty === 'Easy' ? 
                        'linear-gradient(135deg, #A8C4EC, #5379AE)' :
                        activity.difficulty === 'Medium' ? 
                        'linear-gradient(135deg, #5379AE, #06457F)' :
                        'linear-gradient(135deg, #06457F, #2C444C)'
                    }}>
                      {activity.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm mb-4 line-clamp-3" style={{ color: '#2C444C' }}>{activity.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#5379AE' }}>⏱️ {activity.estimatedTime} min</span>
                <div className="flex space-x-2">
                  <button 
                    className="px-4 py-2 text-white text-sm rounded-lg transition-all duration-200 transform hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #0474C4, #5379AE)' }}
                  >
                    Start
                  </button>
                  <button 
                    className="px-3 py-2 text-sm rounded-lg transition-all duration-200 transform hover:scale-105 border"
                    style={{ 
                      backgroundColor: '#A8C4EC', 
                      color: '#06457F',
                      borderColor: '#5379AE'
                    }}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: '#2C444C' }}>No activities found with the selected filters.</p>
            <button 
              onClick={() => {setSelectedCategory('All'); setSelectedDifficulty('All')}}
              className="mt-4 px-6 py-3 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #0474C4, #5379AE)' }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}