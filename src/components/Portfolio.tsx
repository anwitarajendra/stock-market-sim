import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, DollarSign, Shield, Download } from 'lucide-react';
import { PDFGenerator, PortfolioData } from '../services/pdfGenerator';
import { stockApi, StockData } from '../services/stockApi';

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    totalInvested: 15000,
    currentValue: 17847.50,
    totalReturn: 2847.50,
    returnPercentage: 18.98,
    holdings: [
      { symbol: 'AAPL', allocation: 25, value: 4461.88, change: 2.1 },
      { symbol: 'GOOGL', allocation: 20, value: 3569.50, change: -0.8 },
      { symbol: 'TSLA', allocation: 18, value: 3212.55, change: 3.2 },
      { symbol: 'MSFT', allocation: 15, value: 2677.13, change: 1.5 },
      { symbol: 'NVDA', allocation: 12, value: 2141.70, change: 5.7 },
      { symbol: 'AMZN', allocation: 10, value: 1784.75, change: -1.1 }
    ],
    performance: {
      totalTrades: 47,
      winRate: 74.5,
      avgProfit: 156.80,
      maxDrawdown: -8.3,
      sharpeRatio: 1.42,
    }
  });

  const [realtimeData, setRealtimeData] = useState<{ [key: string]: StockData }>({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    // Subscribe to real-time updates for all holdings
    const unsubscribes = portfolioData.holdings.map(holding => 
      stockApi.subscribe(holding.symbol, (data) => {
        setRealtimeData(prev => ({
          ...prev,
          [data.symbol]: data
        }));
      })
    );

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [portfolioData.holdings]);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await PDFGenerator.generatePortfolioReport(portfolioData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 3) return 'text-accent-green';
    if (risk <= 7) return 'text-accent-yellow';
    return 'text-accent-red';
  };

  const algorithmScore = 8.7;
  const riskIndex = 6.2;

  return (
    <div className="bg-tech-gray-900 border border-tech-gray-800 rounded-xl p-6 hover:border-tech-gray-700 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Smart Portfolio</h2>
        <div className="flex items-center space-x-2">
          <PieChart className="w-6 h-6 text-white" />
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="btn-primary px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-tech-gray-950 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-accent-green" />
            <span className="text-sm text-tech-gray-400">Total Invested</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${portfolioData.totalInvested.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-tech-gray-950 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-accent-blue" />
            <span className="text-sm text-tech-gray-400">Current Value</span>
          </div>
          <div className="text-2xl font-bold text-accent-green">
            ${portfolioData.currentValue.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-tech-gray-950 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <PieChart className="w-5 h-5 text-accent-purple" />
            <span className="text-sm text-tech-gray-400">Algorithm Score</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {algorithmScore}/10
          </div>
        </div>
        
        <div className="bg-tech-gray-950 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-accent-yellow" />
            <span className="text-sm text-tech-gray-400">Risk Index</span>
          </div>
          <div className={`text-2xl font-bold ${getRiskColor(riskIndex)}`}>
            {riskIndex}/10
          </div>
        </div>
      </div>

      {/* Holdings List */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Holdings</h3>
        <div className="space-y-2">
          {portfolioData.holdings.map((holding, index) => {
            const liveData = realtimeData[holding.symbol];
            const currentChange = liveData?.changePercent || holding.change;
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-tech-gray-950 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-tech-gray-700 to-tech-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {holding.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{holding.symbol}</div>
                    <div className="text-sm text-tech-gray-400">{holding.allocation}% allocation</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-white">
                    ${liveData?.price ? (liveData.price * holding.allocation * 10).toLocaleString() : holding.value.toLocaleString()}
                  </div>
                  <div className={`text-sm font-semibold ${
                    currentChange >= 0 ? 'text-accent-green' : 'text-accent-red'
                  }`}>
                    {currentChange >= 0 ? '+' : ''}{currentChange.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie Chart Visualization */}
      <div className="mt-6 flex justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {portfolioData.holdings.map((holding, index) => {
              const startAngle = portfolioData.holdings.slice(0, index).reduce((acc, h) => acc + (h.allocation / 100) * 360, 0);
              const endAngle = startAngle + (holding.allocation / 100) * 360;
              const largeArcFlag = holding.allocation > 50 ? 1 : 0;
              
              const x1 = 60 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 60 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 60 + 40 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 60 + 40 * Math.sin((endAngle * Math.PI) / 180);
              
              const colors = ['#ffffff', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151'];
              
              return (
                <path
                  key={index}
                  d={`M 60,60 L ${x1},${y1} A 40,40 0 ${largeArcFlag},1 ${x2},${y2} z`}
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;