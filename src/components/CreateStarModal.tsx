import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface CreateStarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (starName: string, message: string) => void;
}

export const CreateStarModal: React.FC<CreateStarModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [starName, setStarName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit('', message); // Remove star name requirement for now
    setStarName('');
    setMessage('');
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
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message (max 250 characters)"
            maxLength={250}
            className="w-full h-32 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          />
          
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={!message.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Create Star
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};