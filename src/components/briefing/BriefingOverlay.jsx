import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import GlassCard from '../ui/GlassCard';

/**
 * BriefingOverlay Component
 *
 * Morning briefing modal with real data:
 * - Today's task stats
 * - Tessa's personalized summary based on actual tasks
 * - Audio playback option (PRO)
 */
const BriefingOverlay = ({ isOpen, onClose, onAskTessa }) => {
  const { theme } = useTheme();
  const { tasks, categories } = useData();
  const [isPlaying, setIsPlaying] = useState(false);

  // Get today's data
  const todayData = useMemo(() => {
    const today = new Date();
    const todayStr = today.toDateString();

    // Tasks due today
    const todayTasks = tasks.filter(t => {
      if (!t.dueDate || t.isCompleted) return false;
      return new Date(t.dueDate).toDateString() === todayStr;
    });

    // High priority tasks
    const urgentTasks = tasks.filter(t =>
      !t.isCompleted && t.priority === 'high'
    );

    // Overdue tasks
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.isCompleted) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(23, 59, 59);
      return dueDate < today;
    });

    // Active tasks
    const activeTasks = tasks.filter(t => !t.isCompleted);

    return {
      todayTasks,
      urgentTasks,
      overdueTasks,
      activeTasks,
      todayCount: todayTasks.length,
      urgentCount: urgentTasks.length,
      overdueCount: overdueTasks.length,
      activeCount: activeTasks.length,
    };
  }, [tasks]);

  // Generate personalized summary
  const briefingSummary = useMemo(() => {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
    if (hour >= 18) greeting = 'Good evening';

    let summary = `${greeting}, Geri! `;

    if (todayData.activeCount === 0) {
      summary += "You're all caught up! No pending tasks.";
      return summary;
    }

    summary += "Here's your day:\n\n";

    // Today's tasks
    if (todayData.todayCount > 0) {
      summary += `• ${todayData.todayCount} task${todayData.todayCount > 1 ? 's' : ''} due today\n`;
      todayData.todayTasks.slice(0, 2).forEach(task => {
        const cat = categories.find(c => c.id === task.categoryId);
        summary += `  - ${task.title}${task.priority === 'high' ? ' (high priority)' : ''}`;
        if (cat) summary += ` [${cat.name}]`;
        summary += '\n';
      });
      if (todayData.todayCount > 2) {
        summary += `  ...and ${todayData.todayCount - 2} more\n`;
      }
    }

    // Urgent tasks
    if (todayData.urgentCount > 0) {
      summary += `\n• ${todayData.urgentCount} urgent task${todayData.urgentCount > 1 ? 's' : ''} need attention\n`;
    }

    // Overdue tasks
    if (todayData.overdueCount > 0) {
      summary += `\n• ${todayData.overdueCount} overdue task${todayData.overdueCount > 1 ? 's' : ''} — consider rescheduling\n`;
    }

    // Recommendation
    if (todayData.urgentCount > 0) {
      const firstUrgent = todayData.urgentTasks[0];
      summary += `\nI'd recommend starting with "${firstUrgent.title}" first.`;
    } else if (todayData.todayCount > 0) {
      const firstToday = todayData.todayTasks[0];
      summary += `\nLet's start with "${firstToday.title}".`;
    }

    return summary;
  }, [todayData, categories]);

  if (!isOpen) return null;

  const stats = [
    { n: todayData.todayCount, label: 'Today', color: theme.accent },
    { n: todayData.urgentCount, label: 'Urgent', color: '#EF4444' },
    { n: todayData.overdueCount, label: 'Overdue', color: '#F59E0B' },
  ];

  // Get time-based title
  const getTitle = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning Brief';
    if (hour < 18) return 'Afternoon Check-in';
    return 'Evening Summary';
  };

  const getEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️';
    if (hour < 18) return '🌤️';
    return '🌙';
  };

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
            {getEmoji()} {getTitle()}
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
