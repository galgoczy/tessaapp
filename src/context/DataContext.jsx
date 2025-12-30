import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  generateId,
  DEFAULT_CATEGORIES,
  DEFAULT_TAGS,
  suggestTags,
  parseTagsFromText,
} from '../data/models';

// Storage keys
const STORAGE_KEYS = {
  CATEGORIES: 'tessa_categories',
  PROJECTS: 'tessa_projects',
  TASKS: 'tessa_tasks',
  NOTES: 'tessa_notes',
  TAGS: 'tessa_tags',
  CONTACTS: 'tessa_contacts',
  EVENTS: 'tessa_events',
};

// Create context
const DataContext = createContext(null);

/**
 * DataProvider - Central state management for all app data
 */
export const DataProvider = ({ children }) => {
  // === STATE ===

  // Categories
  const [categories, setCategories] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
  });

  // Projects
  const [projects, setProjects] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return stored ? JSON.parse(stored) : [];
  });

  // Tasks
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : [];
  });

  // Notes
  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
    return stored ? JSON.parse(stored) : [];
  });

  // Tags
  const [tags, setTags] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TAGS);
    return stored ? JSON.parse(stored) : DEFAULT_TAGS;
  });

  // Contacts
  const [contacts, setContacts] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return stored ? JSON.parse(stored) : [];
  });

  // Calendar Events
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return stored ? JSON.parse(stored) : [];
  });

  // === PERSISTENCE ===

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  // === CATEGORY ACTIONS ===

  const addCategory = useCallback((category) => {
    const newCategory = {
      id: generateId(),
      isDefault: false,
      linkedEmail: null,
      linkedCalendar: null,
      order: categories.length,
      createdAt: new Date().toISOString(),
      ...category,
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, [categories.length]);

  const updateCategory = useCallback((id, updates) => {
    setCategories(prev => prev.map(cat =>
      cat.id === id ? { ...cat, ...updates } : cat
    ));
  }, []);

  const deleteCategory = useCallback((id) => {
    const category = categories.find(c => c.id === id);
    if (category?.isDefault) return false;

    // Move items to Personal category
    const personalId = 'cat-personal';
    setProjects(prev => prev.map(p => p.categoryId === id ? { ...p, categoryId: personalId } : p));
    setTasks(prev => prev.map(t => t.categoryId === id ? { ...t, categoryId: personalId } : t));
    setNotes(prev => prev.map(n => n.categoryId === id ? { ...n, categoryId: personalId } : n));
    setCategories(prev => prev.filter(c => c.id !== id));
    return true;
  }, [categories]);

  // === PROJECT ACTIONS ===

  const addProject = useCallback((project) => {
    const newProject = {
      id: generateId(),
      categoryId: 'cat-personal',
      description: '',
      color: '#6366F1',
      icon: '📁',
      tags: [],
      status: 'active',
      collaborators: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...project,
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const updateProject = useCallback((id, updates) => {
    setProjects(prev => prev.map(proj =>
      proj.id === id ? { ...proj, ...updates, updatedAt: new Date().toISOString() } : proj
    ));
  }, []);

  const deleteProject = useCallback((id) => {
    // Remove project reference from tasks and notes
    setTasks(prev => prev.map(t => t.projectId === id ? { ...t, projectId: null } : t));
    setNotes(prev => prev.map(n => n.projectId === id ? { ...n, projectId: null } : n));
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  // === TASK ACTIONS ===

  const addTask = useCallback((task) => {
    // Auto-suggest tags from title
    const suggestedTags = suggestTags(task.title + ' ' + (task.description || ''), tags);
    const autoTags = suggestedTags
      .map(name => tags.find(t => t.name === name)?.id)
      .filter(Boolean);

    const newTask = {
      id: generateId(),
      categoryId: 'cat-personal',
      projectId: null,
      description: '',
      priority: 'medium',
      tags: [...new Set([...(task.tags || []), ...autoTags])].slice(0, 3),
      dueDate: null,
      reminderDate: null,
      showInCalendar: true,
      isCompleted: false,
      completedAt: null,
      assignedTo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...task,
    };

    // Update tag usage counts
    newTask.tags.forEach(tagId => {
      setTags(prev => prev.map(t =>
        t.id === tagId ? { ...t, usageCount: t.usageCount + 1 } : t
      ));
    });

    // Create calendar event if has due date and showInCalendar
    if (newTask.dueDate && newTask.showInCalendar) {
      addEventFromTask(newTask);
    }

    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, [tags]);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task;

      const updated = {
        ...task,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Handle completion
      if (updates.isCompleted && !task.isCompleted) {
        updated.completedAt = new Date().toISOString();
      } else if (updates.isCompleted === false) {
        updated.completedAt = null;
      }

      return updated;
    }));
  }, []);

  const deleteTask = useCallback((id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      // Decrease tag usage counts
      task.tags.forEach(tagId => {
        setTags(prev => prev.map(t =>
          t.id === tagId ? { ...t, usageCount: Math.max(0, t.usageCount - 1) } : t
        ));
      });
      // Remove related calendar event
      setEvents(prev => prev.filter(e => e.sourceTaskId !== id));
    }
    setTasks(prev => prev.filter(t => t.id !== id));
  }, [tasks]);

  const toggleTask = useCallback((id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { isCompleted: !task.isCompleted });
    }
  }, [tasks, updateTask]);

  // === NOTE ACTIONS ===

  const addNote = useCallback((note) => {
    // Auto-suggest tags from content
    const suggestedTags = suggestTags(note.content, tags);
    const autoTags = suggestedTags
      .map(name => tags.find(t => t.name === name)?.id)
      .filter(Boolean);

    const newNote = {
      id: generateId(),
      categoryId: 'cat-personal',
      projectId: null,
      type: 'general',
      tags: [...new Set([...(note.tags || []), ...autoTags])].slice(0, 3),
      relatedPerson: null,
      relevantDates: [],
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...note,
    };

    // Update tag usage counts
    newNote.tags.forEach(tagId => {
      setTags(prev => prev.map(t =>
        t.id === tagId ? { ...t, usageCount: t.usageCount + 1 } : t
      ));
    });

    setNotes(prev => [...prev, newNote]);
    return newNote;
  }, [tags]);

  const updateNote = useCallback((id, updates) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
    ));
  }, []);

  const deleteNote = useCallback((id) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      note.tags.forEach(tagId => {
        setTags(prev => prev.map(t =>
          t.id === tagId ? { ...t, usageCount: Math.max(0, t.usageCount - 1) } : t
        ));
      });
    }
    setNotes(prev => prev.filter(n => n.id !== id));
  }, [notes]);

  // === TAG ACTIONS ===

  const addTag = useCallback((name, color = '#6B7280') => {
    const existingTag = tags.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (existingTag) return existingTag;

    const newTag = {
      id: generateId(),
      name: name.toLowerCase(),
      color,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    setTags(prev => [...prev, newTag]);
    return newTag;
  }, [tags]);

  const getOrCreateTag = useCallback((name) => {
    const existing = tags.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;
    return addTag(name);
  }, [tags, addTag]);

  // === EVENT ACTIONS ===

  const addEvent = useCallback((event) => {
    const newEvent = {
      id: generateId(),
      categoryId: 'cat-personal',
      location: null,
      description: '',
      source: 'local',
      sourceTaskId: null,
      color: '#6366F1',
      reminders: [15],
      ...event,
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  const addEventFromTask = useCallback((task) => {
    if (!task.dueDate) return null;

    const dueDate = new Date(task.dueDate);
    const startTime = new Date(dueDate);
    startTime.setHours(9, 0, 0, 0); // Default to 9 AM

    const endTime = new Date(startTime);
    endTime.setHours(10, 0, 0, 0); // 1 hour duration

    const category = categories.find(c => c.id === task.categoryId);

    return addEvent({
      categoryId: task.categoryId,
      title: task.title,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      description: task.description,
      source: 'task',
      sourceTaskId: task.id,
      color: category?.color || '#6366F1',
    });
  }, [categories, addEvent]);

  // === CONTACT ACTIONS ===

  const addContact = useCallback((contact) => {
    const newContact = {
      id: generateId(),
      email: null,
      phone: null,
      relationship: 'other',
      preferences: [],
      allergies: [],
      importantDates: [],
      linkedNotes: [],
      createdAt: new Date().toISOString(),
      ...contact,
    };
    setContacts(prev => [...prev, newContact]);
    return newContact;
  }, []);

  const updateContact = useCallback((id, updates) => {
    setContacts(prev => prev.map(c =>
      c.id === id ? { ...c, ...updates } : c
    ));
  }, []);

  // === SEARCH ===

  const search = useCallback((query) => {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase();
    const results = [];

    // Search tasks
    tasks.forEach(task => {
      const titleMatch = task.title.toLowerCase().includes(q);
      const descMatch = task.description?.toLowerCase().includes(q);
      if (titleMatch || descMatch) {
        results.push({
          id: task.id,
          type: 'task',
          title: task.title,
          subtitle: task.isCompleted ? 'Completed' : (task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'),
          categoryId: task.categoryId,
          projectId: task.projectId,
          relevance: titleMatch ? 10 : 5,
          item: task,
        });
      }
    });

    // Search notes
    notes.forEach(note => {
      if (note.content.toLowerCase().includes(q)) {
        results.push({
          id: note.id,
          type: 'note',
          title: note.content.slice(0, 50) + (note.content.length > 50 ? '...' : ''),
          subtitle: note.type.charAt(0).toUpperCase() + note.type.slice(1),
          categoryId: note.categoryId,
          projectId: note.projectId,
          relevance: 7,
          item: note,
        });
      }
    });

    // Search projects
    projects.forEach(project => {
      const nameMatch = project.name.toLowerCase().includes(q);
      const descMatch = project.description?.toLowerCase().includes(q);
      if (nameMatch || descMatch) {
        results.push({
          id: project.id,
          type: 'project',
          title: project.name,
          subtitle: `${getProjectTaskCount(project.id)} tasks`,
          categoryId: project.categoryId,
          projectId: null,
          relevance: nameMatch ? 9 : 4,
          item: project,
        });
      }
    });

    // Search tags
    tags.forEach(tag => {
      if (tag.name.includes(q)) {
        results.push({
          id: tag.id,
          type: 'tag',
          title: `#${tag.name}`,
          subtitle: `${tag.usageCount} items`,
          categoryId: null,
          projectId: null,
          relevance: 6,
          item: tag,
        });
      }
    });

    // Search contacts
    contacts.forEach(contact => {
      if (contact.name.toLowerCase().includes(q)) {
        results.push({
          id: contact.id,
          type: 'contact',
          title: contact.name,
          subtitle: contact.relationship,
          categoryId: null,
          projectId: null,
          relevance: 8,
          item: contact,
        });
      }
    });

    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
  }, [tasks, notes, projects, tags, contacts]);

  // === HELPERS ===

  const getProjectTaskCount = useCallback((projectId) => {
    return tasks.filter(t => t.projectId === projectId).length;
  }, [tasks]);

  const getProjectCompletedCount = useCallback((projectId) => {
    return tasks.filter(t => t.projectId === projectId && t.isCompleted).length;
  }, [tasks]);

  const getCategoryItems = useCallback((categoryId) => {
    return {
      projects: projects.filter(p => p.categoryId === categoryId),
      tasks: tasks.filter(t => t.categoryId === categoryId),
      notes: notes.filter(n => n.categoryId === categoryId),
    };
  }, [projects, tasks, notes]);

  const getTagById = useCallback((tagId) => {
    return tags.find(t => t.id === tagId);
  }, [tags]);

  const getItemsByTag = useCallback((tagId) => {
    return {
      tasks: tasks.filter(t => t.tags.includes(tagId)),
      notes: notes.filter(n => n.tags.includes(tagId)),
      projects: projects.filter(p => p.tags.includes(tagId)),
    };
  }, [tasks, notes, projects]);

  // === CONTEXT VALUE ===

  const value = {
    // State
    categories,
    projects,
    tasks,
    notes,
    tags,
    contacts,
    events,

    // Category actions
    addCategory,
    updateCategory,
    deleteCategory,

    // Project actions
    addProject,
    updateProject,
    deleteProject,

    // Task actions
    addTask,
    updateTask,
    deleteTask,
    toggleTask,

    // Note actions
    addNote,
    updateNote,
    deleteNote,

    // Tag actions
    addTag,
    getOrCreateTag,

    // Event actions
    addEvent,

    // Contact actions
    addContact,
    updateContact,

    // Search
    search,

    // Helpers
    getProjectTaskCount,
    getProjectCompletedCount,
    getCategoryItems,
    getTagById,
    getItemsByTag,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

/**
 * Hook to use data context
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;
