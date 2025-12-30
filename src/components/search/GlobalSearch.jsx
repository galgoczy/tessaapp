import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

/**
 * GlobalSearch Component
 *
 * Full-screen search overlay with live results.
 * Searches across tasks, notes, projects, tags, contacts, calendar events.
 */
const GlobalSearch = ({ isOpen, onClose, onResultSelect }) => {
  const { theme, accentStyle } = useTheme();
  const { search, categories, tags } = useData();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Live search as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    // Small debounce for performance
    const timer = setTimeout(() => {
      const searchResults = search(query);
      setResults(searchResults);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, search]);

  const handleResultClick = (result) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    onClose();
  };

  const getResultIcon = (type) => {
    const icons = {
      task: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      note: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      project: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
      ),
      tag: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
      contact: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      event: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      email: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    };
    return icons[type] || icons.note;
  };

  const getTypeLabel = (type) => {
    const labels = {
      task: 'Task',
      note: 'Note',
      project: 'Project',
      tag: 'Tag',
      contact: 'Contact',
      event: 'Calendar',
      email: 'Email',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      task: '#10B981',
      note: '#6366F1',
      project: '#F59E0B',
      tag: '#EC4899',
      contact: '#8B5CF6',
      event: '#3B82F6',
      email: '#EF4444',
    };
    return colors[type] || theme.accent;
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : '';
  };

  const getTagNames = (tagIds) => {
    if (!tagIds || tagIds.length === 0) return [];
    return tagIds
      .map(id => tags.find(t => t.id === id))
      .filter(Boolean)
      .map(t => ({ name: t.name, color: t.color }));
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          borderBottom: `1px solid ${theme.borderGlass}`,
        }}
      >
        {/* Search Icon */}
        <div style={{ color: theme.textMuted }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks, notes, projects, tags..."
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: theme.text,
            fontSize: 18,
            fontWeight: 400,
          }}
        />

        {/* Clear / Close Button */}
        {query ? (
          <button
            onClick={() => setQuery('')}
            style={{
              background: theme.surface,
              border: 'none',
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: theme.textMuted,
            }}
          >
            ×
          </button>
        ) : null}

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: theme.accent,
            fontSize: 16,
            fontWeight: 500,
            cursor: 'pointer',
            padding: '8px 0',
          }}
        >
          Cancel
        </button>
      </div>

      {/* Results */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
        }}
      >
        {/* Loading state */}
        {isSearching && (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: theme.textMuted,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                border: `2px solid ${theme.accent}40`,
                borderTopColor: theme.accent,
                borderRadius: '50%',
                margin: '0 auto 12px',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            Searching...
          </div>
        )}

        {/* Empty state - no query */}
        {!query && !isSearching && (
          <div
            style={{
              textAlign: 'center',
              padding: 60,
              color: theme.textMuted,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.5 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p style={{ fontSize: 15 }}>
              Search across all your content
            </p>
            <p style={{ fontSize: 13, marginTop: 8, opacity: 0.7 }}>
              Tasks, notes, projects, tags, contacts, calendar
            </p>
          </div>
        )}

        {/* No results */}
        {query && !isSearching && results.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: 60,
              color: theme.textMuted,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 15 }}>
              No results for "{query}"
            </p>
            <p style={{ fontSize: 13, marginTop: 8, opacity: 0.7 }}>
              Try a different search term
            </p>
          </div>
        )}

        {/* Results list */}
        {!isSearching && Object.keys(groupedResults).length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {Object.entries(groupedResults).map(([type, items]) => (
              <div key={type}>
                {/* Section header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                    color: getTypeColor(type),
                  }}
                >
                  {getResultIcon(type)}
                  <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {getTypeLabel(type)}s
                  </span>
                  <span style={{
                    fontSize: 11,
                    background: `${getTypeColor(type)}20`,
                    padding: '2px 8px',
                    borderRadius: 10,
                  }}>
                    {items.length}
                  </span>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        padding: 14,
                        background: theme.surfaceGlass,
                        border: `1px solid ${theme.borderGlass}`,
                        borderRadius: 12,
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* Icon */}
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: `${getTypeColor(type)}20`,
                          color: getTypeColor(type),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {getResultIcon(type)}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            color: theme.text,
                            fontSize: 15,
                            fontWeight: 500,
                            marginBottom: 4,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {result.title}
                        </div>

                        {result.subtitle && (
                          <div
                            style={{
                              color: theme.textMuted,
                              fontSize: 13,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginBottom: 6,
                            }}
                          >
                            {result.subtitle}
                          </div>
                        )}

                        {/* Meta info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          {/* Category */}
                          {result.item?.categoryId && (
                            <span
                              style={{
                                fontSize: 11,
                                color: theme.textSecondary,
                                background: theme.surface,
                                padding: '2px 8px',
                                borderRadius: 6,
                              }}
                            >
                              {getCategoryName(result.item.categoryId)}
                            </span>
                          )}

                          {/* Tags */}
                          {result.item?.tags && getTagNames(result.item.tags).map(tag => (
                            <span
                              key={tag.name}
                              style={{
                                fontSize: 11,
                                color: tag.color,
                                background: `${tag.color}15`,
                                padding: '2px 6px',
                                borderRadius: 4,
                              }}
                            >
                              #{tag.name}
                            </span>
                          ))}

                          {/* Task status */}
                          {type === 'task' && result.item && (
                            <span
                              style={{
                                fontSize: 11,
                                color: result.item.completed ? '#10B981' : theme.textMuted,
                              }}
                            >
                              {result.item.completed ? '✓ Done' : 'Active'}
                            </span>
                          )}

                          {/* Tag usage count */}
                          {type === 'tag' && result.item && (
                            <span style={{ fontSize: 11, color: theme.textMuted }}>
                              Used {result.item.usageCount} times
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div style={{ color: theme.textMuted, flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9,18 15,12 9,6" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Keyboard hint */}
      <div
        style={{
          padding: 16,
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          borderTop: `1px solid ${theme.borderGlass}`,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          color: theme.textMuted,
          fontSize: 12,
        }}
      >
        <span>
          <kbd style={{
            background: theme.surface,
            padding: '2px 6px',
            borderRadius: 4,
            marginRight: 4,
          }}>↵</kbd>
          select
        </span>
        <span>
          <kbd style={{
            background: theme.surface,
            padding: '2px 6px',
            borderRadius: 4,
            marginRight: 4,
          }}>esc</kbd>
          close
        </span>
      </div>

      {/* Spin animation */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GlobalSearch;
