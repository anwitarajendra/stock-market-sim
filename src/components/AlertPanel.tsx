import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Zap, X } from 'lucide-react';

interface Alert {
  id: number;
  type: 'warning' | 'success' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
}

const AlertPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: 'warning',
      title: 'Volatility Spike Detected',
      message: '$TSLA showing unusual volatility patterns',
      time: '2 min ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'success',
      title: 'Buy Signal Triggered',
      message: 'Greedy algorithm recommends $AAPL entry',
      time: '5 min ago',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'info',
      title: 'Pattern Match Found',
      message: '$GOOGL showing bullish flag formation',
      time: '12 min ago',
      severity: 'low'
    },
    {
      id: 4,
      type: 'error',
      title: 'Stop Loss Triggered',
      message: '$NVDA position closed at -2.1%',
      time: '18 min ago',
      severity: 'high'
    }
  ]);

  const [showAllAlerts, setShowAllAlerts] = useState(false);

  useEffect(() => {
    // Simulate new alerts
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: Date.now(),
        type: ['warning', 'success', 'info', 'error'][Math.floor(Math.random() * 4)] as Alert['type'],
        title: 'New Market Alert',
        message: 'Algorithm detected market movement',
        time: 'Just now',
        severity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as Alert['severity']
      };
      
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep only 10 alerts
    }, 30000); // New alert every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const toggleShowAll = () => {
    setShowAllAlerts(!showAllAlerts);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return TrendingUp;
      case 'info': return Zap;
      case 'error': return TrendingDown;
      default: return AlertTriangle;
    }
  };

  const getAlertColors = (type: string) => {
    switch (type) {
      case 'warning': return 'border-accent-yellow/30 bg-accent-yellow/10 text-accent-yellow';
      case 'success': return 'border-accent-green/30 bg-accent-green/10 text-accent-green';
      case 'info': return 'border-accent-blue/30 bg-accent-blue/10 text-accent-blue';
      case 'error': return 'border-accent-red/30 bg-accent-red/10 text-accent-red';
      default: return 'border-tech-gray-700/30 bg-tech-gray-700/10 text-tech-gray-400';
    }
  };

  const getSeverityIndicator = (severity: string) => {
    const colors = {
      high: 'bg-accent-red',
      medium: 'bg-accent-yellow',
      low: 'bg-accent-green'
    };
    return colors[severity as keyof typeof colors];
  };

  const displayedAlerts = showAllAlerts ? alerts : alerts.slice(0, 4);

  return (
    <div className="bg-tech-gray-900 border border-tech-gray-800 rounded-xl p-6 hover:border-tech-gray-700 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Heuristic Alerts</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
          <span className="text-sm text-accent-green">Real-time</span>
        </div>
      </div>

      <div className="space-y-3">
        {displayedAlerts.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          const colors = getAlertColors(alert.type);
          
          return (
            <div
              key={alert.id}
              className={`relative p-4 rounded-lg border backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer ${colors}`}
            >
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white text-sm truncate">
                      {alert.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getSeverityIndicator(alert.severity)}`}></div>
                      <span className="text-xs text-tech-gray-400">{alert.time}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissAlert(alert.id);
                        }}
                        className="text-tech-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-tech-gray-300 truncate">
                    {alert.message}
                  </p>
                </div>
              </div>
              
              {/* Glow effect for high severity alerts */}
              {alert.severity === 'high' && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent-red/20 to-accent-yellow/20 opacity-50 pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <button 
          onClick={toggleShowAll}
          className="text-sm text-tech-gray-400 hover:text-white transition-colors"
        >
          {showAllAlerts ? 'Show Less' : `View All Alerts (${alerts.length})`}
        </button>
      </div>
    </div>
  );
};

export default AlertPanel;