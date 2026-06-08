"use client";

import React, { useMemo } from "react";
import Layout from "@/components/ui/Layout";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCw, Layers, Shield } from "lucide-react";

export default function Portfolio() {
  // Synthetic data for equity curve
  const equityData = useMemo(() => {
    const data = [];
    let val = 25000;
    let baseTime = Date.now() - 30 * 24 * 60 * 60 * 1000;

    for (let i = 0; i <= 30; i++) {
      val += (Math.random() - 0.42) * 600;
      data.push({
        day: new Date(baseTime).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        Balance: Math.round(val),
      });
      baseTime += 24 * 60 * 60 * 1000;
    }
    return data;
  }, []);

  const stats = [
    { label: "Net Asset Value", value: "$26,482.50", change: "+5.93%", isUp: true, icon: Wallet },
    { label: "Total Margin Balance", value: "$18,250.00", change: "72% Utilized", isUp: true, icon: Layers },
    { label: "Account Health", value: "98.4%", change: "EXCELLENT", isUp: true, icon: Shield },
  ];

  const allocations = [
    { asset: "BTC", amount: "0.245", value: 16782.5, percent: 63.3 },
    { asset: "ETH", amount: "1.500", value: 5775.0, percent: 21.8 },
    { asset: "SOL", amount: "22.500", value: 3729.0, percent: 14.1 },
    { asset: "USDT", amount: "196.000", value: 196.0, percent: 0.8 },
  ];

  return (
    <Layout>
      <div className="flex flex-col space-y-6 h-full select-none">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 shadow-2xl flex items-center justify-between hover:border-slate-700/80 transition duration-150"
              >
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">{stat.label}</span>
                  <span className="text-xl font-bold text-white font-mono">{stat.value}</span>
                  <span className={`text-xs font-bold font-mono flex items-center mt-1 ${stat.isUp ? "text-emerald-400" : "text-slate-400"}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart and Allocation Breakdown */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Equity Chart (8/12 cols) */}
          <div className="col-span-8 bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 shadow-2xl flex flex-col h-96">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800/50 pb-3">
              <span className="font-bold text-slate-200 text-sm">Portfolio Growth Curve</span>
              <div className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 cursor-pointer text-xs font-semibold">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Update Balance</span>
              </div>
            </div>
            <div className="flex-1 w-full relative min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData} margin={{ left: -20, right: 10, top: 5, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} mirror={true} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc" }} />
                  <Area type="monotone" dataKey="Balance" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorBal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation Breakdown (4/12 cols) */}
          <div className="col-span-4 bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 shadow-2xl flex flex-col h-96 overflow-hidden">
            <span className="font-bold text-slate-200 text-sm mb-4 shrink-0 pb-3 border-b border-slate-800/50">Asset Allocation</span>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {allocations.map((alloc) => (
                <div key={alloc.asset} className="bg-slate-950/40 border border-slate-850 rounded-xl p-3 flex items-center justify-between hover:border-slate-800 transition">
                  <div className="flex items-center space-x-3">
                    <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-extrabold text-xs text-indigo-400">
                      {alloc.asset[0]}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200">{alloc.asset}</span>
                      <span className="text-[10px] text-slate-500 block font-medium mt-0.5">{alloc.amount} {alloc.asset}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-slate-200">${alloc.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span className="text-[10px] text-indigo-400 block font-bold mt-0.5">{alloc.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
