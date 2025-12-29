import React from 'react';

/**
 * GlassCard Component
 * 
 * A reusable container with liquid glass effect.
 * Uses backdrop-filter for blur and semi-transparent backgrounds.
 * 
 * @param {React.ReactNode} children - Card content
 * @param {object} style - Additional inline styles
 * @param {function} onClick - Click handler (makes card interactive)
 * @param {boolean} glow - Add accent color glow effect
 * @param {string} className - Additional CSS classes
 */
const GlassCard = ({ 
  children, 
  style = {}, 
  onClick, 
  glow = false,
  className = '',
  theme, // Pass theme from context or props
}) => {
  // Default theme values if not provided
  const t = theme || {
    surfaceGlass: 'rgba(255, 255, 255, 0.08)',
    borderGlass: 'rgba(255, 255, 255, 0.15)',
    glowColor: 'rgba(251, 146, 60, 0.15)',
  };

  const baseStyle = {
    background: t.surfaceGlass,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: `1px solid ${t.borderGlass}`,
    boxShadow: glow 
      ? `0 8px 32px ${t.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`
      : `0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)`,
    position: 'relative',
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const highlightStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
    pointerEvents: 'none',
    borderRadius: '24px 24px 0 0',
  };

  const handleMouseEnter = (e) => {
    if (onClick) {
      e.currentTarget.style.transform = 'scale(1.02)';
    }
  };

  const handleMouseLeave = (e) => {
    if (onClick) {
      e.currentTarget.style.transform = 'scale(1)';
    }
  };

  return (
    <div
      className={`glass-card ${className}`}
      style={{ ...baseStyle, ...style }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glass highlight effect */}
      <div style={highlightStyle} />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
