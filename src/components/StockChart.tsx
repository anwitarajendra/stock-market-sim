import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { stockApi, ChartData, StockData } from '../services/stockApi';

interface StockChartProps {
  terminalMode: boolean;
}

interface CandlestickData extends ChartData {
  open: number;
  high: number;
  low: number;
  close: number;
}

const StockChart: React.FC<StockChartProps> = ({ terminalMode }) => {
  const [timeframe, setTimeframe] = useState('1D');
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [currentData, setCurrentData] = useState<StockData | null>(null);
  
  const timeframes = ['1D', '1W', '1M', '1Y', 'Max'];
  const stocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];

  // Generate candlestick data
  const generateCandlestickData = (symbol: string, timeframe: string): CandlestickData[] => {
    const dataPoints = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : 30;
    const data: CandlestickData[] = [];
    let currentPrice = 173.50; // Base price for AAPL
    
    for (let i = dataPoints; i >= 0; i--) {
      const volatility = 0.02;
      const open = currentPrice;
      const change = (Math.random() - 0.5) * volatility * currentPrice;
      const close = Math.max(open + change, 0.01);
      
      // Generate high and low based on open and close
      const high = Math.max(open, close) + Math.random() * 0.01 * currentPrice;
      const low = Math.min(open, close) - Math.random() * 0.01 * currentPrice;
      
      const time = timeframe === '1D' 
        ? `${String(9 + Math.floor(i * 7 / dataPoints)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
        : timeframe === '1W'
        ? new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()
        : new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString();
      
      data.push({
        time,
        price: Number(close.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 500000,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
      });
      
      currentPrice = close;
    }
    
    return data.reverse();
  };

  useEffect(() => {
    // Load candlestick data
    const data = generateCandlestickData(selectedStock, timeframe);
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
              <div className="text-green-400">${point.close}</div>
              <div className="text-blue-400">{(point.volume / 1000).toFixed(0)}K</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const padding = 40;
  const candleWidth = 8;

  // Find price range
  const allPrices = chartData.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...allPrices) * 0.99;
  const maxPrice = Math.max(...allPrices) * 1.01;
  const priceRange = maxPrice - minPrice;

  // Scale functions
  const scaleX = (index: number) => padding + (index * (chartWidth - 2 * padding)) / Math.max(chartData.length - 1, 1);
  const scaleY = (price: number) => chartHeight - padding - ((price - minPrice) / priceRange) * (chartHeight - 2 * padding);

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
      
      {/* Candlestick Chart */}
      <div className="relative h-80 bg-gray-50 rounded-lg p-4 mb-4">
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
          {/* Grid lines */}
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * (chartHeight - 2 * padding)) / 5}
              x2={chartWidth - padding}
              y2={padding + (i * (chartHeight - 2 * padding)) / 5}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Candlesticks */}
          {chartData.map((candle, index) => {
            const x = scaleX(index);
            const openY = scaleY(candle.open);
            const closeY = scaleY(candle.close);
            const highY = scaleY(candle.high);
            const lowY = scaleY(candle.low);
            
            const isGreen = candle.close > candle.open;
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY);
            const color = isGreen ? '#10b981' : '#ef4444';
            
            return (
              <g key={index}>
                {/* High-Low line (wick) */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1"
                />
                {/* Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={Math.max(bodyHeight, 1)}
                  fill={isGreen ? color : color}
                  stroke={color}
                  strokeWidth="1"
                />
              </g>
            );
          })}
          
          {/* Price labels */}
          {[...Array(6)].map((_, i) => {
            const price = minPrice + (i * priceRange) / 5;
            const y = padding + (i * (chartHeight - 2 * padding)) / 5;
            return (
              <text
                key={i}
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                ${price.toFixed(0)}
              </text>
            );
          })}
        </svg>
        
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