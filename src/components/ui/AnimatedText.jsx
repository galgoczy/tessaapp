import React, { useState, useEffect, useMemo } from 'react';

/**
 * AnimatedText Component
 *
 * Displays text with a typing/fade-in animation effect.
 * Characters appear one by one with a smooth fade effect.
 */
const AnimatedText = ({
  text,
  speed = 20, // ms per character
  style = {},
  onComplete,
  animate = true,
}) => {
  const [visibleLength, setVisibleLength] = useState(animate ? 0 : text.length);
  const [isComplete, setIsComplete] = useState(!animate);

  // Reset animation when text changes
  useEffect(() => {
    if (animate) {
      setVisibleLength(0);
      setIsComplete(false);
    } else {
      setVisibleLength(text.length);
      setIsComplete(true);
    }
  }, [text, animate]);

  // Animate characters
  useEffect(() => {
    if (!animate || isComplete) return;

    if (visibleLength < text.length) {
      const timer = setTimeout(() => {
        setVisibleLength(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [visibleLength, text.length, speed, animate, isComplete, onComplete]);

  // Memoize the rendered characters
  const renderedText = useMemo(() => {
    if (!animate || isComplete) {
      return text;
    }

    const chars = text.split('');
    return chars.map((char, index) => {
      const isVisible = index < visibleLength;
      const isCurrent = index === visibleLength - 1;

      return (
        <span
          key={index}
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.15s ease-out',
            ...(isCurrent && {
              animation: 'charFadeIn 0.15s ease-out',
            }),
          }}
        >
          {char}
        </span>
      );
    });
  }, [text, visibleLength, animate, isComplete]);

  return (
    <>
      <span style={{ ...style, whiteSpace: 'pre-wrap' }}>
        {renderedText}
        {/* Blinking cursor while animating */}
        {animate && !isComplete && (
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: '1em',
              background: 'currentColor',
              marginLeft: 1,
              animation: 'cursorBlink 0.8s ease-in-out infinite',
              verticalAlign: 'text-bottom',
            }}
          />
        )}
      </span>
      <style>{`
        @keyframes charFadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default AnimatedText;
