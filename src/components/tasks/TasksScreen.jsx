import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import GlassCard from '../ui/GlassCard';
import TagPicker from '../ui/TagPicker';
import CategoryPicker from '../ui/CategoryPicker';

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
  check: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  calendar: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  flag: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
    </svg>
  ),
  trash: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
};

/**
 * TasksScreen Component
 *
 * Task management with real data from DataContext.
 * Features: categories, tags, priorities, due dates.
 */
const TasksScreen = ({ onBack }) => {
  const { theme, isFilledStyle } = useTheme();
  const {
    tasks,
    categories,
    tags,
    projects,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTagById,
  } = useData();

  const [activeFilter, setActiveFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddTask, setShowAddTask] = useState(false);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    categoryId: 'cat-personal',
    projectId: null,
    priority: 'medium',
    tags: [],
    dueDate: '',
    showInCalendar: true,
  });

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Done' },
    { id: 'high', label: 'High' },
  ];

  const priorityColors = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981',
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Category filter
    if (categoryFilter !== 'all' && task.categoryId !== categoryFilter) return false;

    // Status filter
    if (activeFilter === 'active') return !task.isCompleted;
    if (activeFilter === 'completed') return task.isCompleted;
    if (activeFilter === 'high') return task.priority === 'high' && !task.isCompleted;
    return true;
  });

  // Sort: incomplete first, then by priority, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    addTask({
      ...newTask,
      dueDate: newTask.dueDate || null,
    });
    setNewTask({
      title: '',
      categoryId: 'cat-personal',
      projectId: null,
      priority: 'medium',
      tags: [],
      dueDate: '',
      showInCalendar: true,
    });
    setShowAddTask(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getCategoryById = (id) => categories.find(c => c.id === id);
  const getProjectById = (id) => projects.find(p => p.id === id);

  const activeCount = tasks.filter(t => !t.isCompleted).length;

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
          <div style={{ flex: 1 }}>
            <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
              Tasks
            </h1>
            <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>
              {activeCount} active
            </p>
          </div>
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
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Status filters */}
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
        }}>
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              style={{
                background: activeFilter === filter.id
                  ? (isFilledStyle ? theme.accent : 'transparent')
                  : theme.surfaceGlass,
                border: activeFilter === filter.id
                  ? `2px solid ${theme.accent}`
                  : `1px solid ${theme.borderGlass}`,
                borderRadius: 20,
                padding: '8px 16px',
                color: activeFilter === filter.id
                  ? (isFilledStyle ? 'white' : theme.accent)
                  : theme.textMuted,
                fontSize: 13,
                fontWeight: activeFilter === filter.id ? 600 : 400,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add task form */}
      {showAddTask && (
        <div style={{ padding: '0 20px 16px' }}>
          <GlassCard theme={theme} style={{ padding: 16 }}>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              autoFocus
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                outline: 'none',
                color: theme.text,
                fontSize: 16,
                marginBottom: 16,
              }}
            />

            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <CategoryPicker
                selectedCategoryId={newTask.categoryId}
                onCategoryChange={(id) => setNewTask({ ...newTask, categoryId: id })}
                compact
              />

              {/* Priority selector */}
              <div style={{ display: 'flex', gap: 4 }}>
                {['high', 'medium', 'low'].map(p => (
                  <button
                    key={p}
                    onClick={() => setNewTask({ ...newTask, priority: p })}
                    style={{
                      padding: '6px 10px',
                      background: newTask.priority === p ? `${priorityColors[p]}20` : 'transparent',
                      border: `1px solid ${newTask.priority === p ? priorityColors[p] : theme.border}`,
                      borderRadius: 8,
                      color: priorityColors[p],
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Due date */}
            <div style={{ marginBottom: 16 }}>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                style={{
                  padding: '8px 12px',
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  color: theme.text,
                  fontSize: 14,
                }}
              />
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 16 }}>
              <TagPicker
                selectedTags={newTask.tags}
                onTagsChange={(tags) => setNewTask({ ...newTask, tags })}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleAddTask}
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
                Add Task
              </button>
              <button
                onClick={() => setShowAddTask(false)}
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

      {/* Tasks list */}
      <div style={{ padding: '0 20px' }}>
        {sortedTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>✓</p>
            <p style={{ color: theme.textMuted, fontSize: 16 }}>
              {activeFilter === 'completed' ? 'No completed tasks' : 'All caught up!'}
            </p>
            <p style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8 }}>
              Tap + to add a task
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sortedTasks.map(task => {
              const category = getCategoryById(task.categoryId);
              const project = task.projectId ? getProjectById(task.projectId) : null;

              return (
                <GlassCard
                  key={task.id}
                  theme={theme}
                  style={{
                    padding: 16,
                    opacity: task.isCompleted ? 0.6 : 1,
                    borderLeft: `3px solid ${category?.color || theme.accent}`,
                  }}
                >
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 8,
                        background: task.isCompleted ? theme.accent : 'transparent',
                        border: `2px solid ${task.isCompleted ? theme.accent : theme.border}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {task.isCompleted && Icons.check('white')}
                    </button>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: theme.text,
                        fontSize: 15,
                        fontWeight: 500,
                        margin: 0,
                        textDecoration: task.isCompleted ? 'line-through' : 'none',
                      }}>
                        {task.title}
                      </p>

                      {/* Meta info */}
                      <div style={{
                        display: 'flex',
                        gap: 10,
                        marginTop: 8,
                        flexWrap: 'wrap',
                        alignItems: 'center',
                      }}>
                        {/* Priority */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: priorityColors[task.priority],
                          fontSize: 12,
                        }}>
                          {Icons.flag(priorityColors[task.priority])}
                          {task.priority}
                        </div>

                        {/* Due date */}
                        {task.dueDate && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            color: isOverdue(task.dueDate) && !task.isCompleted ? theme.error : theme.textMuted,
                            fontSize: 12,
                          }}>
                            {Icons.calendar(isOverdue(task.dueDate) && !task.isCompleted ? theme.error : theme.textMuted)}
                            {formatDate(task.dueDate)}
                          </div>
                        )}

                        {/* Project */}
                        {project && (
                          <span style={{
                            background: `${project.color}20`,
                            padding: '2px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            color: project.color,
                          }}>
                            {project.name}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div style={{
                          display: 'flex',
                          gap: 6,
                          marginTop: 8,
                          flexWrap: 'wrap',
                        }}>
                          {task.tags.map(tagId => {
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
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        opacity: 0.5,
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
        onClick={() => setShowAddTask(true)}
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

export default TasksScreen;
