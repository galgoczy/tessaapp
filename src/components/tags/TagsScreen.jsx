import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import GlassCard from '../ui/GlassCard';

// SVG Icons
const Icons = {
  back: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  tag: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  plus: (color) => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M12 4v16M4 12h16" />
    </svg>
  ),
  trash: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  edit: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  check: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  task: (color) => (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  note: (color) => (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  ),
  folder: (color) => (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  chevron: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
};

const TAG_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
  '#F59E0B', '#10B981', '#06B6D4', '#3B82F6',
  '#84CC16', '#14B8A6', '#F97316', '#A855F7',
];

/**
 * TagsScreen Component
 *
 * Tag management with:
 * - View all tags with usage counts
 * - Edit tag name and color
 * - Delete tags
 * - View items per tag
 */
const TagsScreen = ({ onBack }) => {
  const { theme } = useTheme();
  const { tags, updateTag, deleteTag, addTag, getItemsByTag } = useData();

  const [selectedTag, setSelectedTag] = useState(null);
  const [showAddTag, setShowAddTag] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // New tag form
  const [newTag, setNewTag] = useState({ name: '', color: TAG_COLORS[0] });

  // Edit tag form
  const [editForm, setEditForm] = useState({ name: '', color: '' });

  // Sort tags by usage
  const sortedTags = useMemo(() => {
    let filtered = [...tags];
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered.sort((a, b) => b.usageCount - a.usageCount);
  }, [tags, searchQuery]);

  const handleAddTag = () => {
    if (!newTag.name.trim()) return;
    addTag(newTag.name.trim(), newTag.color);
    setNewTag({ name: '', color: TAG_COLORS[0] });
    setShowAddTag(false);
  };

  const handleStartEdit = (tag) => {
    setEditingTag(tag.id);
    setEditForm({ name: tag.name, color: tag.color });
  };

  const handleSaveEdit = (tagId) => {
    if (!editForm.name.trim()) return;
    updateTag(tagId, {
      name: editForm.name.trim().toLowerCase(),
      color: editForm.color,
    });
    setEditingTag(null);
  };

  const handleDeleteTag = (tagId) => {
    if (confirm('Delete this tag? It will be removed from all items.')) {
      deleteTag(tagId);
      if (selectedTag === tagId) setSelectedTag(null);
    }
  };

  // Tag detail view
  if (selectedTag) {
    const tag = tags.find(t => t.id === selectedTag);
    if (!tag) {
      setSelectedTag(null);
      return null;
    }

    const { tasks: tagTasks, notes: tagNotes, projects: tagProjects } = getItemsByTag(tag.id);
    const totalItems = tagTasks.length + tagNotes.length + tagProjects.length;

    return (
      <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
        {/* Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          padding: '50px 20px 20px',
          background: `${theme.bg}ee`,
          backdropFilter: 'blur(16px)',
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSelectedTag(null)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: theme.surfaceGlass,
                border: `1px solid ${theme.borderGlass}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {Icons.back(theme.text)}
            </button>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `${tag.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {Icons.tag(tag.color)}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ color: theme.text, fontSize: 22, fontWeight: 700, margin: 0 }}>
                #{tag.name}
              </h1>
              <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { icon: Icons.task, label: 'Tasks', count: tagTasks.length, color: '#6366F1' },
              { icon: Icons.note, label: 'Notes', count: tagNotes.length, color: '#10B981' },
              { icon: Icons.folder, label: 'Projects', count: tagProjects.length, color: '#F59E0B' },
            ].map(stat => (
              <GlassCard key={stat.label} theme={theme} style={{ padding: 14, textAlign: 'center' }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                }}>
                  {stat.icon(stat.color)}
                </div>
                <p style={{ color: theme.text, fontSize: 20, fontWeight: 700, margin: 0 }}>
                  {stat.count}
                </p>
                <p style={{ color: theme.textMuted, fontSize: 11, margin: '2px 0 0' }}>
                  {stat.label}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Tasks section */}
        {tagTasks.length > 0 && (
          <div style={{ padding: '0 20px 20px' }}>
            <p style={{ color: theme.textSecondary, fontSize: 13, fontWeight: 500, marginBottom: 12 }}>
              Tasks
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tagTasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    padding: 14,
                    background: theme.surface,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    opacity: task.isCompleted ? 0.6 : 1,
                  }}
                >
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: task.isCompleted ? theme.accent : 'transparent',
                    border: `2px solid ${task.isCompleted ? theme.accent : theme.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {task.isCompleted && Icons.check('white')}
                  </div>
                  <span style={{
                    color: theme.text,
                    fontSize: 14,
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                  }}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes section */}
        {tagNotes.length > 0 && (
          <div style={{ padding: '0 20px 20px' }}>
            <p style={{ color: theme.textSecondary, fontSize: 13, fontWeight: 500, marginBottom: 12 }}>
              Notes
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tagNotes.map(note => (
                <div
                  key={note.id}
                  style={{
                    padding: 14,
                    background: theme.surface,
                    borderRadius: 12,
                  }}
                >
                  <p style={{
                    color: theme.text,
                    fontSize: 13,
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    {note.content.slice(0, 100)}{note.content.length > 100 ? '...' : ''}
                  </p>
                  <p style={{ color: theme.textMuted, fontSize: 11, margin: '8px 0 0' }}>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects section */}
        {tagProjects.length > 0 && (
          <div style={{ padding: '0 20px 20px' }}>
            <p style={{ color: theme.textSecondary, fontSize: 13, fontWeight: 500, marginBottom: 12 }}>
              Projects
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tagProjects.map(project => (
                <div
                  key={project.id}
                  style={{
                    padding: 14,
                    background: theme.surface,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${project.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}>
                    {project.icon}
                  </div>
                  <span style={{ color: theme.text, fontSize: 14, fontWeight: 500 }}>
                    {project.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {totalItems === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🏷️</p>
            <p style={{ color: theme.textMuted, fontSize: 16 }}>No items with this tag</p>
          </div>
        )}
      </div>
    );
  }

  // Tags list view
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        padding: '50px 20px 16px',
        background: `${theme.bg}ee`,
        backdropFilter: 'blur(16px)',
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
              border: `1px solid ${theme.borderGlass}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Icons.back(theme.text)}
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
              Tags
            </h1>
            <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>
              {tags.length} tags
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          background: theme.surfaceGlass,
          borderRadius: 12,
          border: `1px solid ${theme.borderGlass}`,
        }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search tags..."
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
        </div>
      </div>

      {/* Add tag form */}
      {showAddTag && (
        <div style={{ padding: '0 20px 16px' }}>
          <GlassCard theme={theme} style={{ padding: 16 }}>
            <input
              type="text"
              placeholder="Tag name"
              value={newTag.name}
              onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                outline: 'none',
                color: theme.text,
                fontSize: 16,
                fontWeight: 500,
                marginBottom: 16,
              }}
            />

            {/* Color picker */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>Color</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {TAG_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewTag({ ...newTag, color })}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: color,
                      border: newTag.color === color ? '3px solid white' : 'none',
                      boxShadow: newTag.color === color ? `0 0 0 2px ${color}` : 'none',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleAddTag}
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
                Create Tag
              </button>
              <button
                onClick={() => { setShowAddTag(false); setNewTag({ name: '', color: TAG_COLORS[0] }); }}
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

      {/* Tags list */}
      <div style={{ padding: '0 20px' }}>
        {sortedTags.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🏷️</p>
            <p style={{ color: theme.textMuted, fontSize: 16 }}>
              {searchQuery ? 'No tags found' : 'No tags yet'}
            </p>
            {!searchQuery && (
              <p style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8 }}>
                Tags are auto-created when you add them to items
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sortedTags.map(tag => {
              const isEditing = editingTag === tag.id;

              if (isEditing) {
                return (
                  <GlassCard key={tag.id} theme={theme} style={{ padding: 16 }}>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(tag.id)}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        color: theme.text,
                        fontSize: 16,
                        fontWeight: 500,
                        marginBottom: 12,
                      }}
                    />

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                      {TAG_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setEditForm({ ...editForm, color })}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: color,
                            border: editForm.color === color ? '2px solid white' : 'none',
                            boxShadow: editForm.color === color ? `0 0 0 2px ${color}` : 'none',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleSaveEdit(tag.id)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: theme.accent,
                          border: 'none',
                          borderRadius: 8,
                          color: 'white',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTag(null)}
                        style={{
                          padding: '10px 16px',
                          background: theme.surface,
                          border: `1px solid ${theme.border}`,
                          borderRadius: 8,
                          color: theme.textMuted,
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </GlassCard>
                );
              }

              return (
                <GlassCard
                  key={tag.id}
                  theme={theme}
                  style={{ padding: 14 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Tag color indicator */}
                    <div
                      onClick={() => setSelectedTag(tag.id)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${tag.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {Icons.tag(tag.color)}
                    </div>

                    {/* Tag info */}
                    <div
                      onClick={() => setSelectedTag(tag.id)}
                      style={{ flex: 1, cursor: 'pointer' }}
                    >
                      <p style={{
                        color: tag.color,
                        fontSize: 15,
                        fontWeight: 600,
                        margin: 0,
                      }}>
                        #{tag.name}
                      </p>
                      <p style={{ color: theme.textMuted, fontSize: 12, margin: '4px 0 0' }}>
                        {tag.usageCount} item{tag.usageCount !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => handleStartEdit(tag)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: theme.surface,
                        border: `1px solid ${theme.border}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {Icons.edit(theme.textMuted)}
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: '#EF444415',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {Icons.trash('#EF4444')}
                    </button>

                    <div
                      onClick={() => setSelectedTag(tag.id)}
                      style={{ cursor: 'pointer', padding: 4 }}
                    >
                      {Icons.chevron(theme.textMuted)}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating add button */}
      <button
        onClick={() => setShowAddTag(true)}
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

export default TagsScreen;
