import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CreateStarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (starName: string, message: string) => Promise<void>;
}

export const CreateStarModal: React.FC<CreateStarModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [starName, setStarName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStarNameExists = async (name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('stars')
        .select('id')
        .eq('star_name', name)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (err) {
      console.error('Error checking star name:', err);
      throw new Error('Failed to check star name availability');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!starName.trim()) {
        setError('Star name is required');
        setIsSubmitting(false);
        return;
      }

      if (!message.trim()) {
        setError('Message is required');
        setIsSubmitting(false);
        return;
      }

      // Check if star name already exists
      const nameExists = await checkStarNameExists(starName.trim());
      if (nameExists) {
        setError('This star name has already been taken. Please choose a different name.');
        setIsSubmitting(false);
        return;
      }

      await onSubmit(starName.trim(), message.trim());
      setStarName('');
      setMessage('');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create star');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 p-6 rounded-lg w-full max-w-md relative border border-gray-700"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Create a New Star</h2>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <input
            type="text"
            value={starName}
            onChange={(e) => setStarName(e.target.value)}
            placeholder="Star name (required)"
            maxLength={50}
            className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message (max 250 characters)"
            maxLength={250}
            required
            className="w-full h-32 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          />
          
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={!message.trim() || !starName.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Star'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};