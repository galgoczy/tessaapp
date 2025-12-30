import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * FloatingButton Component
 *
 * Simple centered microphone button for voice interaction.
 */
const FloatingButton = ({ onClick }) => {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: theme.surfaceGlass,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${theme.borderGlass}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
        cursor: 'pointer',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateX(-50%) scale(1.08)';
        e.currentTarget.style.boxShadow = `0 12px 40px ${theme.glowColor}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
      }}
    >
      <svg width={24} height={24} viewBox="0 0 24 24" fill={theme.accent}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
      </svg>
    </button>
  );
};

export default FloatingButton;
