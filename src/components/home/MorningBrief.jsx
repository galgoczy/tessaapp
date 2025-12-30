import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * MorningBrief Component
 *
 * Clickable card showing quick summary of the day.
 * Supports two accent styles:
 * - Filled: accent background, white text
 * - Outline: white/glass background, accent border and text
 */
const MorningBrief = ({ onClick }) => {
  const { theme, isFilledStyle } = useTheme();

  // Filled style: accent background, white text
  // Outline style: glass background, accent border
  const cardStyle = isFilledStyle
    ? {
        background: theme.gradient,
        border: 'none',
        boxShadow: `0 4px 20px ${theme.glowColor}`,
      }
    : {
        background: theme.surfaceGlass,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `2px solid ${theme.accent}`,
        boxShadow: `0 4px 20px ${theme.glowColor}40`,
      };

  const titleColor = isFilledStyle ? 'white' : theme.accent;
  const subtitleColor = isFilledStyle ? 'rgba(255,255,255,0.8)' : theme.textMuted;
  const arrowColor = isFilledStyle ? 'white' : theme.accent;

  return (
    <div
      onClick={onClick}
      style={{
        padding: 18,
        marginBottom: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        borderRadius: 20,
        cursor: 'pointer',
        transition: 'all 0.3s',
        ...cardStyle,
      }}
    >
      {/* Content */}
      <div style={{ flex: 1 }}>
        <p style={{ color: titleColor, fontSize: 16, fontWeight: 600, margin: 0 }}>
          Quick Morning Brief
        </p>
        <p style={{ color: subtitleColor, fontSize: 13, margin: 0 }}>
          3 meetings • 2 urgent
        </p>
      </div>

      {/* Arrow */}
      <span style={{ color: arrowColor, fontSize: 20 }}>→</span>
    </div>
  );
};

export default MorningBrief;
