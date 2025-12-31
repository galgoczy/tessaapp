import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import GlassCard from '../ui/GlassCard';

// SVG Icons component for onboarding
const Icon = ({ name, color, size = 24 }) => {
  const icons = {
    briefcase: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    fitness: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6.5 6.5 11 11" />
        <path d="m21 21-1-1" />
        <path d="m3 3 1 1" />
        <path d="m18 22 4-4" />
        <path d="m2 6 4-4" />
        <path d="m3 10 7-7" />
        <path d="m14 21 7-7" />
      </svg>
    ),
    book: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    dollar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    palette: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="1.5" fill={color} />
        <circle cx="17.5" cy="10.5" r="1.5" fill={color} />
        <circle cx="8.5" cy="7.5" r="1.5" fill={color} />
        <circle cx="6.5" cy="12.5" r="1.5" fill={color} />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
    plane: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    wave: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.11 5.89a5.25 5.25 0 0 1 0 7.43l-6.17 6.17a5.25 5.25 0 1 1-7.43-7.43L7.3 9.27" />
        <path d="M7.3 9.27a5.25 5.25 0 0 1 7.43-7.43l2.79 2.79" />
        <path d="m2 2 20 20" />
      </svg>
    ),
    sun: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    moon: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    mic: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    clipboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    ),
    tag: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    sparkles: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
      </svg>
    ),
    hand: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
      </svg>
    ),
  };

  return icons[name] || null;
};

/**
 * OnboardingFlow Component
 *
 * First-run welcome experience:
 * - Welcome animation with Tessa introduction
 * - Name collection
 * - Preference setup
 * - Initial category/interest selection
 * - Quick tutorial
 */
const OnboardingFlow = ({ onComplete }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { updateSettings, addCategory } = useData();
  const [step, setStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [tessaSpeaking, setTessaSpeaking] = useState(false);

  // Fade in on mount
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  // Tessa speaking animation
  useEffect(() => {
    if (step === 0) {
      const interval = setInterval(() => {
        setTessaSpeaking(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const interests = [
    { id: 'work', icon: 'briefcase', label: 'Work & Career', color: '#6366F1' },
    { id: 'personal', icon: 'home', label: 'Personal Life', color: '#10B981' },
    { id: 'health', icon: 'fitness', label: 'Health & Fitness', color: '#EF4444' },
    { id: 'learning', icon: 'book', label: 'Learning', color: '#F59E0B' },
    { id: 'finance', icon: 'dollar', label: 'Finance', color: '#8B5CF6' },
    { id: 'creative', icon: 'palette', label: 'Creative', color: '#EC4899' },
    { id: 'travel', icon: 'plane', label: 'Travel', color: '#06B6D4' },
    { id: 'social', icon: 'users', label: 'Social', color: '#3B82F6' },
  ];

  const toggleInterest = (id) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    // Save user name
    updateSettings({
      userName: userName.trim() || 'there',
      hasCompletedOnboarding: true,
    });

    // Add custom categories for selected interests (skip if default exists)
    selectedInterests.forEach(interestId => {
      const interest = interests.find(i => i.id === interestId);
      if (interest && !['work', 'personal'].includes(interestId)) {
        addCategory({
          name: interest.label,
          icon: interest.icon,
          color: interest.color,
        });
      }
    });

    onComplete();
  };

  const nextStep = () => {
    setFadeIn(false);
    setTimeout(() => {
      setStep(prev => prev + 1);
      setFadeIn(true);
    }, 300);
  };

  const prevStep = () => {
    setFadeIn(false);
    setTimeout(() => {
      setStep(prev => prev - 1);
      setFadeIn(true);
    }, 300);
  };

  // Step content
  const steps = [
    // Step 0: Welcome with Tessa
    {
      content: (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          {/* Tessa avatar */}
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: theme.gradient,
            margin: '0 auto 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 60px ${theme.glowColor}`,
            animation: 'pulse 2s infinite',
          }}>
            {/* Animated bars when speaking */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 40 }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    background: 'white',
                    borderRadius: 3,
                    height: tessaSpeaking ? `${20 + Math.random() * 30}px` : '8px',
                    transition: 'height 0.15s ease',
                  }}
                />
              ))}
            </div>
          </div>

          <h1 style={{
            color: theme.text,
            fontSize: 32,
            fontWeight: 700,
            margin: 0,
            marginBottom: 16,
          }}>
            Hi, I'm Tessa
          </h1>

          <p style={{
            color: theme.textSecondary,
            fontSize: 18,
            lineHeight: 1.6,
            margin: '0 auto',
            maxWidth: 300,
          }}>
            Your personal AI assistant. I'll help you stay organized, focused, and on top of everything.
          </p>

          <div style={{ marginTop: 48 }}>
            <button
              onClick={nextStep}
              style={{
                padding: '16px 48px',
                background: theme.gradient,
                border: 'none',
                borderRadius: 16,
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: `0 4px 24px ${theme.glowColor}`,
              }}
            >
              Let's get started
            </button>
          </div>
        </div>
      ),
    },

    // Step 1: Name input
    {
      content: (
        <div style={{ padding: '40px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: theme.gradient,
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon name="hand" color="white" size={36} />
            </div>
            <h2 style={{
              color: theme.text,
              fontSize: 26,
              fontWeight: 700,
              margin: 0,
              marginBottom: 12,
            }}>
              What should I call you?
            </h2>
            <p style={{
              color: theme.textSecondary,
              fontSize: 15,
              margin: 0,
            }}>
              I'll use this to personalize your experience
            </p>
          </div>

          <GlassCard theme={theme} style={{ padding: 20, marginBottom: 32 }}>
            <input
              type="text"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                outline: 'none',
                color: theme.text,
                fontSize: 20,
                textAlign: 'center',
                fontWeight: 500,
              }}
            />
          </GlassCard>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={prevStep}
              style={{
                padding: '14px 24px',
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                color: theme.textMuted,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              Back
            </button>
            <button
              onClick={nextStep}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: theme.gradient,
                border: 'none',
                borderRadius: 12,
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    // Step 2: Interests/Categories
    {
      content: (
        <div style={{ padding: '40px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{
              color: theme.text,
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              marginBottom: 12,
            }}>
              {userName ? `Nice to meet you, ${userName}!` : 'Nice to meet you!'}
            </h2>
            <p style={{
              color: theme.textSecondary,
              fontSize: 15,
              margin: 0,
            }}>
              What areas of life should I help you with?
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            marginBottom: 32,
          }}>
            {interests.map(interest => {
              const isSelected = selectedInterests.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  style={{
                    padding: 16,
                    background: isSelected ? `${interest.color}20` : theme.surface,
                    border: `2px solid ${isSelected ? interest.color : theme.border}`,
                    borderRadius: 16,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <Icon name={interest.icon} color={isSelected ? interest.color : theme.accent} size={28} />
                  </div>
                  <span style={{
                    color: isSelected ? interest.color : theme.text,
                    fontSize: 14,
                    fontWeight: 500,
                  }}>
                    {interest.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={prevStep}
              style={{
                padding: '14px 24px',
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                color: theme.textMuted,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              Back
            </button>
            <button
              onClick={nextStep}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: theme.gradient,
                border: 'none',
                borderRadius: 12,
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    // Step 3: Theme preference
    {
      content: (
        <div style={{ padding: '40px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{
              color: theme.text,
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              marginBottom: 12,
            }}>
              Choose your vibe
            </h2>
            <p style={{
              color: theme.textSecondary,
              fontSize: 15,
              margin: 0,
            }}>
              You can always change this later
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
            {/* Light theme */}
            <button
              onClick={() => isDark && toggleTheme()}
              style={{
                flex: 1,
                padding: 20,
                background: isDark ? theme.surface : theme.accent,
                border: `2px solid ${isDark ? theme.border : theme.accent}`,
                borderRadius: 20,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: '#FFFFFF',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}>
                <Icon name="sun" color={theme.accent} size={28} />
              </div>
              <span style={{
                color: isDark ? theme.text : 'white',
                fontSize: 16,
                fontWeight: 600,
              }}>
                Light
              </span>
            </button>

            {/* Dark theme */}
            <button
              onClick={() => !isDark && toggleTheme()}
              style={{
                flex: 1,
                padding: 20,
                background: !isDark ? theme.surface : theme.accent,
                border: `2px solid ${!isDark ? theme.border : theme.accent}`,
                borderRadius: 20,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: '#1A1A2E',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}>
                <Icon name="moon" color={theme.accent} size={28} />
              </div>
              <span style={{
                color: !isDark ? theme.text : 'white',
                fontSize: 16,
                fontWeight: 600,
              }}>
                Dark
              </span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={prevStep}
              style={{
                padding: '14px 24px',
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                color: theme.textMuted,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              Back
            </button>
            <button
              onClick={nextStep}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: theme.gradient,
                border: 'none',
                borderRadius: 12,
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },

    // Step 4: Quick tips
    {
      content: (
        <div style={{ padding: '40px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{
              color: theme.text,
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              marginBottom: 12,
            }}>
              Quick tips
            </h2>
            <p style={{
              color: theme.textSecondary,
              fontSize: 15,
              margin: 0,
            }}>
              Here's how to get the most out of Tessa
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
            {[
              {
                icon: 'mic',
                title: 'Talk to me anytime',
                desc: 'Tap the floating button to chat or use voice',
              },
              {
                icon: 'clipboard',
                title: 'Morning briefings',
                desc: "I'll give you a daily overview of your tasks and schedule",
              },
              {
                icon: 'tag',
                title: 'Smart organization',
                desc: 'I auto-tag and categorize your notes and tasks',
              },
              {
                icon: 'search',
                title: 'Search everything',
                desc: 'Find anything across tasks, notes, and projects',
              },
            ].map((tip, idx) => (
              <GlassCard key={idx} theme={theme} style={{ padding: 16 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `${theme.accent}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon name={tip.icon} color={theme.accent} size={24} />
                  </div>
                  <div>
                    <p style={{
                      color: theme.text,
                      fontSize: 15,
                      fontWeight: 600,
                      margin: 0,
                    }}>
                      {tip.title}
                    </p>
                    <p style={{
                      color: theme.textSecondary,
                      fontSize: 13,
                      margin: '4px 0 0',
                    }}>
                      {tip.desc}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={prevStep}
              style={{
                padding: '14px 24px',
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                color: theme.textMuted,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              Back
            </button>
            <button
              onClick={nextStep}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: theme.gradient,
                border: 'none',
                borderRadius: 12,
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Almost done!
            </button>
          </div>
        </div>
      ),
    },

    // Step 5: Ready!
    {
      content: (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          {/* Celebration */}
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: theme.gradient,
            margin: '0 auto 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 60px ${theme.glowColor}`,
            animation: 'pulse 2s infinite',
          }}>
            <Icon name="sparkles" color="white" size={48} />
          </div>

          <h1 style={{
            color: theme.text,
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            marginBottom: 16,
          }}>
            You're all set{userName ? `, ${userName}` : ''}!
          </h1>

          <p style={{
            color: theme.textSecondary,
            fontSize: 16,
            lineHeight: 1.6,
            margin: '0 auto 48px',
            maxWidth: 300,
          }}>
            I'm excited to help you stay organized and productive. Let's make great things happen together!
          </p>

          <button
            onClick={handleComplete}
            style={{
              padding: '16px 48px',
              background: theme.gradient,
              border: 'none',
              borderRadius: 16,
              color: 'white',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: `0 4px 24px ${theme.glowColor}`,
            }}
          >
            Start using Tessa
          </button>

          <p style={{
            color: theme.textMuted,
            fontSize: 13,
            marginTop: 24,
          }}>
            Tip: Say "Hey Tessa" to start a conversation
          </p>
        </div>
      ),
    },
  ];

  // Progress indicator
  const totalSteps = steps.length;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: theme.bg,
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 430,
      margin: '0 auto',
    }}>
      {/* Progress bar */}
      {step > 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: theme.surface,
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: theme.gradient,
            transition: 'width 0.3s ease',
          }} />
        </div>
      )}

      {/* Skip button */}
      {step > 0 && step < steps.length - 1 && (
        <button
          onClick={handleComplete}
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            background: 'none',
            border: 'none',
            color: theme.textMuted,
            fontSize: 14,
            cursor: 'pointer',
            padding: 8,
          }}
        >
          Skip
        </button>
      )}

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ width: '100%' }}>
          {steps[step].content}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default OnboardingFlow;
