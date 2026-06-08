"use client";

import React, { useState } from "react";
import { Info, XCircle } from "lucide-react";

export default function PositionsList() {
  const [activeTab, setActiveTab] = useState<"positions" | "orders" | "history">("positions");

  const mockPositions = [
    {
      symbol: "BTCUSDT",
      side: "LONG",
      leverage: "10x",
      size: "0.45",
      entryPrice: 67820.0,
      markPrice: 68500.5,
      pnl: 306.225,
      pnlPercent: 10.03,
    },
    {
      symbol: "SOLUSDT",
      side: "SHORT",
      leverage: "5x",
      size: "12.5",
      entryPrice: 168.2,
      markPrice: 165.75,
      pnl: 30.625,
      pnlPercent: 7.28,
    },
  ];

  const mockOrders = [
    {
      symbol: "ETHUSDT",
      side: "BUY",
      type: "LIMIT",
      price: 3750.0,
      quantity: "1.5",
      status: "OPEN",
    },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl shadow-2xl overflow-hidden flex flex-col h-full select-none">
      {/* Tabs list */}
      <div className="flex bg-slate-900/80 border-b border-slate-800/80 px-4 shrink-0">
        {(["positions", "orders", "history"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-xs font-bold capitalize border-b-2 -mb-[1px] transition ${
              activeTab === tab
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab === "positions" ? `Active Positions (${mockPositions.length})` : tab === "orders" ? `Open Orders (${mockOrders.length})` : "Trade History"}
          </button>
        ))}
      </div>

      {/* Content pane */}
      <div className="flex-1 overflow-auto p-4 min-h-[150px]">
        {activeTab === "positions" && (
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-500 font-semibold border-b border-slate-800/50 pb-2">
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Side</th>
                <th className="pb-2">Leverage</th>
                <th className="pb-2 text-right">Size</th>
                <th className="pb-2 text-right">Entry Price</th>
                <th className="pb-2 text-right">Mark Price</th>
                <th className="pb-2 text-right">Unrealized PNL</th>
                <th className="pb-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {mockPositions.map((pos) => {
                const isProfit = pos.pnl >= 0;
                return (
                  <tr key={pos.symbol} className="hover:bg-slate-850/20">
                    <td className="py-3 font-bold text-slate-200">{pos.symbol}</td>
                    <td className="py-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        pos.side === "LONG" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {pos.side}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 font-semibold">{pos.leverage}</td>
                    <td className="py-3 text-right text-slate-200 font-semibold">{pos.size}</td>
                    <td className="py-3 text-right text-slate-400">${pos.entryPrice.toFixed(2)}</td>
                    <td className="py-3 text-right text-slate-300">${pos.markPrice.toFixed(2)}</td>
                    <td className={`py-3 text-right font-bold ${isProfit ? "text-emerald-400" : "text-rose-400"}`}>
                      ${pos.pnl.toFixed(2)} ({isProfit ? "+" : ""}{pos.pnlPercent.toFixed(2)}%)
                    </td>
                    <td className="py-3 text-center">
                      <button className="text-slate-500 hover:text-rose-400 transition" title="Close Position">
                        <XCircle className="h-4 w-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {activeTab === "orders" && (
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-500 font-semibold border-b border-slate-800/50 pb-2">
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Side</th>
                <th className="pb-2">Type</th>
                <th className="pb-2 text-right">Price</th>
                <th className="pb-2 text-right">Quantity</th>
                <th className="pb-2 text-center">Status</th>
                <th className="pb-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {mockOrders.map((ord, idx) => (
                <tr key={`${ord.symbol}-${idx}`} className="hover:bg-slate-850/20">
                  <td className="py-3 font-bold text-slate-200">{ord.symbol}</td>
                  <td className="py-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      ord.side === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    }`}>
                      {ord.side}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 font-semibold">{ord.type}</td>
                  <td className="py-3 text-right text-slate-200 font-semibold">${ord.price.toFixed(2)}</td>
                  <td className="py-3 text-right text-slate-300 font-semibold">{ord.quantity}</td>
                  <td className="py-3 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 animate-pulse">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <button className="text-slate-500 hover:text-rose-400 transition" title="Cancel Order">
                      <XCircle className="h-4 w-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "history" && (
          <div className="flex flex-col items-center justify-center py-6 text-slate-500 space-y-1">
            <Info className="h-5 w-5 text-slate-600" />
            <span className="text-xs">No trade history recorded for this session.</span>
          </div>
        )}
      </div>
    </div>
  );
}
