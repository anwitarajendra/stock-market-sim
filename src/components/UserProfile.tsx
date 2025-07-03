import React from 'react';
import { X, User, TrendingUp, DollarSign, PieChart } from 'lucide-react';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const userStats = {
    name: 'VEDANK CHATURVEDI',
    email: 'vedank.chaturvedi@example.com',
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
        {/* User Info with Profile Picture */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            V
          </div>
          <div>
            <h4 className="font-semibold text-white">{userStats.name}</h4>
            <p className="text-sm text-tech-gray-400">{userStats.email}</p>
            <p className="text-xs text-tech-gray-500">Member since {userStats.joinDate}</p>
          </div>
        </div>

        {/* Portfolio Investment Stats */}
        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-white mb-3">Portfolio Investment</h5>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-tech-gray-950 rounded-lg p-3 text-center">
              <TrendingUp className="w-5 h-5 text-accent-green mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{userStats.totalTrades}</div>
              <div className="text-xs text-tech-gray-400">Total Trades</div>
            </div>
            
            <div className="bg-tech-gray-950 rounded-lg p-3 text-center">
              <PieChart className="w-5 h-5 text-accent-blue mx-auto mb-1" />
              <div className="text-lg font-bold text-accent-green">{userStats.winRate}%</div>
              <div className="text-xs text-tech-gray-400">Win Rate</div>
            </div>
            
            <div className="bg-tech-gray-950 rounded-lg p-3 text-center">
              <DollarSign className="w-5 h-5 text-accent-green mx-auto mb-1" />
              <div className="text-lg font-bold text-accent-green">${userStats.totalProfit.toLocaleString()}</div>
              <div className="text-xs text-tech-gray-400">Total Profit</div>
            </div>
            
            <div className="bg-tech-gray-950 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-accent-yellow">{userStats.riskScore}/10</div>
              <div className="text-xs text-tech-gray-400">Risk Score</div>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-tech-gray-950 rounded-lg p-4 mt-4">
            <h6 className="text-sm font-semibold text-white mb-2">Investment Summary</h6>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-tech-gray-400">Total Invested:</span>
                <span className="text-white font-semibold">$15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tech-gray-400">Current Value:</span>
                <span className="text-accent-green font-semibold">$17,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tech-gray-400">Total Return:</span>
                <span className="text-accent-green font-semibold">+18.98%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;