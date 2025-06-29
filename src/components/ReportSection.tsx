import React, { useRef } from 'react';
import { FileText, Download, BarChart, TrendingUp } from 'lucide-react';
import { PDFGenerator } from '../services/pdfGenerator';

const ReportSection = () => {
  const reportRef = useRef<HTMLDivElement>(null);

  const reportStats = {
    totalTrades: 47,
    winRate: 74.5,
    avgProfit: 156.80,
    maxDrawdown: -8.3,
    sharpeRatio: 1.42,
    sortino: 1.68
  };

  const handleGeneratePDF = async () => {
    const portfolioData = {
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
        totalTrades: reportStats.totalTrades,
        winRate: reportStats.winRate,
        avgProfit: reportStats.avgProfit,
        maxDrawdown: reportStats.maxDrawdown,
        sharpeRatio: reportStats.sharpeRatio,
      }
    };

    await PDFGenerator.generatePortfolioReport(portfolioData);
  };

  const handleDownloadTradeSummary = async () => {
    if (reportRef.current) {
      await PDFGenerator.generateTradeReport(reportRef.current);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Performance Reports</h2>
        <p className="text-tech-gray-400">Comprehensive analysis and exportable trading reports</p>
      </div>

      {/* Report Generation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-tech-gray-900 border border-tech-gray-800 rounded-xl p-6 hover:border-tech-gray-700 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-white" />
            <h3 className="text-xl font-bold text-white">PDF Report</h3>
          </div>
          <p className="text-tech-gray-400 mb-4">
            Comprehensive trading report with charts, statistics, and algorithm performance analysis.
          </p>
          <button 
            onClick={handleGeneratePDF}
            className="w-full btn-primary px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Generate PDF Report
          </button>
        </div>

        <div className="bg-tech-gray-900 border border-tech-gray-800 rounded-xl p-6 hover:border-tech-gray-700 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <Download className="w-8 h-8 text-white" />
            <h3 className="text-xl font-bold text-white">Trade Summary</h3>
          </div>
          <p className="text-tech-gray-400 mb-4">
            Detailed CSV export of all trades with timestamps, entry/exit points, and P&L data.
          </p>
          <button 
            onClick={handleDownloadTradeSummary}
            className="w-full btn-primary px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Download Trade Summary
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div ref={reportRef} className="bg-tech-gray-900 border border-tech-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Report Preview</h3>
          <BarChart className="w-6 h-6 text-white" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-tech-gray-950 rounded-lg">
            <TrendingUp className="w-6 h-6 text-accent-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{reportStats.totalTrades}</div>
            <div className="text-sm text-tech-gray-400">Total Trades</div>
          </div>
          
          <div className="text-center p-4 bg-tech-gray-950 rounded-lg">
            <div className="text-2xl font-bold text-accent-green">{reportStats.winRate}%</div>
            <div className="text-sm text-tech-gray-400">Win Rate</div>
          </div>
          
          <div className="text-center p-4 bg-tech-gray-950 rounded-lg">
            <div className="text-2xl font-bold text-white">${reportStats.avgProfit}</div>
            <div className="text-sm text-tech-gray-400">Avg Profit</div>
          </div>
          
          <div className="text-center p-4 bg-tech-gray-950 rounded-lg">
            <div className="text-2xl font-bold text-accent-red">{reportStats.maxDrawdown}%</div>
            <div className="text-sm text-tech-gray-400">Max Drawdown</div>
          </div>
          
          <div className="text-center p-4 bg-tech-gray-950 rounded-lg">
            <div className="text-2xl font-bold text-white">{reportStats.sharpeRatio}</div>
            <div className="text-sm text-tech-gray-400">Sharpe Ratio</div>
          </div>
          
          <div className="text-center p-4 bg-tech-gray-950 rounded-lg">
            <div className="text-2xl font-bold text-white">{reportStats.sortino}</div>
            <div className="text-sm text-tech-gray-400">Sortino Ratio</div>
          </div>
        </div>

        {/* Algorithm Comparison Chart Preview */}
        <div className="bg-tech-gray-950 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-white mb-3">Algorithm Performance Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Greedy', 'K Transaction DP', 'Cooldown', 'Pattern Matcher', 'Portfolio Knapsack'].map((algo, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-tech-gray-400 mb-2">{algo}</div>
                <div className="w-full bg-tech-gray-700 rounded-full h-2 mb-1">
                  <div 
                    className="h-2 rounded-full bg-white transition-all duration-500"
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                  ></div>
                </div>
                <div className="text-xs text-tech-gray-400">{(Math.random() * 20 + 75).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSection;