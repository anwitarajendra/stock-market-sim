import React, { useState } from 'react';
import { Brain, Zap, Target, TrendingUp, Layers, Play, Package, Pause, RotateCcw, Activity, DollarSign } from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  complexity: string;
  description: string;
  performance: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  color: string;
}

interface Trade {
  type: 'BUY' | 'SELL';
  symbol: string;
  price: number;
  time: string;
  profit: number | null;
}

const StrategySelector = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('greedy');
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState({
    profit: 0,
    profitPercentage: 0,
    totalTransactions: 0,
    winRate: 0,
    sharpeRatio: 0,
    maxDrawdown: 0
  });
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  
  const strategies: Strategy[] = [
    {
      id: 'greedy',
      name: 'Greedy Strategy',
      icon: Zap,
      complexity: 'O(n log n)',
      description: 'Optimal for quick profits with immediate decision making',
      performance: 87,
      riskLevel: 'Medium',
      color: 'green'
    },
    {
      id: 'dp',
      name: 'K Transaction DP',
      icon: Brain,
      complexity: 'O(kn)',
      description: 'Dynamic programming approach for limited transactions',
      performance: 92,
      riskLevel: 'Low',
      color: 'blue'
    },
    {
      id: 'cooldown',
      name: 'Cooldown Strategy',
      icon: Target,
      complexity: 'O(n)',
      description: 'Incorporates mandatory waiting periods between trades',
      performance: 78,
      riskLevel: 'High',
      color: 'purple'
    },
    {
      id: 'pattern',
      name: 'Pattern Matcher',
      icon: TrendingUp,
      complexity: 'O(n²)',
      description: 'Identifies recurring market patterns for predictions',
      performance: 85,
      riskLevel: 'Medium',
      color: 'orange'
    },
    {
      id: 'knapsack',
      name: 'Portfolio Knapsack',
      icon: Package,
      complexity: 'O(nW)',
      description: 'Optimizes portfolio allocation using knapsack algorithm',
      performance: 90,
      riskLevel: 'Low',
      color: 'teal'
    }
  ];

  const getColorClasses = (color: string, selected: boolean) => {
    if (selected) {
      return 'border-white bg-tech-gray-800';
    }
    return 'border-tech-gray-700 hover:border-tech-gray-600';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-accent-green';
      case 'Medium': return 'text-accent-yellow';
      case 'High': return 'text-accent-red';
      default: return 'text-tech-gray-400';
    }
  };

  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategy(strategyId);
  };

  const startSimulation = () => {
    setIsRunning(true);
  };

  const pauseSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setSimulationResults({
      profit: 0,
      profitPercentage: 0,
      totalTransactions: 0,
      winRate: 0,
      sharpeRatio: 0,
      maxDrawdown: 0
    });
    setRecentTrades([]);
  };

  // Simulation logic
  React.useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Simulate trading activity
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const randomPrice = Math.random() * 500 + 100;
      const isProfit = Math.random() > 0.3; // 70% chance of profit
      
      const newTrade: Trade = {
        type: Math.random() > 0.5 ? 'BUY' : 'SELL',
        symbol: randomSymbol,
        price: Number(randomPrice.toFixed(2)),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        profit: Math.random() > 0.5 ? (isProfit ? Math.random() * 300 + 50 : -(Math.random() * 100 + 20)) : null
      };

      setRecentTrades(prev => [newTrade, ...prev.slice(0, 9)]);
      
      // Update simulation results
      setSimulationResults(prev => ({
        ...prev,
        profit: prev.profit + (newTrade.profit || 0),
        profitPercentage: Math.min(prev.profitPercentage + (Math.random() * 2 - 1), 50),
        totalTransactions: prev.totalTransactions + 1,
        winRate: Math.min(Math.max(prev.winRate + (Math.random() * 4 - 2), 0), 100),
        sharpeRatio: Math.min(Math.max(prev.sharpeRatio + (Math.random() * 0.2 - 0.1), 0), 3),
        maxDrawdown: Math.min(prev.maxDrawdown + (Math.random() * 1 - 0.5), 0)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const selectedStrategyData = strategies.find(s => s.id === selectedStrategy);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Trading Strategies & Live Simulation</h2>
        <p className="text-tech-gray-400">Select an algorithm, run live simulations, and analyze performance</p>
      </div>

      {/* Strategy Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {strategies.map((strategy) => {
          const Icon = strategy.icon;
          const isSelected = selectedStrategy === strategy.id;
          
          return (
            <div
              key={strategy.id}
              onClick={() => handleStrategySelect(strategy.id)}
              className={`relative p-6 bg-tech-gray-900 backdrop-blur-sm border rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 card-hover ${getColorClasses(strategy.color, isSelected)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-white" />
                <div className="text-xs bg-tech-gray-800 px-2 py-1 rounded text-tech-gray-300">
                  {strategy.complexity}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{strategy.name}</h3>
              <p className="text-tech-gray-400 text-sm mb-4">{strategy.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-tech-gray-400">Performance</span>
                  <span className="text-sm font-semibold text-white">{strategy.performance}%</span>
                </div>
                
                <div className="w-full bg-tech-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-white transition-all duration-500"
                    style={{ width: `${strategy.performance}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-tech-gray-400">Risk Level</span>
                  <span className={`text-sm font-semibold ${getRiskColor(strategy.riskLevel)}`}>
                    {strategy.riskLevel}
                  </span>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute inset-0 rounded-xl bg-white/5 pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Control Panel & Live Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Control Panel */}
        <div className="bg-tech-gray-900 border border-tech-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Simulation Control</h3>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isRunning ? 'bg-accent-green/20 text-accent-green' : 'bg-tech-gray-700/20 text-tech-gray-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-accent-green animate-pulse' : 'bg-tech-gray-400'}`}></div>
              <span>{isRunning ? 'Running' : 'Stopped'}</span>
            </div>
          </div>

          {selectedStrategyData && (
            <div className="mb-6 p-4 bg-tech-gray-950 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <selectedStrategyData.icon className="w-6 h-6 text-white" />
                <h4 className="font-semibold text-white">{selectedStrategyData.name}</h4>
              </div>
              <p className="text-sm text-tech-gray-400 mb-2">{selectedStrategyData.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-tech-gray-400">Complexity: {selectedStrategyData.complexity}</span>
                <span className="text-accent-green">Win Rate: {selectedStrategyData.performance}%</span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            {!isRunning ? (
              <button
                onClick={startSimulation}
                className="flex-1 btn-primary px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Simulation</span>
              </button>
            ) : (
              <button
                onClick={pauseSimulation}
                className="flex-1 btn-secondary px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
            )}
            <button
              onClick={resetSimulation}
              className="btn-secondary px-4 py-3 rounded-lg font-medium flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Live Results */}
        <div className="bg-tech-gray-900 border border-tech-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Live Results</h3>
          
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-tech-gray-950 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent-green mx-auto mb-2" />
              <div className="text-lg font-bold text-accent-green">
                ${simulationResults.profit.toLocaleString()}
              </div>
              <div className="text-xs text-tech-gray-400">Total Profit</div>
            </div>
            
            <div className="text-center p-3 bg-tech-gray-950 rounded-lg">
              <Activity className="w-6 h-6 text-accent-blue mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {simulationResults.totalTransactions}
              </div>
              <div className="text-xs text-tech-gray-400">Transactions</div>
            </div>
            
            <div className="text-center p-3 bg-tech-gray-950 rounded-lg">
              <TrendingUp className="w-6 h-6 text-accent-purple mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {simulationResults.winRate.toFixed(0)}%
              </div>
              <div className="text-xs text-tech-gray-400">Win Rate</div>
            </div>
            
            <div className="text-center p-3 bg-tech-gray-950 rounded-lg">
              <Brain className="w-6 h-6 text-accent-yellow mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {simulationResults.sharpeRatio.toFixed(2)}
              </div>
              <div className="text-xs text-tech-gray-400">Sharpe Ratio</div>
            </div>
          </div>

          {/* Performance Gauge */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="35"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="6"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="35"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="6"
                  strokeDasharray={`${Math.max((simulationResults.profitPercentage / 100) * 220, 0)} 220`}
                  strokeLinecap="round"
                  className="drop-shadow-lg transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {simulationResults.profitPercentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-tech-gray-400">Return</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-tech-gray-900 border border-tech-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Recent Trades</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentTrades.map((trade, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-tech-gray-950 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                  trade.type === 'BUY' ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'
                }`}>
                  {trade.type}
                </div>
                <span className="font-semibold text-white">{trade.symbol}</span>
                <span className="text-tech-gray-400">${trade.price}</span>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-tech-gray-400">{trade.time}</div>
                {trade.profit && (
                  <div className={`text-sm font-semibold ${trade.profit > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {trade.profit > 0 ? '+' : ''}${Math.abs(trade.profit).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {recentTrades.length === 0 && (
            <div className="text-center text-tech-gray-400 py-8">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No trades yet. Start simulation to see live trading activity.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrategySelector;