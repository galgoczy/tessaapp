/**
 * Tessa App - Data Models
 *
 * Defines the core data structures for the app with cross-references
 * to enable AI-powered inference and suggestions.
 */

/**
 * Generate unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Tag - for cross-referencing across all content types
 * @typedef {Object} Tag
 * @property {string} id
 * @property {string} name - Display name (without #)
 * @property {string} color - Hex color for visual distinction
 * @property {number} usageCount - How many items use this tag
 * @property {Date} createdAt
 */

/**
 * Category - Top level organization (Business, Personal, Groceries, etc.)
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} icon - Emoji or icon name
 * @property {string} color - Theme color for this category
 * @property {boolean} isDefault - System default categories can't be deleted
 * @property {string|null} linkedEmail - Optional separate email for this category
 * @property {string|null} linkedCalendar - Optional separate calendar
 * @property {number} order - Display order
 * @property {Date} createdAt
 */

/**
 * Project - Container for related Tasks and Notes within a Category
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} categoryId - Parent category
 * @property {string} name
 * @property {string} description
 * @property {string} color - Project specific color
 * @property {string} icon - Emoji or icon
 * @property {string[]} tags - Array of tag IDs (max 3 recommended)
 * @property {string} status - 'active' | 'archived' | 'completed'
 * @property {string[]} collaborators - User IDs (Founder tier)
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * Task - Actionable item with optional due date
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} categoryId - Parent category
 * @property {string|null} projectId - Optional parent project
 * @property {string} title
 * @property {string} description
 * @property {string} priority - 'high' | 'medium' | 'low'
 * @property {string[]} tags - Array of tag IDs (max 3 recommended)
 * @property {Date|null} dueDate
 * @property {Date|null} reminderDate
 * @property {boolean} showInCalendar - Whether to display in calendar
 * @property {boolean} isCompleted
 * @property {Date|null} completedAt
 * @property {string|null} assignedTo - Collaborator ID (Founder tier)
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * Note - Information/context for AI to remember
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} categoryId - Parent category
 * @property {string|null} projectId - Optional parent project
 * @property {string} content - Main text content
 * @property {string} type - 'idea' | 'person' | 'gift' | 'important' | 'general'
 * @property {string[]} tags - Array of tag IDs (max 3 recommended)
 * @property {string|null} relatedPerson - Name of related person
 * @property {Date[]} relevantDates - Birthdays, anniversaries, etc.
 * @property {boolean} isArchived
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * Contact - Person with preferences and important dates
 * @typedef {Object} Contact
 * @property {string} id
 * @property {string} name
 * @property {string|null} email
 * @property {string|null} phone
 * @property {string} relationship - 'family' | 'friend' | 'colleague' | 'client' | 'other'
 * @property {string[]} preferences - Things they like
 * @property {string[]} allergies - Food/other allergies
 * @property {{type: string, date: Date}[]} importantDates - birthdays, anniversaries
 * @property {string[]} linkedNotes - Note IDs related to this person
 * @property {Date} createdAt
 */

/**
 * CalendarEvent - Event synced or local
 * @typedef {Object} CalendarEvent
 * @property {string} id
 * @property {string} categoryId - Which category this belongs to
 * @property {string} title
 * @property {Date} startTime
 * @property {Date} endTime
 * @property {string|null} location
 * @property {string} description
 * @property {string} source - 'google' | 'apple' | 'outlook' | 'local' | 'task'
 * @property {string|null} sourceTaskId - If created from a task
 * @property {string} color
 * @property {number[]} reminders - Minutes before event
 */

/**
 * Email - Email item for inbox
 * @typedef {Object} Email
 * @property {string} id
 * @property {string} categoryId - Based on linked email
 * @property {string} from
 * @property {string} fromEmail
 * @property {string} subject
 * @property {string} preview
 * @property {string} body
 * @property {Date} receivedAt
 * @property {boolean} isRead
 * @property {boolean} isStarred
 * @property {boolean} isUrgent
 * @property {string[]} attachments
 */

/**
 * SearchResult - Unified search result type
 * @typedef {Object} SearchResult
 * @property {string} id
 * @property {string} type - 'task' | 'note' | 'project' | 'tag' | 'event' | 'contact' | 'email'
 * @property {string} title
 * @property {string} subtitle
 * @property {string} categoryId
 * @property {string|null} projectId
 * @property {number} relevance - Search relevance score
 */

// Default Categories
export const DEFAULT_CATEGORIES = [
  {
    id: 'cat-business',
    name: 'Business',
    icon: '💼',
    color: '#6366F1',
    isDefault: true,
    linkedEmail: null,
    linkedCalendar: null,
    order: 0,
    createdAt: new Date(),
  },
  {
    id: 'cat-personal',
    name: 'Personal',
    icon: '🏠',
    color: '#10B981',
    isDefault: true,
    linkedEmail: null,
    linkedCalendar: null,
    order: 1,
    createdAt: new Date(),
  },
  {
    id: 'cat-groceries',
    name: 'Groceries',
    icon: '🛒',
    color: '#F59E0B',
    isDefault: true,
    linkedEmail: null,
    linkedCalendar: null,
    order: 2,
    createdAt: new Date(),
  },
];

// Default Tags
export const DEFAULT_TAGS = [
  { id: 'tag-urgent', name: 'urgent', color: '#EF4444', usageCount: 0, createdAt: new Date() },
  { id: 'tag-gift', name: 'gift', color: '#EC4899', usageCount: 0, createdAt: new Date() },
  { id: 'tag-monday', name: 'monday', color: '#8B5CF6', usageCount: 0, createdAt: new Date() },
  { id: 'tag-tuesday', name: 'tuesday', color: '#8B5CF6', usageCount: 0, createdAt: new Date() },
  { id: 'tag-wednesday', name: 'wednesday', color: '#8B5CF6', usageCount: 0, createdAt: new Date() },
  { id: 'tag-thursday', name: 'thursday', color: '#8B5CF6', usageCount: 0, createdAt: new Date() },
  { id: 'tag-friday', name: 'friday', color: '#8B5CF6', usageCount: 0, createdAt: new Date() },
  { id: 'tag-weekend', name: 'weekend', color: '#06B6D4', usageCount: 0, createdAt: new Date() },
  { id: 'tag-family', name: 'family', color: '#F97316', usageCount: 0, createdAt: new Date() },
  { id: 'tag-work', name: 'work', color: '#6366F1', usageCount: 0, createdAt: new Date() },
  { id: 'tag-idea', name: 'idea', color: '#FBBF24', usageCount: 0, createdAt: new Date() },
  { id: 'tag-followup', name: 'followup', color: '#14B8A6', usageCount: 0, createdAt: new Date() },
];

// Note types
export const NOTE_TYPES = [
  { id: 'idea', label: 'Idea', icon: '💡', color: '#FBBF24' },
  { id: 'person', label: 'Person', icon: '👤', color: '#6366F1' },
  { id: 'gift', label: 'Gift', icon: '🎁', color: '#EC4899' },
  { id: 'important', label: 'Important', icon: '⚠️', color: '#EF4444' },
  { id: 'general', label: 'General', icon: '📌', color: '#6B7280' },
];

// Priority levels
export const PRIORITIES = [
  { id: 'high', label: 'High', color: '#EF4444' },
  { id: 'medium', label: 'Medium', color: '#F59E0B' },
  { id: 'low', label: 'Low', color: '#10B981' },
];

// Helper functions for tag parsing
export const parseTagsFromText = (text) => {
  const tagRegex = /#(\w+)/g;
  const matches = text.match(tagRegex);
  return matches ? matches.map(t => t.slice(1).toLowerCase()) : [];
};

export const formatTagForDisplay = (tagName) => `#${tagName}`;

// Helper to generate AI-suggested tags based on content
export const suggestTags = (content, existingTags) => {
  const words = content.toLowerCase();
  const suggestions = [];

  // Day-based suggestions
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'weekend'];
  days.forEach(day => {
    if (words.includes(day)) suggestions.push(day);
  });

  // Context-based suggestions
  if (words.includes('gift') || words.includes('present') || words.includes('birthday')) {
    suggestions.push('gift');
  }
  if (words.includes('urgent') || words.includes('asap') || words.includes('immediately')) {
    suggestions.push('urgent');
  }
  if (words.includes('family') || words.includes('mom') || words.includes('dad') || words.includes('wife') || words.includes('husband')) {
    suggestions.push('family');
  }
  if (words.includes('work') || words.includes('meeting') || words.includes('client') || words.includes('project')) {
    suggestions.push('work');
  }
  if (words.includes('idea') || words.includes('think') || words.includes('maybe')) {
    suggestions.push('idea');
  }
  if (words.includes('follow up') || words.includes('check back') || words.includes('remind')) {
    suggestions.push('followup');
  }

  // Return top 3 unique suggestions
  return [...new Set(suggestions)].slice(0, 3);
};
