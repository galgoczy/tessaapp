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
};

const PROJECT_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
  '#F59E0B', '#10B981', '#06B6D4', '#3B82F6',
];

/**
 * ProjectsScreen Component
 *
 * Project management with real data from DataContext.
 * Shows tasks and notes within each project.
 */
const ProjectsScreen = ({ onBack }) => {
  const { theme, isFilledStyle } = useTheme();
  const {
    projects,
    tasks,
    notes,
    categories,
    addProject,
    updateProject,
    deleteProject,
    toggleTask,
    getTagById,
    getProjectTaskCount,
    getProjectCompletedCount,
  } = useData();

  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // New project form
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    categoryId: 'cat-personal',
    color: PROJECT_COLORS[0],
    icon: '📁',
    tags: [],
  });

  // Filter projects by category
  const filteredProjects = categoryFilter === 'all'
    ? projects
    : projects.filter(p => p.categoryId === categoryFilter);

  // Get project items
  const getProjectTasks = (projectId) => tasks.filter(t => t.projectId === projectId);
  const getProjectNotes = (projectId) => notes.filter(n => n.projectId === projectId);

  const handleAddProject = () => {
    if (!newProject.name.trim()) return;
    const created = addProject(newProject);
    setNewProject({
      name: '',
      description: '',
      categoryId: 'cat-personal',
      color: PROJECT_COLORS[0],
      icon: '📁',
      tags: [],
    });
    setShowAddProject(false);
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

    return (
      <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
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
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `${project.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}>
              {project.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ color: theme.text, fontSize: 20, fontWeight: 700, margin: 0 }}>
                {project.name}
              </h1>
              <p style={{ color: category?.color, fontSize: 12, margin: '2px 0 0' }}>
                {category?.icon} {category?.name}
              </p>
            </div>
          </div>

          {project.description && (
            <p style={{ color: theme.textMuted, fontSize: 14, margin: '12px 0 0' }}>
              {project.description}
            </p>
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

        {/* Tasks section */}
        <div style={{ padding: '0 20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            {Icons.tasks(theme.accent)}
            <p style={{ color: theme.text, fontSize: 14, fontWeight: 600, margin: 0 }}>
              Tasks ({projectTasks.filter(t => !t.isCompleted).length} active)
            </p>
          </div>

          {projectTasks.length === 0 ? (
            <p style={{ color: theme.textMuted, fontSize: 13 }}>No tasks in this project</p>
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
                    padding: 12,
                    background: theme.surface,
                    borderRadius: 12,
                    cursor: 'pointer',
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
          )}
        </div>

        {/* Notes section */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            {Icons.notes(theme.accent)}
            <p style={{ color: theme.text, fontSize: 14, fontWeight: 600, margin: 0 }}>
              Notes ({projectNotes.length})
            </p>
          </div>

          {projectNotes.length === 0 ? (
            <p style={{ color: theme.textMuted, fontSize: 13 }}>No notes in this project</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {projectNotes.map(note => (
                <div
                  key={note.id}
                  style={{
                    padding: 12,
                    background: theme.surface,
                    borderRadius: 12,
                  }}
                >
                  <p style={{ color: theme.text, fontSize: 13, margin: 0, lineHeight: 1.4 }}>
                    {note.content.slice(0, 100)}{note.content.length > 100 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
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
                      width: 48,
                      height: 48,
                      borderRadius: 12,
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
                          <p style={{ color: category?.color, fontSize: 11, margin: '2px 0 0' }}>
                            {category?.icon} {category?.name}
                          </p>
                        </div>
                        {Icons.chevron(theme.textMuted)}
                      </div>

                      {/* Progress bar */}
                      {taskCount > 0 && (
                        <div style={{
                          height: 4,
                          background: theme.surface,
                          borderRadius: 2,
                          marginTop: 12,
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: project.color,
                            borderRadius: 2,
                          }} />
                        </div>
                      )}

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.textMuted, fontSize: 12 }}>
                          {Icons.tasks(theme.textMuted)}
                          {completedCount}/{taskCount} tasks
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.textMuted, fontSize: 12 }}>
                          {Icons.notes(theme.textMuted)}
                          {noteCount} notes
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
