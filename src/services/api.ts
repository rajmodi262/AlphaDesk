import axios from "axios";
import type { Candlestick, Ticker } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.binance.com/api/v3",
  timeout: 10000,
});

export const marketApi = {
  getTickers: async (): Promise<Ticker[]> => {
    try {
      const response = await api.get("/ticker/24hr");
      // Pick standard high-volume pairs to keep dashboard clean
      const allowedSymbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "ADAUSDT", "BNBUSDT", "XRPUSDT"];
      
      return response.data
        .filter((item: any) => allowedSymbols.includes(item.symbol))
        .map((item: any) => ({
          symbol: item.symbol,
          price: parseFloat(item.lastPrice),
          change24h: parseFloat(item.priceChange),
          changePercent24h: parseFloat(item.priceChangePercent),
          high24h: parseFloat(item.highPrice),
          low24h: parseFloat(item.lowPrice),
          volume24h: parseFloat(item.volume),
        }));
    } catch (error) {
      console.warn("Failed to fetch tickers from Binance API, falling back to mock data", error);
      return [
        { symbol: "BTCUSDT", price: 68500.5, change24h: 1250.2, changePercent24h: 1.86, high24h: 69200.0, low24h: 67100.0, volume24h: 24500.5 },
        { symbol: "ETHUSDT", price: 3850.25, change24h: -45.1, changePercent24h: -1.16, high24h: 3950.0, low24h: 3790.0, volume24h: 185000.2 },
        { symbol: "SOLUSDT", price: 165.75, change24h: 8.4, changePercent24h: 5.34, high24h: 168.5, low24h: 155.0, volume24h: 850000.0 },
        { symbol: "ADAUSDT", price: 0.485, change24h: -0.015, changePercent24h: -3.0, high24h: 0.51, low24h: 0.47, volume24h: 12000000.0 },
        { symbol: "BNBUSDT", price: 590.3, change24h: 12.1, changePercent24h: 2.09, high24h: 595.0, low24h: 575.0, volume24h: 98000.0 },
        { symbol: "XRPUSDT", price: 0.512, change24h: 0.002, changePercent24h: 0.39, high24h: 0.525, low24h: 0.505, volume24h: 45000000.0 },
      ];
    }
  },

  getKlines: async (symbol: string, interval: string = "1h", limit: number = 100): Promise<Candlestick[]> => {
    try {
      const response = await api.get("/klines", {
        params: { symbol, interval, limit },
      });
      
      return response.data.map((item: any[]) => ({
        time: item[0], // open time in ms
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
      }));
    } catch (error) {
      console.warn(`Failed to fetch klines for ${symbol}, generating realistic mock data`, error);
      // Generate synthetic candlestick data for UI display if offline
      const candles: Candlestick[] = [];
      let lastPrice = symbol.startsWith("BTC") ? 68000 : symbol.startsWith("ETH") ? 3800 : 160;
      let curTime = Date.now() - limit * 60 * 60 * 1000;

      for (let i = 0; i < limit; i++) {
        const change = (Math.random() - 0.48) * (lastPrice * 0.015);
        const open = lastPrice;
        const close = lastPrice + change;
        const high = Math.max(open, close) + Math.random() * (lastPrice * 0.005);
        const low = Math.min(open, close) - Math.random() * (lastPrice * 0.005);
        const volume = Math.random() * 1000 + 100;

        candles.push({ time: curTime, open, high, low, close, volume });
        lastPrice = close;
        curTime += 60 * 60 * 1000;
      }
      return candles;
    }
  },
};
