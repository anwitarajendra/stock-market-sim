import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Brain, Zap, TrendingUp, Code, Activity, DollarSign } from 'lucide-react';

interface AlgorithmStep {
  step: number;
  action: string;
  price: number;
  decision: 'BUY' | 'SELL' | 'HOLD';
  profit: number;
  reasoning: string;
  position: number;
  cash: number;
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
      color: 'green'
    },
    {
      id: 'dp',
      name: 'Dynamic Programming',
      icon: Brain,
      complexity: 'O(n)',
      description: 'Optimal solution using memoization and future price analysis',
      color: 'blue'
    }
  ];

  // Realistic price data with more volatility
  const priceData = [150, 148, 155, 149, 162, 158, 170, 165, 175, 168, 180, 172, 185, 178, 190, 182, 195, 188, 200, 192, 205, 198, 210, 203];

  useEffect(() => {
    if (!algorithmState.isRunning) return;

    const interval = setInterval(() => {
      setAlgorithmState(prev => {
        if (prev.currentStep >= priceData.length - 1) {
          return { ...prev, isRunning: false };
        }

        const currentPrice = priceData[prev.currentStep];
        const nextPrice = priceData[prev.currentStep + 1];
        const prevPrice = priceData[prev.currentStep - 1] || currentPrice;
        
        let decision: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
        let reasoning = '';
        let profit = 0;
        let newPosition = prev.currentPosition;
        let newCash = prev.cash;
        let newBuyPrice = prev.buyPrice;

        // Algorithm-specific logic
        switch (selectedAlgorithm) {
          case 'greedy':
            if (prev.currentPosition === 0) {
              // Look for buying opportunity - price going up next
              if (nextPrice > currentPrice * 1.015) { // 1.5% threshold
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
              // Already holding - look for selling opportunity
              const potentialProfit = (currentPrice - prev.buyPrice) / prev.buyPrice;
              
              if (potentialProfit >= 0.03) { // Take profit at 3%
                decision = 'SELL';
                profit = prev.currentPosition * (currentPrice - prev.buyPrice);
                newCash = prev.cash + (prev.currentPosition * currentPrice);
                newPosition = 0;
                newBuyPrice = 0;
                reasoning = `Greedy: Take profit - ${(potentialProfit*100).toFixed(1)}% gain (${profit.toFixed(2)})`;
              } else if (potentialProfit <= -0.02) { // Stop loss at -2%
                decision = 'SELL';
                profit = prev.currentPosition * (currentPrice - prev.buyPrice);
                newCash = prev.cash + (prev.currentPosition * currentPrice);
                newPosition = 0;
                newBuyPrice = 0;
                reasoning = `Greedy: Stop loss - ${(potentialProfit*100).toFixed(1)}% loss (${profit.toFixed(2)})`;
              } else if (nextPrice < currentPrice * 0.98) { // Sell if big drop coming
                decision = 'SELL';
                profit = prev.currentPosition * (currentPrice - prev.buyPrice);
                newCash = prev.cash + (prev.currentPosition * currentPrice);
                newPosition = 0;
                newBuyPrice = 0;
                reasoning = `Greedy: Exit before drop - next price ${nextPrice.toFixed(2)} < current ${currentPrice.toFixed(2)}`;
              } else {
                reasoning = `Greedy: Hold ${prev.currentPosition} shares - current P&L: ${((currentPrice - prev.buyPrice) * prev.currentPosition).toFixed(2)}`;
              }
            }
            break;

          case 'dp':
            // Dynamic Programming - look ahead multiple steps for optimal decision
            const lookAhead = Math.min(4, priceData.length - prev.currentStep - 1);
            const futurePrices = priceData.slice(prev.currentStep + 1, prev.currentStep + 1 + lookAhead);
            const futureMax = Math.max(...futurePrices);
            const futureMin = Math.min(...futurePrices);
            const avgFuture = futurePrices.reduce((a, b) => a + b, 0) / futurePrices.length;
            
            if (prev.currentPosition === 0) {
              // DP Decision: Buy if future maximum is significantly higher
              const maxPotentialGain = (futureMax - currentPrice) / currentPrice;
              
              if (maxPotentialGain >= 0.04 && avgFuture > currentPrice * 1.02) { // 4% max gain and 2% avg gain
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
              // DP Decision: Sell based on optimal future analysis
              const currentGain = (currentPrice - prev.buyPrice) / prev.buyPrice;
              const futureMaxGain = (futureMax - prev.buyPrice) / prev.buyPrice;
              const futureMinGain = (futureMin - prev.buyPrice) / prev.buyPrice;
              
              // Sell if current price is close to future maximum OR if future looks bad
              if (currentPrice >= futureMax * 0.95) {
                decision = 'SELL';
                profit = prev.currentPosition * (currentPrice - prev.buyPrice);
                newCash = prev.cash + (prev.currentPosition * currentPrice);
                newPosition = 0;
                newBuyPrice = 0;
                reasoning = `DP: Optimal exit - current ${currentPrice.toFixed(2)} near future max ${futureMax.toFixed(2)}`;
              } else if (futureMinGain <= -0.03) { // Exit if future minimum shows 3%+ loss
                decision = 'SELL';
                profit = prev.currentPosition * (currentPrice - prev.buyPrice);
                newCash = prev.cash + (prev.currentPosition * currentPrice);
                newPosition = 0;
                newBuyPrice = 0;
                reasoning = `DP: Risk exit - future min ${futureMin.toFixed(2)} shows ${(futureMinGain*100).toFixed(1)}% loss`;
              } else if (currentGain >= 0.05) { // Take profit at 5%
                decision = 'SELL';
                profit = prev.currentPosition * (currentPrice - prev.buyPrice);
                newCash = prev.cash + (prev.currentPosition * currentPrice);
                newPosition = 0;
                newBuyPrice = 0;
                reasoning = `DP: Profit target - ${(currentGain*100).toFixed(1)}% gain achieved`;
              } else {
                reasoning = `DP: Hold - current gain ${(currentGain*100).toFixed(1)}%, future max ${(futureMaxGain*100).toFixed(1)}%`;
              }
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
          cash: newCash
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
    }, 2500); // Slower for better observation

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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Algorithm Comparison</h2>
        <p className="text-tech-gray-400">Compare Greedy vs Dynamic Programming trading strategies</p>
      </div>

      {/* Algorithm Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 max-w-4xl mx-auto">
        {algorithms.map((algorithm) => {
          const Icon = algorithm.icon;
          const isSelected = selectedAlgorithm === algorithm.id;
          
          return (
            <button
              key={algorithm.id}
              onClick={() => selectAlgorithm(algorithm.id)}
              className={`p-6 bg-tech-gray-900 border rounded-xl transition-all duration-300 text-left ${
                isSelected
                  ? 'border-white bg-tech-gray-800 transform scale-105'
                  : 'border-tech-gray-700 hover:border-tech-gray-600'
              }`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <Icon className="w-10 h-10 text-white" />
                <div>
                  <h3 className="font-bold text-white text-lg">{algorithm.name}</h3>
                  <p className="text-sm text-tech-gray-400">{algorithm.complexity}</p>
                </div>
              </div>
              <p className="text-sm text-tech-gray-300">{algorithm.description}</p>
            </button>
          );
        })}
      </div>

      {/* Control Panel */}
      <div className="bg-tech-gray-900 border border-tech-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">{algorithmState.name}</h3>
            <p className="text-tech-gray-400">Time Complexity: {algorithmState.complexity}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {!algorithmState.isRunning ? (
              <button
                onClick={startAlgorithm}
                className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Algorithm</span>
              </button>
            ) : (
              <button
                onClick={pauseAlgorithm}
                className="btn-secondary px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
            )}
            <button
              onClick={resetAlgorithm}
              className="btn-secondary px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Status Display */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-tech-gray-950 rounded-lg p-4 text-center">
            <Activity className="w-6 h-6 text-accent-blue mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{algorithmState.currentStep}</div>
            <div className="text-sm text-tech-gray-400">Step</div>
          </div>
          
          <div className="bg-tech-gray-950 rounded-lg p-4 text-center">
            <DollarSign className="w-6 h-6 text-accent-green mx-auto mb-2" />
            <div className="text-xl font-bold text-white">${algorithmState.cash.toFixed(0)}</div>
            <div className="text-sm text-tech-gray-400">Cash</div>
          </div>
          
          <div className="bg-tech-gray-950 rounded-lg p-4 text-center">
            <Code className="w-6 h-6 text-accent-purple mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{algorithmState.currentPosition}</div>
            <div className="text-sm text-tech-gray-400">Shares</div>
          </div>
          
          <div className="bg-tech-gray-950 rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-accent-yellow mx-auto mb-2" />
            <div className="text-xl font-bold text-white">${portfolioValue.toFixed(0)}</div>
            <div className="text-sm text-tech-gray-400">Portfolio</div>
          </div>
          
          <div className="bg-tech-gray-950 rounded-lg p-4 text-center">
            <Brain className="w-6 h-6 text-accent-green mx-auto mb-2" />
            <div className={`text-xl font-bold ${algorithmState.totalProfit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              ${algorithmState.totalProfit.toFixed(0)}
            </div>
            <div className="text-sm text-tech-gray-400">Realized P&L</div>
          </div>
          
          <div className="bg-tech-gray-950 rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-accent-blue mx-auto mb-2" />
            <div className={`text-xl font-bold ${totalReturn >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {totalReturn.toFixed(1)}%
            </div>
            <div className="text-sm text-tech-gray-400">Total Return</div>
          </div>
        </div>
      </div>

      {/* Price Chart with Decisions */}
      <div className="bg-tech-gray-900 border border-tech-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Price Chart & Trading Decisions</h3>
        
        <div className="relative h-80 bg-tech-gray-950 rounded-lg p-4 mb-4">
          <svg className="w-full h-full" viewBox="0 0 800 300">
            {/* Grid lines */}
            {[...Array(6)].map((_, i) => (
              <line key={i} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="#374151" strokeWidth="0.5" opacity="0.5" />
            ))}
            
            {/* Price line */}
            <polyline
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
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
                    r="8"
                    fill={step.decision === 'BUY' ? '#10b981' : '#ef4444'}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    className="text-sm fill-white font-bold"
                  >
                    {step.decision}
                  </text>
                  <text
                    x={x}
                    y={y + 25}
                    textAnchor="middle"
                    className="text-xs fill-tech-gray-300"
                  >
                    ${step.price}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-accent-green rounded-full border-2 border-black"></div>
            <span className="text-tech-gray-400 font-medium">BUY Signal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-accent-red rounded-full border-2 border-black"></div>
            <span className="text-tech-gray-400 font-medium">SELL Signal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-1 bg-white"></div>
            <span className="text-tech-gray-400 font-medium">Stock Price</span>
          </div>
        </div>
      </div>

      {/* Decision Log */}
      <div className="bg-tech-gray-900 border border-tech-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Algorithm Decision Log</h3>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {algorithmState.steps.slice().reverse().slice(0, 10).map((step, index) => (
            <div key={step.step} className="flex items-start justify-between p-4 bg-tech-gray-950 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
                  step.decision === 'BUY' ? 'bg-accent-green/20 text-accent-green border border-accent-green/30' : 
                  step.decision === 'SELL' ? 'bg-accent-red/20 text-accent-red border border-accent-red/30' : 
                  'bg-tech-gray-700/20 text-tech-gray-400 border border-tech-gray-600/30'
                }`}>
                  {step.decision}
                </div>
                <div>
                  <div className="font-semibold text-white">Step {step.step} • ${step.price}</div>
                  <div className="text-sm text-tech-gray-400">
                    Position: {step.position} shares • Cash: ${step.cash.toFixed(0)}
                  </div>
                </div>
              </div>
              
              <div className="text-right max-w-md">
                <div className="text-sm text-tech-gray-300 mb-1">{step.reasoning}</div>
                {step.profit !== 0 && (
                  <div className={`text-sm font-bold ${step.profit > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    P&L: {step.profit > 0 ? '+' : ''}${step.profit.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {algorithmState.steps.length === 0 && (
            <div className="text-center text-tech-gray-400 py-12">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No decisions made yet</p>
              <p className="text-sm">Click "Start Algorithm" to begin the simulation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualization;