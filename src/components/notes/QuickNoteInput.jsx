import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';

/**
 * QuickNoteInput Component
 *
 * Modal for quickly adding a new note.
 * Features type selector and text input.
 */
const QuickNoteInput = ({ onClose, onSave }) => {
  const { theme } = useTheme();
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState('general');

  const noteTypes = [
    { id: 'idea', icon: '💡', label: 'Idea' },
    { id: 'person', icon: '👤', label: 'Person' },
    { id: 'gift', icon: '🎁', label: 'Gift' },
    { id: 'important', icon: '⚠️', label: 'Important' },
    { id: 'general', icon: '📌', label: 'General' },
  ];

  const handleSave = () => {
    if (!content.trim()) return;

    onSave({
      id: Date.now().toString(),
      content: content.trim(),
      type: selectedType,
      tags: [],
      createdAt: new Date(),
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: theme.overlayBg,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: 20,
    }}>
      <GlassCard theme={theme} style={{
        width: '100%',
        maxWidth: 400,
        padding: 24,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 600, margin: 0 }}>
            Quick Note
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              color: theme.textMuted,
              fontSize: 20,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Type selector */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16,
          overflowX: 'auto',
          paddingBottom: 4,
        }}>
          {noteTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              style={{
                background: selectedType === type.id ? theme.accent : theme.surface,
                border: `1px solid ${selectedType === type.id ? theme.accent : theme.border}`,
                borderRadius: 12,
                padding: '8px 14px',
                color: selectedType === type.id ? 'white' : theme.textMuted,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              <span>{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>

        {/* Text input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What would you like to remember?"
          autoFocus
          style={{
            width: '100%',
            height: 120,
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: 14,
            padding: 16,
            color: theme.text,
            fontSize: 15,
            lineHeight: 1.5,
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!content.trim()}
          style={{
            width: '100%',
            marginTop: 16,
            padding: 14,
            background: content.trim() ? theme.gradient : theme.surface,
            border: 'none',
            borderRadius: 14,
            color: content.trim() ? 'white' : theme.textMuted,
            fontSize: 15,
            fontWeight: 600,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          Save Note
        </button>
      </GlassCard>
    </div>
  );
};

export default QuickNoteInput;
