import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Database, 
  Cpu, 
  Activity, 
  Zap, 
  Brain, 
  Target, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Server,
  Globe,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface APICall {
  id: number;
  endpoint: string;
  method: string;
  status: 'pending' | 'success' | 'error';
  responseTime: number;
  data: any;
  timestamp: string;
}

interface TradeExecution {
  id: number;
  algorithm: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  reasoning: string;
  executionTime: number;
  status: 'executed' | 'pending' | 'failed';
  timestamp: string;
}

interface AlgorithmDecision {
  id: number;
  algorithm: string;
  step: string;
  input: any;
  processing: string;
  output: any;
  complexity: string;
  executionTime: number;
  timestamp: string;
}

const SystemInternals = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [apiCalls, setApiCalls] = useState<APICall[]>([]);
  const [tradeExecutions, setTradeExecutions] = useState<TradeExecution[]>([]);
  const [algorithmDecisions, setAlgorithmDecisions] = useState<AlgorithmDecision[]>([]);
  const [selectedTab, setSelectedTab] = useState('api');
  const [systemStats, setSystemStats] = useState({
    totalAPICalls: 0,
    totalTrades: 0,
    totalDecisions: 0,
    avgResponseTime: 0,
    successRate: 100,
    algorithmsRunning: 0
  });

  // Simulate API calls
  useEffect(() => {
    if (!isRunning) return;

    const apiInterval = setInterval(() => {
      const endpoints = [
        '/api/stocks/AAPL/price',
        '/api/stocks/GOOGL/price',
        '/api/stocks/MSFT/price',
        '/api/market/volume',
        '/api/indicators/rsi',
        '/api/indicators/macd'
      ];
      
      const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const responseTime = Math.floor(Math.random() * 200) + 50;
      const status = Math.random() > 0.05 ? 'success' : 'error';
      
      const newAPICall: APICall = {
        id: Date.now() + Math.random(),
        endpoint: randomEndpoint,
        method: 'GET',
        status: 'pending',
        responseTime: 0,
        data: null,
        timestamp: new Date().toLocaleTimeString()
      };

      setApiCalls(prev => [newAPICall, ...prev.slice(0, 19)]);

      // Simulate response after delay
      setTimeout(() => {
        setApiCalls(prev => prev.map(call => 
          call.id === newAPICall.id 
            ? {
                ...call,
                status: status as 'success' | 'error',
                responseTime,
                data: status === 'success' ? {
                  price: (Math.random() * 500 + 100).toFixed(2),
                  volume: Math.floor(Math.random() * 1000000),
                  change: (Math.random() * 10 - 5).toFixed(2)
                } : { error: 'Network timeout' }
              }
            : call
        ));
      }, responseTime);

    }, 2000);

    return () => clearInterval(apiInterval);
  }, [isRunning]);

  // Simulate algorithm decisions
  useEffect(() => {
    if (!isRunning) return;

    const decisionInterval = setInterval(() => {
      const algorithms = ['Greedy', 'Dynamic Programming', 'Knapsack'];
      const randomAlgo = algorithms[Math.floor(Math.random() * algorithms.length)];
      
      let decision: AlgorithmDecision;
      
      switch (randomAlgo) {
        case 'Greedy':
          decision = {
            id: Date.now() + Math.random(),
            algorithm: 'Greedy Strategy',
            step: 'Price Analysis',
            input: { currentPrice: 173.50, nextPrice: 175.20 },
            processing: 'if (nextPrice > currentPrice * 1.015) { return BUY; }',
            output: { decision: 'BUY', confidence: 0.87 },
            complexity: 'O(1)',
            executionTime: Math.floor(Math.random() * 5) + 1,
            timestamp: new Date().toLocaleTimeString()
          };
          break;
          
        case 'Dynamic Programming':
          decision = {
            id: Date.now() + Math.random(),
            algorithm: 'Dynamic Programming',
            step: 'Optimal Substructure',
            input: { prices: [170, 173, 175, 172], k: 2 },
            processing: 'dp[i][j] = max(dp[i-1][j], prices[i] - minPrice)',
            output: { maxProfit: 5.20, transactions: 1 },
            complexity: 'O(kn)',
            executionTime: Math.floor(Math.random() * 15) + 5,
            timestamp: new Date().toLocaleTimeString()
          };
          break;
          
        case 'Knapsack':
          decision = {
            id: Date.now() + Math.random(),
            algorithm: 'Portfolio Knapsack',
            step: 'Weight-Value Optimization',
            input: { capacity: 10, items: 6 },
            processing: 'dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])',
            output: { selectedStocks: ['AAPL', 'GOOGL'], totalValue: 18 },
            complexity: 'O(nW)',
            executionTime: Math.floor(Math.random() * 25) + 10,
            timestamp: new Date().toLocaleTimeString()
          };
          break;
          
        default:
          return;
      }
      
      setAlgorithmDecisions(prev => [decision, ...prev.slice(0, 19)]);
      
    }, 4000);

    return () => clearInterval(decisionInterval);
  }, [isRunning]);

  // Simulate trade executions
  useEffect(() => {
    if (!isRunning) return;

    const tradeInterval = setInterval(() => {
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];
      const algorithms = ['Greedy', 'DP', 'Knapsack'];
      const actions = ['BUY', 'SELL'] as const;
      
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const randomAlgo = algorithms[Math.floor(Math.random() * algorithms.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      const newTrade: TradeExecution = {
        id: Date.now() + Math.random(),
        algorithm: randomAlgo,
        symbol: randomSymbol,
        action: randomAction,
        price: Number((Math.random() * 500 + 100).toFixed(2)),
        quantity: Math.floor(Math.random() * 100) + 10,
        reasoning: `${randomAlgo} algorithm detected ${randomAction === 'BUY' ? 'bullish' : 'bearish'} signal`,
        executionTime: Math.floor(Math.random() * 100) + 50,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString()
      };

      setTradeExecutions(prev => [newTrade, ...prev.slice(0, 19)]);

      // Simulate execution completion
      setTimeout(() => {
        setTradeExecutions(prev => prev.map(trade => 
          trade.id === newTrade.id 
            ? { ...trade, status: Math.random() > 0.05 ? 'executed' : 'failed' as 'executed' | 'failed' }
            : trade
        ));
      }, newTrade.executionTime);

    }, 6000);

    return () => clearInterval(tradeInterval);
  }, [isRunning]);

  // Update system stats
  useEffect(() => {
    setSystemStats({
      totalAPICalls: apiCalls.length,
      totalTrades: tradeExecutions.length,
      totalDecisions: algorithmDecisions.length,
      avgResponseTime: apiCalls.length > 0 
        ? apiCalls.reduce((sum, call) => sum + call.responseTime, 0) / apiCalls.length 
        : 0,
      successRate: apiCalls.length > 0 
        ? (apiCalls.filter(call => call.status === 'success').length / apiCalls.length) * 100 
        : 100,
      algorithmsRunning: isRunning ? 3 : 0
    });
  }, [apiCalls, tradeExecutions, algorithmDecisions, isRunning]);

  const startSystem = () => setIsRunning(true);
  const pauseSystem = () => setIsRunning(false);
  const resetSystem = () => {
    setIsRunning(false);
    setApiCalls([]);
    setTradeExecutions([]);
    setAlgorithmDecisions([]);
  };

  const tabs = [
    { id: 'api', label: 'API Calls', icon: Globe, count: apiCalls.length },
    { id: 'algorithms', label: 'Algorithm Decisions', icon: Brain, count: algorithmDecisions.length },
    { id: 'trades', label: 'Trade Executions', icon: TrendingUp, count: tradeExecutions.length }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">System Internals Dashboard</h1>
        <p className="text-gray-400 text-lg">Real-time monitoring of API calls, algorithm decisions, and trade executions</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">API Calls</span>
          </div>
          <div className="text-2xl font-bold text-white">{systemStats.totalAPICalls}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Decisions</span>
          </div>
          <div className="text-2xl font-bold text-white">{systemStats.totalDecisions}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Trades</span>
          </div>
          <div className="text-2xl font-bold text-white">{systemStats.totalTrades}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Avg Response</span>
          </div>
          <div className="text-2xl font-bold text-white">{systemStats.avgResponseTime.toFixed(0)}ms</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">{systemStats.successRate.toFixed(1)}%</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Cpu className="w-5 h-5 text-red-400" />
            <span className="text-sm text-gray-400">Algorithms</span>
          </div>
          <div className="text-2xl font-bold text-white">{systemStats.algorithmsRunning}</div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">System Control</h2>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isRunning ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{isRunning ? 'System Running' : 'System Stopped'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!isRunning ? (
              <button
                onClick={startSystem}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Start System</span>
              </button>
            ) : (
              <button
                onClick={pauseSystem}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Pause className="w-4 h-4" />
                <span>Pause System</span>
              </button>
            )}
            <button
              onClick={resetSystem}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                selectedTab === tab.id ? 'bg-blue-700' : 'bg-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        {/* API Calls Tab */}
        {selectedTab === 'api' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Live API Calls</h3>
              <div className="text-sm text-gray-400">Real-time market data fetching</div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {apiCalls.map((call) => (
                <div key={call.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        call.status === 'success' ? 'bg-green-500/20 text-green-400' :
                        call.status === 'error' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {call.method}
                      </div>
                      <code className="text-blue-400 font-mono text-sm">{call.endpoint}</code>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-400">{call.timestamp}</span>
                      {call.status === 'success' && (
                        <span className="text-green-400 text-sm">{call.responseTime}ms</span>
                      )}
                      {call.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : call.status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                  </div>
                  
                  {call.data && (
                    <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-600">
                      <div className="text-xs text-gray-400 mb-1">Response Data:</div>
                      <code className="text-green-400 text-sm font-mono">
                        {JSON.stringify(call.data, null, 2)}
                      </code>
                    </div>
                  )}
                </div>
              ))}

              {apiCalls.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No API calls yet</p>
                  <p className="text-sm">Start the system to see live API activity</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Algorithm Decisions Tab */}
        {selectedTab === 'algorithms' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Algorithm Decision Engine</h3>
              <div className="text-sm text-gray-400">Real-time algorithmic processing</div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {algorithmDecisions.map((decision) => (
                <div key={decision.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <span className="font-semibold text-white">{decision.algorithm}</span>
                      <span className="text-sm text-gray-400">• {decision.step}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                        {decision.complexity}
                      </span>
                      <span className="text-sm text-gray-400">{decision.executionTime}ms</span>
                      <span className="text-sm text-gray-400">{decision.timestamp}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800 rounded p-3">
                      <div className="text-xs text-gray-400 mb-2">INPUT</div>
                      <code className="text-blue-400 text-sm font-mono">
                        {JSON.stringify(decision.input, null, 1)}
                      </code>
                    </div>

                    <div className="bg-gray-800 rounded p-3">
                      <div className="text-xs text-gray-400 mb-2">PROCESSING</div>
                      <code className="text-yellow-400 text-sm font-mono">
                        {decision.processing}
                      </code>
                    </div>

                    <div className="bg-gray-800 rounded p-3">
                      <div className="text-xs text-gray-400 mb-2">OUTPUT</div>
                      <code className="text-green-400 text-sm font-mono">
                        {JSON.stringify(decision.output, null, 1)}
                      </code>
                    </div>
                  </div>
                </div>
              ))}

              {algorithmDecisions.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No algorithm decisions yet</p>
                  <p className="text-sm">Start the system to see live algorithm processing</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trade Executions Tab */}
        {selectedTab === 'trades' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Trade Execution Engine</h3>
              <div className="text-sm text-gray-400">Live trade processing and execution</div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tradeExecutions.map((trade) => (
                <div key={trade.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        trade.action === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.action}
                      </div>
                      <span className="font-semibold text-white">{trade.symbol}</span>
                      <span className="text-gray-400">{trade.quantity} shares @ ${trade.price}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-400">{trade.timestamp}</span>
                      <span className="text-sm text-gray-400">{trade.executionTime}ms</span>
                      {trade.status === 'executed' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : trade.status === 'failed' ? (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Algorithm:</span>
                      <span className="text-sm text-blue-400">{trade.algorithm}</span>
                    </div>
                    <div className="text-sm text-gray-300">{trade.reasoning}</div>
                  </div>

                  <div className="mt-2 text-sm text-gray-400">
                    Total Value: <span className="text-white font-semibold">${(trade.price * trade.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}

              {tradeExecutions.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No trade executions yet</p>
                  <p className="text-sm">Start the system to see live trading activity</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemInternals;