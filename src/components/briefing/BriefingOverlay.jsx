import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';

/**
 * BriefingOverlay Component
 *
 * Morning briefing modal with:
 * - Audio playback option (PRO)
 * - Stats overview (meetings, urgent, overdue)
 * - Tessa's personalized summary
 * - Ask Tessa action button
 */
const BriefingOverlay = ({ isOpen, onClose, onAskTessa }) => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const briefingSummary = `Good morning, Geri! Here's your day:

• First meeting with Tom at 8:00 AM — high priority
• Client call with Kezia at 10:00 AM on Zoom
• 2 urgent emails awaiting response
• 1 overdue task: Q4 budget review

I'd recommend tackling Peter's email first, then Sarah's designs before your 10 AM call.`;

  const stats = [
    { n: 3, label: 'Meetings', color: theme.accent },
    { n: 2, label: 'Urgent', color: theme.error },
    { n: 1, label: 'Overdue', color: theme.secondary },
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: theme.overlayBg,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '60px 20px 20px',
      overflowY: 'auto',
    }}>
      <GlassCard theme={theme} style={{ width: '100%', maxWidth: 400, padding: 24 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 600, margin: 0 }}>
            ☀️ Morning Brief
          </h2>
          <button
            onClick={() => { onClose(); setIsPlaying(false); }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              color: theme.textMuted,
              fontSize: 20,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* PRO Audio Player */}
        <div style={{
          background: theme.glassGradient,
          borderRadius: 16,
          padding: '14px 16px',
          marginBottom: 16,
          border: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: theme.gradient,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${theme.glowColor}`,
            }}
          >
            {isPlaying ? (
              <svg width={14} height={14} fill="white" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width={14} height={14} fill="white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ color: theme.text, fontSize: 14, fontWeight: 500, margin: 0 }}>
              {isPlaying ? 'Tessa is reading...' : 'Let Tessa read this'}
            </p>
            <p style={{ color: theme.textSecondary, fontSize: 12, margin: 0 }}>
              <span style={{
                background: theme.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
              }}>
                PRO
              </span>
            </p>
          </div>

          {/* Audio bars animation */}
          {isPlaying && (
            <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 18 }}>
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className="audio-bar"
                  style={{
                    width: 3,
                    background: theme.accent,
                    borderRadius: 2,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          marginBottom: 16,
        }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: theme.surface,
              backdropFilter: 'blur(10px)',
              borderRadius: 14,
              padding: 14,
              textAlign: 'center',
              border: `1px solid ${theme.border}`,
            }}>
              <p style={{ color: s.color, fontSize: 22, fontWeight: 700, margin: 0 }}>
                {s.n}
              </p>
              <p style={{ color: theme.textSecondary, fontSize: 11, margin: 0 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tessa's Summary */}
        <div style={{
          background: theme.surface,
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          border: `1px solid ${theme.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: theme.gradient,
              boxShadow: `0 2px 8px ${theme.glowColor}`,
            }} />
            <p style={{ color: theme.accent, fontSize: 13, fontWeight: 600, margin: 0 }}>
              Tessa's Summary
            </p>
          </div>
          <p style={{
            color: theme.text,
            fontSize: 13,
            lineHeight: 1.7,
            margin: 0,
            whiteSpace: 'pre-line',
          }}>
            {briefingSummary}
          </p>
        </div>

        {/* Ask Tessa button */}
        <button
          onClick={onAskTessa}
          style={{
            width: '100%',
            background: theme.glassGradient,
            borderRadius: 14,
            padding: 14,
            border: `1px solid ${theme.border}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: theme.gradient,
          }} />
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: theme.text, fontSize: 14, fontWeight: 500, margin: 0 }}>
              Ask Tessa
            </p>
            <p style={{ color: theme.textSecondary, fontSize: 12, margin: 0 }}>
              "What should I do first?"
            </p>
          </div>
        </button>
      </GlassCard>

      {/* Audio bar animation styles */}
      <style>{`
        .audio-bar { animation: bar 0.4s ease-in-out infinite; }
        @keyframes bar {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
      `}</style>
    </div>
  );
};

export default BriefingOverlay;
