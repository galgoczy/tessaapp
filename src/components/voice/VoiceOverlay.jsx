import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';
import TessaOrb from './TessaOrb';
import WaveAnimation from './WaveAnimation';

/**
 * VoiceOverlay Component
 *
 * Full-screen modal for voice interaction with Tessa.
 * Features:
 * - Animated wave visualization
 * - Tessa orb with pulse effect
 * - Push-to-talk microphone button
 * - Quick suggestion chips
 */
const VoiceOverlay = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [wavePhase, setWavePhase] = useState(0);

  // Animate wave when overlay is open
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setWavePhase(p => p + 0.12);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

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
          marginBottom: 24,
          textAlign: 'center',
        }}>
          {isListening ? 'Listening...' : 'Tap and hold to speak'}
        </p>

        {/* Wave animation */}
        <WaveAnimation
          phase={wavePhase}
          isActive={isListening}
          colors={[theme.accent, theme.secondary, theme.tertiary]}
        />

        {/* Tessa Orb */}
        <div style={{ marginBottom: 24 }}>
          <TessaOrb
            size={80}
            active={isListening}
            theme={theme}
          />
        </div>

        {/* Microphone button */}
        <button
          onMouseDown={() => setIsListening(true)}
          onMouseUp={() => setIsListening(false)}
          onMouseLeave={() => setIsListening(false)}
          onTouchStart={() => setIsListening(true)}
          onTouchEnd={() => setIsListening(false)}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: isListening ? theme.secondary : theme.surfaceGlass,
            border: `2px solid ${isListening ? theme.secondary : theme.border}`,
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: isListening ? `0 0 24px ${theme.secondary}40` : 'none',
          }}
        >
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill={isListening ? 'white' : theme.textMuted}
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
          </svg>
        </button>

        {/* Suggestion chips */}
        <div style={{
          marginTop: 24,
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
