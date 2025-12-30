import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';

/**
 * VoiceOverlay Component
 *
 * Simplified voice interaction modal.
 * Features centered microphone button with push-to-talk.
 */
const VoiceOverlay = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [isListening, setIsListening] = useState(false);

  // Reset listening state when closing
  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const suggestions = ['My day', 'Emails', 'New task', 'Notes'];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: theme.overlayBg,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <GlassCard theme={theme} style={{
        width: '100%',
        maxWidth: 380,
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            color: theme.textMuted,
            fontSize: 22,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          ×
        </button>

        {/* Title */}
        <p style={{
          color: theme.textSecondary,
          fontSize: 13,
          letterSpacing: 1,
          marginBottom: 16,
        }}>
          Talk with Tessa
        </p>

        {/* Status text */}
        <p style={{
          color: theme.text,
          fontSize: 18,
          fontWeight: 500,
          marginBottom: 40,
          textAlign: 'center',
        }}>
          {isListening ? 'Listening...' : 'Tap and hold to speak'}
        </p>

        {/* Microphone button - centered, simple */}
        <button
          onMouseDown={() => setIsListening(true)}
          onMouseUp={() => setIsListening(false)}
          onMouseLeave={() => setIsListening(false)}
          onTouchStart={() => setIsListening(true)}
          onTouchEnd={() => setIsListening(false)}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: isListening ? theme.accent : theme.surfaceGlass,
            border: `2px solid ${isListening ? theme.accent : theme.borderGlass}`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: isListening
              ? `0 0 32px ${theme.glowColor}`
              : '0 4px 16px rgba(0,0,0,0.1)',
            marginBottom: 40,
          }}
        >
          <svg
            width={28}
            height={28}
            viewBox="0 0 24 24"
            fill={isListening ? 'white' : theme.accent}
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
          </svg>
        </button>

        {/* Suggestion chips */}
        <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {suggestions.map(s => (
            <button
              key={s}
              style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                padding: '8px 14px',
                color: theme.textMuted,
                fontSize: 13,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = theme.surfaceGlass;
                e.currentTarget.style.color = theme.text;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = theme.surface;
                e.currentTarget.style.color = theme.textMuted;
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default VoiceOverlay;
