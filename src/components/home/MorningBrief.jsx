import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

/**
 * MorningBrief Component
 *
 * Clickable card showing quick summary of the day.
 * Shows real data: today's tasks, high priority items, events.
 */
const MorningBrief = ({ onClick }) => {
  const { theme, isFilledStyle } = useTheme();
  const { tasks, settings } = useData();

  // Calculate today's stats
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();

    // Tasks due today
    const todayTasks = tasks.filter(t => {
      if (!t.dueDate || t.isCompleted) return false;
      return new Date(t.dueDate).toDateString() === today;
    });

    // High priority tasks
    const urgentTasks = tasks.filter(t =>
      !t.isCompleted && t.priority === 'high'
    );

    // Active tasks (not completed)
    const activeTasks = tasks.filter(t => !t.isCompleted);

    return {
      todayCount: todayTasks.length,
      urgentCount: urgentTasks.length,
      activeCount: activeTasks.length,
    };
  }, [tasks]);

  // Build summary text
  const getSummaryText = () => {
    const parts = [];

    if (todayStats.todayCount > 0) {
      parts.push(`${todayStats.todayCount} due today`);
    }

    if (todayStats.urgentCount > 0) {
      parts.push(`${todayStats.urgentCount} urgent`);
    }

    if (parts.length === 0) {
      if (todayStats.activeCount > 0) {
        return `${todayStats.activeCount} active tasks`;
      }
      return 'All clear for today!';
    }

    return parts.join(' • ');
  };

  // Filled style: accent background, white text
  // Outline style: glass background, accent border
  const cardStyle = isFilledStyle
    ? {
        background: theme.gradient,
        border: 'none',
        boxShadow: `0 4px 20px ${theme.glowColor}`,
      }
    : {
        background: theme.surfaceGlass,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `2px solid ${theme.accent}`,
        boxShadow: `0 4px 20px ${theme.glowColor}40`,
      };

  const titleColor = isFilledStyle ? 'white' : theme.accent;
  const subtitleColor = isFilledStyle ? 'rgba(255,255,255,0.8)' : theme.textMuted;
  const arrowColor = isFilledStyle ? 'white' : theme.accent;

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = settings?.userName || 'User';
    if (hour < 12) return `Good Morning, ${name}`;
    if (hour < 18) return `Good Afternoon, ${name}`;
    return `Good Evening, ${name}`;
  };

  return (
    <div
      onClick={onClick}
      style={{
        padding: 18,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        borderRadius: 20,
        cursor: 'pointer',
        transition: 'all 0.3s',
        ...cardStyle,
      }}
    >
      {/* Content */}
      <div style={{ flex: 1 }}>
        <p style={{ color: titleColor, fontSize: 16, fontWeight: 600, margin: 0 }}>
          {getGreeting()}
        </p>
        <p style={{ color: subtitleColor, fontSize: 13, margin: 0 }}>
          {getSummaryText()}
        </p>
      </div>

      {/* Arrow */}
      <span style={{ color: arrowColor, fontSize: 20 }}>→</span>
    </div>
  );
};

export default MorningBrief;
