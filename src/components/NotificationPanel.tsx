import React, { useState } from 'react';
import { X, Bell, AlertTriangle, TrendingUp, Info, Settings } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

interface Notification {
  id: number;
  type: 'alert' | 'trade' | 'system' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'alert',
      title: 'High Volatility Alert',
      message: 'TSLA showing unusual price movements (+15% in last hour)',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'trade',
      title: 'Trade Executed',
      message: 'Successfully bought 100 shares of AAPL at $173.50',
      time: '5 min ago',
      read: false
    },
    {
      id: 3,
      type: 'system',
      title: 'Algorithm Update',
      message: 'Greedy strategy performance improved by 2.3%',
      time: '15 min ago',
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Market News',
      message: 'Fed announces interest rate decision at 2:00 PM EST',
      time: '1 hour ago',
      read: true
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'trade': return TrendingUp;
      case 'system': return Settings;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert': return 'text-accent-red';
      case 'trade': return 'text-accent-green';
      case 'system': return 'text-accent-blue';
      case 'info': return 'text-accent-yellow';
      default: return 'text-tech-gray-400';
    }
  };

  return (
    <div className="absolute top-16 right-4 w-80 bg-tech-gray-900 border border-tech-gray-800 rounded-xl shadow-tech-lg z-50">
      <div className="flex items-center justify-between p-4 border-b border-tech-gray-800">
        <h3 className="text-lg font-bold text-white">Notifications</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className="text-sm text-tech-gray-400 hover:text-white transition-colors"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="p-1 text-tech-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => {
          const Icon = getIcon(notification.type);
          return (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`p-4 border-b border-tech-gray-800 cursor-pointer hover:bg-tech-gray-800 transition-colors ${
                !notification.read ? 'bg-tech-gray-950' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 mt-0.5 ${getTypeColor(notification.type)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-white text-sm truncate">
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-tech-gray-300 mb-1">
                    {notification.message}
                  </p>
                  <span className="text-xs text-tech-gray-400">
                    {notification.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-tech-gray-800">
        <button className="w-full text-sm text-tech-gray-400 hover:text-white transition-colors">
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;