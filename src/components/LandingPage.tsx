import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Zap, Brain, Github, Linkedin, Phone, ArrowRight, BarChart3, Palette } from 'lucide-react';
import TickerTape from './TickerTape';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleGithubClick = () => {
    window.open('https://github.com/VEDANK1211', '_blank');
  };

  const handleLinkedinClick = () => {
    window.open('https://linkedin.com/in/vedank-chaturvedi', '_blank');
  };

  const handlePhoneClick = () => {
    window.open('tel:+919558865430', '_blank');
  };

  const handleAboutClick = () => {
    alert('Made by:\n1. VEDANK CHATURVEDI\n2. NITESH GUPTA\n3. KYNA PRADEEP\n4. ANWITA R RAO');
  };

  const handlePrivacyClick = () => {
    const privacyContent = `
PRIVACY POLICY - AlgoTradeSim

Last updated: ${new Date().toLocaleDateString()}

1. INFORMATION WE COLLECT
We collect information you provide directly to us, such as when you create an account, use our trading simulation features, or contact us for support.

2. HOW WE USE YOUR INFORMATION
- To provide and maintain our trading simulation services
- To analyze market data and improve algorithm performance
- To send you technical notices and support messages
- To respond to your comments and questions

3. INFORMATION SHARING
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

4. DATA SECURITY
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

5. TRADING SIMULATION DATA
All trading activities on AlgoTradeSim are simulated and do not involve real money or actual stock transactions. Your simulation data is used solely for educational and analytical purposes.

6. COOKIES AND TRACKING
We use cookies and similar technologies to enhance your experience and analyze usage patterns.

7. CONTACT US
If you have questions about this Privacy Policy, please contact us at +91 95588 65430.

This is a student project for educational purposes only.
    `;
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Privacy Policy - AlgoTradeSim</title>
            <style>
              body { font-family: 'Space Grotesk', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
              h1 { color: #333; }
              pre { white-space: pre-wrap; font-family: 'Space Grotesk', sans-serif; }
            </style>
          </head>
          <body>
            <pre>${privacyContent}</pre>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const handleContactClick = () => {
    alert('Contact Information:\n\nPhone: +91 95588 65430\nEmail: vedank.chaturvedi@example.com\nGitHub: VEDANK1211');
  };

  // Generate professional candlestick chart data
  const generateCandlestickData = () => {
    const data = [];
    let basePrice = 17600;
    
    for (let i = 0; i < 120; i++) {
      const volatility = 0.015;
      const trend = Math.sin(i * 0.1) * 0.005;
      
      const open = basePrice;
      const change = (Math.random() - 0.5) * volatility * basePrice + trend * basePrice;
      const close = Math.max(open + change, 100);
      
      const high = Math.max(open, close) + Math.random() * 0.01 * basePrice;
      const low = Math.min(open, close) - Math.random() * 0.01 * basePrice;
      
      data.push({
        x: i * 6,
        open,
        high,
        low,
        close,
        isGreen: close > open
      });
      
      basePrice = close;
    }
    return data;
  };

  const candlestickData = generateCandlestickData();
  const minPrice = Math.min(...candlestickData.map(d => d.low));
  const maxPrice = Math.max(...candlestickData.map(d => d.high));
  const priceRange = maxPrice - minPrice;

  const themeClasses = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      cardBg: 'bg-white/80',
      border: 'border-gray-200',
      gradient: 'from-gray-50 via-white to-gray-100'
    },
    zk: {
      bg: 'bg-zk-navy',
      text: 'text-zk-eggshell',
      cardBg: 'bg-zk-charcoal/80',
      border: 'border-zk-leather',
      gradient: 'from-zk-navy via-zk-charcoal to-zk-navy'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className={`min-h-screen relative overflow-hidden ${currentTheme.bg} font-space`}>
      {/* Professional Candlestick Chart Background */}
      <div className="absolute inset-0 opacity-8">
        <svg className="w-full h-full" viewBox="0 0 720 600" preserveAspectRatio="none">
          {/* Grid lines */}
          {[...Array(12)].map((_, i) => (
            <line key={i} x1="0" y1={i * 50} x2="720" y2={i * 50} stroke={theme === 'zk' ? '#2A2A2A' : '#f3f4f6'} strokeWidth="1" />
          ))}
          {[...Array(25)].map((_, i) => (
            <line key={i} x1={i * 30} y1="0" x2={i * 30} y2="600" stroke={theme === 'zk' ? '#2A2A2A' : '#f3f4f6'} strokeWidth="1" />
          ))}
          
          {/* Candlesticks */}
          {candlestickData.map((candle, i) => {
            const x = candle.x;
            const openY = 600 - ((candle.open - minPrice) / priceRange) * 500 - 50;
            const closeY = 600 - ((candle.close - minPrice) / priceRange) * 500 - 50;
            const highY = 600 - ((candle.high - minPrice) / priceRange) * 500 - 50;
            const lowY = 600 - ((candle.low - minPrice) / priceRange) * 500 - 50;
            
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY);
            const color = candle.isGreen ? (theme === 'zk' ? '#AB987A' : '#10b981') : (theme === 'zk' ? '#FF533D' : '#ef4444');
            
            return (
              <g key={i}>
                {/* High-Low line */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1"
                  opacity="0.6"
                />
                {/* Body */}
                <rect
                  x={x - 2}
                  y={bodyTop}
                  width="4"
                  height={Math.max(bodyHeight, 1)}
                  fill={candle.isGreen ? color : color}
                  opacity="0.7"
                />
              </g>
            );
          })}
          
          {/* Price levels */}
          <line x1="0" y1="150" x2="720" y2="150" stroke={theme === 'zk' ? '#FF533D' : '#ef4444'} strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
          <line x1="0" y1="450" x2="720" y2="450" stroke={theme === 'zk' ? '#AB987A' : '#10b981'} strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
          
          {/* Volume bars at bottom */}
          {candlestickData.filter((_, i) => i % 3 === 0).map((candle, i) => (
            <rect
              key={i}
              x={candle.x - 1}
              y={570}
              width="2"
              height={Math.random() * 25 + 5}
              fill={theme === 'zk' ? '#AB987A' : '#6b7280'}
              opacity="0.2"
            />
          ))}
        </svg>
      </div>
      
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient}`}>
        <div className={`absolute inset-0 ${theme === 'zk' ? 'bg-gradient-to-r from-zk-navy/30 via-zk-charcoal/20 to-zk-navy/30' : 'bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-blue-50/30'}`}></div>
      </div>
      
      {/* Ticker Tape Background */}
      <TickerTape />
      
      {/* Header */}
      <header className="relative z-20 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <BarChart3 className={`w-8 h-8 ${theme === 'zk' ? 'text-zk-coral' : 'text-blue-600'}`} />
            <div className={`absolute -top-1 -right-1 w-3 h-3 ${theme === 'zk' ? 'bg-zk-leather' : 'bg-green-500'} rounded-full animate-pulse`}></div>
          </div>
          <span className={`text-2xl font-bold ${currentTheme.text} tracking-tight font-space`}>
            AlgoTradeSim
          </span>
        </div>
        <nav className="hidden md:flex space-x-8 items-center">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-200 ${theme === 'zk' ? 'bg-zk-leather/20 text-zk-eggshell hover:bg-zk-leather/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title="Toggle Theme"
          >
            <Palette className="w-5 h-5" />
          </button>
          <button onClick={handleAboutClick} className={`${theme === 'zk' ? 'text-zk-eggshell hover:text-zk-coral' : 'text-gray-600 hover:text-gray-900'} transition-colors font-medium`}>About</button>
          <a href="#strategies" className={`${theme === 'zk' ? 'text-zk-eggshell hover:text-zk-coral' : 'text-gray-600 hover:text-gray-900'} transition-colors font-medium`}>Strategies</a>
          <button onClick={handleContactClick} className={`${theme === 'zk' ? 'text-zk-eggshell hover:text-zk-coral' : 'text-gray-600 hover:text-gray-900'} transition-colors font-medium`}>Contact</button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
            <span className={`font-space ${theme === 'zk' ? 'bg-gradient-to-r from-zk-coral via-zk-leather to-zk-coral' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800'} bg-clip-text text-transparent uppercase`}>
              ALGO-TRADE-SIM
            </span>
          </h1>
          
          <div className={`text-2xl md:text-4xl ${theme === 'zk' ? 'text-zk-eggshell' : 'text-gray-700'} mb-4 font-light tracking-wide`}>
            <span className={`${theme === 'zk' ? 'text-zk-leather' : 'text-green-600'} font-semibold uppercase`}>SIMULATE</span> • 
            <span className={`${theme === 'zk' ? 'text-zk-coral' : 'text-blue-600'} font-semibold uppercase`}> ANALYZE</span> • 
            <span className={`${theme === 'zk' ? 'text-zk-leather' : 'text-purple-600'} font-semibold uppercase`}> OPTIMIZE</span>
          </div>
          
          <p className={`text-xl md:text-2xl ${theme === 'zk' ? 'text-zk-eggshell/80' : 'text-gray-600'} mb-12 max-w-4xl mx-auto font-light leading-relaxed`}>
            Advanced algorithmic trading simulation platform powered by machine learning, 
            dynamic programming, and heuristic optimization strategies
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button 
              onClick={handleGetStarted}
              className={`group relative px-10 py-4 ${theme === 'zk' ? 'bg-zk-coral hover:bg-zk-coral/90' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-3`}
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className={`flex items-center space-x-4 text-sm ${theme === 'zk' ? 'text-zk-eggshell/60' : 'text-gray-500'}`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${theme === 'zk' ? 'bg-zk-leather' : 'bg-green-500'} rounded-full animate-pulse`}></div>
                <span>Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${theme === 'zk' ? 'bg-zk-coral' : 'bg-blue-500'} rounded-full animate-pulse`}></div>
                <span>5 Algorithms</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${theme === 'zk' ? 'bg-zk-leather' : 'bg-purple-500'} rounded-full animate-pulse`}></div>
                <span>Live Simulation</span>
              </div>
            </div>
          </div>

          {/* Professional Chart Preview */}
          <div className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-2xl p-8 mb-16 shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h3 className={`text-2xl font-bold ${currentTheme.text}`}>Live Market Simulation</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${theme === 'zk' ? 'bg-zk-leather' : 'bg-green-500'} rounded-full animate-pulse`}></div>
                  <span className={`text-sm ${theme === 'zk' ? 'text-zk-eggshell/80' : 'text-gray-600'} font-medium`}>Real-time</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${currentTheme.text}`}>17,758.45</div>
                <div className={`text-sm ${theme === 'zk' ? 'text-zk-leather' : 'text-green-600'} font-semibold`}>+2.3% ↗</div>
              </div>
            </div>
            
            <div className={`relative h-64 ${theme === 'zk' ? 'bg-zk-charcoal' : 'bg-gray-50'} rounded-xl overflow-hidden`}>
              <svg className="w-full h-full" viewBox="0 0 800 250" preserveAspectRatio="xMidYMid meet">
                {/* Grid */}
                {[...Array(6)].map((_, i) => (
                  <line key={i} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke={theme === 'zk' ? '#AB987A' : '#e5e7eb'} strokeWidth="1" />
                ))}
                {[...Array(17)].map((_, i) => (
                  <line key={i} x1={i * 50} y1="0" x2={i * 50} y2="250" stroke={theme === 'zk' ? '#AB987A' : '#e5e7eb'} strokeWidth="1" />
                ))}
                
                {/* Candlesticks */}
                {candlestickData.slice(0, 80).map((candle, i) => {
                  const x = i * 10;
                  const openY = 250 - ((candle.open - minPrice) / priceRange) * 200 - 25;
                  const closeY = 250 - ((candle.close - minPrice) / priceRange) * 200 - 25;
                  const highY = 250 - ((candle.high - minPrice) / priceRange) * 200 - 25;
                  const lowY = 250 - ((candle.low - minPrice) / priceRange) * 200 - 25;
                  
                  const bodyTop = Math.min(openY, closeY);
                  const bodyHeight = Math.abs(closeY - openY);
                  const color = candle.isGreen ? (theme === 'zk' ? '#AB987A' : '#10b981') : (theme === 'zk' ? '#FF533D' : '#ef4444');
                  
                  return (
                    <g key={i}>
                      {/* High-Low line */}
                      <line
                        x1={x}
                        y1={highY}
                        x2={x}
                        y2={lowY}
                        stroke={color}
                        strokeWidth="1.5"
                      />
                      {/* Body */}
                      <rect
                        x={x - 3}
                        y={bodyTop}
                        width="6"
                        height={Math.max(bodyHeight, 2)}
                        fill={color}
                      />
                    </g>
                  );
                })}
                
                {/* Support/Resistance lines */}
                <line x1="0" y1="60" x2="800" y2="60" stroke={theme === 'zk' ? '#FF533D' : '#ef4444'} strokeWidth="2" opacity="0.5" strokeDasharray="8,4" />
                <line x1="0" y1="190" x2="800" y2="190" stroke={theme === 'zk' ? '#AB987A' : '#10b981'} strokeWidth="2" opacity="0.5" strokeDasharray="8,4" />
              </svg>
              
              {/* Chart Labels */}
              <div className={`absolute bottom-2 left-4 text-xs ${theme === 'zk' ? 'text-zk-eggshell/60' : 'text-gray-500'} font-mono`}>
                Sep 2024 - Present
              </div>
              <div className={`absolute top-2 right-4 text-xs ${theme === 'zk' ? 'text-zk-eggshell/60' : 'text-gray-500'}`}>
                <span className={`inline-block w-3 h-3 ${theme === 'zk' ? 'bg-zk-leather' : 'bg-green-500'} rounded mr-2`}></span>Bullish
                <span className={`inline-block w-3 h-3 ${theme === 'zk' ? 'bg-zk-coral' : 'bg-red-500'} rounded mr-2 ml-4`}></span>Bearish
              </div>
            </div>
            
            <div className={`flex items-center justify-center space-x-8 mt-6 text-sm ${theme === 'zk' ? 'text-zk-eggshell/80' : 'text-gray-600'}`}>
              <div className="text-center">
                <div className={`font-bold ${currentTheme.text}`}>18,400.00</div>
                <div>Day High</div>
              </div>
              <div className="text-center">
                <div className={`font-bold ${currentTheme.text}`}>17,200.00</div>
                <div>Day Low</div>
              </div>
              <div className="text-center">
                <div className={`font-bold ${currentTheme.text}`}>2.4M</div>
                <div>Volume</div>
              </div>
              <div className="text-center">
                <div className={`font-bold ${theme === 'zk' ? 'text-zk-leather' : 'text-green-600'}`}>+158.45</div>
                <div>Change</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-2xl p-8 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group card-hover`}>
            <Brain className={`w-16 h-16 ${theme === 'zk' ? 'text-zk-coral' : 'text-blue-600'} mb-6 group-hover:scale-110 transition-transform`} />
            <h3 className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>Advanced Algorithms</h3>
            <p className={`${theme === 'zk' ? 'text-zk-eggshell/80' : 'text-gray-600'} text-lg leading-relaxed`}>
              Greedy strategies, dynamic programming, pattern matching, and portfolio optimization algorithms with real-time decision making.
            </p>
          </div>
          
          <div className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-2xl p-8 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group card-hover`}>
            <TrendingUp className={`w-16 h-16 ${theme === 'zk' ? 'text-zk-leather' : 'text-green-600'} mb-6 group-hover:scale-110 transition-transform`} />
            <h3 className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>Live Market Analysis</h3>
            <p className={`${theme === 'zk' ? 'text-zk-eggshell/80' : 'text-gray-600'} text-lg leading-relaxed`}>
              Real-time market data simulation with comprehensive performance analytics, risk assessment, and profit tracking.
            </p>
          </div>
          
          <div className={`${currentTheme.cardBg} backdrop-blur-sm border ${currentTheme.border} rounded-2xl p-8 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group card-hover`}>
            <Zap className={`w-16 h-16 ${theme === 'zk' ? 'text-zk-coral' : 'text-purple-600'} mb-6 group-hover:scale-110 transition-transform`} />
            <h3 className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>High Performance</h3>
            <p className={`${theme === 'zk' ? 'text-zk-eggshell/80' : 'text-gray-600'} text-lg leading-relaxed`}>
              Optimized algorithms with O(n log n) complexity for rapid strategy backtesting and real-time execution.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 p-6 border-t ${currentTheme.border} mt-16`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-8 mb-4 md:mb-0">
            <button onClick={handleAboutClick} className={`${theme === 'zk' ? 'text-zk-eggshell/60 hover:text-zk-eggshell' : 'text-gray-500 hover:text-gray-900'} transition-colors font-medium`}>About</button>
            <button onClick={handlePrivacyClick} className={`${theme === 'zk' ? 'text-zk-eggshell/60 hover:text-zk-eggshell' : 'text-gray-500 hover:text-gray-900'} transition-colors font-medium`}>Privacy Policy</button>
            <button onClick={handleGithubClick} className={`${theme === 'zk' ? 'text-zk-eggshell/60 hover:text-zk-eggshell' : 'text-gray-500 hover:text-gray-900'} transition-colors font-medium`}>GitHub Repo</button>
            <button onClick={handleContactClick} className={`${theme === 'zk' ? 'text-zk-eggshell/60 hover:text-zk-eggshell' : 'text-gray-500 hover:text-gray-900'} transition-colors font-medium`}>Contact</button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleGithubClick}
              className={`${theme === 'zk' ? 'text-zk-eggshell/60 hover:text-zk-eggshell' : 'text-gray-500 hover:text-gray-900'} cursor-pointer transition-colors hover:scale-110 transform`}
              title="GitHub - VEDANK1211"
            >
              <Github className="w-6 h-6" />
            </button>
            <button 
              onClick={handleLinkedinClick}
              className={`${theme === 'zk' ? 'text-zk-eggshell/60 hover:text-zk-eggshell' : 'text-gray-500 hover:text-gray-900'} cursor-pointer transition-colors hover:scale-110 transform`}
              title="LinkedIn Profile"
            >
              <Linkedin className="w-6 h-6" />
            </button>
            <button 
              onClick={handlePhoneClick}
              className={`${theme === 'zk' ? 'text-zk-eggshell/60 hover:text-zk-eggshell' : 'text-gray-500 hover:text-gray-900'} cursor-pointer transition-colors hover:scale-110 transform`}
              title="Call +91 95588 65430"
            >
              <Phone className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Team Credits */}
        <div className={`max-w-6xl mx-auto mt-6 pt-6 border-t ${currentTheme.border}`}>
          <p className={`text-center text-sm ${theme === 'zk' ? 'text-zk-eggshell/40' : 'text-gray-400'} mb-2`}>
            Made by: <span className={`${theme === 'zk' ? 'text-zk-eggshell/80' : 'text-gray-600'} font-medium`}>VEDANK CHATURVEDI • NITESH GUPTA • KYNA PRADEEP • ANWITA R RAO</span>
          </p>
          <p className={`text-center text-xs ${theme === 'zk' ? 'text-zk-eggshell/40' : 'text-gray-400'}`}>
            © 2024 AlgoTradeSim - Advanced Algorithmic Trading Simulation Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;