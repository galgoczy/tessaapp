import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
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
};

/**
 * CalendarsScreen Component
 *
 * Calendar view with:
 * - Week view with day selection
 * - Events list for selected day
 * - Synced calendar indicators
 */
const CalendarsScreen = ({ onBack }) => {
  const { theme, isFilledStyle } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });

  // Sample events
  const events = [
    {
      id: '1',
      title: 'Team Standup',
      startTime: '09:00',
      endTime: '09:30',
      location: 'Zoom',
      color: '#4F46E5',
      calendarSource: 'google',
    },
    {
      id: '2',
      title: 'Client Meeting',
      startTime: '11:00',
      endTime: '12:00',
      location: 'Conference Room A',
      color: '#059669',
      calendarSource: 'google',
    },
    {
      id: '3',
      title: 'Lunch with Sarah',
      startTime: '12:30',
      endTime: '13:30',
      location: 'Cafe Luna',
      color: '#F59E0B',
      calendarSource: 'local',
    },
    {
      id: '4',
      title: 'Project Review',
      startTime: '15:00',
      endTime: '16:30',
      location: 'Meeting Room B',
      color: '#EF4444',
      calendarSource: 'outlook',
    },
  ];

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

  const navigateWeek = (direction) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + (direction * 7));
    setCurrentWeekStart(newStart);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const formatMonthYear = () => {
    return currentWeekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const calendarSourceColors = {
    google: '#4285F4',
    apple: '#000000',
    outlook: '#0078D4',
    local: theme.accent,
  };

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

        {/* Month navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <button
            onClick={() => navigateWeek(-1)}
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
            onClick={() => navigateWeek(1)}
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

        {/* Week view */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 6,
          paddingBottom: 16,
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
      </div>

      {/* Events section */}
      <div style={{ padding: '0 20px' }}>
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

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📅</p>
            <p style={{ color: theme.textMuted, fontSize: 16 }}>No events today</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {events.map(event => (
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
                            {event.startTime} - {event.endTime}
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
