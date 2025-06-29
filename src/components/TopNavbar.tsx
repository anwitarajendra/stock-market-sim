import React from 'react';
import { User, Bell, Moon, Sun, Terminal, Eye, Home, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface TopNavbarProps {
  terminalMode: boolean;
  setTerminalMode: (mode: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showUserProfile: boolean;
  setShowUserProfile: (show: boolean) => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ 
  terminalMode, 
  setTerminalMode,
  showNotifications,
  setShowNotifications,
  showUserProfile,
  setShowUserProfile
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleTerminalToggle = () => {
    setTerminalMode(!terminalMode);
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
    setShowUserProfile(false); // Close user profile if open
  };

  const handleUserProfileToggle = () => {
    setShowUserProfile(!showUserProfile);
    setShowNotifications(false); // Close notifications if open
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const themeClasses = {
    light: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-500',
      button: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
      activeButton: 'bg-gray-100 text-gray-900 border-gray-300'
    },
    zk: {
      bg: 'bg-zk-charcoal',
      border: 'border-zk-leather/30',
      text: 'text-zk-eggshell',
      textSecondary: 'text-zk-eggshell/70',
      button: 'text-zk-eggshell/70 hover:text-zk-eggshell hover:bg-zk-leather/20',
      activeButton: 'bg-zk-leather/20 text-zk-eggshell border-zk-leather'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <header className={`${currentTheme.bg} border-b ${currentTheme.border} p-4 shadow-sm font-space`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleHomeClick}
            className={`p-2 ${currentTheme.button} rounded-lg transition-all duration-200`}
            title="Go to Home"
          >
            <Home className="w-5 h-5" />
          </button>
          <h1 className={`text-xl font-bold ${currentTheme.text}`}>Trading Dashboard</h1>
          <div className={`hidden md:flex items-center space-x-2 text-sm ${currentTheme.textSecondary}`}>
            <div className={`w-2 h-2 ${theme === 'zk' ? 'bg-zk-leather' : 'bg-green-500'} rounded-full animate-pulse`}></div>
            <span>Live Market Data</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-200 ${currentTheme.button}`}
            title="Toggle Theme"
          >
            <Palette className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleTerminalToggle}
            className={`p-2 rounded-lg transition-all duration-200 ${
              terminalMode
                ? currentTheme.activeButton
                : currentTheme.button
            }`}
            title={terminalMode ? 'Switch to Visual Mode' : 'Switch to Terminal Mode'}
          >
            {terminalMode ? <Eye className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
          </button>
          
          <button className={`p-2 ${currentTheme.button} rounded-lg transition-all duration-200`}>
            <Moon className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button 
              onClick={handleNotificationToggle}
              className={`p-2 rounded-lg transition-all duration-200 ${
                showNotifications
                  ? currentTheme.activeButton
                  : currentTheme.button
              }`}
            >
              <Bell className="w-5 h-5" />
            </button>
            <div className={`absolute -top-1 -right-1 w-3 h-3 ${theme === 'zk' ? 'bg-zk-coral' : 'bg-red-500'} rounded-full`}></div>
          </div>
          
          <button 
            onClick={handleUserProfileToggle}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showUserProfile
                ? currentTheme.activeButton
                : currentTheme.button
            }`}
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;