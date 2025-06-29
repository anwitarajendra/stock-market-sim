import React, { useState, useEffect } from 'react';
import { Play, TrendingUp, DollarSign, Activity, Pause, RotateCcw } from 'lucide-react';

interface Trade {
  type: 'BUY' | 'SELL';
  symbol: string;
  price: number;
  time: string;
  profit: number | null;
}

const SimulationOutput = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState({
    profit: 2847.50,
    profitPercentage: 18.5,
    totalTransactions: 12,
    winRate: 75,
    sharpeRatio: 1.42,
    maxDrawdown: -5.2
  });

  const [recentTrades, setRecentTrades] = useState<Trade[]>([
    { type: 'BUY', symbol: 'AAPL', price: 168.50, time: '14:32', profit: null },
    { type: 'SELL', symbol: 'TSLA', price: 248.90, time: '14:15', profit: 245.80 },
    { type: 'BUY', symbol: 'GOOGL', price: 139.25, time: '13:58', profit: null },
    { type: 'SELL', symbol: 'MSFT', price: 382.15, time: '13:42', profit: 156.40 },
  ]);

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

  useEffect(() => {
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

  return (
    <div className="bg-tech-gray-900 border border-tech-gray-800 rounded-xl p-6 hover:border-tech-gray-700 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Simulation Results</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isRunning ? 'bg-accent-green' : 'bg-tech-gray-500'}`}></div>
          <span className={`text-sm ${isRunning ? 'text-accent-green' : 'text-tech-gray-400'}`}>
            {isRunning ? 'Live Simulation' : 'Simulation Stopped'}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-2 mb-6">
        {!isRunning ? (
          <button
            onClick={startSimulation}
            className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Start Simulation</span>
          </button>
        ) : (
          <button
            onClick={pauseSimulation}
            className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
          >
            <Pause className="w-4 h-4" />
            <span>Pause</span>
          </button>
        )}
        <button
          onClick={resetSimulation}
          className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Performance Gauge */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#374151"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
              strokeDasharray={`${Math.max((simulationResults.profitPercentage / 100) * 283, 0)} 283`}
              strokeLinecap="round"
              className="drop-shadow-lg transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {simulationResults.profitPercentage.toFixed(1)}%
              </div>
              <div className="text-xs text-tech-gray-400">Profit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
          <Play className="w-6 h-6 text-accent-yellow mx-auto mb-2" />
          <div className="text-lg font-bold text-white">
            {simulationResults.sharpeRatio.toFixed(2)}
          </div>
          <div className="text-xs text-tech-gray-400">Sharpe Ratio</div>
        </div>
      </div>

      {/* Recent Trades */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Recent Trades</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
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
        </div>
      </div>
    </div>
  );
};

export default SimulationOutput;