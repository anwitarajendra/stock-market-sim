import React from 'react';
import { BarChart3, Play, Vibrate as Strategy, PieChart, FileText, Brain } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'simulation', label: 'Simulate', icon: Play },
    { id: 'algorithms', label: 'Algorithms', icon: Brain },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-tech-gray-900/90 backdrop-blur-sm border-t border-tech-gray-800 z-50">
      <div className="flex justify-around items-center py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'text-white bg-tech-gray-800'
                  : 'text-tech-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;