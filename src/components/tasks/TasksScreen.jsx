import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';

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
};

/**
 * TasksScreen Component
 *
 * Task management screen with:
 * - Todo list with checkboxes
 * - Priority indicators (high/medium/low)
 * - Due dates
 * - Filter by status
 * - Quick add task
 */
const TasksScreen = ({ onBack }) => {
  const { theme, isFilledStyle } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Review project proposal',
      priority: 'high',
      dueDate: new Date('2024-01-20'),
      projectId: 'work',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Call dentist for appointment',
      priority: 'medium',
      dueDate: new Date('2024-01-18'),
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Buy groceries',
      priority: 'low',
      dueDate: null,
      isCompleted: true,
    },
    {
      id: '4',
      title: 'Prepare presentation slides',
      priority: 'high',
      dueDate: new Date('2024-01-19'),
      projectId: 'work',
      isCompleted: false,
    },
    {
      id: '5',
      title: 'Send birthday card to Mom',
      priority: 'medium',
      dueDate: new Date('2024-01-17'),
      isCompleted: false,
    },
  ]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Done' },
    { id: 'high', label: 'High Priority' },
  ];

  const priorityColors = {
    high: '#FF6B6B',
    medium: '#FFB84D',
    low: '#4ECDC4',
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'active') return !task.isCompleted;
    if (activeFilter === 'completed') return task.isCompleted;
    if (activeFilter === 'high') return task.priority === 'high' && !task.isCompleted;
    return true;
  });

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: 'medium',
      dueDate: null,
      isCompleted: false,
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const formatDate = (date) => {
    if (!date) return null;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (date) => {
    if (!date) return false;
    return date < new Date() && date.toDateString() !== new Date().toDateString();
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
          <div style={{ flex: 1 }}>
            <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
              Tasks
            </h1>
            <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>
              {tasks.filter(t => !t.isCompleted).length} active
            </p>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
        }}>
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              style={{
                background: activeFilter === filter.id
                  ? (isFilledStyle ? theme.accent : 'transparent')
                  : theme.surfaceGlass,
                backdropFilter: 'blur(10px)',
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
                transition: 'all 0.2s',
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick add input */}
      {showAddTask && (
        <div style={{ padding: '0 20px 16px' }}>
          <GlassCard theme={theme} style={{ padding: 16 }}>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              autoFocus
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                outline: 'none',
                color: theme.text,
                fontSize: 16,
                marginBottom: 12,
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={addTask}
                style={{
                  flex: 1,
                  padding: '10px 16px',
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
                onClick={() => { setShowAddTask(false); setNewTaskTitle(''); }}
                style={{
                  padding: '10px 16px',
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
        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>✓</p>
            <p style={{ color: theme.textMuted, fontSize: 16 }}>
              {activeFilter === 'completed' ? 'No completed tasks' : 'All caught up!'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredTasks.map(task => (
              <GlassCard
                key={task.id}
                theme={theme}
                style={{
                  padding: 16,
                  opacity: task.isCompleted ? 0.6 : 1,
                  transition: 'all 0.2s',
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
                      transition: 'all 0.2s',
                    }}
                  >
                    {task.isCompleted && Icons.check('white')}
                  </button>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <p style={{
                      color: theme.text,
                      fontSize: 15,
                      fontWeight: 500,
                      margin: 0,
                      textDecoration: task.isCompleted ? 'line-through' : 'none',
                    }}>
                      {task.title}
                    </p>

                    <div style={{
                      display: 'flex',
                      gap: 12,
                      marginTop: 8,
                      flexWrap: 'wrap',
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
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </div>

                      {/* Due date */}
                      {task.dueDate && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: isOverdue(task.dueDate) ? theme.error : theme.textMuted,
                          fontSize: 12,
                        }}>
                          {Icons.calendar(isOverdue(task.dueDate) ? theme.error : theme.textMuted)}
                          {formatDate(task.dueDate)}
                        </div>
                      )}

                      {/* Project */}
                      {task.projectId && (
                        <span style={{
                          background: theme.surface,
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontSize: 11,
                          color: theme.textSecondary,
                        }}>
                          {task.projectId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
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
