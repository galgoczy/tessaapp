import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ColorThemePicker Component
 *
 * Displays all 8 available color palettes as selectable circles.
 * - First tap: selects the color (filled style)
 * - Second tap on same color: toggles to outline style
 * Shows visual indicator for filled vs outline mode.
 */
const ColorThemePicker = () => {
  const { theme, accentId, accentStyle, setAccent, getAvailablePalettes } = useTheme();
  const palettes = getAvailablePalettes();

  return (
    <div>
      {/* Hint text */}
      <p style={{
        color: theme.textSecondary,
        fontSize: 11,
        marginBottom: 12,
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        Tap again to switch between filled and outline style
      </p>

      {/* Color grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
      }}>
        {palettes.map((palette) => {
          const isSelected = accentId === palette.id;
          const isOutline = accentStyle === 'outline';

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
              {/* Color circle - shows filled or outline based on current style */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: isSelected && isOutline
                  ? 'transparent'
                  : palette.gradient,
                border: isSelected && isOutline
                  ? `3px solid ${palette.primary}`
                  : 'none',
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
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill={isOutline ? palette.primary : 'white'}
                  >
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
                {/* Style indicator for selected */}
                {isSelected && (
                  <p style={{
                    color: theme.textSecondary,
                    fontSize: 9,
                    margin: '2px 0 0',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    {isOutline ? 'outline' : 'filled'}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorThemePicker;
