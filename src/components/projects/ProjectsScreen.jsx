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
  clock: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
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
};

/**
 * ProjectsScreen Component
 *
 * Project management with:
 * - Project folders/cards
 * - Task count per project
 * - Recent activity
 * - Quick access to related items
 */
const ProjectsScreen = ({ onBack }) => {
  const { theme, isFilledStyle } = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: '1',
      name: 'Website Redesign',
      color: '#6366F1',
      taskCount: 12,
      completedCount: 5,
      lastActivity: '2 hours ago',
      description: 'Complete overhaul of the company website with new design system',
      members: ['John', 'Sarah', 'Mike'],
    },
    {
      id: '2',
      name: 'Mobile App',
      color: '#10B981',
      taskCount: 8,
      completedCount: 3,
      lastActivity: 'Yesterday',
      description: 'Native iOS and Android app development',
      members: ['Anna', 'Peter'],
    },
    {
      id: '3',
      name: 'Marketing Q1',
      color: '#F59E0B',
      taskCount: 15,
      completedCount: 10,
      lastActivity: '3 days ago',
      description: 'Q1 marketing campaign and content calendar',
      members: ['Lisa', 'Tom'],
    },
    {
      id: '4',
      name: 'Product Launch',
      color: '#EF4444',
      taskCount: 20,
      completedCount: 2,
      lastActivity: 'Just now',
      description: 'New product launch preparation and coordination',
      members: ['Sarah', 'John', 'Anna', 'Mike'],
    },
    {
      id: '5',
      name: 'Personal',
      color: '#8B5CF6',
      taskCount: 5,
      completedCount: 1,
      lastActivity: '1 week ago',
      description: 'Personal projects and goals',
      members: [],
    },
  ];

  const getProgressPercent = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
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
          <div style={{ flex: 1 }}>
            <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
              Projects
            </h1>
            <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>
              {projects.length} projects
            </p>
          </div>
        </div>
      </div>

      {/* Stats overview */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Active', value: projects.length, color: theme.accent },
            { label: 'Tasks', value: projects.reduce((acc, p) => acc + p.taskCount, 0), color: '#4ECDC4' },
            { label: 'Done', value: projects.reduce((acc, p) => acc + p.completedCount, 0), color: '#10B981' },
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

      {/* Projects list */}
      <div style={{ padding: '0 20px' }}>
        <p style={{
          color: theme.textSecondary,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          All Projects
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {projects.map(project => (
            <GlassCard
              key={project.id}
              theme={theme}
              onClick={() => setSelectedProject(project)}
              style={{
                padding: 16,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', gap: 14 }}>
                {/* Folder icon */}
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
                    <p style={{
                      color: theme.text,
                      fontSize: 16,
                      fontWeight: 600,
                      margin: 0,
                    }}>
                      {project.name}
                    </p>
                    {Icons.chevron(theme.textMuted)}
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: 4,
                    background: theme.surface,
                    borderRadius: 2,
                    marginTop: 10,
                    marginBottom: 10,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${getProgressPercent(project.completedCount, project.taskCount)}%`,
                      background: project.color,
                      borderRadius: 2,
                      transition: 'width 0.3s',
                    }} />
                  </div>

                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: theme.textMuted,
                      fontSize: 12,
                    }}>
                      {Icons.tasks(theme.textMuted)}
                      {project.completedCount}/{project.taskCount} tasks
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: theme.textMuted,
                      fontSize: 12,
                    }}>
                      {Icons.clock(theme.textMuted)}
                      {project.lastActivity}
                    </div>
                  </div>

                  {/* Members */}
                  {project.members.length > 0 && (
                    <div style={{
                      display: 'flex',
                      marginTop: 10,
                    }}>
                      {project.members.slice(0, 3).map((member, i) => (
                        <div
                          key={member}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: `hsl(${i * 60}, 60%, 60%)`,
                            border: `2px solid ${theme.bg}`,
                            marginLeft: i > 0 ? -8 : 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {member[0]}
                        </div>
                      ))}
                      {project.members.length > 3 && (
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: theme.surface,
                          border: `2px solid ${theme.bg}`,
                          marginLeft: -8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.textMuted,
                          fontSize: 10,
                          fontWeight: 600,
                        }}>
                          +{project.members.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Floating add button */}
      <button
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
