'use client';

import { useState } from 'react';

export default function Home() {
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkDatabaseConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setDbStatus(data);
    } catch (error) {
      setDbStatus({
        success: false,
        message: 'Failed to connect to API',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="p-8 max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 sapphire-text-gradient">What To Do</h1>
          <p className="text-xl" style={{ color: '#2C444C' }}>
            Your daily activity recommendation app for personal growth
          </p>
        </header>

      <main className="space-y-8">
        {/* Database Connection Test */}
        <section className="bg-white p-6 rounded-lg shadow-lg border border-opacity-20" style={{ borderColor: '#A8C4EC' }}>
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#262B40' }}>Database Connection Test</h2>
          <div className="space-y-4">
            <button
              onClick={checkDatabaseConnection}
              disabled={loading}
              className="text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              style={{ 
                background: loading ? '#A8C4EC' : 'linear-gradient(135deg, #0474C4, #5379AE)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Checking...' : 'Test Database Connection'}
            </button>
            
            {dbStatus && (
              <div className={`p-4 rounded-lg ${dbStatus.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${dbStatus.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-medium">
                    {dbStatus.success ? 'Connected' : 'Connection Failed'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-700">{dbStatus.message}</p>
                {dbStatus.timestamp && (
                  <p className="mt-1 text-xs text-gray-500">
                    Checked at: {new Date(dbStatus.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Navigation to App Features */}
        <section className="bg-white p-6 rounded-lg shadow-lg border border-opacity-20" style={{ borderColor: '#A8C4EC' }}>
          <h2 className="text-2xl font-semibold mb-6" style={{ color: '#262B40' }}>Explore the App</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a href="/activities" className="block p-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2 border-transparent"
               style={{ 
                 background: 'linear-gradient(135deg, #A8C4EC, #0474C4)', 
                 color: 'white'
               }}
               onMouseEnter={(e) => e.target.style.borderColor = '#06457F'}
               onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}>
              <div className="text-3xl mb-4">📝</div>
              <h3 className="font-semibold mb-2">Browse Activities</h3>
              <p className="text-sm mb-4 opacity-90">
                Discover personalized activities for personal growth and skill development
              </p>
              <span className="font-medium">Explore Activities →</span>
            </a>
            
            <a href="/dashboard" className="block p-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2 border-transparent"
               style={{ 
                 background: 'linear-gradient(135deg, #5379AE, #2C444C)', 
                 color: 'white'
               }}
               onMouseEnter={(e) => e.target.style.borderColor = '#06457F'}
               onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}>
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-semibold mb-2">Your Dashboard</h3>
              <p className="text-sm mb-4 opacity-90">
                Track your progress, streaks, achievements, and personal growth
              </p>
              <span className="font-medium">View Dashboard →</span>
            </a>
            
            <a href="/profile" className="block p-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2 border-transparent"
               style={{ 
                 background: 'linear-gradient(135deg, #06457F, #262B40)', 
                 color: 'white'
               }}
               onMouseEnter={(e) => e.target.style.borderColor = '#A8C4EC'}
               onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}>
              <div className="text-3xl mb-4">👤</div>
              <h3 className="font-semibold mb-2">Profile Settings</h3>
              <p className="text-sm mb-4 opacity-90">
                Manage your preferences, goals, and personal information
              </p>
              <span className="font-medium">Edit Profile →</span>
            </a>
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}
