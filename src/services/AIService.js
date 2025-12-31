/**
 * AIService - Gemini API Integration for Tessa
 *
 * Handles communication with Google's Gemini API for intelligent responses.
 * API calls go through /api/chat for security (API key stays server-side).
 */

// API endpoint (Vercel serverless function)
const CHAT_API_URL = '/api/chat';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  hu: { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français' },
};

// Detect system language
export const getSystemLanguage = () => {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language?.split('-')[0] || 'en';
    return SUPPORTED_LANGUAGES[lang] ? lang : 'en';
  }
  return 'en';
};

// Language-specific strings
const STRINGS = {
  en: {
    dateFormat: 'en-US',
    timeOfDay: { morning: 'morning', afternoon: 'afternoon', evening: 'evening' },
    greeting: {
      morning: (name) => `Good morning${name ? `, ${name}` : ''}! How can I help you today?`,
      afternoon: (name) => `Good afternoon${name ? `, ${name}` : ''}! What can I do for you?`,
      evening: (name) => `Good evening${name ? `, ${name}` : ''}! How can I assist you?`,
    },
    error: "Sorry, I couldn't process that. Please try again!",
    noTasks: 'No active tasks',
    noNotes: 'No notes',
    noEvents: 'No events today',
    emptyNote: 'Empty note',
    due: 'due',
  },
  hu: {
    dateFormat: 'hu-HU',
    timeOfDay: { morning: 'délelőtt', afternoon: 'délután', evening: 'este' },
    greeting: {
      morning: (name) => `Jó reggelt${name ? `, ${name}` : ''}! Miben segíthetek ma?`,
      afternoon: (name) => `Szép napot${name ? `, ${name}` : ''}! Hogyan segíthetek?`,
      evening: (name) => `Jó estét${name ? `, ${name}` : ''}! Miben lehetek a segítségedre?`,
    },
    error: 'Sajnálom, nem sikerült feldolgozni. Kérlek, próbáld újra!',
    noTasks: 'Nincsenek aktív feladatok',
    noNotes: 'Nincsenek jegyzetek',
    noEvents: 'Nincsenek mai események',
    emptyNote: 'Üres jegyzet',
    due: 'határidő',
  },
  de: {
    dateFormat: 'de-DE',
    timeOfDay: { morning: 'Vormittag', afternoon: 'Nachmittag', evening: 'Abend' },
    greeting: {
      morning: (name) => `Guten Morgen${name ? `, ${name}` : ''}! Wie kann ich dir heute helfen?`,
      afternoon: (name) => `Guten Tag${name ? `, ${name}` : ''}! Was kann ich für dich tun?`,
      evening: (name) => `Guten Abend${name ? `, ${name}` : ''}! Wie kann ich dir helfen?`,
    },
    error: 'Entschuldigung, das konnte ich nicht verarbeiten. Bitte versuche es erneut!',
    noTasks: 'Keine aktiven Aufgaben',
    noNotes: 'Keine Notizen',
    noEvents: 'Keine Termine heute',
    emptyNote: 'Leere Notiz',
    due: 'fällig',
  },
  es: {
    dateFormat: 'es-ES',
    timeOfDay: { morning: 'mañana', afternoon: 'tarde', evening: 'noche' },
    greeting: {
      morning: (name) => `¡Buenos días${name ? `, ${name}` : ''}! ¿Cómo puedo ayudarte hoy?`,
      afternoon: (name) => `¡Buenas tardes${name ? `, ${name}` : ''}! ¿Qué puedo hacer por ti?`,
      evening: (name) => `¡Buenas noches${name ? `, ${name}` : ''}! ¿En qué puedo ayudarte?`,
    },
    error: 'Lo siento, no pude procesarlo. ¡Por favor, inténtalo de nuevo!',
    noTasks: 'No hay tareas activas',
    noNotes: 'No hay notas',
    noEvents: 'No hay eventos hoy',
    emptyNote: 'Nota vacía',
    due: 'vence',
  },
  fr: {
    dateFormat: 'fr-FR',
    timeOfDay: { morning: 'matin', afternoon: 'après-midi', evening: 'soir' },
    greeting: {
      morning: (name) => `Bonjour${name ? `, ${name}` : ''} ! Comment puis-je vous aider aujourd'hui ?`,
      afternoon: (name) => `Bon après-midi${name ? `, ${name}` : ''} ! Que puis-je faire pour vous ?`,
      evening: (name) => `Bonsoir${name ? `, ${name}` : ''} ! Comment puis-je vous aider ?`,
    },
    error: "Désolé, je n'ai pas pu traiter cela. Veuillez réessayer !",
    noTasks: 'Aucune tâche active',
    noNotes: 'Aucune note',
    noEvents: "Pas d'événements aujourd'hui",
    emptyNote: 'Note vide',
    due: 'échéance',
  },
};

/**
 * Build the system prompt with context about the user's data
 */
const buildSystemPrompt = (context, language = 'en') => {
  const { userName, tasks, notes, events } = context;
  const strings = STRINGS[language] || STRINGS.en;
  const today = new Date();
  const todayStr = today.toLocaleDateString(strings.dateFormat, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const hour = today.getHours();
  const timeOfDay = hour < 12 ? strings.timeOfDay.morning : hour < 18 ? strings.timeOfDay.afternoon : strings.timeOfDay.evening;

  // Calculate task statistics
  const activeTasks = tasks.filter(t => !t.isCompleted);
  const urgentTasks = activeTasks.filter(t => t.priority === 'high');
  const completedToday = tasks.filter(t => {
    if (!t.completedAt) return false;
    return new Date(t.completedAt).toDateString() === today.toDateString();
  });

  // Build task list for context
  const taskList = activeTasks.slice(0, 10).map(t => {
    const priority = t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢';
    const due = t.dueDate ? ` (${strings.due}: ${new Date(t.dueDate).toLocaleDateString(strings.dateFormat)})` : '';
    return `- ${priority} ${t.title}${due}`;
  }).join('\n');

  // Build notes summary
  const recentNotes = notes.slice(0, 5).map(n => {
    const preview = n.content?.substring(0, 50) || n.title || strings.emptyNote;
    return `- ${preview}${n.content?.length > 50 ? '...' : ''}`;
  }).join('\n');

  // Build events for today
  const todayEvents = events.filter(e => {
    const eventDate = new Date(e.date || e.startTime);
    return eventDate.toDateString() === today.toDateString();
  });
  const eventList = todayEvents.map(e => {
    const time = e.startTime ? new Date(e.startTime).toLocaleTimeString(strings.dateFormat, { hour: '2-digit', minute: '2-digit' }) : '';
    return `- ${time ? time + ' ' : ''}${e.title}`;
  }).join('\n');

  const langName = SUPPORTED_LANGUAGES[language]?.name || 'English';

  return `You are Tessa, a personal AI assistant. You are friendly, helpful, and efficient.

IMPORTANT RULES:
- Always respond in ${langName}
- Be concise and to the point (max 2-3 sentences unless asked for more detail)
- Use appropriate emotions and empathy
- If the user wants to create a task, note, or event, ask for details
- DO NOT make up data! Only say what you actually know

CURRENT CONTEXT:
- Today's date: ${todayStr}
- Time of day: ${timeOfDay}
- User's name: ${userName || 'User'}

USER'S DATA:
📋 Tasks (${activeTasks.length} active, ${urgentTasks.length} urgent, ${completedToday.length} completed today):
${taskList || strings.noTasks}

📝 Recent notes (${notes.length} total):
${recentNotes || strings.noNotes}

📅 Today's events:
${eventList || strings.noEvents}

YOUR CAPABILITIES:
- Review tasks, advise on priorities
- Create daily summaries
- Help with notes
- Review calendar and events
- Motivation and productivity tips
- General conversation

If the user wants to CREATE something (task, note, event), let them know they can do this in the app, but help them formulate the details.`;
};

/**
 * Send a message to the secure chat API
 */
export const sendMessage = async (userMessage, conversationHistory, context) => {
  const language = context.settings?.language || getSystemLanguage();
  const strings = STRINGS[language] || STRINGS.en;

  try {
    console.log('Sending request to chat API...');

    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory,
        context: {
          userName: context.userName,
          tasks: context.tasks,
          notes: context.notes,
          events: context.events,
        },
        language,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('Chat API error:', data);
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return {
      success: true,
      message: data.message,
      type: data.type || 'ai_response',
    };
  } catch (error) {
    console.error('AIService error:', error);

    // Return error with details for debugging
    return {
      success: false,
      message: `${strings.error}\n\n(Debug: ${error.message})`,
      type: 'error',
      error: error.message,
    };
  }
};

/**
 * Generate a greeting based on time of day and language
 */
export const generateGreeting = (userName, language = null) => {
  const lang = language || getSystemLanguage();
  const strings = STRINGS[lang] || STRINGS.en;
  const hour = new Date().getHours();

  if (hour < 12) {
    return strings.greeting.morning(userName);
  } else if (hour < 18) {
    return strings.greeting.afternoon(userName);
  } else {
    return strings.greeting.evening(userName);
  }
};

export default {
  sendMessage,
  generateGreeting,
  getSystemLanguage,
  SUPPORTED_LANGUAGES,
};
