'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // Always show login page - user can navigate to activities manually
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCheckingAuth(false);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, password: formData.password, name: formData.name };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/activities');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      username: '',
      password: '',
      name: ''
    });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#0474C4' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 sapphire-text-gradient">Daily Activity Tracker</h1>
          <p className="text-lg" style={{ color: '#2C444C' }}>Your personal growth companion</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 border border-opacity-20" style={{ borderColor: '#A8C4EC' }}>
          {/* Check if user is already logged in */}
          {typeof window !== 'undefined' && localStorage.getItem('user') && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-center mb-3">
                You're already logged in as <strong>{JSON.parse(localStorage.getItem('user')).name}</strong>
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => router.push('/activities')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Continue to Activities
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('selectedActivity');
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Login as Different User
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-center" style={{ color: '#262B40' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-center mt-2" style={{ color: '#2C444C' }}>
              {isLogin ? 'Sign in to continue your journey' : 'Start your personal growth journey'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C444C' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{ borderColor: '#A8C4EC' }}
                  placeholder="Enter your full name"
                />
              </div>
            )}



            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2C444C' }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                style={{ borderColor: '#A8C4EC' }}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2C444C' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                style={{ borderColor: '#A8C4EC' }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ background: loading ? '#A8C4EC' : 'linear-gradient(135deg, #0474C4, #5379AE)' }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: '#2C444C' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="font-medium hover:underline transition-colors"
                style={{ color: '#0474C4' }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm" style={{ color: '#2C444C' }}>
              <strong>Demo Users:</strong><br />
              alex123 / password123<br />
              sarah456 / password456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}