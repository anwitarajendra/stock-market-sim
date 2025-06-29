import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import StockChart from './StockChart';
import StrategySelector from './StrategySelector';
import SimulationOutput from './SimulationOutput';
import Portfolio from './Portfolio';
import AlertPanel from './AlertPanel';
import ReportSection from './ReportSection';
import MobileNavigation from './MobileNavigation';
import AlgorithmVisualization from './AlgorithmVisualization';
import NotificationPanel from './NotificationPanel';
import UserProfile from './UserProfile';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [terminalMode, setTerminalMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { theme } = useTheme();

  const themeClasses = {
    light: {
      bg: 'bg-gray-50',
      text: 'text-gray-900'
    },
    zk: {
      bg: 'bg-zk-navy',
      text: 'text-zk-eggshell'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className={`min-h-screen ${currentTheme.bg} flex font-space`}>
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopNavbar 
          terminalMode={terminalMode} 
          setTerminalMode={setTerminalMode}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          showUserProfile={showUserProfile}
          setShowUserProfile={setShowUserProfile}
        />
        
        {/* Notification Panel */}
        {showNotifications && (
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        )}

        {/* User Profile Panel */}
        {showUserProfile && (
          <UserProfile onClose={() => setShowUserProfile(false)} />
        )}
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <StockChart terminalMode={terminalMode} />
                <SimulationOutput />
              </div>
              <div className="space-y-6">
                <Portfolio />
                <AlertPanel />
              </div>
            </div>
          )}
          
          {activeTab === 'simulation' && (
            <div className="max-w-4xl mx-auto">
              <StrategySelector />
            </div>
          )}
          
          {activeTab === 'strategy' && (
            <div className="max-w-4xl mx-auto">
              <StrategySelector />
            </div>
          )}

          {activeTab === 'algorithms' && (
            <div className="max-w-6xl mx-auto">
              <AlgorithmVisualization />
            </div>
          )}
          
          {activeTab === 'portfolio' && (
            <div className="max-w-6xl mx-auto">
              <Portfolio />
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="max-w-4xl mx-auto">
              <ReportSection />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default Dashboard;