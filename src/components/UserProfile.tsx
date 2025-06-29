import React, { useState } from 'react';
import { X, User, Settings, LogOut, Shield, Bell, Moon, Sun } from 'lucide-react';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const userStats = {
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    joinDate: 'March 2024',
    totalTrades: 247,
    winRate: 74.5,
    totalProfit: 12847.50,
    riskScore: 6.2
  };

  return (
    <div className="absolute top-16 right-4 w-80 bg-tech-gray-900 border border-tech-gray-800 rounded-xl shadow-tech-lg z-50">
      <div className="flex items-center justify-between p-4 border-b border-tech-gray-800">
        <h3 className="text-lg font-bold text-white">Profile</h3>
        <button
          onClick={onClose}
          className="p-1 text-tech-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-tech-gray-700 to-tech-gray-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-white">{userStats.name}</h4>
            <p className="text-sm text-tech-gray-400">{userStats.email}</p>
            <p className="text-xs text-tech-gray-500">Member since {userStats.joinDate}</p>
          </div>
        </div>

        {/* Trading Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-tech-gray-950 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-white">{userStats.totalTrades}</div>
            <div className="text-xs text-tech-gray-400">Total Trades</div>
          </div>
          <div className="bg-tech-gray-950 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-accent-green">{userStats.winRate}%</div>
            <div className="text-xs text-tech-gray-400">Win Rate</div>
          </div>
          <div className="bg-tech-gray-950 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-accent-green">${userStats.totalProfit.toLocaleString()}</div>
            <div className="text-xs text-tech-gray-400">Total Profit</div>
          </div>
          <div className="bg-tech-gray-950 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-accent-yellow">{userStats.riskScore}/10</div>
            <div className="text-xs text-tech-gray-400">Risk Score</div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Moon className="w-4 h-4 text-tech-gray-400" />
              <span className="text-sm text-white">Dark Mode</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-10 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-accent-blue' : 'bg-tech-gray-700'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                darkMode ? 'translate-x-5' : 'translate-x-1'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-tech-gray-400" />
              <span className="text-sm text-white">Notifications</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-10 h-6 rounded-full transition-colors ${
                notifications ? 'bg-accent-green' : 'bg-tech-gray-700'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                notifications ? 'translate-x-5' : 'translate-x-1'
              }`}></div>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-tech-gray-300 hover:text-white hover:bg-tech-gray-800 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Account Settings</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-tech-gray-300 hover:text-white hover:bg-tech-gray-800 rounded-lg transition-colors">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Privacy & Security</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-accent-red hover:bg-tech-gray-800 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;