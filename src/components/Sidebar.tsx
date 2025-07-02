import React from 'react';
import { BarChart3, Target, PieChart, FileText, TrendingUp, Brain } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { theme } = useTheme();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'trading', label: 'Trading Strategies', icon: Target },
    { id: 'algorithms', label: 'Algorithm Viewer', icon: Brain },
    { id: 'portfolio', label: 'Portfolio Analysis', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const themeClasses = {
    light: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      activeItem: 'bg-blue-50 border-blue-200 text-blue-700',
      hoverItem: 'hover:bg-gray-50 hover:text-gray-900'
    },
    zk: {
      bg: 'bg-zk-charcoal',
      border: 'border-zk-leather/30',
      text: 'text-zk-eggshell',
      textSecondary: 'text-zk-eggshell/70',
      activeItem: 'bg-zk-coral/20 border-zk-coral text-zk-eggshell',
      hoverItem: 'hover:bg-zk-leather/20 hover:text-zk-eggshell'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className={`w-64 ${currentTheme.bg} border-r ${currentTheme.border} h-screen shadow-sm font-space`}>
      <div className={`p-6 border-b ${currentTheme.border}`}>
        <div className="flex items-center space-x-2">
          <TrendingUp className={`w-8 h-8 ${theme === 'zk' ? 'text-zk-coral' : 'text-blue-600'}`} />
          <span className={`text-xl font-bold ${currentTheme.text} tracking-tight`}>
            AlgoTradeSim
          </span>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? currentTheme.activeItem
                      : `${currentTheme.textSecondary} ${currentTheme.hoverItem}`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;