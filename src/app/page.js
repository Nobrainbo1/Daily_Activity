'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/apiClient';

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

      console.log('Attempting to fetch:', endpoint);
      console.log('Payload:', payload);

      const response = await fetch(apiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok && response.status === 404) {
        setError('API endpoint not found. Please check server configuration.');
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to onboarding page for new signups, activities for login
        if (isLogin) {
          router.push('/activities');
        } else {
          router.push('/onboarding');
        }
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error details:', err);
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Please check if the server is running on the correct port.');
      } else {
        setError(`Network error: ${err.message}`);
      }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 animate-gradient"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-yellow-300 rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-float animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-white space-y-6">
            {/* App Name Title */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white/90 tracking-wide mb-2">
                DAILY ACTIVITY
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 rounded-full"></div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Transform Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
                  Daily Habits
                </span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Your personal activity tracker with step-by-step guidance, progress tracking, and video tutorials.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Step-by-Step Guidance</h3>
                  <p className="text-blue-100">Follow detailed instructions with tips and video tutorials</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Track Your Progress</h3>
                  <p className="text-blue-100">Monitor completion and celebrate your achievements</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Personalized Activities</h3>
                  <p className="text-blue-100">Choose from multiple categories tailored to your goals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
                </h2>
                <p className="text-gray-600">
                  {isLogin ? 'Continue your journey' : 'Start your transformation'}
                </p>
              </div>

              {/* Already Logged In Banner */}
              {typeof window !== 'undefined' && localStorage.getItem('user') && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl">
                  <p className="text-blue-700 text-center mb-3">
                    You're already logged in as <strong>{JSON.parse(localStorage.getItem('user')).name}</strong>
                  </p>
                  <button
                    onClick={() => router.push('/activities')}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold hover:shadow-lg transform hover:scale-102 transition"
                  >
                    Go to Activities →
                  </button>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                      placeholder="Enter your name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-lg font-bold text-white text-lg shadow-lg transform transition-all duration-300 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-2xl hover:scale-102'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </span>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    onClick={toggleMode}
                    className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold hover:underline"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
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

