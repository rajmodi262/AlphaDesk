"use client";

import React, { useEffect } from "react";
import Layout from "@/components/ui/Layout";
import CandlestickChart from "@/components/charts/CandlestickChart";
import Watchlist from "@/components/trading/Watchlist";
import OrderBook from "@/components/trading/OrderBook";
import TradePanel from "@/components/trading/TradePanel";
import PositionsList from "@/components/trading/PositionsList";
import { useMarketStore } from "@/stores/marketStore";
import { useWebSocket } from "@/hooks/useWebSocket";
import { marketApi } from "@/services/api";

export default function Dashboard() {
  const { setTickers, setPriceHistory, selectedSymbol, activeInterval } = useMarketStore();
  
  // Establish real-time WebSocket connection to public market feeds
  useWebSocket();

  // Load initial historical candles and tickers via REST API
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch tickers list
      const tickersData = await marketApi.getTickers();
      setTickers(tickersData);

      // Fetch active ticker candlestick history
      const candlesData = await marketApi.getKlines(selectedSymbol, activeInterval, 100);
      setPriceHistory(selectedSymbol, candlesData);
    };

    fetchInitialData();
    
    // Poll tickers every 10 seconds to keep stats synchronized if WS stream drops
    const tickerInterval = setInterval(async () => {
      const tickersData = await marketApi.getTickers();
      setTickers(tickersData);
    }, 10000);

    return () => clearInterval(tickerInterval);
  }, [selectedSymbol, activeInterval, setTickers, setPriceHistory]);

  return (
    <Layout>
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8.5rem)] min-h-[600px] overflow-hidden">
        {/* Left Column: Watchlist (3/12 cols) */}
        <div className="col-span-3 h-full overflow-hidden">
          <Watchlist />
        </div>

        {/* Center Column: Chart & Positions (6/12 cols) */}
        <div className="col-span-6 flex flex-col space-y-6 h-full overflow-hidden">
          <div className="flex-1 overflow-hidden min-h-[350px]">
            <CandlestickChart />
          </div>
          <div className="h-64 shrink-0 overflow-hidden">
            <PositionsList />
          </div>
        </div>

        {/* Right Column: Order Book & Execution Terminal (3/12 cols) */}
        <div className="col-span-3 flex flex-col space-y-6 h-full overflow-hidden">
          <div className="flex-1 overflow-hidden min-h-[250px]">
            <OrderBook />
          </div>
          <div className="h-96 shrink-0 overflow-hidden">
            <TradePanel />
          </div>
        </div>
      </div>
    </Layout>
  );
}
