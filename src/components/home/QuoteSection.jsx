import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * QuoteSection Component
 *
 * Displays daily inspirational quote.
 * Fades out as user scrolls down.
 */
const QuoteSection = ({ opacity = 1 }) => {
  const { theme } = useTheme();

  // Could be fetched from an API or stored quotes
  const quote = {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      opacity: opacity,
      transition: 'opacity 0.5s',
      minHeight: 200,
    }}>
      {/* Label */}
      <p style={{
        color: theme.tertiary,
        fontSize: 11,
        letterSpacing: 2,
        marginBottom: 16,
        textTransform: 'uppercase',
        fontWeight: 500,
      }}>
        Daily Inspiration
      </p>

      {/* Quote text */}
      <p style={{
        color: theme.text,
        fontSize: 22,
        fontWeight: 500,
        fontStyle: 'italic',
        lineHeight: 1.4,
        margin: '0 0 12px',
        maxWidth: 300,
      }}>
        "{quote.text}"
      </p>

      {/* Author */}
      <p style={{ color: theme.textSecondary, fontSize: 14 }}>
        — {quote.author}
      </p>
    </div>
  );
};

export default QuoteSection;
