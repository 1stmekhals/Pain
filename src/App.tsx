// Main application component that orchestrates the entire Star Letter app
// Handles authentication, star management, modals, and overall app state
import React, { useState, useEffect } from 'react';
// Import React hooks for state management and side effects
import { StarrySky } from './components/StarrySky';
// Import the main sky component that renders stars and handles interactions
import { CreateStarModal } from './components/CreateStarModal';
// Import modal component for creating new stars
import { MusicPlayer } from './components/MusicPlayer';
// Import background music player component
import { ProfileModal } from './components/ProfileModal';
// Import modal for user profile management
import { AdminPanel } from './components/AdminPanel';
// Import admin panel for user and star management
import { AuthModal } from './components/AuthModal';
// Import authentication modal for sign in/up
import { PasswordResetPage } from './components/PasswordResetPage';
// Import password reset page component
import { UnifiedSearch } from './components/UnifiedSearch';
// Import search component for finding users and stars
import { SkySelector } from './components/SkySelector';
// Import component for switching between sky types
import { HamburgerMenu } from './components/HamburgerMenu';
// Import navigation menu component
import { SettingsModal } from './components/SettingsModal';
// Import settings modal for user preferences
import { InstallPrompt } from './components/InstallPrompt';
// Import PWA installation prompt component
import { useLocationTime } from './hooks/useLocationTime';
// Import custom hook for location-based time detection
import { Star } from './types/star';
// Import TypeScript type definition for Star objects
import { Profile } from './types/profile';
// Import TypeScript type definition for Profile objects
import { useAuthStore } from './store/useAuthStore';
// Import authentication store for user state management
import { supabase, checkSupabaseConnection, testNetworkConnectivity } from './lib/supabase';
// Import Supabase client and connection utilities
import { PlusCircle, LogIn, LogOut, X, Trash2, UserCircle, Users, AlertCircle, RefreshCw, ExternalLink, Search } from 'lucide-react';
// Import Lucide React icons for UI elements
import { motion, AnimatePresence } from 'framer-motion';
// Import Framer Motion for smooth animations and transitions

// Check if environment variables are available
const hasSupabaseCredentials = !!(
  import.meta.env.VITE_SUPABASE_URL?.trim() && 
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
);

// Main App component - the root component of the application
function App() {
  // Check if current page is password reset page by examining URL pathname and hash
  const isPasswordResetPage = window.location.pathname === '/reset-password' ||
                              window.location.hash.includes('type=recovery');

  // If it's password reset page, render only the password reset component
  if (isPasswordResetPage) {
    return <PasswordResetPage />;
  }

  // If no Supabase credentials, show setup message
  if (!hasSupabaseCredentials) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 p-8 rounded-lg max-w-2xl w-full text-center">
          <div className="mb-6">
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">
              Setup Required
            </h1>
          </div>
          
          <div className="text-gray-300 text-left mb-6 space-y-4">
            <p>This application requires Supabase credentials to function properly.</p>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Missing Environment Variables:</h3>
              <ul className="text-sm space-y-1">
                <li>• VITE_SUPABASE_URL</li>
                <li>• VITE_SUPABASE_ANON_KEY</li>
              </ul>
            </div>
            
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
              <h3 className="text-blue-400 font-semibold mb-2">For Netlify Deployment:</h3>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Go to your Netlify dashboard</li>
                <li>Select this site</li>
                <li>Go to Site settings → Environment variables</li>
                <li>Add the required Supabase credentials</li>
                <li>Redeploy the site</li>
              </ol>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry After Setup
          </button>
        </div>
      </div>
    );
  }

  // State for managing all stars displayed in the sky
  const [stars, setStars] = useState<Star[]>([]);
  // State for controlling the create star modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for the currently selected star (when user clicks on a star)
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  // State for current sky type (general public sky or user's personal sky)
  const [currentSky, setCurrentSky] = useState<'general' | 'user'>('general');
  // Get user authentication state and functions from the auth store
  const { user, signOut, initialize } = useAuthStore();
  // State for controlling authentication modal visibility
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // State for displaying error messages to the user
  const [error, setError] = useState<string | null>(null);
  // State for tracking if current user has admin privileges
  const [isAdmin, setIsAdmin] = useState(false);
  // State for controlling profile modal visibility
  const [showProfileModal, setShowProfileModal] = useState(false);
  // State for controlling admin panel visibility
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  // State for storing current user's profile information
  const [userProfile, setUserProfile] = useState<Partial<Profile> | null>(null);
  // State for tracking database connection status
  const [isConnected, setIsConnected] = useState(true);
  // State for storing connection error messages
  const [connectionError, setConnectionError] = useState<string | null>(null);
  // State for showing retry loading state
  const [isRetrying, setIsRetrying] = useState(false);
  // State for controlling unified search modal visibility
  const [showSearch, setShowSearch] = useState(false);
  // State for controlling settings modal visibility
  const [showSettings, setShowSettings] = useState(false);
  // Get day/night time information from location-based hook
  const { isDayTime, isLoading: timeLoading, error: timeError } = useLocationTime();
  // State for tracking which user's sky we're currently viewing
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  // State for tracking previous user state to detect logout
  const [prevUser, setPrevUser] = useState<any | null>(null);

  // Effect to handle logout - reset sky to general when user logs out
  useEffect(() => {
    // Check if user just logged out (had user before, now doesn't)
    if (prevUser && !user) {
      // Reset to general sky and clear viewing user
      setCurrentSky('general');
      setViewingUserId(null);
    }
    // Update previous user state for next comparison
    setPrevUser(user);
  }, [user, prevUser]); // Dependencies: run when user or prevUser changes

  // Effect to check database connection and initialize app on startup
  useEffect(() => {
    // Async function to test connectivity and initialize
    const checkConnection = async () => {
      // Set retry loading state
      setIsRetrying(true);
      
      // First test basic network connectivity
      const networkResult = await testNetworkConnectivity();
      if (!networkResult.success) {
        // If network fails, set connection error and stop
        setIsConnected(false);
        setConnectionError(networkResult.error || 'Network connectivity issue');
        setIsRetrying(false);
        return;
      }

      // Then test full Supabase database connection
      const connectionResult = await checkSupabaseConnection();
      setIsConnected(connectionResult.success);
      
      if (!connectionResult.success) {
        // If database connection fails, set error message
        setConnectionError(connectionResult.error || 'Database connection failed');
      } else {
        // If connection successful, clear errors and initialize
        setConnectionError(null);
        setError(null);
        // Initialize authentication system
        initialize();
        // Load stars from database
        fetchStars();
      }
      
      // Clear retry loading state
      setIsRetrying(false);
    };

    // Run connection check on component mount
    checkConnection();
  }, []); // Empty dependency array: run only once on mount

  // Effect to handle clicking outside of star messages to close them
  useEffect(() => {
    // Only add listener if connected to database
    if (!isConnected) return;
    
    // Function to handle clicks outside star messages
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If click is not on star message or interactive star, close selected star
      if (!target.closest('.star-message') && !target.closest('.interactive-star')) {
        setSelectedStar(null);
      }
    };
    
    // Add event listener for clicks
    document.addEventListener('click', handleClickOutside);
    // Cleanup event listener on unmount
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isConnected]); // Dependency: run when connection status changes

  // Effect to check user profile and admin status when user changes
  useEffect(() => {
    // If not connected or no user, reset states
    if (!isConnected || !user) {
      setUserProfile(null);
      setIsAdmin(false);
      return;
    }

    // Check if user profile is complete and if user is admin
    checkProfileCompletion();
    checkAdminStatus();
  }, [user, isConnected]); // Dependencies: run when user or connection changes

  // Function to check if user's profile is complete
  const checkProfileCompletion = async () => {
    // Return early if no user or not connected
    if (!user || !isConnected) return;

    try {
      // Fetch user's profile from database
      const { data: profile, error } = await supabase
        .from('profiles') // Query the profiles table
        .select('*') // Select all columns
        .eq('id', user.id) // Where id matches current user's id
        .maybeSingle(); // Return single result or null

      // Throw error if database query failed
      if (error) throw error;

      // Store profile data in state
      setUserProfile(profile);
      // If profile doesn't exist or is incomplete, show profile modal
      if (!profile || !profile.is_profile_complete) {
        setShowProfileModal(true);
      }
    } catch (err) {
      // Log error and show user-friendly message
      console.error('Error checking profile:', err);
      setError('Failed to load profile. Please try again.');
    }
  };

  // Function to check if current user has admin privileges
  const checkAdminStatus = async () => {
    // Return early if no user or not connected
    if (!user || !isConnected) return;

    try {
      // Check if user's email exists in admin_users table
      const { data, error } = await supabase
        .from('admin_users') // Query the admin_users table
        .select('id') // Select only the id column
        .eq('email', user.email) // Where email matches current user's email
        .maybeSingle(); // Return single result or null

      if (error) {
        // Log error and set admin to false
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      // Set admin status based on whether record was found
      setIsAdmin(!!data); // Convert to boolean: true if data exists, false if null
    } catch (err) {
      // Log error and set admin to false
      console.error('Error checking admin status:', err);
      setIsAdmin(false);
    }
  };

  // Function to fetch stars from database based on current sky type
  const fetchStars = async () => {
    // Return early if not connected to database
    if (!isConnected) return;

    try {
      // Start building the database query
      let query = supabase
        .from('stars') // Query the stars table
        .select(`
          *,
          profiles (
            username,
            display_name,
            hide_display_name
          )
        `); // Select all star columns plus related profile data

      // Filter query based on current sky type
      if (currentSky === 'general') {
        // For general sky, get all public stars
        query = query.eq('sky_type', 'general');
      } else if (currentSky === 'user' && user) {
        // For user sky, get stars from specific user (or current user)
        const targetUserId = viewingUserId || user.id;
        query = query.eq('sky_type', 'user').eq('profile_id', targetUserId);
      }

      // Execute query with ordering by creation date
      const { data, error: fetchError } = await query
        .order('created_at', { ascending: false }); // Newest stars first

      if (fetchError) {
        // Handle specific error when table doesn't exist yet
        if (fetchError.code === '42P01') {
          console.warn('Stars or profiles table does not exist yet');
          setStars([]);
          setError('Database tables not yet configured. Please run migrations.');
          return;
        }
        
        // Log other errors and show user message
        console.error('Error fetching stars:', fetchError);
        setError('Failed to load stars. Please try again.');
        return;
      }

      // Update stars state with fetched data
      setStars(data || []); // Use empty array if data is null
      // Clear any previous errors
      setError(null);
    } catch (err) {
      // Handle unexpected errors
      console.error('Error fetching stars:', err);
      setError('Failed to load stars. Please try again.');
    }
  };

  // Effect to refetch stars when sky type, user, or viewing user changes
  useEffect(() => {
    if (isConnected) {
      fetchStars();
    }
  }, [currentSky, user, isConnected, viewingUserId]); // Dependencies: refetch when these change

  // Function to handle creating a new star
  const handleCreateStar = async (starName: string, message: string): Promise<void> => {
    // Check database connection
    if (!isConnected) {
      setError('Unable to connect to the database. Please try again later.');
      throw new Error('Database connection error');
    }

    // Check user authentication
    if (!user) {
      setError('Please sign in to create stars');
      setIsModalOpen(false);
      setIsAuthModalOpen(true);
      throw new Error('Authentication required');
    }

    try {
      // Variables for finding a suitable star position
      let x, y, attempts = 0;
      const maxAttempts = 100; // Maximum attempts to find position
      const minDistance = 5; // Minimum distance between stars (in percentage)
      
      // Loop to find a position that doesn't conflict with existing stars or UI
      do {
        // Generate random position within safe bounds
        x = Math.random() * 100; // 0% to 100% across the full 360-degree sky
        y = Math.random() * 60 + 20; // 20% to 80% from top
        attempts++; // Increment attempt counter
        
        // Check if position conflicts with UI elements (convert to screen position)
        const screenX = (x * window.innerWidth / 100) % window.innerWidth;
        const conflictsWithUI = (
          (screenX > window.innerWidth * 0.75 && y < 35) || // Avoid moon area (top-right)
          (screenX < window.innerWidth * 0.25 && y < 25) || // Avoid sky selector area (top-left)
          (screenX > window.innerWidth * 0.75 && y > 75)    // Avoid bottom-right corner
        );
        
        // Check if position is too close to existing stars
        const tooCloseToExistingStar = stars.some(existingStar => {
          // Calculate distance using Pythagorean theorem
          const distance = Math.sqrt(
            Math.pow(existingStar.x - x, 2) + Math.pow(existingStar.y - y, 2)
          );
          // Return true if too close
          return distance < minDistance;
        });
        
        // Break loop if position is suitable
        if (!conflictsWithUI && !tooCloseToExistingStar) {
          break;
        }
        
        // Throw error if too many attempts
        if (attempts >= maxAttempts) {
          throw new Error('Unable to find a suitable location for the star. The sky might be too crowded.');
        }
      } while (true); // Continue until suitable position found

      // Create new star object with generated position and random properties
      const newStar = {
        star_name: starName, // Unique name for the star
        message, // User's message
        x, // Horizontal position (percentage)
        y, // Vertical position (percentage)
        // Random size and brightness for visual variety
        size: Math.random() * 2 + 1, // Size between 1 and 3
        brightness: Math.random() * 0.5 + 0.5, // Brightness between 0.5 and 1
        profile_id: user.id, // Link to user who created it
        sky_type: currentSky // Current sky type (general or user)
      };

      // Insert new star into database
      const { error: insertError } = await supabase
        .from('stars') // Insert into stars table
        .insert([newStar]); // Insert the new star object

      if (insertError) {
        // Log error and show user message
        console.error('Error creating star:', insertError);
        setError('Failed to create star. Please try again.');
        throw new Error('Failed to create star');
      }

      // Close modal and refresh stars list
      setIsModalOpen(false);
      setError(null);
      await fetchStars(); // Refresh the stars list
    } catch (err) {
      // Handle and re-throw errors
      console.error('Error creating star:', err);
      setError('Failed to create star. Please try again.');
      throw err;
    }
  };

  // Effect to fetch stars when connection is established
  useEffect(() => {
    if (isConnected) {
      fetchStars();
    }
  }, [isConnected]); // Dependency: run when connection status changes

  // Function to handle deleting a star
  const handleDeleteStar = async (starId: string) => {
    // Check connection and authentication
    if (!isConnected || !user) return;

    try {
      // Delete star from database
      const { error: deleteError } = await supabase
        .from('stars') // Delete from stars table
        .delete() // Delete operation
        .eq('id', starId); // Where id matches the star to delete

      if (deleteError) {
        // Log error and show user message
        console.error('Error deleting star:', deleteError);
        setError('Failed to delete star. Please try again.');
        return;
      }

      // Clear selected star and refresh list
      setSelectedStar(null);
      await fetchStars(); // Refresh the stars list
    } catch (err) {
      // Handle unexpected errors
      console.error('Error deleting star:', err);
      setError('Failed to delete star. Please try again.');
    }
  };

  // Function to handle clicking on a star
  const handleStarClick = (star: Star) => {
    setSelectedStar(star); // Set the clicked star as selected
  };

  // Function to retry database connection
  const handleRetryConnection = async () => {
    // Set loading state and clear errors
    setIsRetrying(true);
    setConnectionError(null);
    
    // Wait a moment before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test network connectivity first
    const networkResult = await testNetworkConnectivity();
    if (!networkResult.success) {
      setConnectionError(networkResult.error || 'Network connectivity issue');
      setIsRetrying(false);
      return;
    }

    // Test full database connection
    const connectionResult = await checkSupabaseConnection();
    setIsConnected(connectionResult.success);
    
    if (!connectionResult.success) {
      setConnectionError(connectionResult.error || 'Database connection failed');
    } else {
      // If successful, initialize and fetch data
      setConnectionError(null);
      initialize();
      fetchStars();
    }
    
    // Clear loading state
    setIsRetrying(false);
  };

  // Function to handle search button click
  const handleSearchClick = () => {
    console.log('Search button clicked, current showSearch:', showSearch);
    setShowSearch(true); // Show the search modal
  };

  // Function to handle closing search modal
  const handleSearchClose = () => {
    console.log('Search modal closing');
    setShowSearch(false); // Hide the search modal
  };

  // Function to handle viewing another user's sky
  const handleUserSkyView = (userId: string) => {
    // Set viewing user and switch to user sky
    setViewingUserId(userId);
    setCurrentSky('user');
    // Close search modal
    setShowSearch(false);
  };
  
  // If not connected to database, show connection error screen
  if (!isConnected) {
    // Check if error is related to CORS configuration
    const isCorsError = connectionError?.includes('CORS Configuration Required');
    
    return (
      // Full screen error display with dark background
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full">
          {/* Error icon and title */}
          <div className="text-center mb-6">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">
              {isCorsError ? 'Setup Required' : 'Connection Error'}
            </h1>
          </div>
          
          {/* Error message with proper formatting */}
          <div className="text-gray-300 text-left mb-6 whitespace-pre-line leading-relaxed">
            {connectionError || 'Unable to connect to the database.'}
          </div>

          {/* Special section for CORS errors with helpful link */}
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
          
          {/* Retry connection button */}
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

  // Main app render when connected
  return (
    // Main container with dark background
    <div className="relative min-h-screen bg-black">
      {/* Main starry sky component */}
      <StarrySky stars={stars} onStarClick={handleStarClick} isDayTime={isDayTime} />
      {/* Background music player */}
      <MusicPlayer />
      
      {/* Sky selector component for switching between general/user sky */}
      <SkySelector
        currentSky={currentSky}
        onSkyChange={(skyType) => {
          // Handle sky type change
          setCurrentSky(skyType);
          if (skyType === 'general') {
            // Clear viewing user when switching to general
            setViewingUserId(null);
          } else if (skyType === 'user' && user) {
            // Set current user when switching to user sky
            setViewingUserId(user.id);
          }
        }}
        isAuthenticated={!!user} // Convert user to boolean
        isDayTime={isDayTime}
        viewingUserId={viewingUserId}
      />

      {/* Error message display at top of screen */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in max-w-[90%] sm:max-w-md text-center">
          {error}
        </div>
      )}

      {/* Settings modal with animation */}
      <AnimatePresence>
        {showSettings && user && (
          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Hamburger navigation menu */}
      <div className="fixed top-4 right-4 z-10">
        <HamburgerMenu
          isAuthenticated={!!user} // Convert user to boolean
          isAdmin={isAdmin}
          onProfileClick={() => setShowProfileModal(true)}
          onSignOut={() => signOut()}
          onSearchClick={handleSearchClick}
          onAdminClick={() => setShowAdminPanel(true)}
          onCreateStarClick={() => setIsModalOpen(true)}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onSettingsClick={() => setShowSettings(true)}
        />
      </div>

      {/* Selected star message popup */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} // Start invisible and below
            animate={{ opacity: 1, y: 0 }} // Animate to visible and in position
            exit={{ opacity: 0, y: 20 }} // Exit invisible and below
            className="fixed bottom-20 sm:bottom-8 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 star-message"
          >
            <div className="bg-gray-900 bg-opacity-90 p-6 rounded-xl sm:max-w-md backdrop-blur-md border border-gray-700 shadow-2xl">
              <div className="relative">
                {/* Delete button for star owners and admins */}
                {(user && (selectedStar.profile_id === user.id || isAdmin)) && (
                  <button
                    onClick={() => handleDeleteStar(selectedStar.id)}
                    className="absolute -top-1 -right-1 text-red-400 hover:text-red-300 transition-colors duration-200 bg-gray-800 rounded-full p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                {/* Star message content */}
                <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                  {selectedStar.message}
                </p>
                {/* Author information if not hidden */}
                <div className="mt-2 text-gray-400 text-sm">
                  {selectedStar.profiles?.display_name && !selectedStar.profiles?.hide_display_name && (
                    <p>By: {selectedStar.profiles.display_name}</p>
                  )}
                </div>
                {/* Instructions for closing */}
                <div className="mt-3 text-gray-400 text-xs">
                  Click anywhere to close
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create star modal */}
      <CreateStarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateStar}
      />

      {/* Authentication modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Profile modal with animation */}
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

      {/* Admin panel with animation */}
      <AnimatePresence>
        {showAdminPanel && isAdmin && (
          <AdminPanel
            isOpen={showAdminPanel}
            onClose={() => setShowAdminPanel(false)}
          />
        )}
      </AnimatePresence>

      {/* Unified search modal with animation */}
      <AnimatePresence>
        {showSearch && user && (
          <UnifiedSearch
            onClose={handleSearchClose}
            onStarSelect={(star) => {
              // Select star and close search
              setSelectedStar(star);
              handleSearchClose();
            }}
            onUserSkyView={handleUserSkyView}
          />
        )}
      </AnimatePresence>

      {/* PWA install prompt */}
      <InstallPrompt />
    </div>
  );
}

// Export the App component as default
export default App;