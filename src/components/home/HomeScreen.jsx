import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';
import Header from './Header';
import MorningBrief from './MorningBrief';
import QuoteSection from './QuoteSection';
import AttentionCards from './AttentionCards';
import FloatingButton from './FloatingButton';
import GlobalSearch from '../search/GlobalSearch';

/**
 * HomeScreen Component
 *
 * Main landing screen with:
 * - Header with greeting and avatar menu
 * - Morning brief card
 * - Inspirational quote (fades on scroll)
 * - "Your Stuff" section with attention cards
 * - Floating "Talk with Tessa" button
 */
const HomeScreen = ({ onOpenVoice, onOpenBriefing, onNavigate }) => {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [bgPulse, setBgPulse] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const scrollThreshold = 250;
  const quoteOpacity = Math.max(0, 1 - scrollY / scrollThreshold);
  const contentOpacity = Math.min(1, (scrollY - 80) / 150);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Background pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBgPulse(true);
      setTimeout(() => setBgPulse(false), 2000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Sample data
  const recentTopics = ['Project Alpha', 'Q4 Budget', 'Team meeting'];

  return (
    <>
      {/* Background pulse */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: theme.glassGradient,
        opacity: bgPulse ? 0.4 : 0,
        transition: 'opacity 3s',
        pointerEvents: 'none',
      }} />

      {/* Hero Section */}
      <div style={{
        padding: '40px 20px 0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Header onNavigate={onNavigate} onOpenSearch={() => setShowSearch(true)} />

        {/* Quote section */}
        <QuoteSection opacity={quoteOpacity} />

        {/* Morning Brief - slightly higher with less margin */}
        <MorningBrief onClick={onOpenBriefing} />

        {/* Your Stuff indicator */}
        <div style={{
          textAlign: 'center',
          marginTop: -20,
          paddingBottom: 120,
          opacity: quoteOpacity,
          transition: 'opacity 0.5s',
        }}>
          <p className="shimmer" style={{
            color: theme.textSecondary,
            fontSize: 12,
            letterSpacing: 3,
            marginBottom: 12,
            fontWeight: 500,
          }}>YOUR STUFF</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ color: theme.textMuted, fontSize: 18, animation: 'bounce 1.5s infinite' }}>⌄</span>
            <span style={{ color: theme.textMuted, fontSize: 18, animation: 'bounce 1.5s infinite 0.15s', opacity: 0.5 }}>⌄</span>
          </div>
        </div>
      </div>

      {/* Below fold content */}
      <div style={{
        padding: '0 20px 160px',
        opacity: contentOpacity,
        transition: 'opacity 0.6s ease-out',
      }}>
        {/* Search bar */}
        <button
          onClick={() => setShowSearch(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            marginBottom: 24,
            background: theme.surfaceGlass,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${theme.borderGlass}`,
            borderRadius: 16,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ color: theme.textMuted, fontSize: 15 }}>
            Search tasks, notes, projects...
          </span>
        </button>

        {/* Recent topics */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 12, fontWeight: 500 }}>Recent</p>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {recentTopics.map(topic => (
              <GlassCard key={topic} theme={theme} style={{ padding: '10px 16px', borderRadius: 20, flexShrink: 0 }}>
                <span style={{ color: theme.text, fontSize: 14 }}>{topic}</span>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Attention section */}
        <p style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 12, fontWeight: 500 }}>Needs attention</p>

        <AttentionCards onOpenVoice={onOpenVoice} />
      </div>

      {/* Floating button */}
      <FloatingButton onClick={onOpenVoice} />

      {/* Global Search Overlay */}
      <GlobalSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onResultSelect={(result) => {
          // Navigate to the appropriate screen based on result type
          if (result.type === 'task') {
            onNavigate('tasks');
          } else if (result.type === 'note') {
            onNavigate('notes');
          } else if (result.type === 'project') {
            onNavigate('projects');
          } else if (result.type === 'event') {
            onNavigate('calendars');
          } else if (result.type === 'contact') {
            onNavigate('contacts');
          } else if (result.type === 'email') {
            onNavigate('mail');
          }
        }}
      />
    </>
  );
};

export default HomeScreen;
