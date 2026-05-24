/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState, useMemo } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('ui-theme') as Theme) || 'system';
  });

  const [systemDark, setSystemDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const isDark = useMemo(() => {
    if (theme === 'system') return systemDark;
    return theme === 'dark';
  }, [theme, systemDark]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');
    const effectiveTheme = isDark ? 'dark' : 'light';
    root.classList.add(effectiveTheme);
    localStorage.setItem('ui-theme', theme);
  }, [theme, isDark]);

  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
