"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";
type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "theme"; // Preserve existing next-themes preferences.
const CHANGE_EVENT = "natee-theme-change";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function readTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") return saved;
  } catch {
    // Storage can be unavailable in private or restricted browsing modes.
  }
  return fallbackTheme ?? "dark";
}

function readResolvedTheme(): ResolvedTheme {
  const selected = readTheme();
  if (selected !== "system") return selected;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  media.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
    media.removeEventListener("change", onChange);
  };
}

const serverTheme = (): Theme => "dark";
const serverResolvedTheme = (): ResolvedTheme => "dark";

/**
 * Hydration-safe theme context without an injected client-side <script>.
 * React 19 warns when next-themes renders its inline script from a client
 * component. The server paints the default dark theme; stored preferences are
 * applied immediately after hydration and continue to work across tabs.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, serverTheme);
  const resolvedTheme = useSyncExternalStore(subscribe, readResolvedTheme, serverResolvedTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Still update the UI if localStorage is blocked.
      fallbackTheme = next;
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

let fallbackTheme: Theme | null = null;

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
