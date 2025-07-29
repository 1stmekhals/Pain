import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Globe, Lock, Calendar } from 'lucide-react';
import { DiaryEntry } from '../types/diary';

interface DiaryListProps {
  entries: DiaryEntry[];
  userId?: string;
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (entryId: string) => void;
}

export const DiaryList: React.FC<DiaryListProps> = ({
  entries,
  userId,
  onEdit,
  onDelete,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-white">{entry.title}</h3>
                {userId === entry.user_id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(entry)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 text-gray-300 whitespace-pre-wrap">
                {entry.content}
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(entry.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  {entry.is_public ? (
                    <>
                      <Globe size={14} className="text-green-400" />
                      <span className="text-green-400">Public</span>
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>Private</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};