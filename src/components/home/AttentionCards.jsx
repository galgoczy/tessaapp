import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';

/**
 * AttentionCards Component
 *
 * Grid of cards showing items that need attention:
 * - Today's schedule (gradient card, spans 2 rows)
 * - Urgent emails
 * - Talk with Tessa shortcut
 */
const AttentionCards = ({ onOpenVoice }) => {
  const { theme } = useTheme();

  const tasks = [
    { id: 1, title: 'Meeting with Tom', time: '08:00' },
    { id: 2, title: 'Client call - Kezia', time: '10:00' },
    { id: 3, title: 'UI/UX Webinar', time: '14:00' },
  ];

  const emails = [
    { id: 1, from: 'Peter Smith' },
    { id: 2, from: 'Sarah (Team)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {/* Schedule Card - Gradient, spans 2 rows */}
      <div style={{
        background: theme.gradient,
        borderRadius: 24,
        padding: 18,
        gridRow: 'span 2',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Highlight overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        <p style={{
          color: 'white',
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 14,
          position: 'relative',
        }}>
          Today's Schedule
        </p>

        {tasks.map((task, i) => (
          <div key={task.id} style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 12,
            padding: 12,
            marginBottom: i < tasks.length - 1 ? 8 : 0,
          }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: '0 0 2px' }}>
              {task.time}
            </p>
            <p style={{ color: 'white', fontSize: 12, fontWeight: 500, margin: 0 }}>
              {task.title}
            </p>
          </div>
        ))}
      </div>

      {/* Email Card */}
      <GlassCard theme={theme} style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>📧</span>
          <span style={{
            background: theme.error,
            borderRadius: 8,
            padding: '3px 10px',
            fontSize: 11,
            color: 'white',
            fontWeight: 600,
          }}>
            {emails.length}
          </span>
        </div>
        <p style={{ color: theme.text, fontSize: 13, fontWeight: 500, margin: '0 0 10px' }}>
          Urgent emails
        </p>
        {emails.map((e, i) => (
          <div key={e.id} style={{
            background: theme.surface,
            borderRadius: 10,
            padding: '10px 12px',
            marginBottom: i === 0 ? 6 : 0,
          }}>
            <p style={{ color: theme.text, fontSize: 12, fontWeight: 500, margin: 0 }}>
              {e.from}
            </p>
          </div>
        ))}
      </GlassCard>

      {/* Talk with Tessa Card */}
      <GlassCard
        theme={theme}
        onClick={onOpenVoice}
        style={{
          padding: 16,
          background: theme.glassGradient,
        }}
      >
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: theme.gradient,
          marginBottom: 12,
          boxShadow: `0 4px 12px ${theme.glowColor}`,
        }} />
        <p style={{ color: theme.text, fontSize: 14, fontWeight: 600, margin: 0 }}>
          Talk with Tessa
        </p>
      </GlassCard>
    </div>
  );
};

export default AttentionCards;
