'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const categories = ['All', 'Creativity', 'Mindfulness', 'Productivity', 'Communication', 'Fitness', 'Learning', 'Social', 'Self-Care'];

  const fallbackActivities = [
    {
      _id: '1',
      title: 'Morning Meditation',
      description: 'Start your day with mindfulness and inner peace. Connect with your breath and set positive intentions.',
      category: 'Mindfulness',
      difficulty: 'Easy',
      estimatedTime: 12,
      instructions: ['Find a quiet, comfortable space', 'Sit with back straight', 'Close your eyes gently', 'Focus on your breathing'],
      steps: [
        {
          stepNumber: 1,
          title: 'Find Your Space',
          description: 'Choose a quiet, comfortable location where you won\'t be disturbed.',
          tips: ['Use a cushion or chair for comfort', 'Ensure good ventilation', 'Dim the lights if possible'],
          videoUrl: 'https://youtu.be/dhFt7eURm78?si=Q7EQ7t0oTS-Z1Jto',
          estimatedDuration: 3
        },
        {
          stepNumber: 2,
          title: 'Proper Posture',
          description: 'Sit with your back straight, shoulders relaxed, and hands resting comfortably.',
          tips: ['Keep spine aligned', 'Relax your shoulders', 'Rest hands on knees or lap'],
          videoUrl: 'https://youtu.be/OyK0oE5rwFY?si=gB2yU0lRdH-jO6uC',
          estimatedDuration: 4
        },
        {
          stepNumber: 3,
          title: 'Breathing Focus',
          description: 'Close your eyes and bring awareness to your natural breath.',
          tips: ['Don\'t force your breathing', 'Notice the rhythm naturally', 'Count breaths if helpful'],
          videoUrl: 'https://youtu.be/RiMb2Bw4Ae8?si=29d0w4nalDOfcRRb',
          estimatedDuration: 4
        }
      ]
    },
    {
      _id: '2',
      title: 'Creative Journaling',
      description: 'Express your thoughts, feelings, and ideas through free-form writing and creative expression.',
      category: 'Creativity',
      difficulty: 'Easy',
      estimatedTime: 18,
      instructions: ['Get your journal', 'Set a timer', 'Write freely', 'Don\'t judge yourself'],
      steps: [
        {
          stepNumber: 1,
          title: 'Prepare Your Materials',
          description: 'Gather your journal, pen, and any art supplies you want to use.',
          tips: ['Use a notebook you love', 'Pick your favorite pen', 'Add stickers or colors'],
          videoUrl: 'https://youtu.be/njstk6xlrh0?si=i1VPfpghZdGT3H_7',
          estimatedDuration: 7
        },
        {
          stepNumber: 2,
          title: 'Set Your Intention',
          description: 'Take a moment to decide what you want to explore or express today.',
          tips: ['Choose a theme or topic', 'Or let it flow naturally', 'There\'s no wrong choice'],
          videoUrl: 'https://youtu.be/QG_WlhxynHo?si=xEUKfd_171hJmGfj',
          estimatedDuration: 7
        },
        {
          stepNumber: 3,
          title: 'Free Writing',
          description: 'Write continuously for 15 minutes without stopping or judging.',
          tips: ['Don\'t worry about grammar', 'Let thoughts flow freely', 'Keep pen moving'],
          videoUrl: 'https://youtu.be/gtcfnDG_0M0?si=SzFmSxke619jGxlz',
          estimatedDuration: 3
        }
      ]
    },
    {
      _id: '3',
      title: 'HIIT Workout',
      description: 'High-intensity interval training to boost your fitness, energy, and metabolism.',
      category: 'Fitness',
      difficulty: 'Medium',
      estimatedTime: 32,
      instructions: ['Warm up', 'High-intensity intervals', 'Rest periods', 'Cool down'],
      steps: [
        {
          stepNumber: 1,
          title: 'Dynamic Warm-Up',
          description: 'Prepare your body with light cardio and dynamic stretches.',
          tips: ['Start with light jogging in place', 'Do arm circles and leg swings', 'Gradually increase intensity'],
          videoUrl: 'https://youtu.be/LKSC_KujZ4g?si=4s9y7m1eljZwmk2v',
          estimatedDuration: 6
        },
        {
          stepNumber: 2,
          title: 'High-Intensity Intervals',
          description: 'Perform 30 seconds of intense exercise followed by 30 seconds rest. Repeat 4 rounds.',
          tips: ['Push yourself during work periods', 'Maintain good form', 'Breathe consistently'],
          videoUrl: 'https://youtu.be/IU913YMDXCk?si=9nRrmYgI9nkAlSK8',
          estimatedDuration: 15
        },
        {
          stepNumber: 3,
          title: 'Cool Down & Stretch',
          description: 'Gradually lower your heart rate and stretch major muscle groups.',
          tips: ['Walk slowly for 2-3 minutes', 'Hold each stretch for 30 seconds', 'Focus on deep breathing'],
          videoUrl: 'https://youtu.be/3N_8ioZ4jdk?si=jlW0D-C0eExP6CEV',
          estimatedDuration: 10
        }
      ]
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
      const response = await fetch('/api/activities', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.activities && Array.isArray(data.activities) && data.activities.length > 0) {
        setActivities(data.activities);
      } else {
        setActivities(fallbackActivities);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
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
      const response = await fetch('/api/user-activities', {
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
        alert(`✓ "${activity.title}" added to your activities!`);
        router.push(`/activity-execute/${activity._id}`);
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

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
                <p className="text-gray-600 mt-1">Welcome, <span className="font-semibold text-blue-600">{user?.name}</span>! 🌟</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/user-activity')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition"
                >
                  📊 My Activities
                </button>
                <button
                  onClick={handleLogout}
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
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-lg"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
                    🔍
                  </span>
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
                      className={`px-4 py-2 rounded-full font-semibold transition transform hover:scale-105 ${
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedCategory === 'All' ? 'All Activities' : `${selectedCategory} Activities`}
                <span className="ml-2 text-blue-600">({filteredActivities.length})</span>
              </h2>
            </div>

            {filteredActivities.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-white/20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No activities found</h3>
                <p className="text-gray-600">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map(activity => {
                  const isExpanded = expandedCards.has(activity._id);
                  
                  return (
                    <div
                      key={activity._id}
                      className="group transform transition-all duration-300 hover:scale-102"
                    >
                      <div className={`bg-gradient-to-br ${getCategoryGradient(activity.category)} p-0.5 rounded-2xl shadow-lg hover:shadow-2xl transition h-full`}>
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col">
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
                          {activity.instructions && activity.instructions.length > 0 && (
                            <div className="mb-4 text-sm">
                              <p className="text-gray-500 font-semibold mb-1">Quick Preview:</p>
                              <p className="text-gray-700 truncate">• {activity.instructions[0]}</p>
                              {activity.instructions.length > 1 && (
                                <p className="text-gray-500 text-xs mt-1">+{activity.instructions.length - 1} more...</p>
                              )}
                            </div>
                          )}

                          {/* Action Button */}
                          <button
                            onClick={() => addActivityToUser(activity)}
                            className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${getCategoryGradient(activity.category)} hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                          >
                            🚀 Start Activity
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
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
