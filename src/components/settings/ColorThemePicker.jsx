import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ColorThemePicker Component
 *
 * Displays all 8 available color palettes as selectable circles.
 * Shows palette name, emoji, and gradient preview.
 */
const ColorThemePicker = () => {
  const { theme, accentId, setAccent, getAvailablePalettes } = useTheme();
  const palettes = getAvailablePalettes();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
    }}>
      {palettes.map((palette) => {
        const isSelected = accentId === palette.id;

        return (
          <button
            key={palette.id}
            onClick={() => setAccent(palette.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: 8,
              background: isSelected ? theme.surface : 'transparent',
              border: isSelected ? `2px solid ${palette.primary}` : '2px solid transparent',
              borderRadius: 16,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {/* Color circle with gradient */}
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: palette.gradient,
              boxShadow: isSelected
                ? `0 4px 16px ${palette.primary}40`
                : '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              transition: 'all 0.2s',
              transform: isSelected ? 'scale(1.1)' : 'scale(1)',
            }}>
              {isSelected && (
                <svg width={20} height={20} viewBox="0 0 24 24" fill="white">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>

            {/* Palette name */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 14 }}>{palette.emoji}</span>
              <p style={{
                color: isSelected ? palette.primary : theme.textMuted,
                fontSize: 11,
                fontWeight: isSelected ? 600 : 400,
                margin: '2px 0 0',
              }}>
                {palette.name}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ColorThemePicker;
