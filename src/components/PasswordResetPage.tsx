import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const PasswordResetPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      try {
        // First, check if we have recovery tokens in the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (type === 'recovery' && accessToken && refreshToken) {
          // Set the session with the recovery tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) throw error;

          if (data.session) {
            setIsValidSession(true);
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setIsValidSession(false);
            setError('Invalid or expired reset link. Please request a new password reset.');
          }
        } else {
          // Check if we already have a valid session
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          if (session) {
            setIsValidSession(true);
          } else {
            setIsValidSession(false);
            setError('Invalid or expired reset link. Please request a new password reset.');
          }
        }
      } catch (err: any) {
        console.error('Error checking session:', err);
        setIsValidSession(false);
        setError('Invalid or expired reset link. Please request a new password reset.');
      }
    };

    checkSession();
  }, []);

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (err: any) {
      console.error('Error updating password:', err);
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  if (isValidSession === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 text-white overflow-hidden">
            {/* Animated stars in header */}
            <div className="absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={`header-star-${i}`}
                  className="absolute bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    opacity: Math.random() * 0.8 + 0.2,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                  }}
                />
              ))}
            </div>
            
            {/* Cosmic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />
            
            <div className="text-center relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-16 h-16 bg-gradient-to-br from-green-400 via-green-300 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                style={{
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3)',
                }}
              >
                <CheckCircle size={32} className="text-gray-900" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Password Updated!</h2>
              <p className="text-white/90 text-sm">Your password has been successfully updated.</p>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8 bg-gradient-to-b from-gray-900 to-black text-center">
            <p className="text-gray-300 mb-6">
              You will be redirected to the home page in a few seconds...
            </p>
            <button
              onClick={handleBackToHome}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg"
              style={{ boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)' }}
            >
              Go to Home Page
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 text-white overflow-hidden">
          {/* Animated stars in header */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={`header-star-${i}`}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                }}
              />
            ))}
          </div>
          
          {/* Cosmic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />
          
          <button
            onClick={handleBackToHome}
            className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors z-10"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="text-center relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)',
              }}
            >
              <Lock size={32} className="text-gray-900" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
            <p className="text-white/90 text-sm">Enter your new password below</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gradient-to-b from-gray-900 to-black">
          {!isValidSession ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 mb-6 backdrop-blur-sm">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
              <button
                onClick={handleBackToHome}
                className="w-full py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg"
                style={{ boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}
              >
                Back to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 backdrop-blur-sm"
                >
                  <AlertCircle size={18} />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all backdrop-blur-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Must contain uppercase, lowercase, number, and be 6+ characters
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all backdrop-blur-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg relative overflow-hidden"
                style={{ boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}
              >
                {/* Subtle star animation on button */}
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`btn-star-${i}`}
                      className="absolute bg-white rounded-full animate-pulse"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: '50%',
                        width: '2px',
                        height: '2px',
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: '2s',
                      }}
                    />
                  ))}
                </div>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating Password...
                  </span>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};