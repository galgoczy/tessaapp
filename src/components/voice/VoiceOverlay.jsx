import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import GlassCard from '../ui/GlassCard';
import WaveAnimation from './WaveAnimation';
import { sendMessage, generateGreeting } from '../../services/AIService';

// Icons
const Icons = {
  mic: (color, filled = true) => (
    <svg width={22} height={22} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
    </svg>
  ),
  image: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  file: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  send: (color) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill={color}>
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  ),
  waveform: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M2 12h2m4 0h2m4 0h2m4 0h2" />
      <path d="M6 8v8m4-12v16m4-12v12m4-8v4" />
    </svg>
  ),
};


/**
 * VoiceOverlay Component
 *
 * Voice interaction modal with Tessa AI functionality.
 * Features:
 * - Voice/text input with voice mode indicator
 * - Context-aware responses
 * - Action suggestions
 * - Conversation history
 * - Image/file upload placeholders
 * - Auto-voice mode for Pro users
 */
const VoiceOverlay = ({ isOpen, onClose, onNavigate, initialMessage, voiceMode: initialVoiceMode }) => {
  const { theme } = useTheme();
  const { tasks, notes, events, settings } = useData();

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMode, setVoiceMode] = useState(initialVoiceMode || false);
  const [wavePhase, setWavePhase] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const conversationEndRef = useRef(null);
  const initialMessageProcessed = useRef(false);

  const isPro = settings?.isPro || false;
  const data = useMemo(() => ({ tasks, notes, events }), [tasks, notes, events]);

  // Scroll to bottom on new messages
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Initial greeting on open
  useEffect(() => {
    if (isOpen && conversation.length === 0) {
      const userName = settings?.userName || '';
      const greeting = generateGreeting(userName);

      setConversation([{ role: 'tessa', message: greeting, type: 'greeting' }]);

      // Auto-enable voice mode for Pro users
      if (isPro && initialVoiceMode) {
        setVoiceMode(true);
        simulateSpeaking();
      }
    }
  }, [isOpen, conversation.length, settings, isPro, initialVoiceMode]);

  // Process initial message (from briefing "Ask Tessa")
  useEffect(() => {
    if (isOpen && initialMessage && !initialMessageProcessed.current && conversation.length > 0) {
      initialMessageProcessed.current = true;
      setTimeout(() => {
        processInput(initialMessage);
      }, 500);
    }
  }, [isOpen, initialMessage, conversation.length]);

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
      setIsSpeaking(false);
      setTextInput('');
      setConversation([]);
      initialMessageProcessed.current = false;
    }
  }, [isOpen]);

  // Simulate Tessa speaking (for Pro users)
  const simulateSpeaking = useCallback((duration = 2000) => {
    if (isPro && voiceMode) {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), duration);
    }
  }, [isPro, voiceMode]);

  const processInput = useCallback(async (input) => {
    if (!input.trim()) return;

    // Add user message to conversation
    const userMessage = { role: 'user', message: input };
    setConversation(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Build context for AI
      const context = {
        userName: settings?.userName || '',
        tasks: data.tasks || [],
        notes: data.notes || [],
        events: data.events || [],
        settings,
      };

      // Get conversation history (exclude the current message we just added)
      const history = conversation.filter(msg => msg.role === 'user' || msg.role === 'tessa');

      // Call AI service
      const response = await sendMessage(input, history, context);

      // Add AI response to conversation
      setConversation(prev => [...prev, {
        role: 'tessa',
        message: response.message,
        type: response.type,
      }]);

      // Simulate voice response for Pro users
      if (voiceMode && response.success) {
        const speakDuration = Math.min(response.message.length * 35, 5000);
        simulateSpeaking(speakDuration);
      }
    } catch (error) {
      console.error('Error processing input:', error);
      setConversation(prev => [...prev, {
        role: 'tessa',
        message: 'Sajnálom, hiba történt. Kérlek, próbáld újra!',
        type: 'error',
      }]);
    } finally {
      setIsProcessing(false);
    }
  }, [data, settings, conversation, voiceMode, simulateSpeaking]);

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

  const handleVoiceEnd = () => {
    if (isListening) {
      setIsListening(false);
      const demoQueries = [
        "Mik a mai feladataim?",
        "Mutasd a naptáramat",
        "Segíts megtervezni a napomat",
        "Mivel kellene kezdenem?",
      ];
      const randomQuery = demoQueries[Math.floor(Math.random() * demoQueries.length)];
      processInput(randomQuery);
    }
  };

  const handleFileUpload = () => {
    // Placeholder for file upload
    alert('File upload coming soon!');
  };

  const handleImageUpload = () => {
    // Placeholder for image upload
    alert('Image upload coming soon!');
  };

  if (!isOpen) return null;

  const suggestions = ['Mai napom', 'Feladataim', 'Mivel kezdjek?', 'Segíts tervezni'];

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {isSpeaking && (
              <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: 3,
                      height: 12,
                      background: 'white',
                      borderRadius: 2,
                      animation: 'speakBar 0.5s ease-in-out infinite',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div>
            <p style={{ color: theme.text, fontSize: 16, fontWeight: 600, margin: 0 }}>
              Tessa
            </p>
            <p style={{ color: theme.textSecondary, fontSize: 12, margin: 0 }}>
              {isSpeaking ? 'Speaking...' : isProcessing ? 'Thinking...' : isListening ? 'Listening...' : 'Ready to help'}
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
        marginBottom: 16,
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
        <div ref={conversationEndRef} />
      </div>

      {/* Quick suggestions */}
      {suggestions.length > 0 && !isListening && !voiceMode && (
        <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 12,
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

      {/* Voice mode indicator for Pro */}
      {voiceMode && isPro && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 16,
          padding: '12px 20px',
          background: `${theme.accent}15`,
          borderRadius: 16,
          border: `1px solid ${theme.accent}30`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: isListening || isSpeaking ? 16 : 8,
                  background: theme.accent,
                  borderRadius: 2,
                  transition: 'height 0.2s',
                  animation: (isListening || isSpeaking) ? 'voiceBar 0.4s ease-in-out infinite' : 'none',
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
          <span style={{ color: theme.accent, fontSize: 13, fontWeight: 500 }}>
            {isListening ? 'Listening...' : isSpeaking ? 'Tessa is speaking...' : 'Voice mode active'}
          </span>
          <button
            onClick={() => setVoiceMode(false)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.textMuted,
              fontSize: 12,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Switch to text
          </button>
        </div>
      )}

      {/* Wave animation when listening */}
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
        gap: 8,
        alignItems: 'center',
      }}>
        {/* File upload button */}
        <button
          onClick={handleFileUpload}
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
            flexShrink: 0,
          }}
        >
          {Icons.file(theme.textMuted)}
        </button>

        {/* Image upload button */}
        <button
          onClick={handleImageUpload}
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
            flexShrink: 0,
          }}
        >
          {Icons.image(theme.textMuted)}
        </button>

        {/* Text input */}
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Kérdezz Tessától bármit..."
            style={{
              width: '100%',
              padding: '12px 16px',
              background: theme.surfaceGlass,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.borderGlass}`,
              borderRadius: 16,
              color: theme.text,
              fontSize: 14,
              outline: 'none',
            }}
          />
        </form>

        {/* Send button (shown when there's text) */}
        {textInput.trim() && (
          <button
            onClick={handleSubmit}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: theme.accent,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {Icons.send('white')}
          </button>
        )}

        {/* Mic button */}
        {!textInput.trim() && (
          <button
            onMouseDown={() => setIsListening(true)}
            onMouseUp={handleVoiceEnd}
            onMouseLeave={handleVoiceEnd}
            onTouchStart={() => setIsListening(true)}
            onTouchEnd={handleVoiceEnd}
            style={{
              width: 48,
              height: 48,
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
            {Icons.mic(isListening ? 'white' : theme.accent)}
          </button>
        )}
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes typingDot {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-4px); }
        }
        @keyframes speakBar {
          0%, 100% { height: 6px; }
          50% { height: 14px; }
        }
        @keyframes voiceBar {
          0%, 100% { height: 6px; }
          50% { height: 18px; }
        }
      `}</style>
    </div>
  );
};

export default VoiceOverlay;
