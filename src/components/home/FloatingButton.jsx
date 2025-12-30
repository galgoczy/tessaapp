import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * FloatingButton Component
 *
 * Fixed bottom button to trigger voice interaction with Tessa.
 * Features pulse animation and shimmer text effect.
 */
const FloatingButton = ({ onClick }) => {
  const { theme } = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: theme.surfaceGlass,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 28,
        padding: '10px 20px 10px 10px',
        border: `1px solid ${theme.borderGlass}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
        cursor: 'pointer',
        zIndex: 50,
      }}
    >
      {/* Orb icon */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: theme.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 4px 16px ${theme.glowColor}`,
        animation: 'pulse 2.5s ease-in-out infinite',
      }}>
        {/* Mic icon */}
        <svg width={18} height={18} viewBox="0 0 24 24" fill="white">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
        </svg>
      </div>

      {/* Text with shimmer */}
      <span className="shimmer" style={{
        color: theme.text,
        fontSize: 15,
        fontWeight: 500,
      }}>
        Let Tessa help you
      </span>
    </div>
  );
};

export default FloatingButton;
