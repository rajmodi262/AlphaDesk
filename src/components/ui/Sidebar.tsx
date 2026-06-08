"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Compass, Wallet, Settings, Terminal, Github } from "lucide-react";

const menuItems = [
  { name: "Trading Terminal", href: "/dashboard", icon: Terminal },
  { name: "Strategy Builder", href: "/strategy", icon: Compass },
  { name: "Portfolio & Logs", href: "/portfolio", icon: Wallet },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col justify-between shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Terminal className="h-6 w-6 text-indigo-500" />
          <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
            ALPHA_DESK
          </span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition duration-200 group ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? "text-indigo-400" : "text-slate-400"
                }`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-800/80">
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 mb-4">
          <div className="text-xs text-slate-500 font-semibold mb-1">STRATEGY ENGINE</div>
          <div className="text-[11px] text-indigo-400 font-mono flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Engine Status: ACTIVE</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="font-mono text-[10px]">VER. 1.0.4-STABLE</span>
          <a
            href="https://github.com/rajmodi262/AlphaDesk"
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-400 transition"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </aside>
  );
}
