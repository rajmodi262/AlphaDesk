// ============================================
// Market Data Type Definitions
// ============================================

export interface Ticker {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  quoteVolume24h: number;
  lastUpdated: number;
}

export interface Candlestick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdateId: number;
  timestamp: number;
}

export interface Trade {
  id: number;
  price: number;
  quantity: number;
  time: number;
  isBuyerMaker: boolean;
}

export interface DepthLevel {
  price: number;
  quantity: number;
  cumulative: number;
  percentage: number;
}

export type TimeInterval =
  | "1m"
  | "3m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "4h"
  | "6h"
  | "8h"
  | "12h"
  | "1d"
  | "3d"
  | "1w"
  | "1M";

export interface MarketSummary {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: "TRADING" | "HALT" | "BREAK";
  currentPrice: number;
  marketCap?: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isFavorite: boolean;
}
