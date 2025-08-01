import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Profile {
  username: string;
  displayName: string;
  hideDisplayName: boolean;
}

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
  updateProfile: (profile: Profile) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user || null, loading: false });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      
      // Handle invalid refresh token error
      if (error instanceof Error && error.message.includes('Invalid Refresh Token')) {
        // Clear stale session data
        set({ user: null, loading: false, error: null });
      } else {
        set({ loading: false, error: 'Failed to initialize authentication' });
      }
    }
  },
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before signing in');
        }
        throw error;
      }
      
      set({ user: data.user, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to sign in', 
        loading: false 
      });
      throw error;
    }
  },
  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        throw error;
      }
      
      set({ 
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to sign up', 
        loading: false 
      });
      throw error;
    }
  },
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to sign out', 
        loading: false 
      });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
  updateProfile: async (profile: Profile) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: (await supabase.auth.getUser()).data.user?.id,
          username: profile.username,
          display_name: profile.displayName,
          hide_display_name: profile.hideDisplayName,
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  },
}));
