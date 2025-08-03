import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = ({ onNavigate, onClose }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) clearError();
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setLocalError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Close modal and redirect to home
        if (onClose) onClose();
        if (onNavigate) onNavigate('home');
      } else {
        setLocalError(result.error || 'Login failed');
      }
    } catch (err) {
      setLocalError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (userType) => {
    setIsSubmitting(true);
    const credentials = userType === 'admin' 
      ? { email: 'admin@markethub.com', password: 'admin123' }
      : { email: 'user1@example.com', password: 'password123' };

    try {
      const result = await login(credentials.email, credentials.password);
      if (result.success) {
        if (onClose) onClose();
        if (onNavigate) onNavigate('home');
      }
    } catch (err) {
      setLocalError('Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your MarketHub account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Error Message */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{displayError}</p>
            </div>
          )}

          {/* Demo Login Buttons */}
          <div className="mb-6 space-y-3">
            <p className="text-sm text-gray-600 text-center">Quick Demo Login:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={isSubmitting}
                className="btn-outline text-sm py-2 px-3 disabled:opacity-50"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                disabled={isSubmitting}
                className="btn-outline text-sm py-2 px-3 disabled:opacity-50"
              >
                User Demo
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign in manually</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors min-h-[44px]"
                placeholder="your.email@example.com"
                disabled={isSubmitting}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors min-h-[44px]"
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 touch-target"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate && onNavigate('register')}
                className="text-accent-500 hover:text-accent-600 font-medium"
                disabled={isSubmitting}
              >
                Sign up here
              </button>
            </p>
            <button
              onClick={() => onNavigate && onNavigate('forgot-password')}
              className="text-sm text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              Forgot your password?
            </button>
          </div>
        </div>

        {/* Back to Home */}
        {onNavigate && (
          <div className="text-center mt-6">
            <button
              onClick={() => onNavigate('home')}
              className="text-gray-300 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              ← Back to MarketHub
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
