import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { stockApi, ChartData, StockData } from '../services/stockApi';

interface StockChartProps {
  terminalMode: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ terminalMode }) => {
  const [timeframe, setTimeframe] = useState('1D');
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currentData, setCurrentData] = useState<StockData | null>(null);
  
  const timeframes = ['1D', '1W', '1M', '1Y', 'Max'];
  const stocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];

  useEffect(() => {
    // Load chart data
    const data = stockApi.generateChartData(selectedStock, timeframe);
    setChartData(data);

    // Subscribe to real-time updates
    const unsubscribe = stockApi.subscribe(selectedStock, (data) => {
      setCurrentData(data);
    });

    return unsubscribe;
  }, [selectedStock, timeframe]);

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
  };

  const handleStockChange = (stock: string) => {
    setSelectedStock(stock);
  };

  if (terminalMode) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-green-400 font-mono">STOCK_CHART_TERMINAL</h2>
          <div className="text-green-400 text-sm font-mono">$ ./run_analysis.sh</div>
        </div>
        
        <div className="font-mono text-sm text-green-400 space-y-1">
          <div>{">"} Initializing market data stream...</div>
          <div>{">"} Connected to NYSE/NASDAQ feed</div>
          <div>{">"} Symbol: {selectedStock} | Price: ${currentData?.price || '---'} | Volume: {currentData?.volume ? (currentData.volume / 1000000).toFixed(1) + 'M' : '---'}</div>
          <div>{">"} Trend: {currentData?.changePercent && currentData.changePercent > 0 ? 'BULLISH' : 'BEARISH'} ({currentData?.changePercent ? (currentData.changePercent > 0 ? '+' : '') + currentData.changePercent.toFixed(2) + '%' : '---'})</div>
          <div>{">"} Support: ${currentData?.low || '---'} | Resistance: ${currentData?.high || '---'}</div>
          <div className="text-yellow-400">{">"} Algorithm ready for deployment...</div>
        </div>
        
        <div className="mt-4 grid grid-cols-6 gap-2 text-xs font-mono">
          {chartData.slice(-6).map((point, index) => (
            <div key={index} className="text-center">
              <div className="text-gray-400">{point.time}</div>
              <div className="text-green-400">${point.price}</div>
              <div className="text-blue-400">{(point.volume / 1000).toFixed(0)}K</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900">Stock Price Analysis</h2>
          <div className="flex items-center space-x-2 text-sm">
            {currentData?.changePercent && currentData.changePercent > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`font-semibold ${currentData?.changePercent && currentData.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currentData?.changePercent ? (currentData.changePercent > 0 ? '+' : '') + currentData.changePercent.toFixed(2) + '%' : '---'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeframe === tf
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Selector */}
      <div className="flex items-center space-x-2 mb-4">
        {stocks.map((stock) => (
          <button
            key={stock}
            onClick={() => handleStockChange(stock)}
            className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
              selectedStock === stock
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            {stock}
          </button>
        ))}
      </div>
      
      {/* Chart Area */}
      <div className="relative h-64 bg-gray-50 rounded-lg p-4 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                color: '#111827',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: '#2563eb' }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Overlay Info */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">${currentData?.price || '---'}</div>
          <div className="text-sm text-gray-500">{selectedStock}</div>
        </div>
      </div>
      
      {/* Chart Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">${currentData?.price || '---'}</div>
          <div className="text-sm text-gray-500">Current Price</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${currentData?.change && currentData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currentData?.change ? (currentData.change >= 0 ? '+' : '') + '$' + Math.abs(currentData.change).toFixed(2) : '---'}
          </div>
          <div className="text-sm text-gray-500">Today's Change</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {currentData?.volume ? (currentData.volume / 1000000).toFixed(1) + 'M' : '---'}
          </div>
          <div className="text-sm text-gray-500">Volume</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">${currentData?.high || '---'}</div>
          <div className="text-sm text-gray-500">Day High</div>
        </div>
      </div>
    </div>
  );
};

export default StockChart;