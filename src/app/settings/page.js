'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/');
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData(prev => ({
        ...prev,
        name: parsedUser.name || ''
      }));
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    // Validate name
    if (!formData.name.trim()) {
      showMessage('Please enter a valid name', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          name: formData.name.trim()
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Update localStorage with new user data
        const updatedUser = { ...user, name: formData.name.trim() };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        showMessage('Profile updated successfully!', 'success');
      } else {
        showMessage(data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!user) return;

    // Validate password fields
    if (!formData.currentPassword) {
      showMessage('Please enter your current password', 'error');
      return;
    }
    if (!formData.newPassword) {
      showMessage('Please enter a new password', 'error');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      showMessage('New passwords do not match', 'error');
      return;
    }
    if (formData.newPassword.length < 6) {
      showMessage('New password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        showMessage('Password updated successfully!', 'success');
      } else {
        showMessage(data.message || 'Failed to update password', 'error');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showMessage('Error updating password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('selectedActivity');
      router.push('/');
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will remove all your data.'
    );
    
    if (!confirmed) return;
    
    const doubleConfirm = confirm(
      'This will permanently delete your account and all associated data. Are you absolutely sure?'
    );
    
    if (!doubleConfirm) return;

    setLoading(true);
    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id
        }),
      });

      if (response.ok) {
        localStorage.removeItem('user');
        localStorage.removeItem('selectedActivity');
        alert('Account deleted successfully');
        router.push('/');
      } else {
        const data = await response.json();
        showMessage(data.message || 'Failed to delete account', 'error');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      showMessage('Error deleting account', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <button
            onClick={() => router.push('/activities')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            ← Back to Activities
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <form onSubmit={updateProfile}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={updatePassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Account Actions */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          <div className="space-y-4">
            <button
              onClick={logout}
              className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              🚪 Logout
            </button>
            <button
              onClick={deleteAccount}
              disabled={loading}
              className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Deleting...' : '🗑 Delete Account'}
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Account created: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
        </div>
      </div>
    </div>
  );
}