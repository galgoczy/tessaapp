import React, { useState, useMemo } from 'react';
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
  folder: (color) => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  tasks: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  notes: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  plus: (color) => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M12 4v16M4 12h16" />
    </svg>
  ),
  chevron: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  trash: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  check: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  flag: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  milestone: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v20M2 12h20" />
      <circle cx="12" cy="12" r="3" fill={color} />
    </svg>
  ),
  calendar: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  edit: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
};

const PROJECT_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
  '#F59E0B', '#10B981', '#06B6D4', '#3B82F6',
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: '#10B981' },
  { value: 'on-hold', label: 'On Hold', color: '#F59E0B' },
  { value: 'completed', label: 'Completed', color: '#6366F1' },
  { value: 'archived', label: 'Archived', color: '#6B7280' },
];

/**
 * ProjectsScreen Component
 *
 * Enhanced project management with:
 * - Detailed project view with progress
 * - Milestones/timeline
 * - Task management within projects
 */
const ProjectsScreen = ({ onBack }) => {
  const { theme } = useTheme();
  const {
    projects,
    tasks,
    notes,
    categories,
    addProject,
    updateProject,
    deleteProject,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    toggleTask,
    addTask,
    getTagById,
    getProjectTaskCount,
    getProjectCompletedCount,
  } = useData();

  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('tasks'); // tasks, milestones, notes
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingProject, setEditingProject] = useState(false);

  // New project form
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    categoryId: 'cat-personal',
    color: PROJECT_COLORS[0],
    icon: '📁',
    tags: [],
    dueDate: '',
  });

  // New milestone form
  const [newMilestone, setNewMilestone] = useState({ title: '', dueDate: '' });

  // New task form
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Filter projects by category
  const filteredProjects = categoryFilter === 'all'
    ? projects
    : projects.filter(p => p.categoryId === categoryFilter);

  // Get project items
  const getProjectTasks = (projectId) => tasks.filter(t => t.projectId === projectId);
  const getProjectNotes = (projectId) => notes.filter(n => n.projectId === projectId);

  const handleAddProject = () => {
    if (!newProject.name.trim()) return;
    const created = addProject({
      ...newProject,
      dueDate: newProject.dueDate || null,
    });
    setNewProject({
      name: '',
      description: '',
      categoryId: 'cat-personal',
      color: PROJECT_COLORS[0],
      icon: '📁',
      tags: [],
      dueDate: '',
    });
    setShowAddProject(false);
  };

  const handleAddMilestone = (projectId) => {
    if (!newMilestone.title.trim()) return;
    addMilestone(projectId, {
      title: newMilestone.title,
      dueDate: newMilestone.dueDate || null,
    });
    setNewMilestone({ title: '', dueDate: '' });
    setShowAddMilestone(false);
  };

  const handleAddTaskToProject = (projectId, categoryId) => {
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle,
      projectId,
      categoryId,
    });
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const getCategoryById = (id) => categories.find(c => c.id === id);

  // Stats
  const totalTasks = tasks.filter(t => t.projectId).length;
  const completedTasks = tasks.filter(t => t.projectId && t.isCompleted).length;

  // Project detail view
  if (selectedProject) {
    const project = projects.find(p => p.id === selectedProject);
    if (!project) {
      setSelectedProject(null);
      return null;
    }

    const projectTasks = getProjectTasks(project.id);
    const projectNotes = getProjectNotes(project.id);
    const category = getCategoryById(project.categoryId);
    const milestones = project.milestones || [];

    const taskCount = projectTasks.length;
    const completedCount = projectTasks.filter(t => t.isCompleted).length;
    const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

    const milestonesCompleted = milestones.filter(m => m.isCompleted).length;
    const milestoneProgress = milestones.length > 0
      ? Math.round((milestonesCompleted / milestones.length) * 100)
      : 0;

    const statusOption = STATUS_OPTIONS.find(s => s.value === project.status) || STATUS_OPTIONS[0];

    // Sort milestones by due date
    const sortedMilestones = [...milestones].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
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
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSelectedProject(null)}
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
              background: `${project.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>
              {project.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ color: theme.text, fontSize: 20, fontWeight: 700, margin: 0 }}>
                {project.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{
                  background: `${statusOption.color}20`,
                  color: statusOption.color,
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  {statusOption.label}
                </span>
                <span style={{ color: category?.color, fontSize: 12 }}>
                  {category?.icon} {category?.name}
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditingProject(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: theme.surfaceGlass,
                border: `1px solid ${theme.borderGlass}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {Icons.edit(theme.textMuted)}
            </button>
          </div>

          {project.description && (
            <p style={{ color: theme.textMuted, fontSize: 14, margin: '12px 0 0', lineHeight: 1.5 }}>
              {project.description}
            </p>
          )}

          {/* Progress Section */}
          <div style={{
            marginTop: 16,
            padding: 16,
            background: theme.surface,
            borderRadius: 16,
            border: `1px solid ${theme.border}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: theme.textSecondary, fontSize: 13 }}>Overall Progress</span>
              <span style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>{progress}%</span>
            </div>
            <div style={{
              height: 8,
              background: theme.bg,
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${project.color}, ${project.color}cc)`,
                borderRadius: 4,
                transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <div>
                <p style={{ color: theme.text, fontSize: 18, fontWeight: 700, margin: 0 }}>
                  {completedCount}/{taskCount}
                </p>
                <p style={{ color: theme.textMuted, fontSize: 11, margin: 0 }}>Tasks</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: theme.text, fontSize: 18, fontWeight: 700, margin: 0 }}>
                  {milestonesCompleted}/{milestones.length}
                </p>
                <p style={{ color: theme.textMuted, fontSize: 11, margin: 0 }}>Milestones</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: theme.text, fontSize: 18, fontWeight: 700, margin: 0 }}>
                  {projectNotes.length}
                </p>
                <p style={{ color: theme.textMuted, fontSize: 11, margin: 0 }}>Notes</p>
              </div>
            </div>
          </div>

          {/* Due date if set */}
          {project.dueDate && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 12,
              color: theme.textMuted,
              fontSize: 13,
            }}>
              {Icons.calendar(theme.textMuted)}
              <span>Due: {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          )}

          {/* Tags */}
          {project.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {project.tags.map(tagId => {
                const tag = getTagById(tagId);
                if (!tag) return null;
                return (
                  <span key={tag.id} style={{
                    background: `${tag.color}15`,
                    color: tag.color,
                    padding: '4px 10px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 500,
                  }}>
                    #{tag.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{
            display: 'flex',
            gap: 8,
            background: theme.surface,
            borderRadius: 12,
            padding: 4,
          }}>
            {[
              { id: 'tasks', label: 'Tasks', count: taskCount },
              { id: 'milestones', label: 'Milestones', count: milestones.length },
              { id: 'notes', label: 'Notes', count: projectNotes.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: activeTab === tab.id ? theme.accent : 'transparent',
                  border: 'none',
                  borderRadius: 10,
                  color: activeTab === tab.id ? 'white' : theme.textMuted,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '0 20px' }}>
          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <>
              {/* Add task button */}
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  marginBottom: 12,
                  background: theme.surfaceGlass,
                  border: `1px dashed ${theme.border}`,
                  borderRadius: 12,
                  color: theme.textMuted,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>+</span> Add task to project
              </button>

              {showAddTask && (
                <GlassCard theme={theme} style={{ padding: 12, marginBottom: 12 }}>
                  <input
                    type="text"
                    placeholder="Task title..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTaskToProject(project.id, project.categoryId)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: theme.text,
                      fontSize: 15,
                      marginBottom: 10,
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleAddTaskToProject(project.id, project.categoryId)}
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
                      Add Task
                    </button>
                    <button
                      onClick={() => { setShowAddTask(false); setNewTaskTitle(''); }}
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
              )}

              {projectTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>📋</p>
                  <p style={{ color: theme.textMuted, fontSize: 14 }}>No tasks yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {projectTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: 14,
                        background: theme.surface,
                        borderRadius: 12,
                        cursor: 'pointer',
                        opacity: task.isCompleted ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: 7,
                        background: task.isCompleted ? theme.accent : 'transparent',
                        border: `2px solid ${task.isCompleted ? theme.accent : theme.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s',
                      }}>
                        {task.isCompleted && Icons.check('white')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{
                          color: theme.text,
                          fontSize: 14,
                          textDecoration: task.isCompleted ? 'line-through' : 'none',
                        }}>
                          {task.title}
                        </span>
                        {task.dueDate && (
                          <p style={{
                            color: theme.textMuted,
                            fontSize: 11,
                            margin: '4px 0 0',
                          }}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {task.priority === 'high' && (
                        <span style={{
                          background: '#EF444420',
                          color: '#EF4444',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 600,
                        }}>
                          HIGH
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <>
              {/* Add milestone button */}
              <button
                onClick={() => setShowAddMilestone(!showAddMilestone)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  marginBottom: 12,
                  background: theme.surfaceGlass,
                  border: `1px dashed ${theme.border}`,
                  borderRadius: 12,
                  color: theme.textMuted,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>+</span> Add milestone
              </button>

              {showAddMilestone && (
                <GlassCard theme={theme} style={{ padding: 12, marginBottom: 12 }}>
                  <input
                    type="text"
                    placeholder="Milestone title..."
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    autoFocus
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: theme.text,
                      fontSize: 15,
                      marginBottom: 10,
                    }}
                  />
                  <input
                    type="date"
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 10,
                      background: theme.surface,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                      color: theme.text,
                      fontSize: 14,
                      marginBottom: 10,
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleAddMilestone(project.id)}
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
                      Add Milestone
                    </button>
                    <button
                      onClick={() => { setShowAddMilestone(false); setNewMilestone({ title: '', dueDate: '' }); }}
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
              )}

              {milestones.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>🎯</p>
                  <p style={{ color: theme.textMuted, fontSize: 14 }}>No milestones yet</p>
                  <p style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
                    Add milestones to track key project phases
                  </p>
                </div>
              ) : (
                <div style={{ position: 'relative', paddingLeft: 20 }}>
                  {/* Timeline line */}
                  <div style={{
                    position: 'absolute',
                    left: 7,
                    top: 12,
                    bottom: 12,
                    width: 2,
                    background: theme.border,
                  }} />

                  {sortedMilestones.map((milestone, idx) => (
                    <div
                      key={milestone.id}
                      style={{
                        position: 'relative',
                        marginBottom: idx === sortedMilestones.length - 1 ? 0 : 16,
                      }}
                    >
                      {/* Timeline dot */}
                      <div
                        onClick={() => updateMilestone(project.id, milestone.id, { isCompleted: !milestone.isCompleted })}
                        style={{
                          position: 'absolute',
                          left: -20,
                          top: 14,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: milestone.isCompleted ? project.color : theme.bg,
                          border: `2px solid ${milestone.isCompleted ? project.color : theme.border}`,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}
                      >
                        {milestone.isCompleted && (
                          <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </div>

                      <div style={{
                        padding: 14,
                        background: milestone.isCompleted ? `${project.color}10` : theme.surface,
                        borderRadius: 12,
                        border: `1px solid ${milestone.isCompleted ? `${project.color}30` : theme.border}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{
                              color: milestone.isCompleted ? project.color : theme.text,
                              fontSize: 14,
                              fontWeight: 600,
                              margin: 0,
                              textDecoration: milestone.isCompleted ? 'line-through' : 'none',
                            }}>
                              {milestone.title}
                            </p>
                            {milestone.dueDate && (
                              <p style={{ color: theme.textMuted, fontSize: 12, margin: '4px 0 0' }}>
                                {new Date(milestone.dueDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => deleteMilestone(project.id, milestone.id)}
                            style={{
                              padding: 6,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              opacity: 0.5,
                            }}
                          >
                            {Icons.trash(theme.textMuted)}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <>
              {projectNotes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>📝</p>
                  <p style={{ color: theme.textMuted, fontSize: 14 }}>No notes in this project</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {projectNotes.map(note => (
                    <div
                      key={note.id}
                      style={{
                        padding: 14,
                        background: theme.surface,
                        borderRadius: 12,
                      }}
                    >
                      <p style={{ color: theme.text, fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                        {note.content.slice(0, 150)}{note.content.length > 150 ? '...' : ''}
                      </p>
                      <p style={{ color: theme.textMuted, fontSize: 11, margin: '8px 0 0' }}>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Edit Project Modal */}
        {editingProject && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: theme.overlayBg,
            backdropFilter: 'blur(16px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}>
            <GlassCard theme={theme} style={{ width: '100%', maxWidth: 400, padding: 20 }}>
              <h3 style={{ color: theme.text, fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                Edit Project
              </h3>

              <input
                type="text"
                placeholder="Project name"
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                style={{
                  width: '100%',
                  padding: 12,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.text,
                  fontSize: 15,
                  marginBottom: 12,
                  outline: 'none',
                }}
              />

              <textarea
                placeholder="Description"
                value={project.description || ''}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: 12,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.text,
                  fontSize: 14,
                  marginBottom: 12,
                  resize: 'none',
                  outline: 'none',
                }}
              />

              {/* Status */}
              <div style={{ marginBottom: 12 }}>
                <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>Status</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {STATUS_OPTIONS.map(status => (
                    <button
                      key={status.value}
                      onClick={() => updateProject(project.id, { status: status.value })}
                      style={{
                        padding: '8px 14px',
                        background: project.status === status.value ? `${status.color}20` : theme.surface,
                        border: `1px solid ${project.status === status.value ? status.color : theme.border}`,
                        borderRadius: 8,
                        color: project.status === status.value ? status.color : theme.textMuted,
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>Color</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {PROJECT_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => updateProject(project.id, { color })}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: color,
                        border: project.color === color ? '3px solid white' : 'none',
                        boxShadow: project.color === color ? `0 0 0 2px ${color}` : 'none',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Due date */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>Due Date</p>
                <input
                  type="date"
                  value={project.dueDate || ''}
                  onChange={(e) => updateProject(project.id, { dueDate: e.target.value || null })}
                  style={{
                    width: '100%',
                    padding: 12,
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 10,
                    color: theme.text,
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setEditingProject(false)}
                  style={{
                    flex: 1,
                    padding: 12,
                    background: theme.accent,
                    border: 'none',
                    borderRadius: 10,
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this project?')) {
                      deleteProject(project.id);
                      setSelectedProject(null);
                    }
                  }}
                  style={{
                    padding: '12px 16px',
                    background: '#EF444420',
                    border: 'none',
                    borderRadius: 10,
                    color: '#EF4444',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    );
  }

  // Projects list view
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
              Projects
            </h1>
            <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>
              {projects.length} projects
            </p>
          </div>
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
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
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stats overview */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Active', value: projects.filter(p => p.status === 'active').length, color: theme.accent },
            { label: 'Tasks', value: totalTasks, color: '#4ECDC4' },
            { label: 'Done', value: completedTasks, color: '#10B981' },
          ].map(stat => (
            <GlassCard key={stat.label} theme={theme} style={{ padding: 14, textAlign: 'center' }}>
              <p style={{ color: stat.color, fontSize: 24, fontWeight: 700, margin: 0 }}>
                {stat.value}
              </p>
              <p style={{ color: theme.textMuted, fontSize: 12, margin: '4px 0 0' }}>
                {stat.label}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Add project form */}
      {showAddProject && (
        <div style={{ padding: '0 20px 16px' }}>
          <GlassCard theme={theme} style={{ padding: 16 }}>
            <input
              type="text"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              autoFocus
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                outline: 'none',
                color: theme.text,
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 12,
              }}
            />

            <textarea
              placeholder="Description (optional)"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={2}
              style={{
                width: '100%',
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 10,
                padding: 10,
                color: theme.text,
                fontSize: 14,
                resize: 'none',
                marginBottom: 12,
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <CategoryPicker
                selectedCategoryId={newProject.categoryId}
                onCategoryChange={(id) => setNewProject({ ...newProject, categoryId: id })}
                compact
              />

              {/* Color picker */}
              <div style={{ display: 'flex', gap: 4 }}>
                {PROJECT_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewProject({ ...newProject, color })}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: color,
                      border: newProject.color === color ? '3px solid white' : 'none',
                      boxShadow: newProject.color === color ? `0 0 0 2px ${color}` : 'none',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Due date */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>Due Date (optional)</p>
              <input
                type="date"
                value={newProject.dueDate}
                onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: 10,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.text,
                  fontSize: 14,
                }}
              />
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 16 }}>
              <TagPicker
                selectedTags={newProject.tags}
                onTagsChange={(tags) => setNewProject({ ...newProject, tags })}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleAddProject}
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
                Create Project
              </button>
              <button
                onClick={() => setShowAddProject(false)}
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

      {/* Projects list */}
      <div style={{ padding: '0 20px' }}>
        {filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📁</p>
            <p style={{ color: theme.textMuted, fontSize: 16 }}>No projects yet</p>
            <p style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8 }}>
              Tap + to create your first project
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredProjects.map(project => {
              const taskCount = getProjectTaskCount(project.id);
              const completedCount = getProjectCompletedCount(project.id);
              const noteCount = getProjectNotes(project.id).length;
              const category = getCategoryById(project.categoryId);
              const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;
              const milestones = project.milestones || [];
              const milestonesCompleted = milestones.filter(m => m.isCompleted).length;
              const statusOption = STATUS_OPTIONS.find(s => s.value === project.status) || STATUS_OPTIONS[0];

              return (
                <GlassCard
                  key={project.id}
                  theme={theme}
                  onClick={() => setSelectedProject(project.id)}
                  style={{
                    padding: 16,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', gap: 14 }}>
                    {/* Icon */}
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: `${project.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {Icons.folder(project.color)}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ color: theme.text, fontSize: 16, fontWeight: 600, margin: 0 }}>
                            {project.name}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <span style={{
                              background: `${statusOption.color}20`,
                              color: statusOption.color,
                              padding: '2px 6px',
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              {statusOption.label}
                            </span>
                            <span style={{ color: category?.color, fontSize: 11 }}>
                              {category?.icon} {category?.name}
                            </span>
                          </div>
                        </div>
                        {Icons.chevron(theme.textMuted)}
                      </div>

                      {/* Progress bar */}
                      {taskCount > 0 && (
                        <div style={{
                          height: 6,
                          background: theme.surface,
                          borderRadius: 3,
                          marginTop: 12,
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, ${project.color}, ${project.color}aa)`,
                            borderRadius: 3,
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                      )}

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.textMuted, fontSize: 12 }}>
                          {Icons.tasks(theme.textMuted)}
                          {completedCount}/{taskCount} tasks
                        </div>
                        {milestones.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.textMuted, fontSize: 12 }}>
                            {Icons.flag(theme.textMuted)}
                            {milestonesCompleted}/{milestones.length}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.textMuted, fontSize: 12 }}>
                          {Icons.notes(theme.textMuted)}
                          {noteCount}
                        </div>
                      </div>

                      {/* Tags */}
                      {project.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                          {project.tags.slice(0, 3).map(tagId => {
                            const tag = getTagById(tagId);
                            if (!tag) return null;
                            return (
                              <span key={tag.id} style={{
                                background: `${tag.color}15`,
                                color: tag.color,
                                padding: '2px 8px',
                                borderRadius: 6,
                                fontSize: 11,
                              }}>
                                #{tag.name}
                              </span>
                            );
                          })}
                        </div>
                      )}
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
        onClick={() => setShowAddProject(true)}
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

export default ProjectsScreen;
