"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-950/20 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
