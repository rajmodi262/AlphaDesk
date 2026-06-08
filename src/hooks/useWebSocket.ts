import { useEffect, useRef, useCallback } from "react";
import { useMarketStore } from "@/stores/marketStore";

// ============================================
// WebSocket Hook — Real-time Market Data
// ============================================

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://stream.binance.com:9443/ws";
const RECONNECT_INTERVAL = Number(process.env.NEXT_PUBLIC_WS_RECONNECT_INTERVAL) || 5000;

interface UseWebSocketOptions {
  symbol: string;
  streams: ("ticker" | "kline" | "depth" | "trade")[];
  interval?: string;
  onMessage?: (data: unknown) => void;
}

export function useWebSocket({ symbol, streams, interval = "1h", onMessage }: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const setConnected = useMarketStore((s) => s.setConnected);

  const buildStreamUrl = useCallback(() => {
    const lowerSymbol = symbol.toLowerCase();
    const streamNames = streams.map((stream) => {
      switch (stream) {
        case "ticker":
          return `${lowerSymbol}@ticker`;
        case "kline":
          return `${lowerSymbol}@kline_${interval}`;
        case "depth":
          return `${lowerSymbol}@depth20@100ms`;
        case "trade":
          return `${lowerSymbol}@trade`;
        default:
          return "";
      }
    });

    return `${WS_BASE_URL}/${streamNames.join("/")}`;
  }, [symbol, streams, interval]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    const url = buildStreamUrl();
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log(`[WS] Connected: ${symbol}`);
      setConnected(true);

      // Clear any pending reconnection
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      } catch (err) {
        console.error("[WS] Parse error:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("[WS] Error:", error);
    };

    ws.onclose = (event) => {
      console.log(`[WS] Disconnected: ${event.code} ${event.reason}`);
      setConnected(false);

      // Auto-reconnect with exponential backoff
      if (!reconnectTimerRef.current) {
        reconnectTimerRef.current = setTimeout(() => {
          console.log("[WS] Attempting reconnection...");
          reconnectTimerRef.current = null;
          connect();
        }, RECONNECT_INTERVAL);
      }
    };

    wsRef.current = ws;
  }, [buildStreamUrl, onMessage, setConnected, symbol]);

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close(1000, "Component unmounted");
      wsRef.current = null;
    }
    setConnected(false);
  }, [setConnected]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    ws: wsRef.current,
    reconnect: connect,
    disconnect,
  };
}
