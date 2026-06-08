"use client";

import React, { useState, useMemo } from "react";
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { useMarketStore } from "@/stores/marketStore";
import { Maximize2, RefreshCw, BarChart2 } from "lucide-react";

export default function CandlestickChart() {
  const { selectedSymbol, priceHistory, activeInterval, setActiveInterval } = useMarketStore();
  const [showVolume, setShowVolume] = useState(true);

  const data = useMemo(() => {
    return priceHistory[selectedSymbol] || [];
  }, [priceHistory, selectedSymbol]);

  // Formatter for timestamp
  const formatTime = (time: number) => {
    const date = new Date(time);
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  };

  // Custom tooltips for institutional look
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const ohlc = payload[0].payload;
      const isUp = ohlc.close >= ohlc.open;
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl font-mono text-xs space-y-1">
          <div className="text-slate-400 font-semibold mb-1">{new Date(ohlc.time).toLocaleString()}</div>
          <div className="flex justify-between space-x-4">
            <span className="text-slate-500">Open:</span>
            <span className="text-slate-200">${ohlc.open.toFixed(2)}</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-slate-500">High:</span>
            <span className="text-slate-200">${ohlc.high.toFixed(2)}</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-slate-500">Low:</span>
            <span className="text-slate-200">${ohlc.low.toFixed(2)}</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-slate-500">Close:</span>
            <span className={`font-bold ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
              ${ohlc.close.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between space-x-4 border-t border-slate-800/80 pt-1 mt-1">
            <span className="text-slate-500">Volume:</span>
            <span className="text-slate-350">{ohlc.volume.toFixed(2)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom SVG path drawing for the candlesticks to give true charting feel
  const CandlestickItem = (props: any) => {
    const { x, y, width, open, close, high, low } = props;
    const isUp = close >= open;
    const color = isUp ? "#10b981" : "#f43f5e"; // Tailwind emerald-500 / rose-500
    
    // Scale coordinates
    const ratio = props.height / Math.abs(high - low || 1);
    const topY = Math.min(y, y + (open - close) * ratio);
    const bottomY = Math.max(y, y + (open - close) * ratio);

    // Render wick & body
    return (
      <g>
        {/* Wick line */}
        <line
          x1={x + width / 2}
          y1={y}
          x2={x + width / 2}
          y2={y + props.height}
          stroke={color}
          strokeWidth={1.5}
        />
        {/* Candle Body */}
        <rect
          x={x + width * 0.15}
          y={open > close ? y : y}
          width={width * 0.7}
          height={Math.max(2, Math.abs(open - close) * ratio)}
          fill={color}
          stroke={color}
          strokeWidth={0.5}
          rx={1}
        />
      </g>
    );
  };

  const intervals = ["1m", "5m", "15m", "1h", "4h", "1d"];

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      {/* Chart Headers */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/50 pb-4">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-200 text-base">{selectedSymbol}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
            Candles
          </span>
        </div>

        {/* Chart Options */}
        <div className="flex items-center space-x-3">
          {/* Time intervals */}
          <div className="flex bg-slate-950/60 p-1 rounded-lg border border-slate-800/50">
            {intervals.map((int) => (
              <button
                key={int}
                onClick={() => setActiveInterval(int as any)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  activeInterval === int
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {int}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-slate-800" />

          {/* Toggle buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`p-1.5 rounded-lg border transition ${
                showVolume
                  ? "bg-slate-850 border-slate-700 text-indigo-400"
                  : "border-transparent text-slate-400 hover:bg-slate-800/40"
              }`}
              title="Toggle Volume"
            >
              <BarChart2 className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full relative min-h-[300px]">
        {data.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
            <RefreshCw className="h-6 w-6 animate-spin mb-2 text-indigo-500" />
            <span className="text-xs font-medium">Synchronizing live market stream...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="time"
                tickFormatter={formatTime}
                stroke="#475569"
                tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke="#475569"
                tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                orientation="right"
                axisLine={false}
                tickLine={false}
                mirror={true}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Custom SVG candle renderer */}
              <Bar
                dataKey="close"
                shape={<CandlestickItem />}
                fill="#10b981"
              />

              {/* Volume Bar overlay */}
              {showVolume && (
                <Bar
                  dataKey="volume"
                  yAxisId="volume"
                  fill="rgba(148, 163, 184, 0.12)"
                  maxBarSize={8}
                />
              )}
              {/* Extra Volume YAxis */}
              <YAxis
                yAxisId="volume"
                orientation="left"
                display="none"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
