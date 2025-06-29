import React, { useState } from 'react';
import { Brain, Zap, Target, TrendingUp, Layers, Play } from 'lucide-react';

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

const StrategySelector = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('greedy');
  const [isRunning, setIsRunning] = useState(false);
  
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
      icon: Layers,
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

  const handleRunStrategy = () => {
    setIsRunning(true);
    // Simulate strategy execution
    setTimeout(() => {
      setIsRunning(false);
      alert(`${strategies.find(s => s.id === selectedStrategy)?.name} executed successfully!`);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Trading Strategy</h2>
        <p className="text-tech-gray-400">Select an algorithm that matches your trading style and risk tolerance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      
      <div className="flex justify-center mt-8">
        <button 
          onClick={handleRunStrategy}
          disabled={isRunning}
          className="btn-primary px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-tech-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <Play className="w-5 h-5" />
          <span>{isRunning ? 'Running Strategy...' : 'Run Selected Strategy'}</span>
        </button>
      </div>
    </div>
  );
};

export default StrategySelector;