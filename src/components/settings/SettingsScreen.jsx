import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import GlassCard from '../ui/GlassCard';
import ColorThemePicker from './ColorThemePicker';
import SettingsItem from './SettingsItem';

// SVG Icon component for settings
const SettingsIcon = ({ name, color, size = 22 }) => {
  const icons = {
    moon: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
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
    mic: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    waveform: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h4l3-9 3 18 3-9h4" />
      </svg>
    ),
    messageCircle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    bell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    lightbulb: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    star: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    download: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    logOut: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  };

  return icons[name] || null;
};

// Voice options
const VOICE_OPTIONS = [
  { id: 'natural', name: 'Natural', description: 'Calm and clear' },
  { id: 'friendly', name: 'Friendly', description: 'Warm and casual' },
  { id: 'professional', name: 'Professional', description: 'Formal and precise' },
];

// Time options for daily summary
const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '18:00', '19:00', '20:00',
];

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
  const { settings, updateSettings, exportData } = useData();

  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editingName, setEditingName] = useState(settings.userName);

  // Helper to render icon
  const icon = (name) => <SettingsIcon name={name} color={theme.accent} />;

  const handleVoiceSelect = (voiceId) => {
    updateSettings({ tessaVoice: voiceId });
    setShowVoicePicker(false);
  };

  const handleTimeSelect = (time) => {
    updateSettings({ dailySummaryTime: time });
    setShowTimePicker(false);
  };

  const handleSaveName = () => {
    if (editingName.trim()) {
      updateSettings({ userName: editingName.trim() });
    }
    setShowProfileEdit(false);
  };

  const handleExport = () => {
    exportData();
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${minutes} ${ampm}`;
  };

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
              icon={icon(isDark ? 'moon' : 'sun')}
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
              icon={icon('mic')}
              label="Tessa Voice"
              description={VOICE_OPTIONS.find(v => v.id === settings.tessaVoice)?.name || 'Natural'}
              type="arrow"
              onClick={() => setShowVoicePicker(true)}
            />
            <SettingsItem
              icon={icon('waveform')}
              label="Hey Tessa"
              description="Wake word activation"
              type="toggle"
              value={settings.wakeWordEnabled}
              onChange={(val) => settings.isPro && updateSettings({ wakeWordEnabled: val })}
              pro={!settings.isPro}
            />
            <SettingsItem
              icon={icon('messageCircle')}
              label="Continuous Conversation"
              description="Keep talking without tapping"
              type="toggle"
              value={settings.continuousConversation}
              onChange={(val) => settings.isPro && updateSettings({ continuousConversation: val })}
              pro={!settings.isPro}
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
              icon={icon('bell')}
              label="Reminders"
              description="Get notified about tasks"
              type="toggle"
              value={settings.remindersEnabled}
              onChange={(val) => updateSettings({ remindersEnabled: val })}
            />
            <SettingsItem
              icon={icon('lightbulb')}
              label="Proactive Suggestions"
              description="Tessa suggests actions"
              type="toggle"
              value={settings.proactiveSuggestions}
              onChange={(val) => updateSettings({ proactiveSuggestions: val })}
            />
            <SettingsItem
              icon={icon('clock')}
              label="Daily Summary"
              description={settings.dailySummaryEnabled ? `Every day at ${formatTime(settings.dailySummaryTime)}` : 'Disabled'}
              type="arrow"
              onClick={() => setShowTimePicker(true)}
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
              icon={icon('user')}
              label="Profile"
              description={settings.userName}
              type="arrow"
              onClick={() => {
                setEditingName(settings.userName);
                setShowProfileEdit(true);
              }}
            />
            <SettingsItem
              icon={icon('star')}
              label="Tessa PRO"
              description={settings.isPro ? 'Active' : 'Upgrade for more features'}
              type="arrow"
              highlight={!settings.isPro}
              onClick={() => updateSettings({ isPro: !settings.isPro })}
            />
            <SettingsItem
              icon={icon('download')}
              label="Export Data"
              description="Download your information"
              type="arrow"
              onClick={handleExport}
            />
            <SettingsItem
              icon={icon('logOut')}
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
          Tessa v1.0.0 {settings.isPro && '• PRO'}
        </p>
      </div>

      {/* Voice Picker Modal */}
      {showVoicePicker && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }} onClick={() => setShowVoicePicker(false)}>
          <GlassCard
            theme={theme}
            style={{ width: '100%', maxWidth: 320, padding: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ color: theme.text, fontSize: 18, fontWeight: 600, margin: '0 0 16px' }}>
              Select Voice
            </h3>
            {VOICE_OPTIONS.map(voice => (
              <button
                key={voice.id}
                onClick={() => handleVoiceSelect(voice.id)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: settings.tessaVoice === voice.id ? `${theme.accent}20` : 'transparent',
                  border: `1px solid ${settings.tessaVoice === voice.id ? theme.accent : theme.border}`,
                  borderRadius: 12,
                  marginBottom: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: theme.text, fontSize: 15, fontWeight: 500, margin: 0 }}>
                    {voice.name}
                  </p>
                  <p style={{ color: theme.textSecondary, fontSize: 13, margin: '2px 0 0' }}>
                    {voice.description}
                  </p>
                </div>
                {settings.tessaVoice === voice.id && (
                  <SettingsIcon name="check" color={theme.accent} size={20} />
                )}
              </button>
            ))}
          </GlassCard>
        </div>
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }} onClick={() => setShowTimePicker(false)}>
          <GlassCard
            theme={theme}
            style={{ width: '100%', maxWidth: 320, padding: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ color: theme.text, fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>
              Daily Summary Time
            </h3>

            {/* Enable/Disable toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              marginBottom: 12,
              borderBottom: `1px solid ${theme.border}`,
            }}>
              <span style={{ color: theme.text, fontSize: 14 }}>Enable daily summary</span>
              <button
                onClick={() => updateSettings({ dailySummaryEnabled: !settings.dailySummaryEnabled })}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  background: settings.dailySummaryEnabled ? theme.accent : theme.border,
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  background: '#fff',
                  position: 'absolute',
                  top: 3,
                  left: settings.dailySummaryEnabled ? 23 : 3,
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>

            {settings.dailySummaryEnabled && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}>
                {TIME_OPTIONS.map(time => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    style={{
                      padding: '10px 8px',
                      background: settings.dailySummaryTime === time ? theme.accent : 'transparent',
                      border: `1px solid ${settings.dailySummaryTime === time ? theme.accent : theme.border}`,
                      borderRadius: 8,
                      color: settings.dailySummaryTime === time ? '#fff' : theme.text,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {formatTime(time)}
                  </button>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }} onClick={() => setShowProfileEdit(false)}>
          <GlassCard
            theme={theme}
            style={{ width: '100%', maxWidth: 320, padding: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ color: theme.text, fontSize: 18, fontWeight: 600, margin: '0 0 16px' }}>
              Edit Profile
            </h3>

            <label style={{
              display: 'block',
              color: theme.textSecondary,
              fontSize: 13,
              marginBottom: 8
            }}>
              Your name
            </label>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              style={{
                width: '100%',
                padding: '12px 14px',
                background: theme.surfaceGlass,
                border: `1px solid ${theme.border}`,
                borderRadius: 10,
                color: theme.text,
                fontSize: 15,
                marginBottom: 16,
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowProfileEdit(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.text,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveName}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: theme.accent,
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
