"use client";

import React, { useState, useMemo } from "react";
import Layout from "@/components/ui/Layout";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Play, Plus, Trash2, ArrowRight, Settings, Sliders, Info, HelpCircle } from "lucide-react";

interface Node {
  id: string;
  type: "indicator" | "logic" | "action";
  label: string;
  value: string;
}

export default function StrategyBuilder() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", type: "indicator", label: "Relative Strength Index (RSI)", value: "RSI(14) < 30" },
    { id: "2", type: "logic", label: "AND Gate", value: "AND" },
    { id: "3", type: "indicator", label: "Exponential Moving Avg (EMA)", value: "Price > EMA(20)" },
    { id: "4", type: "action", label: "Execution Action", value: "BUY (Size: 100%)" },
  ]);

  const [backtested, setBacktested] = useState(false);
  const [loading, setLoading] = useState(false);

  // Synthetic backtesting simulation dataset
  const backtestData = useMemo(() => {
    const data = [];
    let bhValue = 10000;
    let strategyValue = 10000;
    let baseTime = Date.now() - 30 * 24 * 60 * 60 * 1000;

    for (let i = 0; i <= 30; i++) {
      const bhChange = (Math.random() - 0.45) * 300;
      // Make strategy beat Buy & Hold
      const strategyChange = bhChange > 0 
        ? bhChange * 1.15 
        : bhChange * 0.45; // protect downsides

      bhValue += bhChange;
      strategyValue += strategyChange;

      data.push({
        day: new Date(baseTime).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        "Buy & Hold": Math.round(bhValue),
        "AlphaStrategy": Math.round(strategyValue),
      });

      baseTime += 24 * 60 * 60 * 1000;
    }
    return data;
  }, [backtested]);

  const runBacktest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBacktested(true);
    }, 1500);
  };

  const addNode = (type: "indicator" | "logic" | "action") => {
    const id = (nodes.length + 1).toString();
    let label = "Indicator Node";
    let value = "EMA(50) > EMA(200)";
    if (type === "logic") {
      label = "OR Gate";
      value = "OR";
    } else if (type === "action") {
      label = "Stop Loss / TP";
      value = "TRAILING_STOP(2%)";
    }

    setNodes([...nodes, { id, type, label, value }]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6 h-full select-none">
        {/* Strategy Builder Header */}
        <div className="flex items-center justify-between bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-xl">
          <div>
            <h2 className="text-lg font-bold text-white">Visual Strategy Composer</h2>
            <p className="text-xs text-slate-400">Design automated trading algorithms visually using connected indicator logical blocks.</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={runBacktest}
              disabled={loading}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>{loading ? "COMPILING..." : "COMPILE & BACKTEST"}</span>
            </button>
          </div>
        </div>

        {/* Builder Worksurface */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Node Editor Workspace (7/12 cols) */}
          <div className="col-span-7 bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-3">
              <span className="font-bold text-slate-200 text-sm">Signal Pipeline Flow</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => addNode("indicator")}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-750 text-slate-300 hover:text-slate-100 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition"
                >
                  <Plus className="h-3 w-3" />
                  <span>+ Indicator</span>
                </button>
                <button
                  onClick={() => addNode("logic")}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-750 text-slate-300 hover:text-slate-100 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition"
                >
                  <Plus className="h-3 w-3" />
                  <span>+ Logic Gate</span>
                </button>
                <button
                  onClick={() => addNode("action")}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-750 text-slate-300 hover:text-slate-100 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition"
                >
                  <Plus className="h-3 w-3" />
                  <span>+ Action</span>
                </button>
              </div>
            </div>

            {/* Nodes list */}
            <div className="space-y-3 relative py-2">
              {nodes.map((node, idx) => (
                <div key={node.id} className="relative flex flex-col items-center">
                  <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 hover:bg-slate-900/40 transition duration-150">
                    <div className="flex items-center space-x-3.5">
                      <div className={`p-2 rounded-lg border ${
                        node.type === "indicator" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        node.type === "logic" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        <Sliders className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-semibold">{node.label}</div>
                        <div className="text-xs text-slate-200 font-mono font-bold mt-0.5">{node.value}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-slate-500 hover:text-slate-350 hover:bg-slate-800/60 rounded-lg transition">
                        <Settings className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeNode(node.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Node Connector Line */}
                  {idx < nodes.length - 1 && (
                    <div className="h-6 w-0.5 bg-slate-850 flex items-center justify-center relative my-1">
                      <ArrowRight className="h-3 w-3 text-slate-600 rotate-90 absolute" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Performance Report Workspace (5/12 cols) */}
          <div className="col-span-5 flex flex-col space-y-6">
            {/* Simulation Status Card */}
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 shadow-2xl flex flex-col justify-between min-h-[160px]">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800/50 pb-2">
                <span className="font-bold text-slate-200 text-sm">Backtest Engine</span>
                <HelpCircle className="h-4 w-4 text-slate-500 hover:text-slate-450 cursor-pointer" />
              </div>
              
              {!backtested && !loading && (
                <div className="flex flex-col items-center justify-center py-6 text-slate-500 text-xs text-center space-y-2">
                  <Info className="h-5 w-5 text-slate-650" />
                  <span>Configure nodes and compile layout to generate simulation metrics.</span>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-6 text-slate-500 text-xs text-center space-y-2.5">
                  <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span>Running historic backtest simulation over 30 days...</span>
                </div>
              )}

              {backtested && !loading && (
                <div className="space-y-4">
                  {/* Results metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Net Profit</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5">+24.86%</span>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Max Drawdown</span>
                      <span className="text-sm font-bold text-rose-400 font-mono mt-0.5">-3.12%</span>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Win Rate</span>
                      <span className="text-sm font-bold text-indigo-400 font-mono mt-0.5">68.4%</span>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Profit Factor</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5">2.45</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Backtest Line Chart */}
            {backtested && !loading && (
              <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 shadow-2xl flex flex-col h-72">
                <span className="font-bold text-slate-200 text-sm mb-3">Equity Growth curve</span>
                <div className="flex-1 w-full relative min-h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={backtestData} margin={{ left: -20, right: 10, top: 5, bottom: 0 }}>
                      <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} mirror={true} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc" }} />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 10 }} />
                      <Line type="monotone" dataKey="Buy & Hold" stroke="#64748b" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="AlphaStrategy" stroke="#6366f1" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
