import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DiaryEntry } from '../types/diary';
import { DiaryModal } from './DiaryModal';
import { DiaryList } from './DiaryList';
import { useAuthStore } from '../store/useAuthStore';
import { PlusCircle, Book, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const DiaryPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | undefined>();
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    try {
      let query = supabase
        .from('diary_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!user) {
        query = query.eq('is_public', true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching diary entries:', err);
      setError('Failed to load diary entries');
    }
  };

  const handleSubmit = async (entryData: any) => {
    try {
      if (!user) throw new Error('Must be logged in to create entries');

      if ('id' in entryData) {
        const { error: updateError } = await supabase
          .from('diary_entries')
          .update({
            title: entryData.title,
            content: entryData.content,
            is_public: entryData.is_public,
          })
          .eq('id', entryData.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('diary_entries')
          .insert([{
            ...entryData,
            user_id: user.id,
          }]);

        if (insertError) throw insertError;
      }

      setSelectedEntry(undefined);
      await fetchEntries();
    } catch (err) {
      console.error('Error saving diary entry:', err);
      setError('Failed to save diary entry');
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', entryId);

      if (deleteError) throw deleteError;
      await fetchEntries();
    } catch (err) {
      console.error('Error deleting diary entry:', err);
      setError('Failed to delete diary entry');
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    // Only close if clicking the outer backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm overflow-auto z-50" 
      onClick={handleClickOutside}
    >
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Diary</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={() => {
                  setSelectedEntry(undefined);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle size={20} />
                New Entry
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <DiaryList
          entries={entries}
          userId={user?.id}
          onEdit={(entry) => {
            setSelectedEntry(entry);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </motion.div>

      <DiaryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEntry(undefined);
        }}
        onSubmit={handleSubmit}
        entry={selectedEntry}
      />
    </div>
  );
};