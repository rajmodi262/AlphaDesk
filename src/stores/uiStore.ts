import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ============================================
// UI Preferences Store — Zustand
// ============================================

type Theme = "dark" | "light" | "system";
type DashboardLayout = "default" | "compact" | "wide";

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  dashboardLayout: DashboardLayout;
  showOrderBook: boolean;
  showWatchlist: boolean;
  chartHeight: number;

  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setDashboardLayout: (layout: DashboardLayout) => void;
  toggleOrderBook: () => void;
  toggleWatchlist: () => void;
  setChartHeight: (height: number) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      theme: "dark",
      sidebarCollapsed: false,
      dashboardLayout: "default",
      showOrderBook: true,
      showWatchlist: true,
      chartHeight: 500,

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          const root = document.documentElement;
          root.classList.remove("dark", "light");
          if (theme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.add(prefersDark ? "dark" : "light");
          } else {
            root.classList.add(theme);
          }
        }
      },

      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      setDashboardLayout: (layout) => set({ dashboardLayout: layout }),
      toggleOrderBook: () => set({ showOrderBook: !get().showOrderBook }),
      toggleWatchlist: () => set({ showWatchlist: !get().showWatchlist }),
      setChartHeight: (height) => set({ chartHeight: height }),
    }),
    { name: "ui-store" }
  )
);
