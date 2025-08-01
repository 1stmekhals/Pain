import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Upload, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';

interface MusicPlayerProps {
  className?: string;
}

interface BackgroundMusic {
  id: string;
  url: string;
  title: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ className = '' }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { user } = useAuthStore();
  const [currentMusic, setCurrentMusic] = useState<BackgroundMusic | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 5;
  const BASE_RETRY_DELAY = 5000;

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', user.email)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No admin record found - user is not admin
            setIsAdmin(false);
            return;
          }
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

    checkAdminStatus();

    const subscription = supabase
      .channel('background_music_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'background_music',
        },
        () => {
          retryCountRef.current = 0; // Reset retry count on subscription events
          fetchCurrentMusic();
        }
      )
      .subscribe();

    fetchCurrentMusic();

    return () => {
      subscription.unsubscribe();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [user]);

  const retryFetch = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    if (retryCountRef.current >= MAX_RETRIES) {
      setFetchError('Unable to connect to the server. Please check your connection.');
      return;
    }

    // Exponential backoff with jitter
    const delay = Math.min(
      BASE_RETRY_DELAY * Math.pow(2, retryCountRef.current) + Math.random() * 1000,
      30000 // Max delay of 30 seconds
    );

    retryTimeoutRef.current = setTimeout(() => {
      retryCountRef.current++;
      fetchCurrentMusic();
    }, delay);
  };

  const fetchCurrentMusic = async () => {
    try {
      setFetchError(null);
      
      // Check if background_music table exists first
      const { data, error } = await supabase
        .from('background_music')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, not an error
          setCurrentMusic(null);
          retryCountRef.current = 0; // Reset retry count on successful response
          return;
        }
        
        if (error.code === '42P01') {
          // Table doesn't exist
          console.warn('Background music table does not exist yet');
          setCurrentMusic(null);
          setFetchError('Background music feature not yet configured');
          return;
        }

        console.error('Error fetching background music:', error);
        
        // Check if it's a CORS or network error
        const errorMessage = error.message?.toLowerCase() || '';
        if (errorMessage.includes('cors') || errorMessage.includes('fetch')) {
          setFetchError('Connection issue. Please check your Supabase CORS settings.');
        } else {
          setFetchError('Unable to load music. Retrying...');
        }
        
        retryFetch();
        return;
      }

      if (data) {
        // Ensure the URL uses HTTPS
        const secureUrl = data.url.replace(/^http:/, 'https:');
        
        // Test if the audio URL is accessible
        try {
          const response = await fetch(secureUrl, { method: 'HEAD' });
          if (!response.ok) {
            throw new Error('Audio file not accessible');
          }
        } catch (err: any) {
          console.error('Error checking audio URL:', err);
          
          // Check if it's a CORS error
          if (err.message?.includes('cors') || err.message?.includes('fetch')) {
            setFetchError('Audio file blocked by CORS policy');
          } else {
            setFetchError('Unable to access audio file');
          }
          
          retryFetch();
          return;
        }

        setCurrentMusic({ ...data, url: secureUrl });
        retryCountRef.current = 0; // Reset retry count on successful fetch
        
        if (audioRef.current) {
          try {
            audioRef.current.src = secureUrl;
            await audioRef.current.load();
            if (!isMuted) {
              await audioRef.current.play();
            }
          } catch (mediaError: any) {
            console.error('Error loading audio:', mediaError);
            setFetchError('Unable to load audio file');
            retryFetch();
          }
        }
      } else {
        setCurrentMusic(null);
        retryCountRef.current = 0; // Reset retry count when no music is found
      }
    } catch (err: any) {
      console.error('Error fetching background music:', err);
      
      // Provide more specific error messages
      const errorMessage = err.message?.toLowerCase() || '';
      if (errorMessage.includes('cors') || errorMessage.includes('fetch')) {
        setFetchError('CORS configuration required. Please check your Supabase settings.');
      } else {
        setFetchError('Connection error. Retrying...');
      }
      
      retryFetch();
    }
  };

  const toggleMute = async () => {
    if (audioRef.current) {
      try {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
        if (!isMuted) {
          await audioRef.current.pause();
        } else if (currentMusic) {
          await audioRef.current.play();
        }
        setFetchError(null);
      } catch (err) {
        console.error('Error toggling audio:', err);
        setFetchError('Unable to play audio');
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isAdmin) return;

    setUploadError(null);
    setFetchError(null);

    if (file.size > 52428800) {
      setUploadError('File size must be less than 50MB');
      return;
    }

    if (!file.type.startsWith('audio/')) {
      setUploadError('Please upload an audio file');
      return;
    }

    setIsUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('background-music')
        .upload(`music/${fileName}`, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('background-music')
        .getPublicUrl(`music/${fileName}`);

      // Ensure HTTPS URL
      const secureUrl = publicUrl.replace(/^http:/, 'https:');

      await supabase
        .from('background_music')
        .update({ is_active: false })
        .eq('is_active', true);

      const { error: insertError } = await supabase
        .from('background_music')
        .insert([
          {
            url: secureUrl,
            title: file.name,
            is_active: true
          }
        ]);

      if (insertError) throw insertError;

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      retryCountRef.current = 0; // Reset retry count after successful upload
    } catch (error: any) {
      console.error('Error uploading music:', error);
      
      // Provide more specific error messages
      const errorMessage = error.message?.toLowerCase() || '';
      if (errorMessage.includes('cors') || errorMessage.includes('fetch')) {
        setUploadError('CORS configuration required. Please check your Supabase settings.');
      } else if (error.message === 'Payload too large') {
        setUploadError('File size exceeds the maximum limit');
      } else {
        setUploadError(error.message || 'Failed to upload music');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-gray-900 bg-opacity-80 p-3 rounded-lg sm:rounded-full backdrop-blur-sm ${className}`}>
      {isAdmin && (
        <div className="relative">
          <label className={`
            cursor-pointer hover:opacity-80 transition-opacity 
            flex items-center gap-2 px-3 py-1.5 
            ${isUploading ? 'bg-gray-600' : 'bg-indigo-600'} 
            rounded-full text-white text-sm
          `}>
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isUploading ? 'Uploading...' : 'Upload Music'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
          {uploadError && (
            <div className="absolute top-full mt-2 left-0 right-0 text-center whitespace-nowrap">
              <span className="text-red-400 text-xs bg-gray-800 px-2 py-1 rounded">
                {uploadError}
              </span>
            </div>
          )}
        </div>
      )}
      
      <button
        onClick={toggleMute}
        className="text-white hover:opacity-80 transition-opacity"
        disabled={!currentMusic}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {currentMusic ? (
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-white opacity-60" />
          <span className="text-white text-sm truncate max-w-[120px] sm:max-w-[150px]">
            {currentMusic.title}
          </span>
        </div>
      ) : isAdmin ? (
        <span className="text-gray-400 text-sm">Upload music to begin</span>
      ) : (
        <span className="text-gray-400 text-sm">No music playing</span>
      )}

      {fetchError && (
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-red-400" />
          <span className="text-red-400 text-xs bg-gray-800 px-2 py-1 rounded">
            {fetchError}
          </span>
        </div>
      )}

      <audio ref={audioRef} loop muted className="hidden" />
    </div>
  );
};