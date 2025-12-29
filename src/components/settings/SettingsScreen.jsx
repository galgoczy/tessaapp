import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';
import ColorThemePicker from './ColorThemePicker';
import SettingsItem from './SettingsItem';

/**
 * SettingsScreen Component
 *
 * Full settings page with sections:
 * - Appearance (dark/light mode, color themes)
 * - Voice & Sound
 * - Notifications
 * - Account
 */
const SettingsScreen = ({ onBack }) => {
  const { theme, isDark, toggleMode } = useTheme();

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        padding: '50px 20px 16px',
        background: `${theme.bg}ee`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <button
          onClick={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: theme.surfaceGlass,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.borderGlass}`,
            color: theme.text,
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ←
        </button>
        <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
          Settings
        </h1>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Appearance Section */}
        <section style={{ marginBottom: 32 }}>
          <p style={{
            color: theme.textSecondary,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1,
            marginBottom: 12,
            textTransform: 'uppercase',
          }}>
            Appearance
          </p>

          <GlassCard theme={theme} style={{ padding: 0, overflow: 'hidden' }}>
            {/* Dark mode toggle */}
            <SettingsItem
              icon={isDark ? '🌙' : '☀️'}
              label="Dark Mode"
              description="Switch between dark and light themes"
              type="toggle"
              value={isDark}
              onChange={toggleMode}
            />

            {/* Color Theme Picker */}
            <div style={{
              padding: 16,
              borderTop: `1px solid ${theme.border}`,
            }}>
              <div style={{ marginBottom: 12 }}>
                <p style={{ color: theme.text, fontSize: 15, fontWeight: 500, margin: 0 }}>
                  Color Theme
                </p>
                <p style={{ color: theme.textSecondary, fontSize: 13, margin: '4px 0 0' }}>
                  Choose your accent color palette
                </p>
              </div>
              <ColorThemePicker />
            </div>
          </GlassCard>
        </section>

        {/* Voice & Sound Section */}
        <section style={{ marginBottom: 32 }}>
          <p style={{
            color: theme.textSecondary,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1,
            marginBottom: 12,
            textTransform: 'uppercase',
          }}>
            Voice & Sound
          </p>

          <GlassCard theme={theme} style={{ padding: 0, overflow: 'hidden' }}>
            <SettingsItem
              icon="🎙️"
              label="Tessa Voice"
              description="Natural"
              type="arrow"
            />
            <SettingsItem
              icon="👋"
              label="Hey Tessa"
              description="Wake word activation"
              type="toggle"
              value={false}
              pro
            />
            <SettingsItem
              icon="💬"
              label="Continuous Conversation"
              description="Keep talking without tapping"
              type="toggle"
              value={false}
              pro
              isLast
            />
          </GlassCard>
        </section>

        {/* Notifications Section */}
        <section style={{ marginBottom: 32 }}>
          <p style={{
            color: theme.textSecondary,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1,
            marginBottom: 12,
            textTransform: 'uppercase',
          }}>
            Notifications
          </p>

          <GlassCard theme={theme} style={{ padding: 0, overflow: 'hidden' }}>
            <SettingsItem
              icon="🔔"
              label="Reminders"
              description="Get notified about tasks"
              type="toggle"
              value={true}
            />
            <SettingsItem
              icon="💡"
              label="Proactive Suggestions"
              description="Tessa suggests actions"
              type="toggle"
              value={true}
            />
            <SettingsItem
              icon="☀️"
              label="Daily Summary"
              description="Every day at 8:00 AM"
              type="arrow"
              isLast
            />
          </GlassCard>
        </section>

        {/* Account Section */}
        <section style={{ marginBottom: 32 }}>
          <p style={{
            color: theme.textSecondary,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1,
            marginBottom: 12,
            textTransform: 'uppercase',
          }}>
            Account
          </p>

          <GlassCard theme={theme} style={{ padding: 0, overflow: 'hidden' }}>
            <SettingsItem
              icon="👤"
              label="Profile"
              description="Geri"
              type="arrow"
            />
            <SettingsItem
              icon="⭐"
              label="Tessa PRO"
              description="Upgrade for more features"
              type="arrow"
              highlight
            />
            <SettingsItem
              icon="📤"
              label="Export Data"
              description="Download your information"
              type="arrow"
            />
            <SettingsItem
              icon="🚪"
              label="Log Out"
              type="arrow"
              isLast
            />
          </GlassCard>
        </section>

        {/* Version */}
        <p style={{
          color: theme.textSecondary,
          fontSize: 12,
          textAlign: 'center',
          marginTop: 24,
        }}>
          Tessa v1.0.0
        </p>
      </div>
    </div>
  );
};

export default SettingsScreen;
