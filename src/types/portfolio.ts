// ============================================
// Portfolio Type Definitions
// ============================================

export interface Position {
  symbol: string;
  side: "LONG" | "SHORT";
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  timestamp: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
  availableBalance: number;
  marginUsed: number;
  positions: Position[];
}

export interface Allocation {
  symbol: string;
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface TradeHistoryEntry {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  type: "MARKET" | "LIMIT" | "STOP_LOSS" | "TAKE_PROFIT";
  price: number;
  quantity: number;
  total: number;
  fee: number;
  status: "FILLED" | "PARTIAL" | "CANCELLED" | "PENDING";
  timestamp: number;
}
