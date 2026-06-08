"use client";

import React from "react";
import { useMarketStore } from "@/stores/marketStore";
import { Search, Star, TrendingUp, TrendingDown } from "lucide-react";

export default function Watchlist() {
  const { tickers, selectedSymbol, setSelectedSymbol } = useMarketStore();

  return (
    <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 shadow-2xl flex flex-col h-full overflow-hidden select-none">
      {/* Header & Search */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-slate-200 text-sm">Watchlist</span>
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search symbols..."
            className="w-full bg-slate-950/80 border border-slate-800/80 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition font-sans"
            disabled
          />
        </div>
      </div>

      {/* Watchlist Headers */}
      <div className="grid grid-cols-3 text-slate-500 font-semibold text-[10px] uppercase pb-2 px-2 border-b border-slate-800/50 shrink-0">
        <div>Symbol</div>
        <div className="text-right">Price</div>
        <div className="text-right">24h %</div>
      </div>

      {/* Ticker list */}
      <div className="flex-1 overflow-y-auto space-y-1 pt-2">
        {tickers.map((ticker) => {
          const isSelected = selectedSymbol === ticker.symbol;
          const isUp = ticker.changePercent24h >= 0;

          return (
            <div
              key={ticker.symbol}
              onClick={() => setSelectedSymbol(ticker.symbol)}
              className={`grid grid-cols-3 items-center py-2.5 px-2.5 rounded-lg cursor-pointer transition duration-150 ${
                isSelected
                  ? "bg-indigo-600/10 border border-indigo-500/20 text-white"
                  : "hover:bg-slate-800/40 border border-transparent text-slate-350 hover:text-slate-200"
              }`}
            >
              {/* Symbol */}
              <div className="flex flex-col">
                <span className="font-bold text-xs">{ticker.symbol.replace("USDT", "")}</span>
                <span className="text-[9px] text-slate-500 font-medium">USDT</span>
              </div>

              {/* Price */}
              <div className="text-right font-mono font-medium text-xs">
                ${ticker.price.toLocaleString(undefined, {
                  minimumFractionDigits: ticker.price < 1 ? 4 : 2,
                  maximumFractionDigits: ticker.price < 1 ? 4 : 2,
                })}
              </div>

              {/* Change % */}
              <div className="text-right font-mono flex items-center justify-end space-x-1">
                {isUp ? (
                  <TrendingUp className="h-3 w-3 text-emerald-400 shrink-0" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-rose-400 shrink-0" />
                )}
                <span className={`text-[11px] font-bold ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                  {isUp ? "+" : ""}
                  {ticker.changePercent24h.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
