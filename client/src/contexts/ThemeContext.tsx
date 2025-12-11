import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Get time-based theme based on user's local time
  const getTimeBasedTheme = (): Theme => {
    const hour = new Date().getHours();
    // Dark mode from 6 PM (18:00) to 6 AM (06:00)
    return (hour >= 18 || hour < 6) ? 'dark' : 'light';
  };

  // Initialize theme
  const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
      // Check if user has manually set theme in current session
      const sessionTheme = sessionStorage.getItem('theme') as Theme | null;
      if (sessionTheme) {
        return sessionTheme;
      }
      // Otherwise use time-based theme
      return getTimeBasedTheme();
    }
    return 'light'; // Fallback for SSR
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [userOverride, setUserOverride] = useState<boolean>(() => {
    // Check if user has a session override on initialization
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('theme') !== null;
    }
    return false;
  });

  useEffect(() => {
    // Apply theme to DOM
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Auto-update theme based on time if user hasn't manually overridden
    if (!userOverride) {
      const interval = setInterval(() => {
        const timeBasedTheme = getTimeBasedTheme();
        if (timeBasedTheme !== theme) {
          setTheme(timeBasedTheme);
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [theme, userOverride]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setUserOverride(true);
    // Store user's preference in session storage (will be cleared on session end)
    sessionStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 