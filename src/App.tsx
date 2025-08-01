import React, { useState, useEffect } from 'react';
import { StarrySky } from './components/StarrySky';
import { CreateStarModal } from './components/CreateStarModal';
import { MusicPlayer } from './components/MusicPlayer';
import { ProfileModal } from './components/ProfileModal';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { PasswordResetPage } from './components/PasswordResetPage';
import { SkySelector } from './components/SkySelector';
import { UserSearch } from './components/UserSearch';
import { Star } from './types/star';
import { Profile } from './types/profile';
import { useAuthStore } from './store/useAuthStore';
import { supabase, checkSupabaseConnection, testNetworkConnectivity } from './lib/supabase';
import { PlusCircle, LogIn, LogOut, X, Trash2, UserCircle, Users, AlertCircle, RefreshCw, ExternalLink, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  // Check if this is a password reset page
  const isPasswordResetPage = window.location.hash.includes('type=recovery') || 
                              window.location.pathname === '/reset-password';

  // If it's a password reset page, render the password reset component
  if (isPasswordResetPage) {
    return <PasswordResetPage />;
  }

  const [stars, setStars] = useState<Star[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const { user, signOut, initialize } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [userProfile, setUserProfile] = useState<Partial<Profile> | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      setIsRetrying(true);
      
      // First test basic network connectivity
      const networkResult = await testNetworkConnectivity();
      if (!networkResult.success) {
        setIsConnected(false);
        setConnectionError(networkResult.error || 'Network connectivity issue');
        setIsRetrying(false);
        return;
      }

      // Then test full Supabase connection
      const connectionResult = await checkSupabaseConnection();
      setIsConnected(connectionResult.success);
      
      if (!connectionResult.success) {
        setConnectionError(connectionResult.error || 'Database connection failed');
      } else {
        setConnectionError(null);
        setError(null);
        initialize();
        fetchStars();
      }
      
      setIsRetrying(false);
    };

    checkConnection();
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.star-message') && !target.closest('.interactive-star')) {
        setSelectedStar(null);
      }
      if (!target.closest('.user-search') && showUserSearch) {
        setShowUserSearch(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserSearch, isConnected]);

  useEffect(() => {
    if (!isConnected || !user) {
      setUserProfile(null);
      setIsAdmin(false);
      return;
    }

    checkProfileCompletion();
    checkAdminStatus();
  }, [user, isConnected]);

  const checkProfileCompletion = async () => {
    if (!user || !isConnected) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setUserProfile(profile);
      if (!profile || !profile.is_profile_complete) {
        setShowProfileModal(true);
      }
    } catch (err) {
      console.error('Error checking profile:', err);
      setError('Failed to load profile. Please try again.');
    }
  };

  const checkAdminStatus = async () => {
    if (!user || !isConnected) return;

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(!!data);
    } catch (err) {
      console.error('Error checking admin status:', err);
      setIsAdmin(false);
    }
  };

  const fetchStars = async () => {
    if (!isConnected) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('stars')
        .select(`
          *,
          profiles (
            username,
            display_name,
            hide_display_name
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        if (fetchError.code === '42P01') {
          // Table doesn't exist yet
          console.warn('Stars or profiles table does not exist yet');
          setStars([]);
          setError('Database tables not yet configured. Please run migrations.');
          return;
        }
        
        console.error('Error fetching stars:', fetchError);
        setError('Failed to load stars. Please try again.');
        return;
      }

      setStars(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching stars:', err);
      setError('Failed to load stars. Please try again.');
    }
  };

  const handleCreateStar = async (starName: string, message: string) => {
    if (!isConnected) {
      setError('Unable to connect to the database. Please try again later.');
      return;
    }

    if (!user) {
      setError('Please sign in to create stars');
      setIsModalOpen(false);
      setIsAuthModalOpen(true);
      return;
    }

    try {
      let x, y;
      do {
        x = Math.random() * 90 + 5;
        y = Math.random() * 70 + 5;
      } while (x > 70 && y < 30); // Avoid moon area

      const newStar = {
        message,
        x,
        y,
        size: Math.random() * 2 + 1,
        brightness: Math.random() * 0.5 + 0.5,
        profile_id: user.id
      };

      const { error: insertError } = await supabase
        .from('stars')
        .insert([newStar]);

      if (insertError) {
        console.error('Error creating star:', insertError);
        setError('Failed to create star. Please try again.');
        return;
      }

      setIsModalOpen(false);
      setError(null);
      await fetchStars();
    } catch (err) {
      console.error('Error creating star:', err);
      setError('Failed to create star. Please try again.');
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchStars();
    }
  }, [isConnected]);

  const handleDeleteStar = async (starId: string) => {
    if (!isConnected || !user) return;

    try {
      const { error: deleteError } = await supabase
        .from('stars')
        .delete()
        .eq('id', starId);

      if (deleteError) {
        console.error('Error deleting star:', deleteError);
        setError('Failed to delete star. Please try again.');
        return;
      }

      setSelectedStar(null);
      await fetchStars();
    } catch (err) {
      console.error('Error deleting star:', err);
      setError('Failed to delete star. Please try again.');
    }
  };

  const handleStarClick = (star: Star) => {
    setSelectedStar(star);
  };

  const handleRetryConnection = async () => {
    setIsRetrying(true);
    setConnectionError(null);
    
    // Wait a moment before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const networkResult = await testNetworkConnectivity();
    if (!networkResult.success) {
      setConnectionError(networkResult.error || 'Network connectivity issue');
      setIsRetrying(false);
      return;
    }

    const connectionResult = await checkSupabaseConnection();
    setIsConnected(connectionResult.success);
    
    if (!connectionResult.success) {
      setConnectionError(connectionResult.error || 'Database connection failed');
    } else {
      setConnectionError(null);
      initialize();
      fetchStars();
    }
    
    setIsRetrying(false);
  };

  if (!isConnected) {
    const isCorsError = connectionError?.includes('CORS Configuration Required');
    
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full">
          <div className="text-center mb-6">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">
              {isCorsError ? 'Setup Required' : 'Connection Error'}
            </h1>
          </div>
          
          <div className="text-gray-300 text-left mb-6 whitespace-pre-line leading-relaxed">
            {connectionError || 'Unable to connect to the database.'}
          </div>

          {isCorsError && (
            <div className="mb-6 p-4 bg-blue-900 bg-opacity-50 rounded-lg border border-blue-700">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium">Quick Setup Link</span>
              </div>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 underline transition-colors"
              >
                Open Supabase Dashboard →
              </a>
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={handleRetryConnection}
              disabled={isRetrying}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry Connection'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      <StarrySky stars={stars} onStarClick={handleStarClick} />
      <MusicPlayer />

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in max-w-[90%] sm:max-w-md text-center">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="fixed top-4 right-4 flex flex-col sm:flex-row gap-2 sm:gap-4 z-10">
        {user ? (
          <>
            <button
              onClick={() => setShowUserSearch(!showUserSearch)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 bg-opacity-80 text-white rounded-full hover:bg-opacity-100 transition-all duration-300 text-sm sm:text-base"
            >
              <Search size={20} />
              <span className="hidden sm:inline">Search Users</span>
            </button>
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 bg-opacity-80 text-white rounded-full hover:bg-opacity-100 transition-all duration-300 text-sm sm:text-base"
            >
              <UserCircle size={20} />
              <span className="hidden sm:inline">Profile</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowAdminPanel(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 bg-opacity-80 text-white rounded-full hover:bg-opacity-100 transition-all duration-300 text-sm sm:text-base"
              >
                <Users size={20} />
                <span className="hidden sm:inline">Users</span>
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 bg-opacity-80 text-white rounded-full hover:bg-opacity-100 transition-all duration-300 text-sm sm:text-base"
            >
              <PlusCircle size={20} />
              <span className="hidden sm:inline">Create Star</span>
            </button>
            <button
              onClick={() => signOut()}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 bg-opacity-80 text-white rounded-full hover:bg-opacity-100 transition-all duration-300 text-sm sm:text-base"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 bg-opacity-80 text-white rounded-full hover:bg-opacity-100 transition-all duration-300 text-sm sm:text-base"
          >
            <LogIn size={20} />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>

      {/* Selected Star Message */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 sm:bottom-8 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 star-message"
          >
            <div className="bg-gray-900 bg-opacity-90 p-6 rounded-xl sm:max-w-md backdrop-blur-md border border-gray-700 shadow-2xl">
              <div className="relative">
                {(user && (selectedStar.profile_id === user.id || isAdmin)) && (
                  <button
                    onClick={() => handleDeleteStar(selectedStar.id)}
                    className="absolute -top-1 -right-1 text-red-400 hover:text-red-300 transition-colors duration-200 bg-gray-800 rounded-full p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                  {selectedStar.message}
                </p>
                <div className="mt-2 text-gray-400 text-sm">
                  {selectedStar.profiles?.display_name && !selectedStar.profiles?.hide_display_name && (
                    <p>By: {selectedStar.profiles.display_name}</p>
                  )}
                </div>
                <div className="mt-3 text-gray-400 text-xs">
                  Click anywhere to close
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateStarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateStar}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && user && (
          <ProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            userId={user.id}
            existingProfile={userProfile || undefined}
            isNewUser={!userProfile?.is_profile_complete}
          />
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdminPanel && isAdmin && (
          <AdminPanel
            isOpen={showAdminPanel}
            onClose={() => setShowAdminPanel(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;