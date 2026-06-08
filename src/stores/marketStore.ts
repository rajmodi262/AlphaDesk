import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { Ticker, Candlestick, OrderBook, WatchlistItem, TimeInterval } from "@/types";

// ============================================
// Market Data Store — Zustand
// ============================================

interface MarketState {
  // Active symbol & interval
  activeSymbol: string;
  activeInterval: TimeInterval;

  // Real-time data
  tickers: Map<string, Ticker>;
  candles: Candlestick[];
  orderBook: OrderBook | null;

  // Watchlist
  watchlist: WatchlistItem[];

  // Connection status
  isConnected: boolean;
  lastUpdate: number;

  // Actions
  setActiveSymbol: (symbol: string) => void;
  setActiveInterval: (interval: TimeInterval) => void;
  updateTicker: (ticker: Ticker) => void;
  setCandles: (candles: Candlestick[]) => void;
  appendCandle: (candle: Candlestick) => void;
  updateOrderBook: (orderBook: OrderBook) => void;
  setWatchlist: (items: WatchlistItem[]) => void;
  toggleFavorite: (symbol: string) => void;
  setConnected: (status: boolean) => void;
}

const DEFAULT_WATCHLIST: WatchlistItem[] = [
  { symbol: "BTCUSDT", name: "Bitcoin", price: 0, change: 0, changePercent: 0, isFavorite: true },
  { symbol: "ETHUSDT", name: "Ethereum", price: 0, change: 0, changePercent: 0, isFavorite: true },
  { symbol: "BNBUSDT", name: "BNB", price: 0, change: 0, changePercent: 0, isFavorite: false },
  { symbol: "SOLUSDT", name: "Solana", price: 0, change: 0, changePercent: 0, isFavorite: false },
  { symbol: "XRPUSDT", name: "XRP", price: 0, change: 0, changePercent: 0, isFavorite: false },
  { symbol: "ADAUSDT", name: "Cardano", price: 0, change: 0, changePercent: 0, isFavorite: false },
  { symbol: "DOGEUSDT", name: "Dogecoin", price: 0, change: 0, changePercent: 0, isFavorite: false },
  { symbol: "AVAXUSDT", name: "Avalanche", price: 0, change: 0, changePercent: 0, isFavorite: false },
];

export const useMarketStore = create<MarketState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      activeSymbol: process.env.NEXT_PUBLIC_DEFAULT_SYMBOL || "BTCUSDT",
      activeInterval: (process.env.NEXT_PUBLIC_DEFAULT_INTERVAL as TimeInterval) || "1h",

      tickers: new Map(),
      candles: [],
      orderBook: null,

      watchlist: DEFAULT_WATCHLIST,

      isConnected: false,
      lastUpdate: 0,

      setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),

      setActiveInterval: (interval) => set({ activeInterval: interval }),

      updateTicker: (ticker) => {
        const tickers = new Map(get().tickers);
        tickers.set(ticker.symbol, ticker);

        // Also update watchlist prices
        const watchlist = get().watchlist.map((item) =>
          item.symbol === ticker.symbol
            ? {
                ...item,
                price: ticker.price,
                change: ticker.change24h,
                changePercent: ticker.changePercent24h,
              }
            : item
        );

        set({ tickers, watchlist, lastUpdate: Date.now() });
      },

      setCandles: (candles) => set({ candles }),

      appendCandle: (candle) => {
        const existing = get().candles;
        const lastCandle = existing[existing.length - 1];

        if (lastCandle && lastCandle.time === candle.time) {
          // Update existing candle
          const updated = [...existing.slice(0, -1), candle];
          set({ candles: updated });
        } else {
          // Append new candle
          set({ candles: [...existing, candle] });
        }
      },

      updateOrderBook: (orderBook) => set({ orderBook }),

      setWatchlist: (items) => set({ watchlist: items }),

      toggleFavorite: (symbol) => {
        const watchlist = get().watchlist.map((item) =>
          item.symbol === symbol ? { ...item, isFavorite: !item.isFavorite } : item
        );
        set({ watchlist });
      },

      setConnected: (status) => set({ isConnected: status }),
    })),
    { name: "market-store" }
  )
);
