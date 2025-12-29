import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';
import NoteCard from './NoteCard';
import QuickNoteInput from './QuickNoteInput';

/**
 * NotesScreen Component
 *
 * Notes management screen with:
 * - Filter by note type
 * - Search functionality
 * - List of note cards
 * - Quick note input floating button
 */
const NotesScreen = ({ onBack }) => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickNote, setShowQuickNote] = useState(false);

  // Note types with icons
  const noteTypes = [
    { id: 'all', label: 'All', icon: '📝' },
    { id: 'idea', label: 'Ideas', icon: '💡' },
    { id: 'person', label: 'People', icon: '👤' },
    { id: 'gift', label: 'Gifts', icon: '🎁' },
    { id: 'important', label: 'Important', icon: '⚠️' },
    { id: 'general', label: 'General', icon: '📌' },
  ];

  // Sample notes data
  const [notes] = useState([
    {
      id: '1',
      content: 'Anna mentioned she loves the new Italian restaurant downtown',
      type: 'person',
      relatedPerson: 'Anna',
      tags: ['restaurant', 'date-idea'],
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      content: 'Gift idea: Peter wants the new PlayStation controller',
      type: 'gift',
      relatedPerson: 'Peter',
      tags: ['birthday', 'gaming'],
      createdAt: new Date('2024-01-14'),
    },
    {
      id: '3',
      content: 'App idea: A habit tracker that syncs with calendar',
      type: 'idea',
      tags: ['app', 'productivity'],
      createdAt: new Date('2024-01-13'),
    },
    {
      id: '4',
      content: 'Mom is allergic to shellfish - remember for restaurant picks',
      type: 'important',
      relatedPerson: 'Mom',
      tags: ['allergy', 'food'],
      createdAt: new Date('2024-01-12'),
    },
    {
      id: '5',
      content: 'Team prefers 10 AM meetings over 9 AM',
      type: 'general',
      tags: ['work', 'meetings'],
      createdAt: new Date('2024-01-11'),
    },
  ]);

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesFilter = activeFilter === 'all' || note.type === activeFilter;
    const matchesSearch = !searchQuery ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        padding: '50px 20px 16px',
        background: `${theme.bg}ee`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <button
            onClick={onBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: theme.surfaceGlass,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.borderGlass}`,
              color: theme.text,
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ←
          </button>
          <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
            Notes
          </h1>
        </div>

        {/* Search bar */}
        <div style={{
          background: theme.surfaceGlass,
          backdropFilter: 'blur(10px)',
          borderRadius: 14,
          padding: '12px 16px',
          border: `1px solid ${theme.borderGlass}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ color: theme.textMuted }}>🔍</span>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: theme.text,
              fontSize: 15,
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: theme.textMuted,
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div style={{
        padding: '0 20px 16px',
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
      }}>
        {noteTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setActiveFilter(type.id)}
            style={{
              background: activeFilter === type.id ? theme.accent : theme.surfaceGlass,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${activeFilter === type.id ? theme.accent : theme.borderGlass}`,
              borderRadius: 20,
              padding: '8px 14px',
              color: activeFilter === type.id ? 'white' : theme.textMuted,
              fontSize: 13,
              fontWeight: activeFilter === type.id ? 600 : 400,
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

      {/* Notes list */}
      <div style={{ padding: '0 20px' }}>
        {filteredNotes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
          }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📝</p>
            <p style={{ color: theme.textMuted, fontSize: 16 }}>
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </p>
            <p style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8 }}>
              Tap + to add your first note
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>

      {/* Floating add button */}
      <button
        onClick={() => setShowQuickNote(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: theme.gradient,
          border: 'none',
          boxShadow: `0 4px 20px ${theme.glowColor}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="white">
          <path d="M12 4v16M4 12h16" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </button>

      {/* Quick note input modal */}
      {showQuickNote && (
        <QuickNoteInput
          onClose={() => setShowQuickNote(false)}
          onSave={(note) => {
            console.log('New note:', note);
            setShowQuickNote(false);
          }}
        />
      )}
    </div>
  );
};

export default NotesScreen;
