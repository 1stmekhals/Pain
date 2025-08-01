import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Upload, AlertCircle, SkipForward, Play, Pause, List, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicPlayerProps {
  className?: string;
}

interface BackgroundMusic {
  id: string;
  url: string;
  title: string;
  is_active: boolean;
  created_at: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ className = '' }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { user } = useAuthStore();
  const [playlist, setPlaylist] = useState<BackgroundMusic[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
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
          retryCountRef.current = 0;
          fetchPlaylist();
        }
      )
      .subscribe();

    fetchPlaylist();

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

    const delay = Math.min(
      BASE_RETRY_DELAY * Math.pow(2, retryCountRef.current) + Math.random() * 1000,
      30000
    );

    retryTimeoutRef.current = setTimeout(() => {
      retryCountRef.current++;
      fetchPlaylist();
    }, delay);
  };

  const fetchPlaylist = async () => {
    try {
      setFetchError(null);
      
      const { data, error } = await supabase
        .from('background_music')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116') {
          setPlaylist([]);
          retryCountRef.current = 0;
          return;
        }
        
        if (error.code === '42P01') {
          console.warn('Background music table does not exist yet');
          setPlaylist([]);
          setFetchError('Background music feature not yet configured');
          return;
        }

        console.error('Error fetching playlist:', error);
        
        const errorMessage = error.message?.toLowerCase() || '';
        if (errorMessage.includes('cors') || errorMessage.includes('fetch')) {
          setFetchError('Connection issue. Please check your Supabase CORS settings.');
        } else {
          setFetchError('Unable to load music. Retrying...');
        }
        
        retryFetch();
        return;
      }

      if (data && data.length > 0) {
        const validTracks = [];
        
        for (const track of data) {
          const secureUrl = track.url.replace(/^http:/, 'https:');
          
          try {
            const response = await fetch(secureUrl, { method: 'HEAD' });
            if (response.ok) {
              validTracks.push({ ...track, url: secureUrl });
            }
          } catch (err) {
            console.warn(`Track ${track.title} is not accessible:`, err);
          }
        }

        setPlaylist(validTracks);
        retryCountRef.current = 0;
        
        // If we have tracks and audio element, load the first track
        if (validTracks.length > 0 && audioRef.current) {
          loadTrack(0, validTracks);
        }
      } else {
        setPlaylist([]);
        retryCountRef.current = 0;
      }
    } catch (err: any) {
      console.error('Error fetching playlist:', err);
      
      const errorMessage = err.message?.toLowerCase() || '';
      if (errorMessage.includes('cors') || errorMessage.includes('fetch')) {
        setFetchError('CORS configuration required. Please check your Supabase settings.');
      } else {
        setFetchError('Connection error. Retrying...');
      }
      
      retryFetch();
    }
  };

  const loadTrack = async (index: number, trackList = playlist) => {
    if (!audioRef.current || !trackList[index]) return;

    try {
      audioRef.current.src = trackList[index].url;
      await audioRef.current.load();
      setCurrentTrackIndex(index);
      
      if (!isMuted && isPlaying) {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error loading track:', error);
      setFetchError('Unable to load audio file');
    }
  };

  const playNextTrack = () => {
    if (playlist.length === 0) return;
    
    // Random next track
    let nextIndex;
    if (playlist.length === 1) {
      nextIndex = 0;
    } else {
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (nextIndex === currentTrackIndex);
    }
    
    loadTrack(nextIndex);
  };

  const togglePlayPause = async () => {
    if (!audioRef.current || playlist.length === 0) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (isMuted) {
          setIsMuted(false);
          audioRef.current.muted = false;
        }
        await audioRef.current.play();
        setIsPlaying(true);
      }
      setFetchError(null);
    } catch (err) {
      console.error('Error toggling playback:', err);
      setFetchError('Unable to play audio');
    }
  };

  const toggleMute = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      
      if (!isMuted) {
        setIsPlaying(false);
      } else if (playlist.length > 0) {
        await audioRef.current.play();
        setIsPlaying(true);
      }
      setFetchError(null);
    } catch (err) {
      console.error('Error toggling audio:', err);
      setFetchError('Unable to play audio');
    }
  };

  const selectTrack = (index: number) => {
    loadTrack(index);
    setShowPlaylist(false);
    if (!isMuted) {
      setIsPlaying(true);
    }
  };

  const deleteTrack = async (trackId: string) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('background_music')
        .delete()
        .eq('id', trackId);

      if (error) throw error;

      // Refresh playlist
      await fetchPlaylist();
    } catch (error: any) {
      console.error('Error deleting track:', error);
      setUploadError('Failed to delete track');
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

      const secureUrl = publicUrl.replace(/^http:/, 'https:');

      const { error: insertError } = await supabase
        .from('background_music')
        .insert([
          {
            url: secureUrl,
            title: file.name,
            is_active: false
          }
        ]);

      if (insertError) throw insertError;

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      retryCountRef.current = 0;
      await fetchPlaylist();
    } catch (error: any) {
      console.error('Error uploading music:', error);
      
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

  // Handle track end - play next random track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTrackEnd = () => {
      playNextTrack();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('ended', handleTrackEnd);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [playlist, currentTrackIndex]);

  const currentTrack = playlist[currentTrackIndex];

  return (
    <>
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
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-white hover:opacity-80 transition-opacity"
            disabled={playlist.length === 0}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={togglePlayPause}
            className="text-white hover:opacity-80 transition-opacity"
            disabled={playlist.length === 0}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            onClick={playNextTrack}
            className="text-white hover:opacity-80 transition-opacity"
            disabled={playlist.length === 0}
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="text-white hover:opacity-80 transition-opacity"
            disabled={playlist.length === 0}
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {currentTrack ? (
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-white opacity-60" />
            <span className="text-white text-sm truncate max-w-[120px] sm:max-w-[150px]">
              {currentTrack.title}
            </span>
          </div>
        ) : playlist.length > 0 ? (
          <span className="text-gray-400 text-sm">Select a track</span>
        ) : isAdmin ? (
          <span className="text-gray-400 text-sm">Upload music to begin</span>
        ) : (
          <span className="text-gray-400 text-sm">No music available</span>
        )}

        {fetchError && (
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-400" />
            <span className="text-red-400 text-xs bg-gray-800 px-2 py-1 rounded">
              {fetchError}
            </span>
          </div>
        )}

        <audio ref={audioRef} loop={false} muted className="hidden" />
      </div>

      {/* Playlist Modal */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPlaylist(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 w-full max-w-md rounded-xl shadow-2xl border border-gray-700"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-semibold text-white">Playlist</h2>
                    <span className="text-gray-400 text-sm">({playlist.length} tracks)</span>
                  </div>
                  <button
                    onClick={() => setShowPlaylist(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {playlist.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No tracks available
                  </div>
                ) : (
                  playlist.map((track, index) => (
                    <div
                      key={track.id}
                      className={`flex items-center justify-between p-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0 ${
                        index === currentTrackIndex ? 'bg-gray-800' : ''
                      }`}
                    >
                      <button
                        onClick={() => selectTrack(index)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            index === currentTrackIndex ? 'bg-purple-400' : 'bg-gray-600'
                          }`} />
                          <div>
                            <div className={`font-medium ${
                              index === currentTrackIndex ? 'text-purple-400' : 'text-white'
                            }`}>
                              {track.title}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {new Date(track.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </button>
                      
                      {isAdmin && (
                        <button
                          onClick={() => deleteTrack(track.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};