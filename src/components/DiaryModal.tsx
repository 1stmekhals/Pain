import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Globe, Lock } from 'lucide-react';
import { DiaryEntry, CreateDiaryEntry, UpdateDiaryEntry } from '../types/diary';

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: CreateDiaryEntry | UpdateDiaryEntry) => Promise<void>;
  entry?: DiaryEntry;
}

export const DiaryModal: React.FC<DiaryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  entry,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setIsPublic(entry.is_public);
    } else {
      setTitle('');
      setContent('');
      setIsPublic(false);
    }
  }, [entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const entryData = {
        title,
        content,
        is_public: isPublic,
        ...(entry && { id: entry.id }),
      };
      await onSubmit(entryData);
      onClose();
    } catch (error) {
      console.error('Error saving diary entry:', error);
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
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-700"
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {entry ? 'Edit Entry' : 'New Diary Entry'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry Title"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
              className="w-full h-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isPublic
                  ? 'bg-green-600/20 text-green-400'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {isPublic ? <Globe size={18} /> : <Lock size={18} />}
              {isPublic ? 'Public' : 'Private'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};