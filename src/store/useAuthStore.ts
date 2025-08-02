// Authentication store using Zustand for state management
// Handles user authentication, session management, and profile operations
import { create } from 'zustand';
// Import Zustand store creation function
import { supabase } from '../lib/supabase';
// Import configured Supabase client

// Interface defining the structure of a user profile
interface Profile {
  username: string; // User's unique username
  displayName: string; // User's display name
  hideDisplayName: boolean; // Whether to hide display name publicly
}

// Interface defining the authentication store state and methods
interface AuthState {
  user: any | null; // Current authenticated user (null if not authenticated)
  loading: boolean; // Loading state for authentication operations
  error: string | null; // Error message for authentication failures
  signIn: (email: string, password: string) => Promise<void>; // Sign in method
  signUp: (email: string, password: string) => Promise<void>; // Sign up method
  signOut: () => Promise<void>; // Sign out method
  initialize: () => Promise<void>; // Initialize authentication state
  clearError: () => void; // Clear error messages
  updateProfile: (profile: Profile) => Promise<void>; // Update user profile
}

// Create the authentication store using Zustand
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state values
  user: null, // No user initially
  loading: true, // Loading initially while checking session
  error: null, // No error initially
  
  // Initialize authentication state and set up session listener
  initialize: async () => {
    try {
      // Get current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      // Set user from session (null if no session)
      set({ user: session?.user || null, loading: false });

      // Set up listener for authentication state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        // Update user state when auth state changes
        set({ user: session?.user || null });
      });
    } catch (error) {
      // Log error for debugging
      console.error('Error initializing auth:', error);
      
      // Handle session-related authentication errors
      if (error instanceof Error && (
        error.message.includes('Invalid Refresh Token') ||
        error.message.includes('Session from session_id claim in JWT does not exist') ||
        error.message.includes('session_not_found')
      )) {
        // Clear stale session data for these specific errors
        set({ user: null, loading: false, error: null });
      } else {
        // Set generic error for other initialization failures
        set({ loading: false, error: 'Failed to initialize authentication' });
      }
    }
  },
  
  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      // Set loading state and clear any previous errors
      set({ loading: true, error: null });
      
      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Handle specific error cases with user-friendly messages
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before signing in');
        }
        // Re-throw other errors as-is
        throw error;
      }
      
      // Set user and clear loading state on success
      set({ user: data.user, loading: false });
    } catch (error: any) {
      // Set error message and clear loading state on failure
      set({ 
        error: error.message || 'Failed to sign in', 
        loading: false 
      });
      // Re-throw error for component handling
      throw error;
    }
  },
  
  // Sign up with email and password
  signUp: async (email, password) => {
    try {
      // Set loading state and clear any previous errors
      set({ loading: true, error: null });
      
      // Attempt to sign up with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Set redirect URL for email confirmation
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        // Handle specific error cases with user-friendly messages
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        // Re-throw other errors as-is
        throw error;
      }
      
      // Clear loading state and error on success
      set({ 
        loading: false,
        error: null
      });
    } catch (error: any) {
      // Set error message and clear loading state on failure
      set({ 
        error: error.message || 'Failed to sign up', 
        loading: false 
      });
      // Re-throw error for component handling
      throw error;
    }
  },
  
  // Sign out current user
  signOut: async () => {
    try {
      // Set loading state and clear any previous errors
      set({ loading: true, error: null });
      
      // Attempt to sign out - ignore expected session errors
      await supabase.auth.signOut();
    } catch (error: any) {
      // Silently handle expected session errors (session_not_found, expired sessions, etc.)
      // These are normal when the session is already invalid on the server
    } finally {
      // Always clear local state regardless of server response
      set({ user: null, loading: false });
    }
  },
  
  // Clear error messages
  clearError: () => set({ error: null }),
  
  // Update user profile information
  updateProfile: async (profile: Profile) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Update or insert profile in database
      const { error } = await supabase
        .from('profiles') // Target profiles table
        .upsert({ // Insert or update
          id: user?.id, // Use current user's ID
          username: profile.username,
          display_name: profile.displayName,
          hide_display_name: profile.hideDisplayName,
        });

      if (error) throw error; // Throw error if database operation failed
    } catch (error: any) {
      // Log error for debugging
      console.error('Error updating profile:', error);
      // Throw user-friendly error message
      throw new Error('Failed to update profile');
    }
  },
}));