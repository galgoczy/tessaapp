import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import GlassCard from '../ui/GlassCard';

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
    { id: 'work', icon: '💼', label: 'Work & Career', color: '#6366F1' },
    { id: 'personal', icon: '🏠', label: 'Personal Life', color: '#10B981' },
    { id: 'health', icon: '💪', label: 'Health & Fitness', color: '#EF4444' },
    { id: 'learning', icon: '📚', label: 'Learning', color: '#F59E0B' },
    { id: 'finance', icon: '💰', label: 'Finance', color: '#8B5CF6' },
    { id: 'creative', icon: '🎨', label: 'Creative', color: '#EC4899' },
    { id: 'travel', icon: '✈️', label: 'Travel', color: '#06B6D4' },
    { id: 'social', icon: '👥', label: 'Social', color: '#3B82F6' },
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
              fontSize: 36,
            }}>
              👋
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
                  }}
                >
                  <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>
                    {interest.icon}
                  </span>
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
                fontSize: 28,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}>
                ☀️
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
                fontSize: 28,
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}>
                🌙
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
                icon: '🎤',
                title: 'Talk to me anytime',
                desc: 'Tap the floating button to chat or use voice',
              },
              {
                icon: '📋',
                title: 'Morning briefings',
                desc: "I'll give you a daily overview of your tasks and schedule",
              },
              {
                icon: '🏷️',
                title: 'Smart organization',
                desc: 'I auto-tag and categorize your notes and tasks',
              },
              {
                icon: '🔍',
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
                    fontSize: 24,
                    flexShrink: 0,
                  }}>
                    {tip.icon}
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
            fontSize: 48,
            boxShadow: `0 0 60px ${theme.glowColor}`,
            animation: 'pulse 2s infinite',
          }}>
            🎉
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
