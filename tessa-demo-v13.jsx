import React, { useState, useEffect } from 'react';

const TessaDemo = () => {
  const [isListening, setIsListening] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [bgPulse, setBgPulse] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [wavePhase, setWavePhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scrollThreshold = 250;
  const quoteOpacity = Math.max(0, 1 - scrollY / scrollThreshold);
  const contentOpacity = Math.min(1, (scrollY - 80) / 150);

  // Wave animation
  useEffect(() => {
    if (voiceOpen) {
      const interval = setInterval(() => setWavePhase(p => p + 0.12), 50);
      return () => clearInterval(interval);
    }
  }, [voiceOpen]);

  // Background pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setBgPulse(true);
      setTimeout(() => setBgPulse(false), 2000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Scroll
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Liquid Glass theme
  const t = darkMode ? {
    bg: '#0a0a0f',
    surface: 'rgba(255, 255, 255, 0.05)',
    surfaceGlass: 'rgba(255, 255, 255, 0.08)',
    surfaceSolid: '#151519',
    text: '#FFFFFF',
    textMuted: '#a1a1aa',
    textSecondary: '#71717a',
    border: 'rgba(255, 255, 255, 0.1)',
    borderGlass: 'rgba(255, 255, 255, 0.15)',
    orange: '#fb923c',
    orangeLight: '#fdba74',
    orangeDark: '#ea580c',
    blue: '#38bdf8',
    purple: '#a78bfa',
    pink: '#f472b6',
    cyan: '#22d3ee',
    red: '#f87171',
    gradient: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #a78bfa 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(251,146,60,0.15) 0%, rgba(244,114,182,0.1) 50%, rgba(167,139,250,0.15) 100%)',
    overlayBg: 'rgba(10, 10, 15, 0.75)',
  } : {
    bg: '#fafafa',
    surface: 'rgba(0, 0, 0, 0.03)',
    surfaceGlass: 'rgba(255, 255, 255, 0.7)',
    surfaceSolid: '#ffffff',
    text: '#18181b',
    textMuted: '#52525b',
    textSecondary: '#71717a',
    border: 'rgba(0, 0, 0, 0.08)',
    borderGlass: 'rgba(255, 255, 255, 0.5)',
    orange: '#ea580c',
    orangeLight: '#fb923c',
    orangeDark: '#c2410c',
    blue: '#0284c7',
    purple: '#7c3aed',
    pink: '#db2777',
    cyan: '#0891b2',
    red: '#dc2626',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #db2777 50%, #7c3aed 100%)',
    glassGradient: 'linear-gradient(135deg, rgba(234,88,12,0.1) 0%, rgba(219,39,119,0.08) 50%, rgba(124,58,237,0.1) 100%)',
    overlayBg: 'rgba(250, 250, 250, 0.8)',
  };

  const tasks = [
    { id: 1, title: 'Meeting with Tom', time: '08:00' },
    { id: 2, title: 'Client call - Kezia', time: '10:00' },
    { id: 3, title: 'UI/UX Webinar', time: '14:00' },
  ];

  const emails = [
    { id: 1, from: 'Peter Smith' },
    { id: 2, from: 'Sarah (Team)' },
  ];

  const recentTopics = ['Project Alpha', 'Q4 Budget', 'Team meeting'];

  const menuItems = [
    { icon: '⚙️', label: 'Settings' },
    { icon: '📧', label: 'Mail' },
    { icon: '📅', label: 'Calendars' },
    { icon: '✓', label: 'Tasks' },
    { icon: '📁', label: 'Projects' },
    { icon: '👤', label: 'Account' },
  ];

  const briefingSummary = `Good morning, Geri! Here's your day:

• First meeting with Tom at 8:00 AM — high priority
• Client call with Kezia at 10:00 AM on Zoom  
• 2 urgent emails awaiting response
• 1 overdue task: Q4 budget review

I'd recommend tackling Peter's email first, then Sarah's designs before your 10 AM call.`;

  // Liquid Glass Card Component
  const GlassCard = ({ children, style, onClick, glow }) => (
    <div
      onClick={onClick}
      style={{
        background: t.surfaceGlass,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 24,
        border: `1px solid ${t.borderGlass}`,
        boxShadow: glow 
          ? `0 8px 32px rgba(251,146,60,0.15), inset 0 1px 0 rgba(255,255,255,0.1)`
          : `0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)`,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {/* Glass highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  );

  // Voice Overlay - Liquid Glass Style
  const VoiceOverlay = () => {
    if (!voiceOpen) return null;

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: t.overlayBg,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
        {/* Glass Modal */}
        <GlassCard style={{
          width: '100%',
          maxWidth: 380,
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Close */}
          <button
            onClick={() => { setVoiceOpen(false); setIsListening(false); }}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: t.surface,
              border: `1px solid ${t.border}`,
              color: t.textMuted,
              fontSize: 22,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >×</button>

          <p style={{ color: t.textSecondary, fontSize: 13, letterSpacing: 1, marginBottom: 16 }}>
            Talk with Tessa
          </p>

          <p style={{ color: t.text, fontSize: 18, fontWeight: 500, marginBottom: 24, textAlign: 'center' }}>
            {isListening ? 'Listening...' : 'Tap and hold to speak'}
          </p>

          {/* Wave */}
          <svg width={240} height={50} style={{ marginBottom: 24 }}>
            {[0, 1, 2].map(i => (
              <path
                key={i}
                d={Array.from({ length: 40 }, (_, j) => {
                  const x = (j / 39) * 240;
                  const y = 25 + Math.sin((j / 39) * Math.PI * 3 + wavePhase + i * 0.8) * (isListening ? 18 : 6) * (1 - i * 0.25);
                  return `${j === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke={i === 0 ? t.orange : i === 1 ? t.pink : t.purple}
                strokeWidth={2.5 - i * 0.5}
                opacity={0.8 - i * 0.2}
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Tessa Orb */}
          <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 24 }}>
            <div className="orb-glow" style={{
              position: 'absolute',
              inset: -16,
              borderRadius: '50%',
              background: t.gradient,
              filter: 'blur(24px)',
              opacity: isListening ? 0.5 : 0.25,
            }} />
            <div className="orb-ring" style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              border: `2px solid ${t.orange}`,
              opacity: 0.3,
            }} />
            <div className="orb-core" style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: t.gradient,
              boxShadow: `inset 0 -8px 16px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.2)`,
            }}>
              <div style={{
                position: 'absolute',
                top: '15%',
                left: '20%',
                width: '30%',
                height: '25%',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.35)',
                filter: 'blur(2px)',
              }} />
            </div>
          </div>

          {/* Mic */}
          <button
            onMouseDown={() => setIsListening(true)}
            onMouseUp={() => setIsListening(false)}
            onMouseLeave={() => setIsListening(false)}
            onTouchStart={() => setIsListening(true)}
            onTouchEnd={() => setIsListening(false)}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: isListening ? t.blue : t.surfaceGlass,
              border: `2px solid ${isListening ? t.blue : t.border}`,
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: isListening ? `0 0 24px ${t.blue}40` : 'none',
            }}
          >
            <svg width={22} height={22} viewBox="0 0 24 24" fill={isListening ? 'white' : t.textMuted}>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
            </svg>
          </button>

          {/* Suggestions */}
          <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['My day', 'Emails', 'New task'].map(s => (
              <button key={s} style={{
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 16,
                padding: '8px 14px',
                color: t.textMuted,
                fontSize: 13,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
              }}>{s}</button>
            ))}
          </div>
        </GlassCard>

        <style>{`
          .orb-glow { animation: glow-pulse 3s ease-in-out infinite; }
          .orb-ring { animation: ring-pulse 3s ease-in-out infinite; }
          .orb-core { animation: core-pulse 3s ease-in-out infinite; }
          @keyframes glow-pulse {
            0%, 100% { transform: scale(1); opacity: 0.25; }
            50% { transform: scale(1.15); opacity: 0.4; }
          }
          @keyframes ring-pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.15; }
          }
          @keyframes core-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </div>
    );
  };

  // Briefing Overlay
  const BriefingOverlay = () => {
    if (!briefingOpen) return null;

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: t.overlayBg,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 20px 20px',
        overflowY: 'auto',
      }}>
        <GlassCard style={{ width: '100%', maxWidth: 400, padding: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: t.text, fontSize: 20, fontWeight: 600, margin: 0 }}>☀️ Morning Brief</h2>
            <button
              onClick={() => { setBriefingOpen(false); setIsPlaying(false); }}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: t.surface,
                border: `1px solid ${t.border}`,
                color: t.textMuted,
                fontSize: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >×</button>
          </div>

          {/* Pro Audio */}
          <div style={{
            background: t.glassGradient,
            borderRadius: 16,
            padding: '14px 16px',
            marginBottom: 16,
            border: `1px solid ${t.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: t.gradient,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(251,146,60,0.3)',
              }}
            >
              {isPlaying ? (
                <svg width={14} height={14} fill="white" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width={14} height={14} fill="white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ color: t.text, fontSize: 14, fontWeight: 500, margin: 0 }}>
                {isPlaying ? 'Tessa is reading...' : 'Let Tessa read this'}
              </p>
              <p style={{ color: t.textSecondary, fontSize: 12, margin: 0 }}>
                <span style={{ background: t.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 600 }}>PRO</span>
              </p>
            </div>
            {isPlaying && (
              <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 18 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} className="audio-bar" style={{
                    width: 3,
                    background: t.orange,
                    borderRadius: 2,
                    animationDelay: `${i * 0.1}s`,
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { n: 3, label: 'Meetings', color: t.orange },
              { n: 2, label: 'Urgent', color: t.red },
              { n: 1, label: 'Overdue', color: t.blue },
            ].map(s => (
              <div key={s.label} style={{ 
                background: t.surface, 
                backdropFilter: 'blur(10px)',
                borderRadius: 14, 
                padding: 14, 
                textAlign: 'center', 
                border: `1px solid ${t.border}` 
              }}>
                <p style={{ color: s.color, fontSize: 22, fontWeight: 700, margin: 0 }}>{s.n}</p>
                <p style={{ color: t.textSecondary, fontSize: 11, margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{
            background: t.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            border: `1px solid ${t.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ 
                width: 28, 
                height: 28, 
                borderRadius: '50%', 
                background: t.gradient,
                boxShadow: '0 2px 8px rgba(251,146,60,0.3)',
              }} />
              <p style={{ color: t.orange, fontSize: 13, fontWeight: 600, margin: 0 }}>Tessa's Summary</p>
            </div>
            <p style={{ color: t.text, fontSize: 13, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
              {briefingSummary}
            </p>
          </div>

          {/* Ask Tessa */}
          <button
            onClick={() => { setBriefingOpen(false); setVoiceOpen(true); }}
            style={{
              width: '100%',
              background: t.glassGradient,
              borderRadius: 14,
              padding: 14,
              border: `1px solid ${t.border}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.gradient }} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: t.text, fontSize: 14, fontWeight: 500, margin: 0 }}>Ask Tessa</p>
              <p style={{ color: t.textSecondary, fontSize: 12, margin: 0 }}>"What should I do first?"</p>
            </div>
          </button>
        </GlassCard>

        <style>{`
          .audio-bar { animation: bar 0.4s ease-in-out infinite; }
          @keyframes bar {
            0%, 100% { height: 4px; }
            50% { height: 16px; }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', 
      maxWidth: 430, 
      margin: '0 auto', 
      background: t.bg, 
      minHeight: '100vh',
      transition: 'background 0.4s',
    }}>
      {/* Ambient gradient background */}
      <div style={{
        position: 'fixed',
        top: '-20%',
        right: '-20%',
        width: '70%',
        height: '50%',
        background: `radial-gradient(circle, ${t.purple}15 0%, transparent 70%)`,
        pointerEvents: 'none',
        transition: 'opacity 0.4s',
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        left: '-20%',
        width: '60%',
        height: '40%',
        background: `radial-gradient(circle, ${t.orange}10 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Background pulse */}
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        background: t.glassGradient, 
        opacity: bgPulse ? 0.4 : 0, 
        transition: 'opacity 3s', 
        pointerEvents: 'none' 
      }} />

      {/* Status bar */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        maxWidth: 430, 
        margin: '0 auto', 
        padding: '12px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: 14, 
        fontWeight: 500, 
        color: t.text, 
        background: `${t.bg}cc`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 100,
      }}>
        <span>10:30</span>
        <span>📶 🔋</span>
      </div>

      {/* Hero Section */}
      <div style={{ padding: '70px 20px 0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <p style={{ color: t.textSecondary, fontSize: 14, marginBottom: 4 }}>Good Morning,</p>
            <h1 style={{ color: t.text, fontSize: 28, fontWeight: 700, margin: 0 }}>Geri 👋</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 14, 
                background: t.surfaceGlass, 
                backdropFilter: 'blur(10px)',
                border: `1px solid ${t.borderGlass}`, 
                fontSize: 18, 
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowMenu(!showMenu)} 
                style={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #8B7355 0%, #E8D5B7 50%, #4A90A4 100%)', 
                  border: `2px solid ${t.borderGlass}`,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }} 
              />
              {showMenu && (
                <>
                  <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
                  <GlassCard style={{ 
                    position: 'absolute', 
                    top: 52, 
                    right: 0, 
                    minWidth: 170, 
                    zIndex: 99, 
                    padding: 8,
                  }}>
                    {menuItems.map((item) => (
                      <button 
                        key={item.label} 
                        onClick={() => setShowMenu(false)} 
                        style={{ 
                          width: '100%', 
                          padding: '12px 14px', 
                          background: 'none', 
                          border: 'none', 
                          borderRadius: 10,
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 10, 
                          cursor: 'pointer', 
                          color: t.text, 
                          fontSize: 14,
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = t.surface}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <span>{item.icon}</span> {item.label}
                      </button>
                    ))}
                  </GlassCard>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Morning Brief - Glass Card */}
        <GlassCard 
          onClick={() => setBriefingOpen(true)} 
          glow
          style={{ padding: 18, marginBottom: 40, display: 'flex', alignItems: 'center', gap: 14 }}
        >
          <div style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 14, 
            background: t.gradient, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: 22,
            boxShadow: '0 4px 12px rgba(251,146,60,0.3)',
          }}>☀️</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: t.text, fontSize: 16, fontWeight: 600, margin: 0 }}>Quick Morning Brief</p>
            <p style={{ color: t.textMuted, fontSize: 13, margin: 0 }}>3 meetings • 2 urgent</p>
          </div>
          <span style={{ color: t.textMuted, fontSize: 20 }}>→</span>
        </GlassCard>

        {/* Quote */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          textAlign: 'center',
          opacity: quoteOpacity,
          transition: 'opacity 0.5s',
          minHeight: 200,
        }}>
          <p style={{ color: t.purple, fontSize: 11, letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase', fontWeight: 500 }}>Daily Inspiration</p>
          <p style={{ color: t.text, fontSize: 22, fontWeight: 500, fontStyle: 'italic', lineHeight: 1.4, margin: '0 0 12px', maxWidth: 300 }}>
            "The secret of getting ahead is getting started."
          </p>
          <p style={{ color: t.textSecondary, fontSize: 14 }}>— Mark Twain</p>
        </div>

        {/* Your Stuff - Lower position */}
        <div style={{ 
          textAlign: 'center', 
          paddingTop: 40,
          paddingBottom: 60, 
          opacity: quoteOpacity, 
          transition: 'opacity 0.5s',
        }}>
          <p className="shimmer" style={{ 
            color: t.textSecondary, 
            fontSize: 12, 
            letterSpacing: 3, 
            marginBottom: 12,
            fontWeight: 500,
          }}>YOUR STUFF</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ color: t.textMuted, fontSize: 18, animation: 'bounce 1.5s infinite' }}>⌄</span>
            <span style={{ color: t.textMuted, fontSize: 18, animation: 'bounce 1.5s infinite 0.15s', opacity: 0.5 }}>⌄</span>
          </div>
        </div>
      </div>

      {/* Below fold - scrolls all the way up */}
      <div style={{ 
        padding: '0 20px 160px', 
        opacity: contentOpacity,
        transition: 'opacity 0.6s ease-out',
      }}>
        {/* Recent */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: t.textSecondary, fontSize: 13, marginBottom: 12, fontWeight: 500 }}>Recent</p>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {recentTopics.map(topic => (
              <GlassCard key={topic} style={{ padding: '10px 16px', borderRadius: 20, flexShrink: 0 }}>
                <span style={{ color: t.text, fontSize: 14 }}>{topic}</span>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Attention */}
        <p style={{ color: t.textSecondary, fontSize: 13, marginBottom: 12, fontWeight: 500 }}>Needs attention</p>

        {/* Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Schedule */}
          <div style={{
            background: t.gradient,
            borderRadius: 24,
            padding: 18,
            gridRow: 'span 2',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
            }} />
            <p style={{ color: 'white', fontSize: 14, fontWeight: 600, marginBottom: 14, position: 'relative' }}>Today's Schedule</p>
            {tasks.map((task, i) => (
              <div key={task.id} style={{ 
                background: 'rgba(255,255,255,0.15)', 
                backdropFilter: 'blur(8px)',
                borderRadius: 12, 
                padding: 12, 
                marginBottom: i < 2 ? 8 : 0,
              }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: '0 0 2px' }}>{task.time}</p>
                <p style={{ color: 'white', fontSize: 12, fontWeight: 500, margin: 0 }}>{task.title}</p>
              </div>
            ))}
          </div>

          {/* Email */}
          <GlassCard style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>📧</span>
              <span style={{ 
                background: t.red, 
                borderRadius: 8, 
                padding: '3px 10px', 
                fontSize: 11, 
                color: 'white', 
                fontWeight: 600,
              }}>2</span>
            </div>
            <p style={{ color: t.text, fontSize: 13, fontWeight: 500, margin: '0 0 10px' }}>Urgent emails</p>
            {emails.map((e, i) => (
              <div key={e.id} style={{ 
                background: t.surface, 
                borderRadius: 10, 
                padding: '10px 12px', 
                marginBottom: i === 0 ? 6 : 0,
              }}>
                <p style={{ color: t.text, fontSize: 12, fontWeight: 500, margin: 0 }}>{e.from}</p>
              </div>
            ))}
          </GlassCard>

          {/* Talk Tessa */}
          <GlassCard 
            onClick={() => setVoiceOpen(true)} 
            style={{ 
              padding: 16, 
              background: t.glassGradient,
            }}
          >
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              background: t.gradient, 
              marginBottom: 12,
              boxShadow: '0 4px 12px rgba(251,146,60,0.3)',
            }} />
            <p style={{ color: t.text, fontSize: 14, fontWeight: 600, margin: 0 }}>Talk with Tessa</p>
          </GlassCard>
        </div>
      </div>

      {/* Floating button - Glass */}
      <div 
        onClick={() => setVoiceOpen(true)} 
        style={{ 
          position: 'fixed', 
          bottom: 24, 
          left: '50%', 
          transform: 'translateX(-50%)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          background: t.surfaceGlass,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 28, 
          padding: '10px 20px 10px 10px', 
          border: `1px solid ${t.borderGlass}`, 
          boxShadow: `0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
          cursor: 'pointer', 
          zIndex: 50,
        }}
      >
        <div style={{ 
          width: 48, 
          height: 48, 
          borderRadius: '50%', 
          background: t.gradient, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(251,146,60,0.4)',
          animation: 'pulse 2.5s ease-in-out infinite',
        }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="white">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
          </svg>
        </div>
        <span className="shimmer" style={{ color: t.text, fontSize: 15, fontWeight: 500 }}>Let Tessa help you</span>
      </div>

      {/* Overlays */}
      <VoiceOverlay />
      <BriefingOverlay />

      {/* Global styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer {
          background: linear-gradient(90deg, 
            ${t.textSecondary} 0%, 
            ${t.textSecondary} 35%, 
            ${t.text} 50%, 
            ${t.textSecondary} 65%, 
            ${t.textSecondary} 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TessaDemo;
