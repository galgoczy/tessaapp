import React, { createContext, useContext, useState, useEffect } from 'react';
import { buildTheme, accentPalettes } from '../styles/themes';

/**
 * Theme Context
 * 
 * Provides app-wide theming with:
 * - Dark/Light mode toggle
 * - Accent color palette selection
 * - Persistent storage of preferences
 */

const ThemeContext = createContext(null);

// Storage keys
const STORAGE_KEYS = {
  MODE: 'tessa_theme_mode',
  ACCENT: 'tessa_accent_palette',
};

export const ThemeProvider = ({ children }) => {
  // Initialize from localStorage or defaults
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.MODE) || 'dark';
    }
    return 'dark';
  });

  const [accentId, setAccentId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.ACCENT) || 'sunset';
    }
    return 'sunset';
  });

  // Build theme object
  const theme = buildTheme(mode, accentId);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODE, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCENT, accentId);
  }, [accentId]);

  // Toggle dark/light mode
  const toggleMode = () => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Set specific mode
  const setThemeMode = (newMode) => {
    if (newMode === 'dark' || newMode === 'light') {
      setMode(newMode);
    }
  };

  // Set accent palette
  const setAccent = (paletteId) => {
    if (accentPalettes[paletteId]) {
      setAccentId(paletteId);
    }
  };

  // Get all available palettes for picker
  const getAvailablePalettes = () => {
    return Object.values(accentPalettes);
  };

  const value = {
    theme,
    mode,
    accentId,
    isDark: mode === 'dark',
    toggleMode,
    setThemeMode,
    setAccent,
    getAvailablePalettes,
    palettes: accentPalettes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for consuming theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
