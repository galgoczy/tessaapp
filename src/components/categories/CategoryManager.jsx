import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { CATEGORY_ICONS, CATEGORY_COLORS, generateId } from '../../data/models';
import GlassCard from '../ui/GlassCard';

// SVG Icon components for categories
const CategoryIconSVG = ({ iconId, color, size = 20 }) => {
  const icons = {
    briefcase: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    cart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    heart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    star: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    folder: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    tag: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    globe: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    book: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    lightbulb: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="22" x2="14" y2="22" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
    ),
  };

  return icons[iconId] || icons.folder;
};

// General Icons
const Icons = {
  back: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  plus: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M12 4v16M4 12h16" />
    </svg>
  ),
  trash: (color) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  edit: (color) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  check: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  x: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

/**
 * CategoryManager Component
 *
 * Screen for managing categories:
 * - View all categories
 * - Create new categories with icon and color picker
 * - Edit existing categories
 * - Delete custom categories (not default ones)
 */
const CategoryManager = ({ onBack }) => {
  const { theme, isFilledStyle } = useTheme();
  const { categories, addCategory, updateCategory, deleteCategory } = useData();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'folder',
    color: '#6366F1',
  });

  const resetForm = () => {
    setFormData({ name: '', icon: 'folder', color: '#6366F1' });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formData.name.trim(),
        icon: formData.icon,
        color: formData.color,
      });
    } else {
      addCategory({
        id: generateId(),
        name: formData.name.trim(),
        icon: formData.icon,
        color: formData.color,
        isDefault: false,
        linkedEmail: null,
        linkedCalendar: null,
        order: categories.length,
        createdAt: new Date(),
      });
    }
    resetForm();
  };

  const handleDelete = (category) => {
    if (category.isDefault) return;
    if (confirm(`Delete "${category.name}" category? This cannot be undone.`)) {
      deleteCategory(category.id);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        padding: '50px 20px 20px',
        background: `${theme.bg}ee`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={onBack}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: theme.surfaceGlass,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.borderGlass}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {Icons.back(theme.text)}
            </button>
            <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
              Categories
            </h1>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: isFilledStyle ? theme.gradient : 'transparent',
                border: `2px solid ${theme.accent}`,
                borderRadius: 12,
                cursor: 'pointer',
                color: isFilledStyle ? 'white' : theme.accent,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {Icons.plus(isFilledStyle ? 'white' : theme.accent)}
              New
            </button>
          )}
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div style={{ padding: '0 20px 24px' }}>
          <GlassCard theme={theme} style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ color: theme.text, fontSize: 18, fontWeight: 600, margin: 0 }}>
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <button
                onClick={resetForm}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                {Icons.x(theme.textMuted)}
              </button>
            </div>

            {/* Name input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: theme.textSecondary, fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
                NAME
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.text,
                  fontSize: 15,
                  outline: 'none',
                }}
              />
            </div>

            {/* Icon picker */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: theme.textSecondary, fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
                ICON
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 8,
              }}>
                {CATEGORY_ICONS.map(icon => (
                  <button
                    key={icon.id}
                    onClick={() => setFormData({ ...formData, icon: icon.id })}
                    style={{
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: formData.icon === icon.id ? `${formData.color}20` : theme.surface,
                      border: formData.icon === icon.id ? `2px solid ${formData.color}` : `1px solid ${theme.border}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    title={icon.name}
                  >
                    <CategoryIconSVG
                      iconId={icon.id}
                      color={formData.icon === icon.id ? formData.color : theme.textMuted}
                      size={22}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: theme.textSecondary, fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
                COLOR
              </label>
              <div style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
              }}>
                {CATEGORY_COLORS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setFormData({ ...formData, color: c.color })}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: c.color,
                      border: formData.color === c.color ? `3px solid ${theme.text}` : '3px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    title={c.name}
                  >
                    {formData.color === c.color && Icons.check('white')}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: theme.textSecondary, fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
                PREVIEW
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 16,
                background: theme.surface,
                borderRadius: 12,
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${formData.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CategoryIconSVG iconId={formData.icon} color={formData.color} size={24} />
                </div>
                <span style={{
                  color: theme.text,
                  fontSize: 16,
                  fontWeight: 600,
                }}>
                  {formData.name || 'Category Name'}
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: formData.name.trim() ? theme.gradient : theme.surface,
                border: 'none',
                borderRadius: 12,
                color: formData.name.trim() ? 'white' : theme.textMuted,
                fontSize: 15,
                fontWeight: 600,
                cursor: formData.name.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </GlassCard>
        </div>
      )}

      {/* Categories list */}
      <div style={{ padding: '0 20px' }}>
        <p style={{
          color: theme.textSecondary,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          Your Categories
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {categories.map(category => (
            <GlassCard key={category.id} theme={theme} style={{ padding: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: 16,
              }}>
                {/* Icon */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${category.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                  <CategoryIconSVG iconId={category.icon} color={category.color} size={24} />
                </div>

                {/* Name and info */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    color: theme.text,
                    fontSize: 16,
                    fontWeight: 600,
                    margin: 0,
                  }}>
                    {category.name}
                  </p>
                  {category.isDefault && (
                    <span style={{
                      fontSize: 11,
                      color: theme.textMuted,
                    }}>
                      Default category
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleEdit(category)}
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
                  {!category.isDefault && (
                    <button
                      onClick={() => handleDelete(category)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: '#EF444415',
                        border: `1px solid #EF444430`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {Icons.trash('#EF4444')}
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export the icon component for use in other screens
export { CategoryIconSVG };
export default CategoryManager;
