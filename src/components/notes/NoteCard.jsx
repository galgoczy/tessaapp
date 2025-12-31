import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';

/**
 * NoteCard Component
 *
 * Displays a single note with:
 * - Type icon
 * - Content text
 * - Related person (if any)
 * - Tags
 * - Creation date
 */
const NoteCard = ({ note }) => {
  const { theme } = useTheme();

  // Get icon for note type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'idea': return '💡';
      case 'person': return '👤';
      case 'gift': return '🎁';
      case 'important': return '⚠️';
      default: return '📌';
    }
  };

  // Get color for note type
  const getTypeColor = (type) => {
    switch (type) {
      case 'idea': return '#fbbf24';
      case 'person': return theme.secondary;
      case 'gift': return '#f472b6';
      case 'important': return theme.error;
      default: return theme.textMuted;
    }
  };

  // Format date
  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <GlassCard theme={theme} style={{ padding: 16 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 12,
      }}>
        {/* Type icon */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${getTypeColor(note.type)}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}>
          {getTypeIcon(note.type)}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <p style={{
            color: theme.text,
            fontSize: 14,
            lineHeight: 1.5,
            margin: 0,
          }}>
            {note.content}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTop: `1px solid ${theme.border}`,
      }}>
        {/* Tags and person */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Related person badge */}
          {note.relatedPerson && (
            <span style={{
              background: `${theme.secondary}20`,
              color: theme.secondary,
              padding: '4px 10px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 500,
            }}>
              👤 {note.relatedPerson}
            </span>
          )}

          {/* Tags */}
          {note.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              style={{
                background: theme.surface,
                color: theme.textMuted,
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: 12,
              }}
            >
              #{tag}
            </span>
          ))}

          {note.tags.length > 2 && (
            <span style={{
              color: theme.textSecondary,
              fontSize: 12,
            }}>
              +{note.tags.length - 2}
            </span>
          )}
        </div>

        {/* Date */}
        <span style={{
          color: theme.textSecondary,
          fontSize: 12,
        }}>
          {formatDate(note.createdAt)}
        </span>
      </div>
    </GlassCard>
  );
};

export default NoteCard;
