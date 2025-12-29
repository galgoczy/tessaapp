/**
 * Tessa App - Theme System
 * 
 * This file contains all color palettes and theme configurations.
 * Use with ThemeContext to provide app-wide theming.
 */

// Base colors that don't change with accent
export const baseColors = {
  dark: {
    bg: '#0a0a0f',
    surface: 'rgba(255, 255, 255, 0.05)',
    surfaceGlass: 'rgba(255, 255, 255, 0.08)',
    surfaceSolid: '#151519',
    text: '#FFFFFF',
    textMuted: '#a1a1aa',
    textSecondary: '#71717a',
    border: 'rgba(255, 255, 255, 0.1)',
    borderGlass: 'rgba(255, 255, 255, 0.15)',
    overlayBg: 'rgba(10, 10, 15, 0.75)',
    error: '#f87171',
    success: '#4ade80',
    warning: '#fbbf24',
  },
  light: {
    bg: '#fafafa',
    surface: 'rgba(0, 0, 0, 0.03)',
    surfaceGlass: 'rgba(255, 255, 255, 0.7)',
    surfaceSolid: '#ffffff',
    text: '#18181b',
    textMuted: '#52525b',
    textSecondary: '#71717a',
    border: 'rgba(0, 0, 0, 0.08)',
    borderGlass: 'rgba(255, 255, 255, 0.5)',
    overlayBg: 'rgba(250, 250, 250, 0.8)',
    error: '#dc2626',
    success: '#16a34a',
    warning: '#d97706',
  },
};

// Accent color palettes
export const accentPalettes = {
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌅',
    primary: '#fb923c',
    primaryLight: '#fdba74',
    primaryDark: '#ea580c',
    secondary: '#f472b6',
    tertiary: '#a78bfa',
    gradient: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #a78bfa 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(251,146,60,0.15) 0%, rgba(244,114,182,0.1) 50%, rgba(167,139,250,0.15) 100%)',
    glowColor: 'rgba(251, 146, 60, 0.4)',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    primary: '#38bdf8',
    primaryLight: '#7dd3fc',
    primaryDark: '#0284c7',
    secondary: '#22d3ee',
    tertiary: '#a78bfa',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #22d3ee 50%, #a78bfa 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(34,211,238,0.1) 50%, rgba(167,139,250,0.15) 100%)',
    glowColor: 'rgba(56, 189, 248, 0.4)',
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    emoji: '🌲',
    primary: '#4ade80',
    primaryLight: '#86efac',
    primaryDark: '#16a34a',
    secondary: '#2dd4bf',
    tertiary: '#38bdf8',
    gradient: 'linear-gradient(135deg, #4ade80 0%, #2dd4bf 50%, #38bdf8 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(74,222,128,0.15) 0%, rgba(45,212,191,0.1) 50%, rgba(56,189,248,0.15) 100%)',
    glowColor: 'rgba(74, 222, 128, 0.4)',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    emoji: '💜',
    primary: '#a78bfa',
    primaryLight: '#c4b5fd',
    primaryDark: '#7c3aed',
    secondary: '#f472b6',
    tertiary: '#fb7185',
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb7185 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(244,114,182,0.1) 50%, rgba(251,113,133,0.15) 100%)',
    glowColor: 'rgba(167, 139, 250, 0.4)',
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    emoji: '🌸',
    primary: '#fb7185',
    primaryLight: '#fda4af',
    primaryDark: '#e11d48',
    secondary: '#f472b6',
    tertiary: '#e879f9',
    gradient: 'linear-gradient(135deg, #fb7185 0%, #f472b6 50%, #e879f9 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(251,113,133,0.15) 0%, rgba(244,114,182,0.1) 50%, rgba(232,121,249,0.15) 100%)',
    glowColor: 'rgba(251, 113, 133, 0.4)',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    emoji: '🌙',
    primary: '#6366f1',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    secondary: '#8b5cf6',
    tertiary: '#a78bfa',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(167,139,250,0.15) 100%)',
    glowColor: 'rgba(99, 102, 241, 0.4)',
  },
  ember: {
    id: 'ember',
    name: 'Ember',
    emoji: '🔥',
    primary: '#f87171',
    primaryLight: '#fca5a5',
    primaryDark: '#dc2626',
    secondary: '#fb923c',
    tertiary: '#fbbf24',
    gradient: 'linear-gradient(135deg, #f87171 0%, #fb923c 50%, #fbbf24 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(248,113,113,0.15) 0%, rgba(251,146,60,0.1) 50%, rgba(251,191,36,0.15) 100%)',
    glowColor: 'rgba(248, 113, 113, 0.4)',
  },
  mint: {
    id: 'mint',
    name: 'Mint',
    emoji: '🍃',
    primary: '#2dd4bf',
    primaryLight: '#5eead4',
    primaryDark: '#0d9488',
    secondary: '#4ade80',
    tertiary: '#a3e635',
    gradient: 'linear-gradient(135deg, #2dd4bf 0%, #4ade80 50%, #a3e635 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(45,212,191,0.15) 0%, rgba(74,222,128,0.1) 50%, rgba(163,230,53,0.15) 100%)',
    glowColor: 'rgba(45, 212, 191, 0.4)',
  },
};

// Helper to build complete theme
export const buildTheme = (mode = 'dark', accentId = 'sunset') => {
  const base = baseColors[mode];
  const accent = accentPalettes[accentId];

  return {
    mode,
    accentId,
    ...base,
    accent: accent.primary,
    accentLight: accent.primaryLight,
    accentDark: accent.primaryDark,
    secondary: accent.secondary,
    tertiary: accent.tertiary,
    gradient: accent.gradient,
    glassGradient: accent.glassGradient,
    glowColor: accent.glowColor,
  };
};

// Default theme
export const defaultTheme = buildTheme('dark', 'sunset');

// Typography scale
export const typography = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  sizes: {
    xs: '11px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '22px',
    '4xl': '28px',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// Spacing scale
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '10px',
  base: '12px',
  lg: '14px',
  xl: '16px',
  '2xl': '18px',
  '3xl': '20px',
  '4xl': '24px',
  '5xl': '32px',
  '6xl': '40px',
};

// Border radius scale
export const radii = {
  sm: '8px',
  md: '10px',
  base: '12px',
  lg: '14px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '28px',
  full: '9999px',
};

// Shadows
export const shadows = {
  glass: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
  glassDark: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
  glassGlow: (color) => `0 8px 32px ${color}, inset 0 1px 0 rgba(255,255,255,0.1)`,
  elevated: '0 10px 40px rgba(0,0,0,0.3)',
  button: (color) => `0 4px 16px ${color}`,
};

// Animation durations
export const transitions = {
  fast: '0.15s',
  normal: '0.2s',
  slow: '0.3s',
  slower: '0.4s',
  slowest: '0.5s',
};

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  modal: 1000,
  tooltip: 1100,
  toast: 1200,
};
