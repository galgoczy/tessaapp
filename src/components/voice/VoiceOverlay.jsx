import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';
import WaveAnimation from './WaveAnimation';

/**
 * VoiceOverlay Component
 *
 * Voice interaction modal with wave animation and centered mic button.
 * Closes on X button or clicking outside the modal.
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

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
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
      }}
    >
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

        {/* Title - centered */}
        <p style={{
          color: theme.textSecondary,
          fontSize: 13,
          letterSpacing: 1,
          marginBottom: 16,
          textAlign: 'center',
          width: '100%',
        }}>
          Talk with Tessa
        </p>

        {/* Status text - centered */}
        <p style={{
          color: theme.text,
          fontSize: 18,
          fontWeight: 500,
          marginBottom: 24,
          textAlign: 'center',
          width: '100%',
        }}>
          {isListening ? 'Listening...' : 'Tap and hold to speak'}
        </p>

        {/* Wave animation - centered */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}>
          <WaveAnimation
            phase={wavePhase}
            isActive={isListening}
            colors={[theme.accent, theme.accentLight, theme.secondary]}
          />
        </div>

        {/* Centered mic button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginBottom: 32,
        }}>
          <button
            className="mic-button"
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
              transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
              boxShadow: isListening
                ? `0 0 32px ${theme.glowColor}`
                : '0 4px 16px rgba(0,0,0,0.1)',
              animation: isListening ? 'none' : 'micPulse 2.5s ease-in-out infinite',
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
        </div>

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

      {/* Pulse animation */}
      <style>{`
        @keyframes micPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default VoiceOverlay;
