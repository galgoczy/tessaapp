import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * SettingsItem Component
 *
 * Reusable settings row with icon, label, description,
 * and optional toggle/arrow/pro badge.
 */
const SettingsItem = ({
  icon,
  label,
  description,
  type = 'arrow', // 'toggle', 'arrow', 'none'
  value,
  onChange,
  pro = false,
  highlight = false,
  isLast = false,
}) => {
  const { theme } = useTheme();

  const handleClick = () => {
    if (type === 'toggle' && onChange) {
      onChange(!value);
    }
  };

  return (
    <div
      onClick={type === 'toggle' ? handleClick : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 16,
        borderBottom: isLast ? 'none' : `1px solid ${theme.border}`,
        cursor: type === 'toggle' ? 'pointer' : 'default',
        transition: 'background 0.2s',
      }}
    >
      {/* Icon */}
      <span style={{ fontSize: 22 }}>{icon}</span>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{
            color: highlight ? theme.accent : theme.text,
            fontSize: 15,
            fontWeight: 500,
            margin: 0,
          }}>
            {label}
          </p>

          {/* PRO badge */}
          {pro && (
            <span style={{
              background: theme.gradient,
              padding: '2px 6px',
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 700,
              color: 'white',
            }}>
              PRO
            </span>
          )}
        </div>

        {description && (
          <p style={{
            color: theme.textSecondary,
            fontSize: 13,
            margin: '2px 0 0',
          }}>
            {description}
          </p>
        )}
      </div>

      {/* Right side control */}
      {type === 'toggle' && (
        <div style={{
          width: 50,
          height: 30,
          borderRadius: 15,
          background: value ? theme.accent : theme.surface,
          border: `1px solid ${value ? theme.accent : theme.border}`,
          position: 'relative',
          transition: 'all 0.2s',
          cursor: 'pointer',
        }}>
          <div style={{
            position: 'absolute',
            top: 3,
            left: value ? 23 : 3,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'left 0.2s',
          }} />
        </div>
      )}

      {type === 'arrow' && (
        <span style={{ color: theme.textMuted, fontSize: 18 }}>→</span>
      )}
    </div>
  );
};

export default SettingsItem;
