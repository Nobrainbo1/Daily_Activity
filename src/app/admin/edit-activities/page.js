'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const router = useRouter();

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
      const response = await fetch('/api/activities');
      const data = await response.json();
      if (data.activities) {
        setActivities(data.activities);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditActivity = (activity) => {
    setEditingActivity({
      ...activity,
      steps: activity.steps.map(step => ({ ...step }))
    });
  };

  const handleStepVideoChange = (stepIndex, videoUrl) => {
    const newSteps = [...editingActivity.steps];
    newSteps[stepIndex].videoUrl = videoUrl;
    setEditingActivity({ ...editingActivity, steps: newSteps });
  };

  const handleSaveActivity = async () => {
    try {
      const response = await fetch('/api/activities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: editingActivity._id,
          updates: {
            title: editingActivity.title,
            description: editingActivity.description,
            steps: editingActivity.steps
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: '✅ Activity updated successfully!', type: 'success' });
        fetchActivities();
        setEditingActivity(null);
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: data.error || 'Failed to update activity', type: 'error' });
      }
    } catch (err) {
      console.error('Error updating activity:', err);
      setMessage({ text: 'Error updating activity', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/activities')}
            className="mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            ← Back to Activities
          </button>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Edit Activities & Video Links
            </h1>
            <p className="text-gray-600 mt-2">
              Update activity information and video tutorial links
            </p>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Activities List */}
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20"
            >
              {editingActivity?._id === activity._id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Activity Title
                    </label>
                    <input
                      type="text"
                      value={editingActivity.title}
                      onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingActivity.description}
                      onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Steps with Video Links */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">Steps & Video Links</h3>
                    {editingActivity.steps.map((step, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-blue-600">Step {step.stepNumber}</span>
                          <span className="text-gray-700">{step.title}</span>
                        </div>
                        
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Video URL (YouTube, Vimeo, etc.)
                          </label>
                          <input
                            type="url"
                            value={step.videoUrl || ''}
                            onChange={(e) => handleStepVideoChange(index, e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          {step.videoUrl && (
                            <a
                              href={step.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                            >
                              🔗 Test link
                            </a>
                          )}
                        </div>

                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveActivity}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      ✓ Save Changes
                    </button>
                    <button
                      onClick={() => setEditingActivity(null)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{activity.title}</h3>
                      <p className="text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {activity.category}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                          {activity.steps?.length || 0} steps
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditActivity(activity)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      ✏️ Edit
                    </button>
                  </div>

                  {/* Show current video links */}
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Current Video Links:</p>
                    <div className="space-y-1">
                      {activity.steps?.map((step, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          Step {step.stepNumber}: {step.videoUrl ? (
                            <a href={step.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {step.videoUrl.substring(0, 50)}{step.videoUrl.length > 50 ? '...' : ''}
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">No video link</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
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
      `}</style>
    </div>
  );
}
