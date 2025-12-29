import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';

/**
 * Header Component
 *
 * Displays greeting, user name, theme toggle, and avatar with dropdown menu.
 */
const Header = ({ onNavigate }) => {
  const { theme, isDark, toggleMode } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const menuItems = [
    { icon: '⚙️', label: 'Settings', screen: 'settings' },
    { icon: '📝', label: 'Notes', screen: 'notes' },
    { icon: '📧', label: 'Mail', screen: 'mail' },
    { icon: '📅', label: 'Calendars', screen: 'calendars' },
    { icon: '✓', label: 'Tasks', screen: 'tasks' },
    { icon: '📁', label: 'Projects', screen: 'projects' },
    { icon: '👤', label: 'Account', screen: 'account' },
  ];

  const handleMenuClick = (screen) => {
    setShowMenu(false);
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 24,
    }}>
      {/* Greeting */}
      <div>
        <p style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 4 }}>
          {getGreeting()},
        </p>
        <h1 style={{ color: theme.text, fontSize: 28, fontWeight: 700, margin: 0 }}>
          Geri 👋
        </h1>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleMode}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: theme.surfaceGlass,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid ${theme.borderGlass}`,
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Avatar with menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B7355 0%, #E8D5B7 50%, #4A90A4 100%)',
              border: `2px solid ${theme.borderGlass}`,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          />

          {/* Dropdown menu */}
          {showMenu && (
            <>
              <div
                onClick={() => setShowMenu(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 98 }}
              />
              <GlassCard
                theme={theme}
                style={{
                  position: 'absolute',
                  top: 52,
                  right: 0,
                  minWidth: 170,
                  zIndex: 99,
                  padding: 8,
                }}
              >
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleMenuClick(item.screen)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'none',
                      border: 'none',
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      cursor: 'pointer',
                      color: theme.text,
                      fontSize: 14,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = theme.surface}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
              </GlassCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
