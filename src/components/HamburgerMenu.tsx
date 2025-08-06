import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, UserCircle, LogOut, Search, Users, PlusCircle, Settings } from 'lucide-react';

interface HamburgerMenuProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onProfileClick: () => void;
  onSignOut: () => void;
  onSearchClick: () => void;
  onAdminClick: () => void;
  onCreateStarClick: () => void;
  onSignInClick: () => void;
  onSettingsClick: () => void;
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
  onSettingsClick,
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
    {
      icon: Settings,
      label: 'Settings',
      action: onSettingsClick,
      color: 'text-gray-400 hover:text-gray-300',
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
        className="flex items-center justify-center w-12 h-12 glass-dark text-white rounded-full hover:scale-110 hover:shadow-lg transition-all duration-300 group"
        aria-label="Menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          className="group-hover:scale-110 transition-transform duration-200"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.div>
      </button>

      {/* Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ 
              duration: 0.2, 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
            className="absolute top-14 right-0 w-52 glass-dark rounded-xl shadow-2xl py-3 z-50 overflow-hidden"
          >
            {/* Subtle animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10" />
            
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleMenuItemClick(item.action)}
                className={`relative w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-all duration-200 group ${item.color}`}
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-current opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <item.icon size={18} className="group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};