"use client";

import React, { useState, useEffect } from "react";
import { useMarketStore } from "@/stores/marketStore";
import { ShieldCheck, Info } from "lucide-react";

export default function TradePanel() {
  const { selectedSymbol, priceHistory } = useMarketStore();
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [leverage, setLeverage] = useState("10");

  const currentPrice = priceHistory[selectedSymbol]?.length > 0
    ? priceHistory[selectedSymbol][priceHistory[selectedSymbol].length - 1].close
    : 0;

  useEffect(() => {
    if (currentPrice > 0 && orderType === "limit") {
      setPrice(currentPrice.toString());
    } else {
      setPrice("");
    }
  }, [currentPrice, orderType, selectedSymbol]);

  const totalValue = parseFloat(price || currentPrice.toString() || "0") * parseFloat(quantity || "0");
  const marginRequired = totalValue / parseInt(leverage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mock Order Placed:\nSide: ${side.toUpperCase()}\nType: ${orderType.toUpperCase()}\nPrice: ${price || "MARKET"}\nQuantity: ${quantity}\nLeverage: ${leverage}x`);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 shadow-2xl flex flex-col h-full overflow-hidden select-none">
      <div className="flex items-center justify-between border-b border-slate-800/50 pb-3 mb-4 shrink-0">
        <span className="font-bold text-slate-200 text-sm">Execution Terminal</span>
        <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setSide("buy")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition ${
              side === "buy" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            BUY
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition ${
              side === "sell" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            SELL
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Order Type Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-850">
            <button
              type="button"
              onClick={() => setOrderType("limit")}
              className={`py-1.5 text-xs font-semibold rounded-md transition ${
                orderType === "limit" ? "bg-slate-850 text-indigo-400 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Limit
            </button>
            <button
              type="button"
              onClick={() => setOrderType("market")}
              className={`py-1.5 text-xs font-semibold rounded-md transition ${
                orderType === "market" ? "bg-slate-850 text-indigo-400 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Market
            </button>
          </div>

          {/* Price Input (if limit) */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Price (USDT)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Market"
              disabled={orderType === "market"}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition font-mono font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Quantity Input */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Size ({selectedSymbol.replace("USDT", "")})</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition font-mono font-medium"
            />
          </div>

          {/* Leverage Selector */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Leverage</label>
              <span className="text-xs text-indigo-400 font-bold font-mono">{leverage}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              className="w-full accent-indigo-500 cursor-ew-resize bg-slate-800 rounded-lg appearance-none h-1.5"
            />
          </div>
        </div>

        {/* Dynamic calculations list */}
        <div className="space-y-2.5 bg-slate-950/40 p-4 rounded-xl border border-slate-850 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Total Value:</span>
            <span className="text-slate-300">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Margin Required:</span>
            <span className="text-indigo-400 font-semibold">${marginRequired.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between border-t border-slate-800/80 pt-2 mt-2">
            <span className="text-slate-500 flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Risk Margin:</span>
            </span>
            <span className="text-emerald-400 font-bold">SAFE</span>
          </div>
        </div>

        {/* Order Exec Button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-sm font-bold tracking-wide transition shadow-lg ${
            side === "buy"
              ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-[0.98]"
              : "bg-rose-500 text-white hover:bg-rose-400 active:scale-[0.98]"
          }`}
        >
          {side === "buy" ? "PLACE BUY ORDER" : "PLACE SELL ORDER"}
        </button>
      </form>
    </div>
  );
}
