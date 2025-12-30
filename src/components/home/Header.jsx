import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';

// SVG Icons component
const Icon = ({ name, color, size = 20 }) => {
  const icons = {
    settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    notes: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
    mail: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    tasks: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    projects: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    account: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    ),
    sun: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    moon: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  };

  return icons[name] || null;
};

/**
 * Header Component
 *
 * Displays greeting, user name, and avatar with dropdown menu.
 * Dark mode toggle is now inside the menu.
 */
const Header = ({ onNavigate }) => {
  const { theme, isDark, toggleMode, toggleAccentStyle, isFilledStyle } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const menuItems = [
    { icon: 'settings', label: 'Settings', screen: 'settings' },
    { icon: 'notes', label: 'Notes', screen: 'notes' },
    { icon: 'mail', label: 'Mail', screen: 'mail' },
    { icon: 'calendar', label: 'Calendars', screen: 'calendars' },
    { icon: 'tasks', label: 'Tasks', screen: 'tasks' },
    { icon: 'projects', label: 'Projects', screen: 'projects' },
    { icon: 'account', label: 'Account', screen: 'account' },
  ];

  const handleMenuClick = (screen) => {
    setShowMenu(false);
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  const handleThemeToggle = () => {
    toggleMode();
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
          Geri
        </h1>
      </div>

      {/* Right side: Theme toggle + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Quick theme toggle button */}
        <button
          onClick={toggleMode}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: theme.surfaceGlass,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid ${theme.borderGlass}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          <Icon name={isDark ? 'sun' : 'moon'} color={theme.accent} size={18} />
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
                minWidth: 180,
                zIndex: 99,
                padding: 8,
              }}
            >
              {/* Theme toggle */}
              <button
                onClick={handleThemeToggle}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'none',
                  border: 'none',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  color: theme.text,
                  fontSize: 14,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = theme.surface}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <Icon name={isDark ? 'sun' : 'moon'} color={theme.accent} />
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>

              {/* Divider */}
              <div style={{
                height: 1,
                background: theme.border,
                margin: '4px 8px',
              }} />

              {/* Menu items */}
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
                    gap: 12,
                    cursor: 'pointer',
                    color: theme.text,
                    fontSize: 14,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = theme.surface}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <Icon name={item.icon} color={theme.accent} />
                  {item.label}
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
