import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';

/**
 * MorningBrief Component
 *
 * Clickable card showing quick summary of the day.
 * Opens the full briefing overlay when tapped.
 */
const MorningBrief = ({ onClick }) => {
  const { theme } = useTheme();

  return (
    <GlassCard
      theme={theme}
      onClick={onClick}
      glow
      style={{
        padding: 18,
        marginBottom: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      {/* Content */}
      <div style={{ flex: 1 }}>
        <p style={{ color: theme.accent, fontSize: 16, fontWeight: 600, margin: 0 }}>
          Quick Morning Brief
        </p>
        <p style={{ color: theme.textMuted, fontSize: 13, margin: 0 }}>
          3 meetings • 2 urgent
        </p>
      </div>

      {/* Arrow */}
      <span style={{ color: theme.accent, fontSize: 20 }}>→</span>
    </GlassCard>
  );
};

export default MorningBrief;
