import React, { useState, useEffect } from 'react';
import { stockApi, StockData } from '../services/stockApi';
import { useTheme } from '../contexts/ThemeContext';

const TickerTape = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const { theme } = useTheme();
  
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];

  useEffect(() => {
    // Initial load
    setStocks(stockApi.getMultipleStocks(symbols));

    // Update every 5 seconds
    const interval = setInterval(() => {
      setStocks(stockApi.getMultipleStocks(symbols));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const themeClasses = {
    light: {
      symbol: 'text-black',
      price: 'text-gray-800',
      positive: 'text-green-600',
      negative: 'text-red-600'
    },
    zk: {
      symbol: 'text-zk-eggshell',
      price: 'text-zk-eggshell/80',
      positive: 'text-zk-leather',
      negative: 'text-zk-coral'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className="absolute top-24 left-0 right-0 overflow-hidden opacity-30 z-0">
      <div className="flex animate-scroll whitespace-nowrap">
        {[...stocks, ...stocks, ...stocks].map((stock, index) => (
          <div key={index} className="flex items-center mx-8 text-lg font-space">
            <span className={`font-bold ${currentTheme.symbol} uppercase`}>{stock.symbol}</span>
            <span className={`mx-2 ${currentTheme.price}`}>${stock.price}</span>
            <span className={stock.changePercent >= 0 ? currentTheme.positive : currentTheme.negative}>
              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerTape;