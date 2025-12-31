import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import GlassCard from '../ui/GlassCard';
import WaveAnimation from './WaveAnimation';

// Tessa AI response types and logic
const TESSA_RESPONSES = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! What would you like me to help you with?",
    "Hey! I'm ready to assist. What do you need?",
  ],
  tasks: {
    summary: (stats) => `You have ${stats.active} active tasks. ${stats.today > 0 ? `${stats.today} are due today.` : ''} ${stats.urgent > 0 ? `${stats.urgent} are marked as urgent.` : 'No urgent ones!'} What would you like to do?`,
    empty: "You don't have any tasks yet. Would you like me to help you create one?",
    created: (title) => `Got it! I've added "${title}" to your tasks. Anything else?`,
    completed: (title) => `Nice work! "${title}" is now complete.`,
  },
  calendar: {
    summary: (count) => count > 0
      ? `You have ${count} event${count > 1 ? 's' : ''} coming up today. Want me to read them out?`
      : "Your calendar looks clear today. Would you like to schedule something?",
  },
  notes: {
    summary: (count) => `You have ${count} note${count !== 1 ? 's' : ''} saved. What would you like to do?`,
    created: "I've saved that note for you.",
  },
  emails: {
    summary: (unread) => unread > 0
      ? `You have ${unread} unread email${unread > 1 ? 's' : ''}. Should I summarize them?`
      : "No new emails at the moment. Your inbox is all caught up!",
  },
  suggestions: {
    morning: (userName) => `Good morning, ${userName}! Here's what I'd suggest starting with: check your urgent tasks first, then review your calendar for today.`,
    afternoon: (userName) => `Good afternoon, ${userName}! Let me help you stay on track. Would you like a quick update on your remaining tasks?`,
    evening: (userName) => `Good evening, ${userName}! Time to wrap up. I can help you review what you accomplished today or plan for tomorrow.`,
  },
  unknown: [
    "I'm not sure I understood that. Could you try rephrasing?",
    "Hmm, I didn't quite catch that. Can you say it differently?",
    "I'm still learning! Could you try asking in another way?",
  ],
};

// Simulate AI processing
const simulateTessaResponse = (input, data, settings) => {
  const text = input.toLowerCase();
  const userName = settings?.userName || 'there';
  const hour = new Date().getHours();

  // Calculate stats
  const today = new Date().toDateString();
  const taskStats = {
    active: data.tasks.filter(t => !t.isCompleted).length,
    today: data.tasks.filter(t => t.dueDate && !t.isCompleted && new Date(t.dueDate).toDateString() === today).length,
    urgent: data.tasks.filter(t => !t.isCompleted && t.priority === 'high').length,
    completed: data.tasks.filter(t => t.isCompleted).length,
  };

  // Task-related queries
  if (text.includes('task') || text.includes('todo') || text.includes('to do')) {
    if (text.includes('add') || text.includes('create') || text.includes('new')) {
      return {
        type: 'action',
        message: "Sure! What would you like to name the new task?",
        action: 'create_task',
      };
    }
    if (taskStats.active === 0) {
      return { type: 'info', message: TESSA_RESPONSES.tasks.empty };
    }
    return { type: 'info', message: TESSA_RESPONSES.tasks.summary(taskStats) };
  }

  // Calendar queries
  if (text.includes('calendar') || text.includes('schedule') || text.includes('event') || text.includes('meeting')) {
    return { type: 'info', message: TESSA_RESPONSES.calendar.summary(data.events.length) };
  }

  // Email queries
  if (text.includes('email') || text.includes('mail') || text.includes('inbox')) {
    return { type: 'info', message: TESSA_RESPONSES.emails.summary(2) }; // Demo: 2 unread
  }

  // Notes queries
  if (text.includes('note') || text.includes('notes')) {
    if (text.includes('add') || text.includes('create') || text.includes('new')) {
      return {
        type: 'action',
        message: "What would you like me to write down?",
        action: 'create_note',
      };
    }
    return { type: 'info', message: TESSA_RESPONSES.notes.summary(data.notes.length) };
  }

  // Day summary / suggestion
  if (text.includes('my day') || text.includes('today') || text.includes('summary') || text.includes('what should')) {
    if (hour < 12) {
      return { type: 'suggestion', message: TESSA_RESPONSES.suggestions.morning(userName) };
    } else if (hour < 18) {
      return { type: 'suggestion', message: TESSA_RESPONSES.suggestions.afternoon(userName) };
    }
    return { type: 'suggestion', message: TESSA_RESPONSES.suggestions.evening(userName) };
  }

  // Greetings
  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    const greetings = TESSA_RESPONSES.greeting;
    return { type: 'greeting', message: greetings[Math.floor(Math.random() * greetings.length)] };
  }

  // Thank you
  if (text.includes('thank') || text.includes('thanks')) {
    return { type: 'greeting', message: "You're welcome! Is there anything else I can help with?" };
  }

  // Help
  if (text.includes('help') || text.includes('what can you do')) {
    return {
      type: 'info',
      message: "I can help you with:\n• Managing your tasks and to-dos\n• Checking your calendar\n• Creating notes\n• Summarizing your emails\n• Planning your day\n\nJust ask me anything!"
    };
  }

  // Unknown - try to be helpful
  const unknowns = TESSA_RESPONSES.unknown;
  return { type: 'unknown', message: unknowns[Math.floor(Math.random() * unknowns.length)] };
};

/**
 * VoiceOverlay Component
 *
 * Voice interaction modal with Tessa AI functionality.
 * Features:
 * - Voice/text input
 * - Context-aware responses
 * - Action suggestions
 * - Conversation history
 */
const VoiceOverlay = ({ isOpen, onClose, onNavigate }) => {
  const { theme } = useTheme();
  const { tasks, notes, events, settings, addTask, addNote } = useData();

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wavePhase, setWavePhase] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);

  const data = useMemo(() => ({ tasks, notes, events }), [tasks, notes, events]);

  // Initial greeting on open
  useEffect(() => {
    if (isOpen && conversation.length === 0) {
      const hour = new Date().getHours();
      const userName = settings?.userName || 'there';
      let greeting;

      if (hour < 12) {
        greeting = `Good morning, ${userName}! How can I help you today?`;
      } else if (hour < 18) {
        greeting = `Good afternoon, ${userName}! What would you like to do?`;
      } else {
        greeting = `Good evening, ${userName}! How can I assist you?`;
      }

      setConversation([{ role: 'tessa', message: greeting, type: 'greeting' }]);
    }
  }, [isOpen, conversation.length, settings]);

  // Animate wave when overlay is open
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setWavePhase(p => p + 0.12);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setIsProcessing(false);
      setTextInput('');
      // Don't reset conversation - keep history for the session
    }
  }, [isOpen]);

  const processInput = useCallback((input) => {
    if (!input.trim()) return;

    // Add user message to conversation
    setConversation(prev => [...prev, { role: 'user', message: input }]);
    setIsProcessing(true);

    // Handle pending actions
    if (pendingAction) {
      setTimeout(() => {
        if (pendingAction === 'create_task') {
          addTask({ title: input, priority: 'medium' });
          setConversation(prev => [...prev, {
            role: 'tessa',
            message: TESSA_RESPONSES.tasks.created(input),
            type: 'success'
          }]);
        } else if (pendingAction === 'create_note') {
          addNote({ content: input });
          setConversation(prev => [...prev, {
            role: 'tessa',
            message: TESSA_RESPONSES.notes.created,
            type: 'success'
          }]);
        }
        setPendingAction(null);
        setIsProcessing(false);
      }, 800);
      return;
    }

    // Simulate AI processing delay
    setTimeout(() => {
      const response = simulateTessaResponse(input, data, settings);
      setConversation(prev => [...prev, { role: 'tessa', ...response }]);

      if (response.action) {
        setPendingAction(response.action);
      }

      setIsProcessing(false);
    }, 800 + Math.random() * 400);
  }, [data, settings, pendingAction, addTask, addNote]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (textInput.trim()) {
      processInput(textInput);
      setTextInput('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    processInput(suggestion);
  };

  // Simulate voice recognition
  const handleVoiceEnd = () => {
    if (isListening) {
      setIsListening(false);
      // Simulate recognized speech
      const demoQueries = [
        "What are my tasks for today?",
        "Show me my calendar",
        "Help me plan my day",
        "Create a new note",
      ];
      const randomQuery = demoQueries[Math.floor(Math.random() * demoQueries.length)];
      processInput(randomQuery);
    }
  };

  if (!isOpen) return null;

  const suggestions = pendingAction
    ? []
    : ['My day', 'Tasks', 'Calendar', 'New note'];

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
        flexDirection: 'column',
        padding: '60px 20px 20px',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: theme.gradient,
            boxShadow: `0 4px 12px ${theme.glowColor}`,
          }} />
          <div>
            <p style={{ color: theme.text, fontSize: 16, fontWeight: 600, margin: 0 }}>
              Tessa
            </p>
            <p style={{ color: theme.textSecondary, fontSize: 12, margin: 0 }}>
              {isProcessing ? 'Thinking...' : isListening ? 'Listening...' : 'Ready to help'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
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

      {/* Conversation area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {conversation.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <GlassCard
              theme={theme}
              style={{
                padding: '12px 16px',
                maxWidth: '85%',
                background: msg.role === 'user' ? theme.accent : theme.surfaceGlass,
                border: msg.role === 'user' ? 'none' : `1px solid ${theme.borderGlass}`,
              }}
            >
              <p style={{
                color: msg.role === 'user' ? 'white' : theme.text,
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
                whiteSpace: 'pre-line',
              }}>
                {msg.message}
              </p>
            </GlassCard>
            {msg.type === 'success' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 6,
                color: '#10B981',
                fontSize: 12,
              }}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Done
              </div>
            )}
          </div>
        ))}

        {/* Processing indicator */}
        {isProcessing && (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <GlassCard theme={theme} style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: theme.accent,
                      animation: 'typingDot 1s ease-in-out infinite',
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      {suggestions.length > 0 && !isListening && (
        <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => handleSuggestionClick(s)}
              style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                padding: '8px 14px',
                color: theme.textMuted,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Wave animation */}
      {isListening && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          <WaveAnimation
            phase={wavePhase}
            isActive={true}
            colors={[theme.accent, theme.accentLight, theme.secondary]}
          />
        </div>
      )}

      {/* Input area */}
      <div style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}>
        {/* Text input */}
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={pendingAction ? "Type your response..." : "Ask Tessa anything..."}
            style={{
              width: '100%',
              padding: '14px 18px',
              background: theme.surfaceGlass,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.borderGlass}`,
              borderRadius: 20,
              color: theme.text,
              fontSize: 15,
              outline: 'none',
            }}
          />
        </form>

        {/* Mic button */}
        <button
          onMouseDown={() => setIsListening(true)}
          onMouseUp={handleVoiceEnd}
          onMouseLeave={handleVoiceEnd}
          onTouchStart={() => setIsListening(true)}
          onTouchEnd={handleVoiceEnd}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: isListening ? theme.accent : theme.surfaceGlass,
            border: `2px solid ${isListening ? theme.accent : theme.borderGlass}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: isListening ? `0 0 24px ${theme.glowColor}` : 'none',
            flexShrink: 0,
          }}
        >
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill={isListening ? 'white' : theme.accent}
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
          </svg>
        </button>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes typingDot {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default VoiceOverlay;
