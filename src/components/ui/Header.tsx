"use client";

import React from "react";
import { useMarketStore } from "@/stores/marketStore";
import { Activity, Radio, Cpu, Bell, User } from "lucide-react";

export default function Header() {
  const { selectedSymbol, connectionStatus, priceHistory } = useMarketStore();
  
  const currentPrice = priceHistory[selectedSymbol]?.length > 0
    ? priceHistory[selectedSymbol][priceHistory[selectedSymbol].length - 1].close
    : 0;

  const prevPrice = priceHistory[selectedSymbol]?.length > 1
    ? priceHistory[selectedSymbol][priceHistory[selectedSymbol].length - 2].close
    : currentPrice;

  const priceDiff = currentPrice - prevPrice;
  const isUp = priceDiff >= 0;

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md px-6 flex items-center justify-between z-10">
      {/* Left: Active ticker overview */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
            <Cpu className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center">
              AlphaDesk
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">
                v1.0
              </span>
            </h1>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-slate-800" />

        {/* Selected Pair Price */}
        <div className="flex items-center space-x-4">
          <div>
            <div className="text-xs text-slate-500 font-medium">Selected Asset</div>
            <div className="text-sm font-semibold text-slate-200">{selectedSymbol}</div>
          </div>
          {currentPrice > 0 && (
            <div>
              <div className="text-xs text-slate-500 font-medium">Last Price</div>
              <div className={`text-sm font-bold ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: WS Connection + Actions */}
      <div className="flex items-center space-x-6">
        {/* WebSocket Status Indicator */}
        <div className="flex items-center space-x-2 bg-slate-800/40 px-3 py-1.5 rounded-full border border-slate-700/30">
          <Radio className={`h-4 w-4 animate-pulse ${
            connectionStatus === "connected" ? "text-emerald-400" : 
            connectionStatus === "connecting" ? "text-amber-400" : "text-rose-400"
          }`} />
          <span className="text-xs font-semibold text-slate-300 capitalize">
            WS: {connectionStatus}
          </span>
        </div>

        {/* System Activity */}
        <div className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 cursor-pointer transition">
          <Activity className="h-4 w-4" />
          <span className="text-xs font-medium">API Latency: 24ms</span>
        </div>

        <div className="h-6 w-[1px] bg-slate-800" />

        {/* Action icons */}
        <div className="flex items-center space-x-3">
          <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-500 rounded-full" />
          </button>
          <button className="flex items-center space-x-2 pl-2 border-l border-slate-850">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden hover:border-slate-500 transition">
              <User className="h-4 w-4 text-slate-400" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
