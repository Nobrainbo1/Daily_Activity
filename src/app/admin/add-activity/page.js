'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/apiClient';

export default function AddActivity() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [activity, setActivity] = useState({
    title: '',
    category: 'Mindfulness',
    difficulty: 'Easy',
    estimatedTime: 10,
    description: '',
    steps: [
      {
        stepNumber: 1,
        title: '',
        description: '',
        tips: [''],
        videoUrl: '',
        estimatedDuration: 2
      }
    ]
  });

  const categories = [
    'Creativity',
    'Mindfulness',
    'Productivity',
    'Communication',
    'Fitness',
    'Learning',
    'Social',
    'Self-Care'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleActivityChange = (field, value) => {
    setActivity(prev => ({ ...prev, [field]: value }));
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...activity.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setActivity(prev => ({ ...prev, steps: newSteps }));
  };

  const handleTipChange = (stepIndex, tipIndex, value) => {
    const newSteps = [...activity.steps];
    newSteps[stepIndex].tips[tipIndex] = value;
    setActivity(prev => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    const newStep = {
      stepNumber: activity.steps.length + 1,
      title: '',
      description: '',
      tips: [''],
      videoUrl: '',
      estimatedDuration: 2
    };
    setActivity(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const removeStep = (index) => {
    if (activity.steps.length === 1) {
      setMessage({ type: 'error', text: 'Activity must have at least one step' });
      return;
    }
    const newSteps = activity.steps.filter((_, i) => i !== index);
    // Renumber steps
    newSteps.forEach((step, i) => {
      step.stepNumber = i + 1;
    });
    setActivity(prev => ({ ...prev, steps: newSteps }));
  };

  const addTip = (stepIndex) => {
    const newSteps = [...activity.steps];
    newSteps[stepIndex].tips.push('');
    setActivity(prev => ({ ...prev, steps: newSteps }));
  };

  const removeTip = (stepIndex, tipIndex) => {
    const newSteps = [...activity.steps];
    if (newSteps[stepIndex].tips.length > 1) {
      newSteps[stepIndex].tips = newSteps[stepIndex].tips.filter((_, i) => i !== tipIndex);
      setActivity(prev => ({ ...prev, steps: newSteps }));
    }
  };

  const validateActivity = () => {
    if (!activity.title.trim()) {
      setMessage({ type: 'error', text: 'Activity title is required' });
      return false;
    }
    if (!activity.description.trim()) {
      setMessage({ type: 'error', text: 'Activity description is required' });
      return false;
    }
    
    for (let i = 0; i < activity.steps.length; i++) {
      const step = activity.steps[i];
      if (!step.title.trim()) {
        setMessage({ type: 'error', text: `Step ${i + 1} title is required` });
        return false;
      }
      if (!step.description.trim()) {
        setMessage({ type: 'error', text: `Step ${i + 1} description is required` });
        return false;
      }
      if (step.tips.some(tip => !tip.trim())) {
        setMessage({ type: 'error', text: `Step ${i + 1} has empty tips. Please fill or remove them.` });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateActivity()) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(apiUrl('/api/activities'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Activity created successfully!' });
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setActivity({
            title: '',
            category: 'Mindfulness',
            difficulty: 'Easy',
            estimatedTime: 10,
            description: '',
            steps: [
              {
                stepNumber: 1,
                title: '',
                description: '',
                tips: [''],
                videoUrl: '',
                estimatedDuration: 2
              }
            ]
          });
          setMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create activity' });
      }
    } catch (err) {
      console.error('Error creating activity:', err);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      Creativity: 'from-purple-500 to-pink-500',
      Mindfulness: 'from-blue-500 to-cyan-500',
      Productivity: 'from-orange-500 to-amber-500',
      Communication: 'from-indigo-500 to-purple-500',
      Fitness: 'from-green-500 to-emerald-500',
      Learning: 'from-blue-600 to-indigo-600',
      Social: 'from-pink-500 to-rose-500',
      'Self-Care': 'from-violet-500 to-fuchsia-500'
    };
    return gradients[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1 absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="blob blob-2 absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000"></div>
        <div className="blob blob-3 absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/activities')}
            className="mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            ← Back to Activities
          </button>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Add New Activity
            </h1>
            <p className="text-gray-600">
              Create a new activity with step-by-step instructions, tips, and video tutorials
            </p>
          </div>
        </div>

        {/* Message Banner */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border-2 border-green-500 text-green-700' 
              : 'bg-red-50 border-2 border-red-500 text-red-700'
          }`}>
            <p className="font-semibold">{message.text}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Activity Title *
                </label>
                <input
                  type="text"
                  value={activity.title}
                  onChange={(e) => handleActivityChange('title', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  placeholder="e.g., Morning Meditation"
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={activity.category}
                    onChange={(e) => handleActivityChange('category', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={activity.difficulty}
                    onChange={(e) => handleActivityChange('difficulty', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estimated Time (minutes) *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={activity.estimatedTime}
                    onChange={(e) => handleActivityChange('estimatedTime', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={activity.description}
                  onChange={(e) => handleActivityChange('description', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  rows="3"
                  placeholder="Describe what this activity is about..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Steps Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Steps</h2>
              <button
                type="button"
                onClick={addStep}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition"
              >
                + Add Step
              </button>
            </div>

            <div className="space-y-6">
              {activity.steps.map((step, stepIndex) => (
                <div
                  key={stepIndex}
                  className={`bg-gradient-to-r ${getCategoryGradient(activity.category)} bg-opacity-10 p-6 rounded-xl border-2 border-gray-200`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Step {step.stepNumber}
                    </h3>
                    {activity.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(stepIndex)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                      >
                        Remove Step
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Step Title *
                      </label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleStepChange(stepIndex, 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                        placeholder="e.g., Find Your Space"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Step Description *
                      </label>
                      <textarea
                        value={step.description}
                        onChange={(e) => handleStepChange(stepIndex, 'description', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                        rows="3"
                        placeholder="Describe what to do in this step..."
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Tips (at least one required) *
                        </label>
                        <button
                          type="button"
                          onClick={() => addTip(stepIndex)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                        >
                          + Add Tip
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {step.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={tip}
                              onChange={(e) => handleTipChange(stepIndex, tipIndex, e.target.value)}
                              className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                              placeholder={`Tip ${tipIndex + 1}`}
                              required
                            />
                            {step.tips.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTip(stepIndex, tipIndex)}
                                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Video URL (optional)
                        </label>
                        <input
                          type="url"
                          value={step.videoUrl}
                          onChange={(e) => handleStepChange(stepIndex, 'videoUrl', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                          placeholder="https://youtube.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Estimated Duration (minutes) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={step.estimatedDuration}
                          onChange={(e) => handleStepChange(stepIndex, 'estimatedDuration', parseInt(e.target.value))}
                          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Activity...
                </span>
              ) : (
                'Create Activity'
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(20px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .blob {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        .blob-1 {
          top: 10%;
          left: 20%;
        }
        
        .blob-2 {
          top: 60%;
          right: 10%;
          left: auto;
        }
        
        .blob-3 {
          bottom: 10%;
          top: auto;
        }
      `}</style>
    </div>
  );
}
