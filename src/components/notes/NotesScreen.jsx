import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import GlassCard from '../ui/GlassCard';
import TagPicker from '../ui/TagPicker';
import CategoryPicker from '../ui/CategoryPicker';
import CategoryIcon from '../ui/CategoryIcon';

// SVG Icons
const Icons = {
  back: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  plus: (color) => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M12 4v16M4 12h16" />
    </svg>
  ),
  search: (color) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  trash: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
};

/**
 * NotesScreen Component
 *
 * Notes management with real data from DataContext.
 * Features: categories, tags, note types, search.
 */
const NotesScreen = ({ onBack }) => {
  const { theme } = useTheme();
  const {
    notes,
    categories,
    tags,
    projects,
    addNote,
    updateNote,
    deleteNote,
    getTagById,
  } = useData();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  // New note form state
  const [newNote, setNewNote] = useState({
    content: '',
    categoryId: 'cat-personal',
    projectId: null,
    type: 'general',
    tags: [],
    relatedPerson: '',
  });

  // Filter notes
  const filteredNotes = notes.filter(note => {
    if (note.isArchived) return false;

    // Category filter
    if (categoryFilter !== 'all' && note.categoryId !== categoryFilter) return false;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const contentMatch = note.content.toLowerCase().includes(q);
      const personMatch = note.relatedPerson?.toLowerCase().includes(q);
      const tagMatch = note.tags.some(tagId => {
        const tag = getTagById(tagId);
        return tag?.name.includes(q);
      });
      if (!contentMatch && !personMatch && !tagMatch) return false;
    }

    return true;
  });

  // Sort by most recent
  const sortedNotes = [...filteredNotes].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleAddNote = () => {
    if (!newNote.content.trim()) return;
    addNote({
      ...newNote,
      relatedPerson: newNote.relatedPerson || null,
    });
    setNewNote({
      content: '',
      categoryId: 'cat-personal',
      projectId: null,
      type: 'general',
      tags: [],
      relatedPerson: '',
    });
    setShowAddNote(false);
  };

  const getCategoryById = (id) => categories.find(c => c.id === id);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Icons.back(theme.text)}
          </button>
          <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0, flex: 1 }}>
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
          marginBottom: 16,
        }}>
          {Icons.search(theme.textMuted)}
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

        {/* Category tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 12,
          marginBottom: 8,
        }}>
          <button
            onClick={() => setCategoryFilter('all')}
            style={{
              padding: '8px 14px',
              background: categoryFilter === 'all' ? theme.accent : theme.surfaceGlass,
              border: `1px solid ${categoryFilter === 'all' ? theme.accent : theme.borderGlass}`,
              borderRadius: 20,
              color: categoryFilter === 'all' ? 'white' : theme.textMuted,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              style={{
                padding: '8px 14px',
                background: categoryFilter === cat.id ? `${cat.color}20` : theme.surfaceGlass,
                border: `1px solid ${categoryFilter === cat.id ? cat.color : theme.borderGlass}`,
                borderRadius: 20,
                color: categoryFilter === cat.id ? cat.color : theme.textMuted,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <CategoryIcon
                iconId={cat.icon}
                color={categoryFilter === cat.id ? cat.color : theme.textMuted}
                size={14}
              />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add note form */}
      {showAddNote && (
        <div style={{ padding: '0 20px 16px' }}>
          <GlassCard theme={theme} style={{ padding: 16 }}>
            <textarea
              placeholder="What do you want to remember?"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              autoFocus
              rows={3}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                outline: 'none',
                color: theme.text,
                fontSize: 15,
                resize: 'none',
                marginBottom: 16,
              }}
            />

            <div style={{ marginBottom: 16 }}>
              <CategoryPicker
                selectedCategoryId={newNote.categoryId}
                onCategoryChange={(id) => setNewNote({ ...newNote, categoryId: id })}
                compact
              />
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 16 }}>
              <TagPicker
                selectedTags={newNote.tags}
                onTagsChange={(tags) => setNewNote({ ...newNote, tags })}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleAddNote}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: theme.accent,
                  border: 'none',
                  borderRadius: 10,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save Note
              </button>
              <button
                onClick={() => setShowAddNote(false)}
                style={{
                  padding: '12px 16px',
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.textMuted,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Notes list */}
      <div style={{ padding: '0 20px' }}>
        {sortedNotes.length === 0 ? (
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
            {sortedNotes.map(note => {
              const typeInfo = getNoteTypeInfo(note.type);
              const category = getCategoryById(note.categoryId);

              return (
                <GlassCard
                  key={note.id}
                  theme={theme}
                  style={{
                    padding: 16,
                    borderLeft: `3px solid ${typeInfo.color}`,
                  }}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    {/* Type icon */}
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `${typeInfo.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      flexShrink: 0,
                    }}>
                      {typeInfo.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: theme.text,
                        fontSize: 14,
                        lineHeight: 1.5,
                        margin: 0,
                      }}>
                        {note.content}
                      </p>

                      {/* Related person */}
                      {note.relatedPerson && (
                        <p style={{
                          color: theme.accent,
                          fontSize: 13,
                          fontWeight: 500,
                          margin: '8px 0 0',
                        }}>
                          👤 {note.relatedPerson}
                        </p>
                      )}

                      {/* Tags */}
                      {note.tags.length > 0 && (
                        <div style={{
                          display: 'flex',
                          gap: 6,
                          marginTop: 8,
                          flexWrap: 'wrap',
                        }}>
                          {note.tags.map(tagId => {
                            const tag = getTagById(tagId);
                            if (!tag) return null;
                            return (
                              <span
                                key={tag.id}
                                style={{
                                  background: `${tag.color}15`,
                                  color: tag.color,
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontWeight: 500,
                                }}
                              >
                                #{tag.name}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Meta */}
                      <div style={{
                        display: 'flex',
                        gap: 10,
                        marginTop: 10,
                        alignItems: 'center',
                      }}>
                        <span style={{
                          fontSize: 11,
                          color: theme.textMuted,
                        }}>
                          {formatDate(note.createdAt)}
                        </span>
                        <span style={{
                          fontSize: 11,
                          color: category?.color,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          {category?.icon} {category?.name}
                        </span>
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteNote(note.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        opacity: 0.5,
                        alignSelf: 'flex-start',
                      }}
                    >
                      {Icons.trash(theme.textMuted)}
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating add button */}
      <button
        onClick={() => setShowAddNote(true)}
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
        {Icons.plus('white')}
      </button>
    </div>
  );
};

export default NotesScreen;
