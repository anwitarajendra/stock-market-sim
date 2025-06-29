// Mock real-time stock data service
export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  timestamp: number;
}

export interface ChartData {
  time: string;
  price: number;
  volume: number;
}

class StockApiService {
  private basePrice: { [key: string]: number } = {
    'AAPL': 173.50,
    'GOOGL': 140.15,
    'MSFT': 378.85,
    'TSLA': 248.42,
    'AMZN': 145.86,
    'NVDA': 875.28,
    'META': 484.20,
    'NFLX': 445.03,
  };

  private subscribers: { [key: string]: ((data: StockData) => void)[] } = {};

  // Simulate real-time price updates
  generateRealtimePrice(symbol: string): StockData {
    const basePrice = this.basePrice[symbol] || 100;
    const volatility = 0.02; // 2% volatility
    const change = (Math.random() - 0.5) * volatility * basePrice;
    const newPrice = Math.max(basePrice + change, 0.01);
    
    // Update base price for next iteration
    this.basePrice[symbol] = newPrice;
    
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol,
      price: Number(newPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 500000,
      high: Number((newPrice * (1 + Math.random() * 0.02)).toFixed(2)),
      low: Number((newPrice * (1 - Math.random() * 0.02)).toFixed(2)),
      open: Number((basePrice * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
      timestamp: Date.now(),
    };
  }

  // Generate historical chart data
  generateChartData(symbol: string, timeframe: string): ChartData[] {
    const dataPoints = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : 30;
    const data: ChartData[] = [];
    let currentPrice = this.basePrice[symbol] || 100;
    
    for (let i = dataPoints; i >= 0; i--) {
      const volatility = 0.02;
      const change = (Math.random() - 0.5) * volatility * currentPrice;
      currentPrice = Math.max(currentPrice + change, 0.01);
      
      const time = timeframe === '1D' 
        ? `${String(9 + Math.floor(i * 7 / dataPoints)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
        : timeframe === '1W'
        ? new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()
        : new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString();
      
      data.push({
        time,
        price: Number(currentPrice.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 500000,
      });
    }
    
    return data.reverse();
  }

  // Subscribe to real-time updates
  subscribe(symbol: string, callback: (data: StockData) => void): () => void {
    if (!this.subscribers[symbol]) {
      this.subscribers[symbol] = [];
      // Start real-time updates for this symbol
      this.startRealtimeUpdates(symbol);
    }
    
    this.subscribers[symbol].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers[symbol] = this.subscribers[symbol].filter(cb => cb !== callback);
      if (this.subscribers[symbol].length === 0) {
        delete this.subscribers[symbol];
      }
    };
  }

  private startRealtimeUpdates(symbol: string) {
    const updateInterval = setInterval(() => {
      if (!this.subscribers[symbol] || this.subscribers[symbol].length === 0) {
        clearInterval(updateInterval);
        return;
      }
      
      const data = this.generateRealtimePrice(symbol);
      this.subscribers[symbol].forEach(callback => callback(data));
    }, 2000 + Math.random() * 3000); // Update every 2-5 seconds
  }

  // Get multiple stocks data
  getMultipleStocks(symbols: string[]): StockData[] {
    return symbols.map(symbol => this.generateRealtimePrice(symbol));
  }
}

export const stockApi = new StockApiService();