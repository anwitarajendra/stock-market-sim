import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Brain, Zap, TrendingUp, Code, Activity, DollarSign, Package, Target, BarChart3 } from 'lucide-react';

interface AlgorithmStep {
  step: number;
  action: string;
  price: number;
  decision: 'BUY' | 'SELL' | 'HOLD';
  profit: number;
  reasoning: string;
  position: number;
  cash: number;
  knapsackData?: {
    capacity: number;
    items: Array<{ stock: string; weight: number; value: number; selected: boolean }>;
    totalValue: number;
    totalWeight: number;
  };
}

interface AlgorithmState {
  name: string;
  currentStep: number;
  isRunning: boolean;
  steps: AlgorithmStep[];
  totalProfit: number;
  complexity: string;
  currentPosition: number;
  cash: number;
  buyPrice: number;
}

const AlgorithmVisualization = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('greedy');
  const [algorithmState, setAlgorithmState] = useState<AlgorithmState>({
    name: 'Greedy Strategy',
    currentStep: 0,
    isRunning: false,
    steps: [],
    totalProfit: 0,
    complexity: 'O(n)',
    currentPosition: 0,
    cash: 10000,
    buyPrice: 0
  });

  const algorithms = [
    {
      id: 'greedy',
      name: 'Greedy Strategy',
      icon: Zap,
      complexity: 'O(n)',
      description: 'Makes locally optimal choices - buy low, sell high immediately',
      color: 'green',
      winRate: 87
    },
    {
      id: 'dp',
      name: 'Dynamic Programming',
      icon: Brain,
      complexity: 'O(n)',
      description: 'Optimal solution using memoization and future price analysis',
      color: 'blue',
      winRate: 92
    },
    {
      id: 'knapsack',
      name: 'Portfolio Knapsack',
      icon: Package,
      complexity: 'O(nW)',
      description: 'Optimizes portfolio allocation using 0/1 knapsack algorithm',
      color: 'purple',
      winRate: 89
    }
  ];

  // Realistic price data with more volatility
  const priceData = [150, 148, 155, 149, 162, 158, 170, 165, 175, 168, 180, 172, 185, 178, 190, 182, 195, 188, 200, 192, 205, 198, 210, 203];

  // Knapsack items (stocks with risk/reward ratios)
  const knapsackItems = [
    { stock: 'AAPL', weight: 3, value: 8, selected: false },
    { stock: 'GOOGL', weight: 4, value: 9, selected: false },
    { stock: 'MSFT', weight: 2, value: 6, selected: false },
    { stock: 'TSLA', weight: 5, value: 12, selected: false },
    { stock: 'NVDA', weight: 4, value: 10, selected: false },
    { stock: 'AMZN', weight: 3, value: 7, selected: false }
  ];

  useEffect(() => {
    if (!algorithmState.isRunning) return;

    const interval = setInterval(() => {
      setAlgorithmState(prev => {
        if (prev.currentStep >= priceData.length - 1) {
          return { ...prev, isRunning: false };
        }

        const currentPrice = priceData[prev.currentStep];
        const nextPrice = priceData[prev.currentStep + 1];
        
        let decision: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
        let reasoning = '';
        let profit = 0;
        let newPosition = prev.currentPosition;
        let newCash = prev.cash;
        let newBuyPrice = prev.buyPrice;
        let knapsackData = undefined;

        // Algorithm-specific logic
        switch (selectedAlgorithm) {
          case 'greedy':
            if (prev.currentPosition === 0) {
              if (nextPrice > currentPrice * 1.015) {
                const shares = Math.floor(prev.cash / currentPrice);
                if (shares > 0) {
                  decision = 'BUY';
                  newPosition = shares;
                  newCash = prev.cash - (shares * currentPrice);
                  newBuyPrice = currentPrice;
                  reasoning = `Greedy: Buy signal - next price ${nextPrice.toFixed(2)} > current ${currentPrice.toFixed(2)} (+${((nextPrice/currentPrice-1)*100).toFixed(1)}%)`;
                }
              } else {
                reasoning = `Greedy: Wait - next price ${nextPrice.toFixed(2)} not profitable enough`;
              }
            } else {
              const potentialProfit = (currentPrice - prev.buyPrice) / prev.buyPrice;
              
              if (potentialProfit >= 0.03) {
                decision = 'SELL';
                profit = prev.currentPosition * (currentPrice - prev.buyPrice);
                newCash = prev.cash + (prev.currentPosition * currentPrice);
                newPosition = 0;
                newBuyPrice = 0;
                reasoning = `Greedy: Take profit - ${(potentialProfit*100).toFixed(1)}% gain (${profit.toFixed(2)})`;
              } else if (potentialProfit <= -0.02) {
                decision = 'SELL';
                profit = prev.currentPosition * (currentPrice - prev.buyPrice);
                newCash = prev.cash + (prev.currentPosition * currentPrice);
                newPosition = 0;
                newBuyPrice = 0;
                reasoning = `Greedy: Stop loss - ${(potentialProfit*100).toFixed(1)}% loss (${profit.toFixed(2)})`;
              } else {
                reasoning = `Greedy: Hold ${prev.currentPosition} shares - current P&L: ${((currentPrice - prev.buyPrice) * prev.currentPosition).toFixed(2)}`;
              }
            }
            break;

          case 'dp':
            const lookAhead = Math.min(4, priceData.length - prev.currentStep - 1);
            const futurePrices = priceData.slice(prev.currentStep + 1, prev.currentStep + 1 + lookAhead);
            const futureMax = Math.max(...futurePrices);
            const avgFuture = futurePrices.reduce((a, b) => a + b, 0) / futurePrices.length;
            
            if (prev.currentPosition === 0) {
              const maxPotentialGain = (futureMax - currentPrice) / currentPrice;
              
              if (maxPotentialGain >= 0.04 && avgFuture > currentPrice * 1.02) {
                const shares = Math.floor(prev.cash / currentPrice);
                if (shares > 0) {
                  decision = 'BUY';
                  newPosition = shares;
                  newCash = prev.cash - (shares * currentPrice);
                  newBuyPrice = currentPrice;
                  reasoning = `DP: Optimal buy - future max ${futureMax.toFixed(2)} (+${(maxPotentialGain*100).toFixed(1)}%), avg ${avgFuture.toFixed(2)}`;
                }
              } else {
                reasoning = `DP: Wait - max future gain ${(maxPotentialGain*100).toFixed(1)}% insufficient (need 4%+)`;
              }
            } else {
              const currentGain = (currentPrice - prev.buyPrice) / prev.buyPrice;
              
              if (currentPrice >= futureMax * 0.95) {
                decision = 'SELL';
                profit = prev.currentPosition * (currentPrice - prev.buyPrice);
                newCash = prev.cash + (prev.currentPosition * currentPrice);
                newPosition = 0;
                newBuyPrice = 0;
                reasoning = `DP: Optimal exit - current ${currentPrice.toFixed(2)} near future max ${futureMax.toFixed(2)}`;
              } else if (currentGain >= 0.05) {
                decision = 'SELL';
                profit = prev.currentPosition * (currentPrice - prev.buyPrice);
                newCash = prev.cash + (prev.currentPosition * currentPrice);
                newPosition = 0;
                newBuyPrice = 0;
                reasoning = `DP: Profit target - ${(currentGain*100).toFixed(1)}% gain achieved`;
              } else {
                reasoning = `DP: Hold - current gain ${(currentGain*100).toFixed(1)}%, future max ${((futureMax - prev.buyPrice) / prev.buyPrice * 100).toFixed(1)}%`;
              }
            }
            break;

          case 'knapsack':
            // Knapsack algorithm for portfolio optimization
            const capacity = 10; // Risk capacity
            const items = [...knapsackItems];
            
            // Dynamic programming knapsack solution
            const dp = Array(items.length + 1).fill(null).map(() => Array(capacity + 1).fill(0));
            
            for (let i = 1; i <= items.length; i++) {
              for (let w = 1; w <= capacity; w++) {
                if (items[i-1].weight <= w) {
                  dp[i][w] = Math.max(
                    dp[i-1][w],
                    dp[i-1][w - items[i-1].weight] + items[i-1].value
                  );
                } else {
                  dp[i][w] = dp[i-1][w];
                }
              }
            }
            
            // Backtrack to find selected items
            let w = capacity;
            const selectedItems = [];
            for (let i = items.length; i > 0 && w > 0; i--) {
              if (dp[i][w] !== dp[i-1][w]) {
                items[i-1].selected = true;
                selectedItems.push(items[i-1]);
                w -= items[i-1].weight;
              }
            }
            
            const totalValue = selectedItems.reduce((sum, item) => sum + item.value, 0);
            const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);
            
            knapsackData = {
              capacity,
              items,
              totalValue,
              totalWeight
            };
            
            // Make trading decision based on knapsack optimization
            if (prev.currentPosition === 0 && selectedItems.length > 0) {
              const avgValue = totalValue / selectedItems.length;
              if (avgValue >= 8) { // High value threshold
                const shares = Math.floor(prev.cash / currentPrice);
                if (shares > 0) {
                  decision = 'BUY';
                  newPosition = shares;
                  newCash = prev.cash - (shares * currentPrice);
                  newBuyPrice = currentPrice;
                  reasoning = `Knapsack: Optimal portfolio selected - ${selectedItems.length} stocks, value: ${totalValue}, weight: ${totalWeight}/${capacity}`;
                }
              } else {
                reasoning = `Knapsack: Portfolio value ${avgValue.toFixed(1)} below threshold (need 8+)`;
              }
            } else if (prev.currentPosition > 0) {
              const currentGain = (currentPrice - prev.buyPrice) / prev.buyPrice;
              if (currentGain >= 0.04) {
                decision = 'SELL';
                profit = prev.currentPosition * (currentPrice - prev.buyPrice);
                newCash = prev.cash + (prev.currentPosition * currentPrice);
                newPosition = 0;
                newBuyPrice = 0;
                reasoning = `Knapsack: Rebalance portfolio - ${(currentGain*100).toFixed(1)}% gain achieved`;
              } else {
                reasoning = `Knapsack: Hold position - current gain ${(currentGain*100).toFixed(1)}%, portfolio optimized`;
              }
            } else {
              reasoning = `Knapsack: No optimal portfolio found - capacity: ${capacity}, best value: ${totalValue}`;
            }
            break;
        }

        const newStep: AlgorithmStep = {
          step: prev.currentStep + 1,
          action: `Step ${prev.currentStep + 1}`,
          price: currentPrice,
          decision,
          profit,
          reasoning,
          position: newPosition,
          cash: newCash,
          knapsackData
        };

        return {
          ...prev,
          currentStep: prev.currentStep + 1,
          steps: [...prev.steps, newStep],
          totalProfit: prev.totalProfit + profit,
          currentPosition: newPosition,
          cash: newCash,
          buyPrice: newBuyPrice
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [algorithmState.isRunning, selectedAlgorithm, priceData]);

  const startAlgorithm = () => {
    setAlgorithmState(prev => ({ ...prev, isRunning: true }));
  };

  const pauseAlgorithm = () => {
    setAlgorithmState(prev => ({ ...prev, isRunning: false }));
  };

  const resetAlgorithm = () => {
    const algorithm = algorithms.find(a => a.id === selectedAlgorithm);
    setAlgorithmState({
      name: algorithm?.name || 'Algorithm',
      currentStep: 0,
      isRunning: false,
      steps: [],
      totalProfit: 0,
      complexity: algorithm?.complexity || 'O(n)',
      currentPosition: 0,
      cash: 10000,
      buyPrice: 0
    });
  };

  const selectAlgorithm = (algorithmId: string) => {
    const algorithm = algorithms.find(a => a.id === algorithmId);
    if (algorithm) {
      setSelectedAlgorithm(algorithmId);
      setAlgorithmState({
        name: algorithm.name,
        currentStep: 0,
        isRunning: false,
        steps: [],
        totalProfit: 0,
        complexity: algorithm.complexity,
        currentPosition: 0,
        cash: 10000,
        buyPrice: 0
      });
    }
  };

  const portfolioValue = algorithmState.cash + (algorithmState.currentPosition * (priceData[algorithmState.currentStep] || 0));
  const totalReturn = ((portfolioValue - 10000) / 10000) * 100;
  const selectedAlgo = algorithms.find(a => a.id === selectedAlgorithm);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Portfolio Value</h3>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">${portfolioValue.toLocaleString()}</div>
          <div className={`text-sm font-medium ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalReturn >= 0 ? '↗' : '↘'} {Math.abs(totalReturn).toFixed(2)}%
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Algorithm Performance</h3>
            <Brain className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{selectedAlgo?.winRate || 0}%</div>
          <div className="text-sm font-medium text-blue-400">Win Rate</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Trades</h3>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{algorithmState.steps.length}</div>
          <div className="text-sm font-medium text-purple-400">Executed</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Algorithm Selection */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-6">Trading Algorithms</h2>
            
            <div className="space-y-4">
              {algorithms.map((algorithm) => {
                const Icon = algorithm.icon;
                const isSelected = selectedAlgorithm === algorithm.id;
                
                return (
                  <button
                    key={algorithm.id}
                    onClick={() => selectAlgorithm(algorithm.id)}
                    className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon className="w-6 h-6 text-white" />
                      <div>
                        <h3 className="font-semibold text-white">{algorithm.name}</h3>
                        <p className="text-xs text-gray-400">{algorithm.complexity}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{algorithm.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Win Rate</span>
                      <span className="text-sm font-semibold text-green-400">{algorithm.winRate}%</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Control Panel */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                {!algorithmState.isRunning ? (
                  <button
                    onClick={startAlgorithm}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseAlgorithm}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                )}
                <button
                  onClick={resetAlgorithm}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  algorithmState.isRunning ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${algorithmState.isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span>{algorithmState.isRunning ? 'Running' : 'Stopped'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart and Visualization */}
        <div className="lg:col-span-2">
          {/* Price Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Price Chart & Trading Signals</h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400">BUY</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-400">SELL</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-80 bg-gray-900 rounded-lg p-4">
              <svg className="w-full h-full" viewBox="0 0 800 300">
                {/* Grid lines */}
                {[...Array(6)].map((_, i) => (
                  <line key={i} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="#374151" strokeWidth="0.5" opacity="0.5" />
                ))}
                
                {/* Price line */}
                <polyline
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  points={priceData.slice(0, algorithmState.currentStep + 1).map((price, index) => 
                    `${(index / (priceData.length - 1)) * 780 + 10},${300 - ((price - 140) / 80) * 280}`
                  ).join(' ')}
                />
                
                {/* Decision markers */}
                {algorithmState.steps.map((step, index) => {
                  if (step.decision === 'HOLD') return null;
                  
                  const x = (index / (priceData.length - 1)) * 780 + 10;
                  const y = 300 - ((step.price - 140) / 80) * 280;
                  
                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill={step.decision === 'BUY' ? '#10b981' : '#ef4444'}
                        stroke="#000"
                        strokeWidth="1"
                      />
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        className="text-xs fill-white font-bold"
                      >
                        {step.decision}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Knapsack Visualization (only for knapsack algorithm) */}
          {selectedAlgorithm === 'knapsack' && algorithmState.steps.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <h3 className="text-xl font-bold text-white mb-6">Knapsack Portfolio Optimization</h3>
              
              {algorithmState.steps[algorithmState.steps.length - 1]?.knapsackData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Portfolio Items</h4>
                    <div className="space-y-3">
                      {algorithmState.steps[algorithmState.steps.length - 1].knapsackData.items.map((item, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            item.selected
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-gray-600 bg-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{item.stock}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-400">W:{item.weight}</span>
                              <span className="text-sm text-gray-400">V:{item.value}</span>
                              {item.selected && <span className="text-green-400 text-sm">✓</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Optimization Results</h4>
                    <div className="space-y-4">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Total Value</div>
                        <div className="text-2xl font-bold text-green-400">
                          {algorithmState.steps[algorithmState.steps.length - 1].knapsackData.totalValue}
                        </div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Weight Used</div>
                        <div className="text-2xl font-bold text-white">
                          {algorithmState.steps[algorithmState.steps.length - 1].knapsackData.totalWeight}/
                          {algorithmState.steps[algorithmState.steps.length - 1].knapsackData.capacity}
                        </div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Efficiency</div>
                        <div className="text-2xl font-bold text-blue-400">
                          {(algorithmState.steps[algorithmState.steps.length - 1].knapsackData.totalValue / 
                            algorithmState.steps[algorithmState.steps.length - 1].knapsackData.totalWeight).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Decision Log */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Algorithm Decision Log</h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {algorithmState.steps.slice().reverse().slice(0, 8).map((step, index) => (
                <div key={step.step} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        step.decision === 'BUY' ? 'bg-green-500/20 text-green-400' : 
                        step.decision === 'SELL' ? 'bg-red-500/20 text-red-400' : 
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {step.decision}
                      </div>
                      <span className="font-semibold text-white">Step {step.step}</span>
                      <span className="text-gray-400">${step.price}</span>
                    </div>
                    {step.profit !== 0 && (
                      <span className={`text-sm font-bold ${step.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {step.profit > 0 ? '+' : ''}${step.profit.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300">{step.reasoning}</p>
                </div>
              ))}
              
              {algorithmState.steps.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No decisions made yet</p>
                  <p className="text-sm">Click "Start" to begin the simulation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualization;