import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/profile';

interface UserSearchProps {
  onClose: () => void;
  onUserSelect: (userId: string) => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({
  onClose,
  onUserSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm.trim()) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const searchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: searchError } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`)
        .limit(10);

      if (searchError) throw searchError;
      setUsers(data || []);
    } catch (err: any) {
      console.error('Error searching users:', err);
      setError('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        className="bg-gray-900 w-full max-w-md rounded-xl shadow-2xl border border-gray-700 user-search"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Search Users</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username or display name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-gray-400">
              Searching...
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && searchTerm && users.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              No users found
            </div>
          )}

          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => onUserSelect(user.id)}
              className="w-full p-4 text-left hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">
                    {user.hide_display_name ? user.username : user.display_name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    @{user.username}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {!searchTerm && (
          <div className="p-4 text-center text-gray-400">
            Start typing to search for users...
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};