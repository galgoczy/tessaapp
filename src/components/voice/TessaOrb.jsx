import React from 'react';

/**
 * TessaOrb Component
 * 
 * Animated orb representing Tessa's presence.
 * Features multiple layers with pulsing animations.
 * 
 * @param {number} size - Orb diameter in pixels (default: 80)
 * @param {boolean} active - Enhanced animation when active/listening
 * @param {object} theme - Theme object with gradient and accent colors
 */
const TessaOrb = ({ 
  size = 80, 
  active = false,
  theme,
}) => {
  // Default theme values
  const t = theme || {
    gradient: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #a78bfa 100%)',
    accent: '#fb923c',
  };

  const containerStyle = {
    position: 'relative',
    width: `${size}px`,
    height: `${size}px`,
  };

  // Glow layer - outermost
  const glowStyle = {
    position: 'absolute',
    inset: `-${size * 0.2}px`,
    borderRadius: '50%',
    background: t.gradient,
    filter: `blur(${size * 0.3}px)`,
    opacity: active ? 0.5 : 0.25,
    animation: 'orbGlowPulse 3s ease-in-out infinite',
  };

  // Ring layer
  const ringStyle = {
    position: 'absolute',
    inset: `-${size * 0.1}px`,
    borderRadius: '50%',
    border: `2px solid ${t.accent}`,
    opacity: 0.3,
    animation: 'orbRingPulse 3s ease-in-out infinite',
  };

  // Core layer - main orb
  const coreStyle = {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: t.gradient,
    boxShadow: `
      inset 0 -${size * 0.1}px ${size * 0.2}px rgba(0,0,0,0.3), 
      inset 0 ${size * 0.05}px ${size * 0.1}px rgba(255,255,255,0.2)
    `,
    animation: 'orbCorePulse 3s ease-in-out infinite',
  };

  // Highlight reflection
  const highlightStyle = {
    position: 'absolute',
    top: '15%',
    left: '20%',
    width: '30%',
    height: '25%',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.35)',
    filter: 'blur(2px)',
  };

  return (
    <div style={containerStyle}>
      <div className="orb-glow" style={glowStyle} />
      <div className="orb-ring" style={ringStyle} />
      <div className="orb-core" style={coreStyle}>
        <div style={highlightStyle} />
      </div>
      
      <style>{`
        @keyframes orbGlowPulse {
          0%, 100% { transform: scale(1); opacity: ${active ? 0.4 : 0.25}; }
          50% { transform: scale(1.15); opacity: ${active ? 0.6 : 0.4}; }
        }
        @keyframes orbRingPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.15; }
        }
        @keyframes orbCorePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default TessaOrb;
