import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, UserCircle, LogOut, Search, Users, PlusCircle } from 'lucide-react';

interface HamburgerMenuProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onProfileClick: () => void;
  onSignOut: () => void;
  onSearchClick: () => void;
  onAdminClick: () => void;
  onCreateStarClick: () => void;
  onSignInClick: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isAuthenticated,
  isAdmin,
  onProfileClick,
  onSignOut,
  onSearchClick,
  onAdminClick,
  onCreateStarClick,
  onSignInClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const menuItems = isAuthenticated ? [
    {
      icon: Search,
      label: 'Search',
      action: onSearchClick,
      color: 'text-green-400 hover:text-green-300',
    },
    {
      icon: PlusCircle,
      label: 'Create Star',
      action: onCreateStarClick,
      color: 'text-blue-400 hover:text-blue-300',
    },
    {
      icon: UserCircle,
      label: 'Profile',
      action: onProfileClick,
      color: 'text-purple-400 hover:text-purple-300',
    },
    ...(isAdmin ? [{
      icon: Users,
      label: 'Admin Panel',
      action: onAdminClick,
      color: 'text-yellow-400 hover:text-yellow-300',
    }] : []),
    {
      icon: LogOut,
      label: 'Sign Out',
      action: onSignOut,
      color: 'text-red-400 hover:text-red-300',
    },
  ] : [
    {
      icon: UserCircle,
      label: 'Sign In',
      action: onSignInClick,
      color: 'text-blue-400 hover:text-blue-300',
    },
  ];

  return (
    <div ref={menuRef} className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 bg-gray-900 bg-opacity-80 text-white rounded-full hover:bg-opacity-100 transition-all duration-300 backdrop-blur-sm border border-gray-700"
        aria-label="Menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.div>
      </button>

      {/* Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-14 right-0 w-48 bg-gray-900 bg-opacity-95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700 py-2 z-50"
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item.action)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors ${item.color}`}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};