import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

/**
 * TagPicker Component
 *
 * Allows selecting existing tags or creating new ones.
 * Shows tag suggestions and selected tags as chips.
 */
const TagPicker = ({
  selectedTags = [],
  onTagsChange,
  maxTags = 3,
  showSuggestions = true,
}) => {
  const { theme } = useTheme();
  const { tags, addTag } = useData();
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter tags based on input
  const filteredTags = tags.filter(tag =>
    tag.name.includes(inputValue.toLowerCase()) &&
    !selectedTags.includes(tag.id)
  );

  // Get popular tags (most used)
  const popularTags = [...tags]
    .sort((a, b) => b.usageCount - a.usageCount)
    .filter(tag => !selectedTags.includes(tag.id))
    .slice(0, 5);

  const handleSelectTag = (tagId) => {
    if (selectedTags.length >= maxTags) return;
    if (!selectedTags.includes(tagId)) {
      onTagsChange([...selectedTags, tagId]);
    }
    setInputValue('');
    setIsOpen(false);
  };

  const handleRemoveTag = (tagId) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const handleCreateTag = () => {
    if (!inputValue.trim()) return;
    const newTag = addTag(inputValue.trim());
    if (newTag && selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, newTag.id]);
    }
    setInputValue('');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTags.length > 0) {
        handleSelectTag(filteredTags[0].id);
      } else if (inputValue.trim()) {
        handleCreateTag();
      }
    }
    if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const getTagById = (tagId) => tags.find(t => t.id === tagId);

  return (
    <div style={{ position: 'relative' }}>
      {/* Selected tags + input */}
      <div
        onClick={() => setIsOpen(true)}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          padding: '8px 12px',
          background: theme.surface,
          border: `1px solid ${isOpen ? theme.accent : theme.border}`,
          borderRadius: 12,
          minHeight: 44,
          alignItems: 'center',
          cursor: 'text',
          transition: 'border-color 0.2s',
        }}
      >
        {/* Selected tag chips */}
        {selectedTags.map(tagId => {
          const tag = getTagById(tagId);
          if (!tag) return null;
          return (
            <span
              key={tag.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: `${tag.color}20`,
                color: tag.color,
                padding: '4px 8px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              #{tag.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(tag.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: tag.color,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </span>
          );
        })}

        {/* Input */}
        {selectedTags.length < maxTags && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.replace(/\s/g, ''))}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedTags.length === 0 ? 'Add tags...' : ''}
            style={{
              flex: 1,
              minWidth: 80,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: theme.text,
              fontSize: 14,
            }}
          />
        )}

        {/* Tag count indicator */}
        <span style={{
          color: theme.textMuted,
          fontSize: 11,
          marginLeft: 'auto',
        }}>
          {selectedTags.length}/{maxTags}
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 98 }}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: theme.surfaceGlass,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${theme.borderGlass}`,
            borderRadius: 12,
            padding: 8,
            zIndex: 99,
            maxHeight: 200,
            overflowY: 'auto',
          }}>
            {/* Search results or popular tags */}
            {inputValue ? (
              <>
                {filteredTags.length > 0 ? (
                  filteredTags.slice(0, 5).map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleSelectTag(tag.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 12px',
                        background: 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        textAlign: 'left',
                        color: theme.text,
                        fontSize: 14,
                      }}
                      onMouseEnter={(e) => e.target.style.background = theme.surface}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: tag.color,
                      }} />
                      #{tag.name}
                      <span style={{ color: theme.textMuted, fontSize: 12, marginLeft: 'auto' }}>
                        {tag.usageCount}
                      </span>
                    </button>
                  ))
                ) : (
                  <button
                    onClick={handleCreateTag}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: theme.accent,
                      fontSize: 14,
                    }}
                  >
                    <span>+</span>
                    Create "#{inputValue}"
                  </button>
                )}
              </>
            ) : (
              <>
                {showSuggestions && popularTags.length > 0 && (
                  <>
                    <p style={{
                      color: theme.textMuted,
                      fontSize: 11,
                      padding: '4px 12px',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}>
                      Popular tags
                    </p>
                    {popularTags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => handleSelectTag(tag.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 12px',
                          background: 'none',
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                          textAlign: 'left',
                          color: theme.text,
                          fontSize: 14,
                        }}
                        onMouseEnter={(e) => e.target.style.background = theme.surface}
                        onMouseLeave={(e) => e.target.style.background = 'none'}
                      >
                        <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: tag.color,
                        }} />
                        #{tag.name}
                      </button>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TagPicker;
