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
  chevronDown: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  chevronUp: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M18 15l-6-6-6 6" />
    </svg>
  ),
  clock: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  location: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  plus: (color) => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M12 4v16M4 12h16" />
    </svg>
  ),
  calendar: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  list: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  task: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
};

/**
 * CalendarsScreen Component
 *
 * Calendar view with:
 * - Week view with day selection
 * - Month view (expandable)
 * - Next Up mode (upcoming events + tasks)
 * - Events list for selected day
 * - Synced calendar indicators
 */
const CalendarsScreen = ({ onBack }) => {
  const { theme, isFilledStyle } = useTheme();
  const { events, tasks, categories } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'month' | 'nextup'
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sample events (will be replaced with real data)
  const sampleEvents = [
    {
      id: '1',
      title: 'Team Standup',
      startTime: new Date(new Date().setHours(9, 0)),
      endTime: new Date(new Date().setHours(9, 30)),
      location: 'Zoom',
      color: '#4F46E5',
      calendarSource: 'google',
    },
    {
      id: '2',
      title: 'Client Meeting',
      startTime: new Date(new Date().setHours(11, 0)),
      endTime: new Date(new Date().setHours(12, 0)),
      location: 'Conference Room A',
      color: '#059669',
      calendarSource: 'google',
    },
    {
      id: '3',
      title: 'Lunch with Sarah',
      startTime: new Date(new Date().setHours(12, 30)),
      endTime: new Date(new Date().setHours(13, 30)),
      location: 'Cafe Luna',
      color: '#F59E0B',
      calendarSource: 'local',
    },
    {
      id: '4',
      title: 'Project Review',
      startTime: new Date(new Date().setHours(15, 0)),
      endTime: new Date(new Date().setHours(16, 30)),
      location: 'Meeting Room B',
      color: '#EF4444',
      calendarSource: 'outlook',
    },
  ];

  // Get tasks with due dates for Next Up mode
  const upcomingItems = useMemo(() => {
    const now = new Date();
    const items = [];

    // Add events
    sampleEvents.forEach(event => {
      if (event.startTime >= now) {
        items.push({
          ...event,
          type: 'event',
          sortDate: event.startTime,
        });
      }
    });

    // Add tasks with due dates
    tasks.filter(t => !t.isCompleted && t.dueDate).forEach(task => {
      const dueDate = new Date(task.dueDate);
      if (dueDate >= now) {
        const cat = categories.find(c => c.id === task.categoryId);
        items.push({
          id: task.id,
          title: task.title,
          type: 'task',
          sortDate: dueDate,
          dueDate: dueDate,
          priority: task.priority,
          categoryName: cat?.name || 'Uncategorized',
          color: cat?.color || theme.accent,
        });
      }
    });

    // Sort by date
    return items.sort((a, b) => a.sortDate - b.sortDate).slice(0, 20);
  }, [tasks, categories, theme.accent]);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getWeekDates = () => {
    const dates = [];
    const start = new Date(currentWeekStart);
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get the Monday of the first week
    let startDay = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDay.setDate(firstDay.getDate() + diff);

    const dates = [];
    let current = new Date(startDay);

    // Generate 6 weeks of dates
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const navigateWeek = (direction) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + (direction * 7));
    setCurrentWeekStart(newStart);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const formatMonthYear = () => {
    const ref = viewMode === 'month' ? currentMonth : currentWeekStart;
    return ref.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatRelativeDate = (date) => {
    const now = new Date();
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Tomorrow';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const calendarSourceColors = {
    google: '#4285F4',
    apple: '#000000',
    outlook: '#0078D4',
    local: theme.accent,
  };

  const viewModes = [
    { id: 'week', label: 'Week', icon: Icons.calendar },
    { id: 'month', label: 'Month', icon: Icons.calendar },
    { id: 'nextup', label: 'Next Up', icon: Icons.list },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        padding: '50px 20px 0',
        background: `${theme.bg}ee`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
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
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.borderGlass}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Icons.back(theme.text)}
          </button>
          <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
            Calendar
          </h1>
        </div>

        {/* View mode tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16,
          background: theme.surface,
          borderRadius: 12,
          padding: 4,
        }}>
          {viewModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 12px',
                background: viewMode === mode.id
                  ? (isFilledStyle ? theme.gradient : theme.bg)
                  : 'transparent',
                border: viewMode === mode.id
                  ? `1px solid ${theme.accent}`
                  : '1px solid transparent',
                borderRadius: 10,
                cursor: 'pointer',
                color: viewMode === mode.id
                  ? (isFilledStyle ? 'white' : theme.accent)
                  : theme.textMuted,
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              {mode.icon(viewMode === mode.id ? (isFilledStyle ? 'white' : theme.accent) : theme.textMuted)}
              {mode.label}
            </button>
          ))}
        </div>

        {/* Month/Week navigation (not for Next Up) */}
        {viewMode !== 'nextup' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <button
              onClick={() => viewMode === 'month' ? navigateMonth(-1) : navigateWeek(-1)}
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
            <p style={{
              color: theme.text,
              fontSize: 16,
              fontWeight: 600,
              margin: 0,
            }}>
              {formatMonthYear()}
            </p>
            <button
              onClick={() => viewMode === 'month' ? navigateMonth(1) : navigateWeek(1)}
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
        )}

        {/* Week view */}
        {viewMode === 'week' && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 6,
              paddingBottom: 8,
            }}>
              {getWeekDates().map((date, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '8px 4px',
                    background: isSelected(date)
                      ? (isFilledStyle ? theme.gradient : 'transparent')
                      : isToday(date) ? theme.surface : 'transparent',
                    border: isSelected(date)
                      ? `2px solid ${theme.accent}`
                      : isToday(date) ? `1px solid ${theme.border}` : 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{
                    color: isSelected(date)
                      ? (isFilledStyle ? 'white' : theme.accent)
                      : theme.textMuted,
                    fontSize: 11,
                    fontWeight: 500,
                    marginBottom: 4,
                  }}>
                    {weekDays[i]}
                  </span>
                  <span style={{
                    color: isSelected(date)
                      ? (isFilledStyle ? 'white' : theme.accent)
                      : theme.text,
                    fontSize: 16,
                    fontWeight: isSelected(date) || isToday(date) ? 700 : 500,
                  }}>
                    {date.getDate()}
                  </span>
                </button>
              ))}
            </div>

            {/* Expand to month button */}
            <button
              onClick={() => {
                setCurrentMonth(selectedDate);
                setViewMode('month');
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: theme.textMuted,
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              {Icons.chevronDown(theme.textMuted)}
              <span>Show month</span>
            </button>
          </>
        )}

        {/* Month view */}
        {viewMode === 'month' && (
          <>
            {/* Day names header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 4,
              marginBottom: 8,
            }}>
              {weekDays.map(day => (
                <div
                  key={day}
                  style={{
                    textAlign: 'center',
                    color: theme.textMuted,
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '4px 0',
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Month grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 4,
              paddingBottom: 8,
            }}>
              {getMonthDates().map((date, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 4,
                    background: isSelected(date)
                      ? (isFilledStyle ? theme.gradient : 'transparent')
                      : isToday(date) ? theme.surface : 'transparent',
                    border: isSelected(date)
                      ? `2px solid ${theme.accent}`
                      : isToday(date) ? `1px solid ${theme.border}` : 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    opacity: isCurrentMonth(date) ? 1 : 0.3,
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{
                    color: isSelected(date)
                      ? (isFilledStyle ? 'white' : theme.accent)
                      : theme.text,
                    fontSize: 14,
                    fontWeight: isSelected(date) || isToday(date) ? 700 : 400,
                  }}>
                    {date.getDate()}
                  </span>
                </button>
              ))}
            </div>

            {/* Collapse to week button */}
            <button
              onClick={() => setViewMode('week')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: theme.textMuted,
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              {Icons.chevronUp(theme.textMuted)}
              <span>Show week</span>
            </button>
          </>
        )}
      </div>

      {/* Content area */}
      <div style={{ padding: '0 20px' }}>
        {/* Next Up mode */}
        {viewMode === 'nextup' && (
          <>
            <p style={{
              color: theme.textSecondary,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 12,
              marginTop: 16,
            }}>
              Upcoming Events & Tasks
            </p>

            {upcomingItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>🎉</p>
                <p style={{ color: theme.textMuted, fontSize: 16 }}>All clear! Nothing upcoming.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {upcomingItems.map(item => (
                  <GlassCard key={item.id} theme={theme} style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ display: 'flex' }}>
                      {/* Color bar */}
                      <div style={{
                        width: 4,
                        background: item.color,
                      }} />

                      <div style={{ flex: 1, padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            {/* Type badge */}
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              background: `${item.color}20`,
                              color: item.color,
                              padding: '2px 8px',
                              borderRadius: 6,
                              fontSize: 10,
                              fontWeight: 600,
                              marginBottom: 6,
                            }}>
                              {item.type === 'task' ? Icons.task(item.color) : Icons.clock(item.color)}
                              {item.type === 'task' ? 'TASK' : 'EVENT'}
                            </div>

                            <p style={{
                              color: theme.text,
                              fontSize: 15,
                              fontWeight: 600,
                              margin: 0,
                            }}>
                              {item.title}
                            </p>

                            <div style={{
                              display: 'flex',
                              gap: 12,
                              marginTop: 8,
                              flexWrap: 'wrap',
                            }}>
                              {/* Date/time */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                color: theme.textMuted,
                                fontSize: 12,
                              }}>
                                {Icons.clock(theme.textMuted)}
                                {item.type === 'event' ? (
                                  <span>
                                    {formatRelativeDate(item.startTime)} · {formatTime(item.startTime)}
                                  </span>
                                ) : (
                                  <span>Due {formatRelativeDate(item.dueDate)}</span>
                                )}
                              </div>

                              {/* Location for events */}
                              {item.location && (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  color: theme.textMuted,
                                  fontSize: 12,
                                }}>
                                  {Icons.location(theme.textMuted)}
                                  {item.location}
                                </div>
                              )}

                              {/* Category for tasks */}
                              {item.categoryName && (
                                <span style={{
                                  fontSize: 11,
                                  color: theme.textSecondary,
                                  background: theme.surface,
                                  padding: '2px 8px',
                                  borderRadius: 6,
                                }}>
                                  {item.categoryName}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Priority badge for tasks */}
                          {item.priority === 'high' && (
                            <div style={{
                              background: '#EF444420',
                              color: '#EF4444',
                              padding: '4px 8px',
                              borderRadius: 6,
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              HIGH
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </>
        )}

        {/* Day events (for week/month view) */}
        {viewMode !== 'nextup' && (
          <>
            <p style={{
              color: theme.textSecondary,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>

            {sampleEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>📅</p>
                <p style={{ color: theme.textMuted, fontSize: 16 }}>No events today</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sampleEvents.map(event => (
                  <GlassCard key={event.id} theme={theme} style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ display: 'flex' }}>
                      {/* Color bar */}
                      <div style={{
                        width: 4,
                        background: event.color,
                      }} />

                      <div style={{ flex: 1, padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{
                              color: theme.text,
                              fontSize: 15,
                              fontWeight: 600,
                              margin: 0,
                            }}>
                              {event.title}
                            </p>

                            <div style={{
                              display: 'flex',
                              gap: 12,
                              marginTop: 8,
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                color: theme.textMuted,
                                fontSize: 12,
                              }}>
                                {Icons.clock(theme.textMuted)}
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </div>

                              {event.location && (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  color: theme.textMuted,
                                  fontSize: 12,
                                }}>
                                  {Icons.location(theme.textMuted)}
                                  {event.location}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Calendar source indicator */}
                          <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: calendarSourceColors[event.calendarSource],
                          }} />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Calendar sync status */}
      <div style={{ padding: '24px 20px' }}>
        <p style={{
          color: theme.textSecondary,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          Connected Calendars
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { name: 'Google', color: '#4285F4' },
            { name: 'Outlook', color: '#0078D4' },
          ].map(cal => (
            <span
              key={cal.name}
              style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                color: theme.text,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: cal.color,
              }} />
              {cal.name}
            </span>
          ))}
        </div>
      </div>

      {/* Floating add button */}
      <button
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

export default CalendarsScreen;
