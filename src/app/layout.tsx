import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AlphaDesk | Real-Time Algorithmic Trading Dashboard",
  description: "Advanced institutional-grade trading dashboard, visual strategy builder, and real-time backtesting platform.",
  keywords: ["trading", "algorithmic", "backtesting", "finance", "real-time", "binance", "react", "nextjs"],
  authors: [{ name: "Raj Modi" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}
