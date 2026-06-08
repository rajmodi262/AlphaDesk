"use client";

import React, { useMemo } from "react";
import { useMarketStore } from "@/stores/marketStore";

export default function OrderBook() {
  const { selectedSymbol, orderBook, priceHistory } = useMarketStore();

  const currentPrice = useMemo(() => {
    const history = priceHistory[selectedSymbol];
    return history && history.length > 0 ? history[history.length - 1].close : 0;
  }, [priceHistory, selectedSymbol]);

  // Generate synthetic orderbook depth details if WS data is initializing
  const mockDepth = useMemo(() => {
    if (orderBook.bids.length > 0) return orderBook;

    const basePrice = currentPrice || 68000;
    const bids = Array.from({ length: 8 }).map((_, i) => {
      const price = basePrice * (1 - (i + 1) * 0.0005);
      const size = Math.random() * 2 + 0.1;
      return { price, size, total: 0 };
    });

    const asks = Array.from({ length: 8 }).map((_, i) => {
      const price = basePrice * (1 + (i + 1) * 0.0005);
      const size = Math.random() * 2 + 0.1;
      return { price, size, total: 0 };
    }).reverse(); // high to low for display

    // Sum totals
    let bidSum = 0;
    bids.forEach(b => { bidSum += b.size; b.total = bidSum; });
    
    let askSum = 0;
    [...asks].reverse().forEach(a => { askSum += a.size; a.total = askSum; });

    return { bids, asks };
  }, [orderBook, currentPrice]);

  const maxTotal = useMemo(() => {
    const maxBid = mockDepth.bids[mockDepth.bids.length - 1]?.total || 1;
    const maxAsk = mockDepth.asks[0]?.total || 1;
    return Math.max(maxBid, maxAsk);
  }, [mockDepth]);

  return (
    <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 shadow-2xl flex flex-col h-full font-mono text-xs select-none">
      <div className="flex items-center justify-between border-b border-slate-800/50 pb-3 mb-3 shrink-0">
        <span className="font-bold text-slate-200 text-sm">Order Book</span>
        <span className="text-[10px] text-slate-500 font-semibold uppercase">Real-Time (depth 8)</span>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-3 text-slate-500 font-semibold mb-2 px-1 shrink-0">
        <div>Price (USDT)</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
      </div>

      {/* Asks (Sells) */}
      <div className="flex-1 flex flex-col justify-end overflow-hidden mb-1">
        {mockDepth.asks.map((ask, idx) => {
          const depthPercent = Math.min(100, (ask.total / maxTotal) * 100);
          return (
            <div
              key={`ask-${idx}`}
              className="grid grid-cols-3 py-0.5 hover:bg-slate-800/30 px-1 relative cursor-pointer"
            >
              <div
                className="absolute right-0 top-0 bottom-0 bg-rose-500/5 -z-10 transition-all duration-300"
                style={{ width: `${depthPercent}%` }}
              />
              <span className="text-rose-400 font-medium">
                {ask.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-right text-slate-350">{ask.size.toFixed(4)}</span>
              <span className="text-right text-slate-400">{ask.total.toFixed(4)}</span>
            </div>
          );
        })}
      </div>

      {/* Middle: Last Price Spread */}
      <div className="py-2.5 my-1.5 border-y border-slate-850 flex items-center justify-between px-1 bg-slate-950/40 rounded-lg shrink-0">
        <div>
          <span className="text-slate-500 text-[10px] font-semibold block uppercase">Spread Price</span>
          <span className="text-sm font-bold text-slate-100">
            ${currentPrice > 0 ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "---"}
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-500 text-[10px] font-semibold block uppercase">Spread</span>
          <span className="text-xs text-indigo-400 font-semibold">
            0.02%
          </span>
        </div>
      </div>

      {/* Bids (Buys) */}
      <div className="flex-1 overflow-hidden">
        {mockDepth.bids.map((bid, idx) => {
          const depthPercent = Math.min(100, (bid.total / maxTotal) * 100);
          return (
            <div
              key={`bid-${idx}`}
              className="grid grid-cols-3 py-0.5 hover:bg-slate-800/30 px-1 relative cursor-pointer"
            >
              <div
                className="absolute right-0 top-0 bottom-0 bg-emerald-500/5 -z-10 transition-all duration-300"
                style={{ width: `${depthPercent}%` }}
              />
              <span className="text-emerald-400 font-medium">
                {bid.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-right text-slate-350">{bid.size.toFixed(4)}</span>
              <span className="text-right text-slate-400">{bid.total.toFixed(4)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
