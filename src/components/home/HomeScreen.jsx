import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';
import Header from './Header';
import MorningBrief from './MorningBrief';
import QuoteSection from './QuoteSection';
import AttentionCards from './AttentionCards';
import FloatingButton from './FloatingButton';

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
        <Header onNavigate={onNavigate} />

        <MorningBrief onClick={onOpenBriefing} />

        <QuoteSection opacity={quoteOpacity} />

        {/* Your Stuff indicator */}
        <div style={{
          textAlign: 'center',
          paddingTop: 40,
          paddingBottom: 60,
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
    </>
  );
};

export default HomeScreen;
