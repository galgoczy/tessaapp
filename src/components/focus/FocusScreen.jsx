import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  play: (color) => (
    <svg width={32} height={32} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  pause: (color) => (
    <svg width={32} height={32} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  ),
  stop: (color) => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ),
  skip: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  ),
  coffee: (color) => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  target: (color) => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  settings: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

const SESSION_TYPES = {
  focus: { label: 'Focus', color: '#6366F1', defaultDuration: 25 },
  shortBreak: { label: 'Short Break', color: '#10B981', defaultDuration: 5 },
  longBreak: { label: 'Long Break', color: '#06B6D4', defaultDuration: 15 },
};

/**
 * FocusScreen Component
 *
 * Pomodoro-style focus timer with:
 * - Customizable focus/break durations
 * - Session tracking
 * - Statistics
 */
const FocusScreen = ({ onBack }) => {
  const { theme } = useTheme();
  const {
    focusSessions,
    startFocusSession,
    completeFocusSession,
    cancelFocusSession,
    getTodayFocusTime,
    tasks,
  } = useData();

  // Timer state
  const [sessionType, setSessionType] = useState('focus');
  const [duration, setDuration] = useState(SESSION_TYPES.focus.defaultDuration);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Custom durations
  const [customDurations, setCustomDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const intervalRef = useRef(null);

  // Get incomplete tasks for task picker
  const incompleteTasks = tasks.filter(t => !t.isCompleted);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timer
  const startTimer = useCallback(() => {
    if (!isRunning) {
      const session = startFocusSession({
        type: sessionType,
        duration: duration,
        taskId: selectedTaskId,
      });
      setCurrentSessionId(session.id);
      setIsRunning(true);
    }
  }, [isRunning, sessionType, duration, selectedTaskId, startFocusSession]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Resume timer
  const resumeTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Reset timer
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    if (currentSessionId) {
      cancelFocusSession(currentSessionId);
      setCurrentSessionId(null);
    }
  }, [duration, currentSessionId, cancelFocusSession]);

  // Complete session
  const completeSession = useCallback(() => {
    if (currentSessionId) {
      completeFocusSession(currentSessionId);
      setCurrentSessionId(null);
    }
    setIsRunning(false);

    if (sessionType === 'focus') {
      setSessionsCompleted(prev => prev + 1);

      // Auto switch to break
      if ((sessionsCompleted + 1) % 4 === 0) {
        setSessionType('longBreak');
        const newDuration = customDurations.longBreak;
        setDuration(newDuration);
        setTimeLeft(newDuration * 60);
      } else {
        setSessionType('shortBreak');
        const newDuration = customDurations.shortBreak;
        setDuration(newDuration);
        setTimeLeft(newDuration * 60);
      }
    } else {
      // After break, switch to focus
      setSessionType('focus');
      const newDuration = customDurations.focus;
      setDuration(newDuration);
      setTimeLeft(newDuration * 60);
    }
  }, [currentSessionId, sessionType, sessionsCompleted, customDurations, completeFocusSession]);

  // Skip to next
  const skipSession = useCallback(() => {
    if (currentSessionId) {
      cancelFocusSession(currentSessionId);
      setCurrentSessionId(null);
    }
    setIsRunning(false);

    if (sessionType === 'focus') {
      setSessionType('shortBreak');
      const newDuration = customDurations.shortBreak;
      setDuration(newDuration);
      setTimeLeft(newDuration * 60);
    } else {
      setSessionType('focus');
      const newDuration = customDurations.focus;
      setDuration(newDuration);
      setTimeLeft(newDuration * 60);
    }
  }, [sessionType, customDurations, currentSessionId, cancelFocusSession]);

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      completeSession();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, completeSession]);

  // Update timer when session type changes (only when not running)
  const switchSessionType = (type) => {
    if (!isRunning && !currentSessionId) {
      setSessionType(type);
      const newDuration = customDurations[type];
      setDuration(newDuration);
      setTimeLeft(newDuration * 60);
    }
  };

  // Calculate progress
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  // Stats
  const todayFocusTime = getTodayFocusTime();
  const todayHours = Math.floor(todayFocusTime / 60);
  const todayMins = todayFocusTime % 60;

  const currentConfig = SESSION_TYPES[sessionType];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        padding: '50px 20px 20px',
        background: `${theme.bg}ee`,
        backdropFilter: 'blur(16px)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
              Focus Mode
            </h1>
            <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>
              Stay concentrated
            </p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
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
            {Icons.settings(theme.textMuted)}
          </button>
        </div>
      </div>

      {/* Session type tabs */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          display: 'flex',
          gap: 8,
          background: theme.surface,
          borderRadius: 12,
          padding: 4,
        }}>
          {Object.entries(SESSION_TYPES).map(([key, config]) => (
            <button
              key={key}
              onClick={() => switchSessionType(key)}
              disabled={isRunning}
              style={{
                flex: 1,
                padding: '10px 8px',
                background: sessionType === key ? config.color : 'transparent',
                border: 'none',
                borderRadius: 10,
                color: sessionType === key ? 'white' : theme.textMuted,
                fontSize: 13,
                fontWeight: 500,
                cursor: isRunning ? 'not-allowed' : 'pointer',
                opacity: isRunning && sessionType !== key ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timer circle */}
      <div style={{ padding: '0 20px 30px', textAlign: 'center' }}>
        <div style={{
          position: 'relative',
          width: 280,
          height: 280,
          margin: '0 auto',
        }}>
          {/* Background circle */}
          <svg
            width={280}
            height={280}
            style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
          >
            <circle
              cx={140}
              cy={140}
              r={130}
              fill="none"
              stroke={theme.surface}
              strokeWidth={12}
            />
            <circle
              cx={140}
              cy={140}
              r={130}
              fill="none"
              stroke={currentConfig.color}
              strokeWidth={12}
              strokeDasharray={`${2 * Math.PI * 130}`}
              strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>

          {/* Timer content */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <p style={{
              color: currentConfig.color,
              fontSize: 14,
              fontWeight: 500,
              margin: '0 0 8px',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              {currentConfig.label}
            </p>
            <p style={{
              color: theme.text,
              fontSize: 56,
              fontWeight: 700,
              margin: 0,
              fontFamily: 'monospace',
            }}>
              {formatTime(timeLeft)}
            </p>
            <p style={{ color: theme.textMuted, fontSize: 13, margin: '8px 0 0' }}>
              Session {sessionsCompleted + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Task selector */}
      {sessionType === 'focus' && !isRunning && (
        <div style={{ padding: '0 20px 20px' }}>
          <GlassCard theme={theme} style={{ padding: 14 }}>
            <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>
              Working on
            </p>
            <select
              value={selectedTaskId || ''}
              onChange={(e) => setSelectedTaskId(e.target.value || null)}
              style={{
                width: '100%',
                padding: 12,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 10,
                color: theme.text,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <option value="">No specific task</option>
              {incompleteTasks.map(task => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
          </GlassCard>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: '0 20px 30px' }}>
        {isRunning ? (
          <>
            <button
              onClick={pauseTimer}
              style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: theme.surface,
                border: `2px solid ${currentConfig.color}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {Icons.pause(currentConfig.color)}
            </button>
            <button
              onClick={resetTimer}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            >
              {Icons.stop(theme.textMuted)}
            </button>
          </>
        ) : currentSessionId ? (
          <>
            <button
              onClick={resumeTimer}
              style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: currentConfig.color,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 20px ${currentConfig.color}50`,
              }}
            >
              {Icons.play('white')}
            </button>
            <button
              onClick={resetTimer}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            >
              {Icons.stop(theme.textMuted)}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={startTimer}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: currentConfig.color,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 20px ${currentConfig.color}50`,
              }}
            >
              {Icons.play('white')}
            </button>
            <button
              onClick={skipSession}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            >
              {Icons.skip(theme.textMuted)}
            </button>
          </>
        )}
      </div>

      {/* Stats */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <GlassCard theme={theme} style={{ padding: 16, textAlign: 'center' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `${theme.accent}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              {Icons.target(theme.accent)}
            </div>
            <p style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
              {sessionsCompleted}
            </p>
            <p style={{ color: theme.textMuted, fontSize: 12, margin: '4px 0 0' }}>
              Sessions today
            </p>
          </GlassCard>

          <GlassCard theme={theme} style={{ padding: 16, textAlign: 'center' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: '#10B98115',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              {Icons.coffee('#10B981')}
            </div>
            <p style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
              {todayHours > 0 ? `${todayHours}h ${todayMins}m` : `${todayMins}m`}
            </p>
            <p style={{ color: theme.textMuted, fontSize: 12, margin: '4px 0 0' }}>
              Focus time today
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Settings modal */}
      {showSettings && (
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
            <h3 style={{ color: theme.text, fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
              Timer Settings
            </h3>

            {/* Focus duration */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: theme.text, fontSize: 14 }}>Focus duration</span>
                <span style={{ color: theme.accent, fontSize: 14, fontWeight: 600 }}>
                  {customDurations.focus} min
                </span>
              </label>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={customDurations.focus}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCustomDurations(prev => ({ ...prev, focus: val }));
                  if (sessionType === 'focus' && !isRunning) {
                    setDuration(val);
                    setTimeLeft(val * 60);
                  }
                }}
                style={{
                  width: '100%',
                  marginTop: 8,
                  accentColor: theme.accent,
                }}
              />
            </div>

            {/* Short break duration */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: theme.text, fontSize: 14 }}>Short break</span>
                <span style={{ color: '#10B981', fontSize: 14, fontWeight: 600 }}>
                  {customDurations.shortBreak} min
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={customDurations.shortBreak}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCustomDurations(prev => ({ ...prev, shortBreak: val }));
                  if (sessionType === 'shortBreak' && !isRunning) {
                    setDuration(val);
                    setTimeLeft(val * 60);
                  }
                }}
                style={{
                  width: '100%',
                  marginTop: 8,
                  accentColor: '#10B981',
                }}
              />
            </div>

            {/* Long break duration */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: theme.text, fontSize: 14 }}>Long break</span>
                <span style={{ color: '#06B6D4', fontSize: 14, fontWeight: 600 }}>
                  {customDurations.longBreak} min
                </span>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={customDurations.longBreak}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCustomDurations(prev => ({ ...prev, longBreak: val }));
                  if (sessionType === 'longBreak' && !isRunning) {
                    setDuration(val);
                    setTimeLeft(val * 60);
                  }
                }}
                style={{
                  width: '100%',
                  marginTop: 8,
                  accentColor: '#06B6D4',
                }}
              />
            </div>

            <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 16 }}>
              Long break every 4 focus sessions
            </p>

            <button
              onClick={() => setShowSettings(false)}
              style={{
                width: '100%',
                padding: 14,
                background: theme.accent,
                border: 'none',
                borderRadius: 12,
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default FocusScreen;
