import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * QuoteSection Component
 *
 * Displays rotating inspirational quotes.
 * Fades out as user scrolls down.
 */
const QuoteSection = ({ opacity = 1 }) => {
  const { theme } = useTheme();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
    },
    {
      text: "It always seems impossible until it's done.",
      author: "Nelson Mandela",
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
    },
    {
      text: "Do what you can, with what you have, where you are.",
      author: "Theodore Roosevelt",
    },
  ];

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFadeIn(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  const quote = quotes[quoteIndex];

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
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.5s',
      }}>
        "{quote.text}"
      </p>

      {/* Author */}
      <p style={{
        color: theme.textSecondary,
        fontSize: 14,
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.5s',
      }}>
        — {quote.author}
      </p>
    </div>
  );
};

export default QuoteSection;
