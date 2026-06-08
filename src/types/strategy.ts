// ============================================
// Strategy & Backtesting Type Definitions
// ============================================

export interface StrategyNode {
  id: string;
  type: "indicator" | "condition" | "action" | "entry" | "exit" | "risk";
  position: { x: number; y: number };
  data: {
    label: string;
    params: Record<string, number | string | boolean>;
    description?: string;
  };
}

export interface StrategyEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: "success" | "failure" | "default";
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  nodes: StrategyNode[];
  edges: StrategyEdge[];
  isPublished: boolean;
  rating?: number;
  tags: string[];
}

export interface BacktestConfig {
  strategyId: string;
  symbol: string;
  interval: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  positionSize: number;
  commission: number;
  slippage: number;
}

export interface BacktestResult {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  equityCurve: { date: string; equity: number; benchmark: number }[];
  trades: BacktestTrade[];
}

export interface BacktestTrade {
  id: number;
  entryDate: string;
  exitDate: string;
  side: "LONG" | "SHORT";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  holdingPeriod: number;
}

export interface MarketplaceStrategy {
  id: string;
  name: string;
  author: string;
  description: string;
  rating: number;
  totalBacktests: number;
  avgReturn: number;
  sharpeRatio: number;
  tags: string[];
  subscriberCount: number;
  createdAt: string;
}

export type IndicatorType =
  | "SMA"
  | "EMA"
  | "RSI"
  | "MACD"
  | "BBANDS"
  | "ATR"
  | "STOCH"
  | "VWAP"
  | "OBV"
  | "ADX"
  | "CCI"
  | "MFI"
  | "WILLIAMS_R"
  | "ICHIMOKU"
  | "SUPERTREND";
