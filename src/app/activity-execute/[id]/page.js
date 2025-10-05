'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ActivityExecute() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/');
        return;
      }
      setUser(JSON.parse(userData));
      fetchActivityData();
    }
  }, [params.id]);

  const fetchActivityData = async () => {
    try {
      // params.id is the userActivity ID, not the activity ID
      // Fetch user activity by ID (which will be populated with activity details)
      const userActRes = await fetch(`/api/user-activities?id=${params.id}`);
      const userActData = await userActRes.json();
      
      console.log('User activity response:', userActData);
      
      if (userActData.userActivities && userActData.userActivities.length > 0) {
        const userAct = userActData.userActivities[0];
        setUserActivity(userAct);
        
        // The activity details should be populated in activityId field
        if (userAct.activityId) {
          setActivity(userAct.activityId);
        }
        
        // Set progress state
        if (userAct.progress) {
          setCurrentStep(userAct.progress.currentStep || 0);
          const completed = new Set(
            (userAct.progress.completedSteps || []).map(s => s.stepNumber)
          );
          setCompletedSteps(completed);
          setIsStarted(userAct.progress.startedAt !== null);
        }
      } else {
        console.error('No user activity found with ID:', params.id);
      }
    } catch (err) {
      console.error('Error fetching activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      const response = await fetch('/api/user-activities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userActivityId: userActivity._id,
          updates: {
            status: 'in-progress',
            'progress.startedAt': new Date(),
            'progress.totalSteps': activity.steps?.length || 0,
            'progress.currentStep': 0
          }
        })
      });

      if (response.ok) {
        setIsStarted(true);
        setCurrentStep(0);
      }
    } catch (err) {
      console.error('Error starting activity:', err);
    }
  };

  const handleStepComplete = async (stepNumber) => {
    const newCompleted = new Set(completedSteps);
    
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    
    setCompletedSteps(newCompleted);

    const percentComplete = Math.round((newCompleted.size / (activity.steps?.length || 1)) * 100);
    const allComplete = newCompleted.size === activity.steps?.length;
    const noneComplete = newCompleted.size === 0;

    try {
      const updates = {
        'progress.completedSteps': Array.from(newCompleted).map(num => ({
          stepNumber: num,
          completedAt: new Date()
        })),
        'progress.percentComplete': percentComplete,
        'progress.currentStep': stepNumber
      };

      if (allComplete) {
        // All steps completed - mark activity as completed
        updates.status = 'completed';
        updates.completedAt = new Date();
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      } else if (noneComplete && userActivity.progress?.startedAt) {
        // All steps un-completed but activity was started - reset to in-progress
        updates.status = 'in-progress';
        updates.completedAt = null;
      } else if (userActivity.status === 'completed' && !allComplete) {
        // Activity was completed but user un-completed a step - revert to in-progress
        updates.status = 'in-progress';
        updates.completedAt = null;
      }

      await fetch('/api/user-activities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userActivityId: userActivity._id,
          updates
        })
      });

      // Update local userActivity state to reflect status change
      if (updates.status) {
        setUserActivity(prev => ({
          ...prev,
          status: updates.status,
          completedAt: updates.completedAt
        }));
      }
    } catch (err) {
      console.error('Error updating progress:', err);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity not found</h2>
          <button
            onClick={() => router.push('/activities')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = completedSteps.size / (activity.steps?.length || 1) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Celebration Confetti */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-6xl animate-bounce">🎉</div>
          <div className="absolute text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-pulse">
            Congratulations! 🌟
          </div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/user-activity')}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition group"
          >
            <span className="mr-2 transform group-hover:-translate-x-1 transition">←</span>
            Back to My Activities
          </button>

          <div className={`bg-gradient-to-r ${getCategoryGradient(activity.category)} p-1 rounded-2xl shadow-2xl`}>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getCategoryGradient(activity.category)} mb-3`}>
                    {activity.category}
                  </span>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{activity.title}</h1>
                  <p className="text-gray-600 text-lg">{activity.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Difficulty</div>
                  <div className={`text-lg font-bold ${
                    activity.difficulty === 'Easy' ? 'text-green-600' :
                    activity.difficulty === 'Medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {activity.difficulty}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {isStarted && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
                    <span className="text-sm font-bold text-blue-600">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getCategoryGradient(activity.category)} transition-all duration-500 ease-out rounded-full flex items-center justify-end px-2`}
                      style={{ width: `${progressPercent}%` }}
                    >
                      {progressPercent > 10 && (
                        <span className="text-xs font-bold text-white">
                          {completedSteps.size}/{activity.steps?.length || 0}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Start Button */}
              {!isStarted && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleStart}
                    className={`px-12 py-4 bg-gradient-to-r ${getCategoryGradient(activity.category)} text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300`}
                  >
                    🚀 Start Activity
                  </button>
                  <p className="mt-3 text-sm text-gray-500">
                    Estimated time: {activity.estimatedTime} minutes
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Steps */}
        {isStarted && activity.steps && activity.steps.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📋 Step-by-Step Guide</h2>
            
            {activity.steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.stepNumber);
              const isCurrent = currentStep === step.stepNumber;
              
              return (
                <div
                  key={step.stepNumber}
                  className={`transform transition-all duration-300 ${
                    isCurrent ? 'scale-102' : 'scale-100'
                  }`}
                >
                  <div className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border-2 ${
                    isCompleted ? 'border-green-400' :
                    isCurrent ? `border-blue-400` :
                    'border-gray-200'
                  }`}>
                    <div className={`p-6 ${isCompleted ? 'bg-green-50' : isCurrent ? 'bg-blue-50' : 'bg-white'}`}>
                      <div className="flex items-start gap-4">
                        {/* Step Number Circle */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          isCompleted ? 'bg-green-500 text-white' :
                          isCurrent ? 'bg-blue-500 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {isCompleted ? '✓' : step.stepNumber}
                        </div>

                        <div className="flex-1">
                          {/* Step Title */}
                          <h3 className={`text-2xl font-bold mb-2 ${
                            isCompleted ? 'text-green-700 line-through' :
                            'text-gray-800'
                          }`}>
                            {step.title}
                          </h3>

                          {/* Step Description */}
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {step.description}
                          </p>

                          {/* Tips Section */}
                          {step.tips && step.tips.length > 0 && (
                            <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                              <h4 className="font-bold text-yellow-800 mb-2 flex items-center">
                                💡 Tips:
                              </h4>
                              <ul className="list-disc list-inside space-y-1">
                                {step.tips.map((tip, tipIndex) => {
                                  // Check if tip contains a URL
                                  const urlRegex = /(https?:\/\/[^\s]+)/g;
                                  const parts = tip.split(urlRegex);
                                  
                                  return (
                                    <li key={tipIndex} className="text-yellow-900 text-sm">
                                      {parts.map((part, partIndex) => {
                                        if (part.match(urlRegex)) {
                                          return (
                                            <a
                                              key={partIndex}
                                              href={part}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-600 hover:underline font-medium"
                                            >
                                              {part}
                                            </a>
                                          );
                                        }
                                        return <span key={partIndex}>{part}</span>;
                                      })}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}

                          {/* Video Tutorial */}
                          {step.videoUrl && (
                            <div className="mb-4">
                              <a
                                href={step.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getCategoryGradient(activity.category)} text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition`}
                              >
                                <span className="font-semibold">Watch Tutorial Video</span>
                                <span>→</span>
                              </a>
                            </div>
                          )}

                          {/* Duration */}
                          <div className="text-sm text-gray-500 mb-4">
                            ⏱️ Estimated time: {step.estimatedDuration || 5} minutes
                          </div>

                          {/* Complete Checkbox */}
                          <button
                            onClick={() => handleStepComplete(step.stepNumber)}
                            className={`w-full py-3 rounded-lg font-bold transition transform hover:scale-102 ${
                              isCompleted
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            {isCompleted ? '✓ Completed' : 'Mark as Complete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Completion Message */}
        {isStarted && completedSteps.size === activity.steps?.length && (
          <div className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-8 text-center text-white shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
            <p className="text-xl mb-6">You've completed this activity!</p>
            <button
              onClick={() => router.push('/activities')}
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition"
            >
              Browse More Activities
            </button>
          </div>
        )}
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
