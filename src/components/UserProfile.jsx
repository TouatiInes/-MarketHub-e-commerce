import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, EnvelopeIcon, PhoneIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const UserProfile = ({ onNavigate }) => {
  const { user, updateProfile, logout, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    preferences: {
      newsletter: true,
      notifications: true
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        preferences: {
          newsletter: user.preferences?.newsletter ?? true,
          notifications: user.preferences?.notifications ?? true
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        preferences: {
          newsletter: user.preferences?.newsletter ?? true,
          notifications: user.preferences?.notifications ?? true
        }
      });
    }
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleLogout = () => {
    logout();
    if (onNavigate) onNavigate('home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
          <button
            onClick={() => onNavigate && onNavigate('login')}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role === 'admin' ? 'Administrator' : 'Customer'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-ghost flex items-center space-x-2"
              >
                <PencilIcon className="h-4 w-4" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="btn-outline flex items-center space-x-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 min-h-[44px]"
                  disabled={isSaving}
                />
              ) : (
                <div className="flex items-center space-x-2 py-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user.firstName}</span>
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 min-h-[44px]"
                  disabled={isSaving}
                />
              ) : (
                <div className="flex items-center space-x-2 py-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user.lastName}</span>
                </div>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-2 py-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{user.email}</span>
                <span className="text-xs text-gray-500">(Cannot be changed)</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 min-h-[44px]"
                  placeholder="+216 12 345 678"
                  disabled={isSaving}
                />
              ) : (
                <div className="flex items-center space-x-2 py-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user.phone || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Preferences */}
          {isEditing && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="preferences.newsletter"
                    checked={formData.preferences.newsletter}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
                    disabled={isSaving}
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Subscribe to newsletter and promotional emails
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="preferences.notifications"
                    checked={formData.preferences.notifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
                    disabled={isSaving}
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Receive order updates and notifications
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Account Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">{user.cart?.length || 0}</div>
              <div className="text-sm text-gray-600">Items in Cart</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">{user.wishlist?.length || 0}</div>
              <div className="text-sm text-gray-600">Wishlist Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Member Since</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
