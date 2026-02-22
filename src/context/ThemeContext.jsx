import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSiteData } from "../api/client";

const ThemeContext = createContext(null);

function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-secondary", theme.secondary);
  root.style.setProperty("--color-accent", theme.accent);
  root.style.setProperty("--color-bg", theme.background);
  root.style.setProperty("--color-text", theme.text);
}

export function ThemeProvider({ children }) {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    try {
      const data = await getSiteData();
      setSiteData(data);
      applyTheme(data.theme);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(
    () => ({ siteData, setSiteData, refresh, loading, error }),
    [siteData, loading, error]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeData() {
  return useContext(ThemeContext);
}
