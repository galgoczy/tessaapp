import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import GlassCard from '../ui/GlassCard';

// SVG Icons
const Icons = {
  back: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  plus: (color) => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M12 4v16M4 12h16" />
    </svg>
  ),
  check: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  fire: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
      <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.5 1.5-4.5 3-6 .5 2.5 2 3.5 3 4 1.5-2 2-5 1-8 4.5 2 6 5.5 6 10 0 3.866-3.134 7-7 7z" />
    </svg>
  ),
  trash: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  edit: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  chevronLeft: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  chevronRight: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
};

const HABIT_ICONS = ['✨', '💪', '📚', '🏃', '💧', '🧘', '💤', '🍎', '💊', '🎯', '✍️', '🎹', '🌅', '🚶', '🧠', '💰'];
const HABIT_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6'];

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * HabitsScreen Component
 *
 * Habit tracking with:
 * - Daily habit checklist
 * - Streak tracking
 * - Weekly calendar view
 * - Habit management (add/edit/delete)
 */
const HabitsScreen = ({ onBack }) => {
  const { theme } = useTheme();
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    isHabitCompletedOnDate,
  } = useData();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  // New habit form
  const [newHabit, setNewHabit] = useState({
    title: '',
    icon: '✨',
    color: HABIT_COLORS[0],
    targetDays: [0, 1, 2, 3, 4, 5, 6],
  });

  // Get week dates
  const getWeekDates = (date) => {
    const week = [];
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const goToPrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleToggleHabit = (habitId) => {
    if (isHabitCompletedOnDate(habitId, selectedDate)) {
      uncompleteHabit(habitId, selectedDate);
    } else {
      completeHabit(habitId, selectedDate);
    }
  };

  const handleAddHabit = () => {
    if (!newHabit.title.trim()) return;
    addHabit(newHabit);
    setNewHabit({
      title: '',
      icon: '✨',
      color: HABIT_COLORS[0],
      targetDays: [0, 1, 2, 3, 4, 5, 6],
    });
    setShowAddHabit(false);
  };

  const handleSaveEdit = () => {
    if (!editingHabit) return;
    updateHabit(editingHabit.id, editingHabit);
    setEditingHabit(null);
  };

  const handleDeleteHabit = (habitId) => {
    if (confirm('Delete this habit? All history will be lost.')) {
      deleteHabit(habitId);
      setEditingHabit(null);
    }
  };

  const toggleTargetDay = (dayIndex, isEdit = false) => {
    if (isEdit && editingHabit) {
      const days = editingHabit.targetDays.includes(dayIndex)
        ? editingHabit.targetDays.filter(d => d !== dayIndex)
        : [...editingHabit.targetDays, dayIndex];
      setEditingHabit({ ...editingHabit, targetDays: days });
    } else {
      const days = newHabit.targetDays.includes(dayIndex)
        ? newHabit.targetDays.filter(d => d !== dayIndex)
        : [...newHabit.targetDays, dayIndex];
      setNewHabit({ ...newHabit, targetDays: days });
    }
  };

  // Filter habits for selected day
  const todayDayOfWeek = selectedDate.getDay();
  const activeHabits = habits.filter(h =>
    !h.isArchived && (h.targetDays || []).includes(todayDayOfWeek)
  );

  const completedCount = activeHabits.filter(h => isHabitCompletedOnDate(h.id, selectedDate)).length;
  const completionPercent = activeHabits.length > 0
    ? Math.round((completedCount / activeHabits.length) * 100)
    : 0;

  // Calculate total stats
  const totalStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak || 0), 0);
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        padding: '50px 20px 16px',
        background: `${theme.bg}ee`,
        backdropFilter: 'blur(16px)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <button
            onClick={onBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: theme.surfaceGlass,
              border: `1px solid ${theme.borderGlass}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Icons.back(theme.text)}
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
              Habits
            </h1>
            <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>
              {habits.length} habit{habits.length !== 1 ? 's' : ''} tracked
            </p>
          </div>
        </div>

        {/* Week navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <button
            onClick={goToPrevWeek}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Icons.chevronLeft(theme.textMuted)}
          </button>

          <button
            onClick={goToToday}
            style={{
              padding: '8px 16px',
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              color: theme.text,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {weekDates[0].toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </button>

          <button
            onClick={goToNextWeek}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Icons.chevronRight(theme.textMuted)}
          </button>
        </div>

        {/* Week days */}
        <div style={{ display: 'flex', gap: 6 }}>
          {weekDates.map((date, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDate(date)}
              style={{
                flex: 1,
                padding: '8px 4px',
                background: isSelected(date) ? theme.accent : isToday(date) ? `${theme.accent}20` : theme.surface,
                border: isToday(date) && !isSelected(date) ? `1px solid ${theme.accent}` : `1px solid ${isSelected(date) ? theme.accent : theme.border}`,
                borderRadius: 12,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <p style={{
                color: isSelected(date) ? 'white' : theme.textMuted,
                fontSize: 11,
                margin: 0,
                fontWeight: 500,
              }}>
                {WEEKDAYS[idx]}
              </p>
              <p style={{
                color: isSelected(date) ? 'white' : theme.text,
                fontSize: 16,
                fontWeight: 600,
                margin: '4px 0 0',
              }}>
                {date.getDate()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <GlassCard theme={theme} style={{ padding: 14, textAlign: 'center' }}>
            <p style={{ color: theme.accent, fontSize: 24, fontWeight: 700, margin: 0 }}>
              {completionPercent}%
            </p>
            <p style={{ color: theme.textMuted, fontSize: 11, margin: '4px 0 0' }}>Today</p>
          </GlassCard>
          <GlassCard theme={theme} style={{ padding: 14, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              {Icons.fire('#F59E0B')}
              <p style={{ color: '#F59E0B', fontSize: 24, fontWeight: 700, margin: 0 }}>
                {totalStreak}
              </p>
            </div>
            <p style={{ color: theme.textMuted, fontSize: 11, margin: '4px 0 0' }}>Streak</p>
          </GlassCard>
          <GlassCard theme={theme} style={{ padding: 14, textAlign: 'center' }}>
            <p style={{ color: '#10B981', fontSize: 24, fontWeight: 700, margin: 0 }}>
              {longestStreak}
            </p>
            <p style={{ color: theme.textMuted, fontSize: 11, margin: '4px 0 0' }}>Best</p>
          </GlassCard>
        </div>
      </div>

      {/* Progress bar */}
      {activeHabits.length > 0 && (
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{
            height: 8,
            background: theme.surface,
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${completionPercent}%`,
              background: theme.gradient,
              borderRadius: 4,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <p style={{ color: theme.textMuted, fontSize: 12, marginTop: 8, textAlign: 'center' }}>
            {completedCount} of {activeHabits.length} completed today
          </p>
        </div>
      )}

      {/* Add habit form */}
      {showAddHabit && (
        <div style={{ padding: '0 20px 16px' }}>
          <GlassCard theme={theme} style={{ padding: 16 }}>
            <input
              type="text"
              placeholder="Habit name"
              value={newHabit.title}
              onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
              autoFocus
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                outline: 'none',
                color: theme.text,
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 16,
              }}
            />

            {/* Icon picker */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>Icon</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {HABIT_ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewHabit({ ...newHabit, icon })}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: newHabit.icon === icon ? `${newHabit.color}20` : theme.surface,
                      border: `2px solid ${newHabit.icon === icon ? newHabit.color : 'transparent'}`,
                      cursor: 'pointer',
                      fontSize: 20,
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>Color</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {HABIT_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewHabit({ ...newHabit, color })}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: color,
                      border: newHabit.color === color ? '3px solid white' : 'none',
                      boxShadow: newHabit.color === color ? `0 0 0 2px ${color}` : 'none',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Target days */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>Repeat on</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {WEEKDAY_NAMES.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleTargetDay(idx)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      background: newHabit.targetDays.includes(idx) ? `${newHabit.color}20` : theme.surface,
                      border: `1px solid ${newHabit.targetDays.includes(idx) ? newHabit.color : theme.border}`,
                      borderRadius: 8,
                      color: newHabit.targetDays.includes(idx) ? newHabit.color : theme.textMuted,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {WEEKDAYS[idx]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleAddHabit}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: theme.accent,
                  border: 'none',
                  borderRadius: 10,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Add Habit
              </button>
              <button
                onClick={() => setShowAddHabit(false)}
                style={{
                  padding: '12px 16px',
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.textMuted,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Habits list */}
      <div style={{ padding: '0 20px' }}>
        {activeHabits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>✨</p>
            <p style={{ color: theme.textMuted, fontSize: 16 }}>
              {habits.length === 0 ? 'No habits yet' : 'No habits for this day'}
            </p>
            <p style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8 }}>
              Tap + to create your first habit
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeHabits.map(habit => {
              const isCompleted = isHabitCompletedOnDate(habit.id, selectedDate);

              return (
                <GlassCard
                  key={habit.id}
                  theme={theme}
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', alignItems: 'stretch' }}>
                    {/* Checkbox area */}
                    <button
                      onClick={() => handleToggleHabit(habit.id)}
                      style={{
                        width: 70,
                        background: isCompleted ? habit.color : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                      }}
                    >
                      {isCompleted ? (
                        Icons.check('white')
                      ) : (
                        <span style={{ fontSize: 28 }}>{habit.icon}</span>
                      )}
                    </button>

                    {/* Content */}
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{
                            color: theme.text,
                            fontSize: 15,
                            fontWeight: 600,
                            margin: 0,
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            opacity: isCompleted ? 0.6 : 1,
                          }}>
                            {habit.title}
                          </p>
                          {(habit.currentStreak || 0) > 0 && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              marginTop: 6
                            }}>
                              {Icons.fire('#F59E0B')}
                              <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 600 }}>
                                {habit.currentStreak} day streak
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setEditingHabit(habit)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: theme.surface,
                            border: `1px solid ${theme.border}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {Icons.edit(theme.textMuted)}
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit habit modal */}
      {editingHabit && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: theme.overlayBg,
          backdropFilter: 'blur(16px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
          <GlassCard theme={theme} style={{ width: '100%', maxWidth: 400, padding: 20 }}>
            <h3 style={{ color: theme.text, fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              Edit Habit
            </h3>

            <input
              type="text"
              placeholder="Habit name"
              value={editingHabit.title}
              onChange={(e) => setEditingHabit({ ...editingHabit, title: e.target.value })}
              style={{
                width: '100%',
                padding: 12,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 10,
                color: theme.text,
                fontSize: 15,
                marginBottom: 16,
                outline: 'none',
              }}
            />

            {/* Icon picker */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>Icon</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {HABIT_ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setEditingHabit({ ...editingHabit, icon })}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: editingHabit.icon === icon ? `${editingHabit.color}20` : theme.surface,
                      border: `2px solid ${editingHabit.icon === icon ? editingHabit.color : 'transparent'}`,
                      cursor: 'pointer',
                      fontSize: 20,
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>Color</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {HABIT_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setEditingHabit({ ...editingHabit, color })}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: color,
                      border: editingHabit.color === color ? '3px solid white' : 'none',
                      boxShadow: editingHabit.color === color ? `0 0 0 2px ${color}` : 'none',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Target days */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>Repeat on</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {WEEKDAY_NAMES.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleTargetDay(idx, true)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      background: editingHabit.targetDays.includes(idx) ? `${editingHabit.color}20` : theme.surface,
                      border: `1px solid ${editingHabit.targetDays.includes(idx) ? editingHabit.color : theme.border}`,
                      borderRadius: 8,
                      color: editingHabit.targetDays.includes(idx) ? editingHabit.color : theme.textMuted,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {WEEKDAYS[idx]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleSaveEdit}
                style={{
                  flex: 1,
                  padding: 12,
                  background: theme.accent,
                  border: 'none',
                  borderRadius: 10,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
              <button
                onClick={() => handleDeleteHabit(editingHabit.id)}
                style={{
                  padding: '12px 16px',
                  background: '#EF444420',
                  border: 'none',
                  borderRadius: 10,
                  color: '#EF4444',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setEditingHabit(null)}
                style={{
                  padding: '12px 16px',
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.textMuted,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Floating add button */}
      <button
        onClick={() => setShowAddHabit(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: theme.gradient,
          border: 'none',
          boxShadow: `0 4px 20px ${theme.glowColor}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
      >
        {Icons.plus('white')}
      </button>
    </div>
  );
};

export default HabitsScreen;
