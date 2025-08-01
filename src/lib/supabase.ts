import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Please click the "Connect to Supabase" button in the top right corner to set up your database connection.'
  );
}

// Ensure URL doesn't end with a trailing slash
const normalizedUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;

export const supabase = createClient(normalizedUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'star-letter'
    }
  },
  db: {
    schema: 'public'
  }
});

// Helper function to determine if error is CORS-related
const isCorsError = (error: any): boolean => {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = error?.toString?.()?.toLowerCase() || '';
  
  return (
    errorMessage.includes('cors') ||
    errorMessage.includes('cross-origin') ||
    errorMessage.includes('failed to fetch') ||
    errorString.includes('cors') ||
    errorString.includes('cross-origin') ||
    errorString.includes('failed to fetch') ||
    error?.name === 'TypeError' && errorMessage.includes('fetch')
  );
};

// Helper function to get user-friendly error message
const getConnectionErrorMessage = (error: any): string => {
  if (isCorsError(error)) {
    return `CORS Configuration Required

Your Supabase project needs to allow requests from this local development server.

To fix this:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Project Settings (gear icon)
4. Click on "API" in the settings menu
5. In the "CORS (Origins)" section, add: http://localhost:5173
6. Save the changes and refresh this page

This is a one-time setup required for local development.`;
  }

  if (error?.message?.includes('timeout') || error?.name === 'AbortError') {
    return `Connection Timeout

Unable to reach your Supabase project. This could be due to:
• Network connectivity issues
• Supabase project being paused or unavailable
• Firewall or proxy blocking the connection

Please check your internet connection and Supabase project status.`;
  }

  return `Database Connection Error

Unable to connect to your Supabase project. Please check:
• Your internet connection
• Supabase project status at https://supabase.com/dashboard
• Project credentials in your environment variables

Error details: ${error?.message || 'Unknown error'}`;
};

// Helper function to check Supabase connection with better error handling
export const checkSupabaseConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // First, try a simple health check with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Try to check if we can connect to Supabase at all
    const { data, error } = await supabase.auth.getSession();

    clearTimeout(timeoutId);

    if (error) {
      console.error('Supabase connection error:', error);
      return {
        success: false,
        error: getConnectionErrorMessage(error)
      };
    }

    // If we can get session info, connection is working
    return { success: true };
  } catch (err: any) {
    console.error('Supabase connection error:', err);
    return {
      success: false,
      error: getConnectionErrorMessage(err)
    };
  }
};

// Additional helper to test basic network connectivity
export const testNetworkConnectivity = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${normalizedUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return {
        success: false,
        error: `Server responded with status ${response.status}. Please check your Supabase project status.`
      };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error('Network connectivity test failed:', err);
    return {
      success: false,
      error: getConnectionErrorMessage(err)
    };
  }
};