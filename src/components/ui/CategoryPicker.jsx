import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

/**
 * CategoryPicker Component
 *
 * Dropdown to select a category for tasks/notes/projects.
 */
const CategoryPicker = ({
  selectedCategoryId,
  onCategoryChange,
  compact = false,
}) => {
  const { theme } = useTheme();
  const { categories } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];

  const handleSelect = (categoryId) => {
    onCategoryChange(categoryId);
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            background: `${selectedCategory.color}20`,
            border: `1px solid ${selectedCategory.color}40`,
            borderRadius: 8,
            cursor: 'pointer',
            color: selectedCategory.color,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <span>{selectedCategory.icon}</span>
          {selectedCategory.name}
          <span style={{ fontSize: 10 }}>▼</span>
        </button>

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
              marginTop: 4,
              background: theme.surfaceGlass,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${theme.borderGlass}`,
              borderRadius: 12,
              padding: 6,
              zIndex: 99,
              minWidth: 150,
            }}>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleSelect(category.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    background: category.id === selectedCategoryId ? theme.surface : 'none',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: theme.text,
                    fontSize: 14,
                  }}
                >
                  <span>{category.icon}</span>
                  <span style={{ color: category.color, fontWeight: 500 }}>
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Full version with label
  return (
    <div>
      <label style={{
        display: 'block',
        color: theme.textSecondary,
        fontSize: 12,
        fontWeight: 500,
        marginBottom: 6,
      }}>
        Category
      </label>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            background: theme.surface,
            border: `1px solid ${isOpen ? theme.accent : theme.border}`,
            borderRadius: 12,
            cursor: 'pointer',
            color: theme.text,
            fontSize: 15,
            textAlign: 'left',
            transition: 'border-color 0.2s',
          }}
        >
          <span style={{ fontSize: 20 }}>{selectedCategory.icon}</span>
          <span style={{ flex: 1 }}>{selectedCategory.name}</span>
          <span style={{ color: theme.textMuted, fontSize: 12 }}>▼</span>
        </button>

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
              border: `1px solid ${theme.borderGlass}`,
              borderRadius: 12,
              padding: 6,
              zIndex: 99,
            }}>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleSelect(category.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    background: category.id === selectedCategoryId ? theme.surface : 'none',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: theme.text,
                    fontSize: 15,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{category.icon}</span>
                  <span style={{ flex: 1 }}>{category.name}</span>
                  {category.id === selectedCategoryId && (
                    <span style={{ color: theme.accent }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPicker;
