/**
 * AIService - Gemini API Integration for Tessa
 *
 * Handles communication with Google's Gemini API for intelligent responses.
 */

const GEMINI_API_KEY = 'AIzaSyDdyHkDrtUuFwbPeqTDaGMDcwHHjnDeHx0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Build the system prompt with context about the user's data
 */
const buildSystemPrompt = (context) => {
  const { userName, tasks, notes, events, settings } = context;
  const today = new Date();
  const todayStr = today.toLocaleDateString('hu-HU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const hour = today.getHours();

  // Calculate task statistics
  const activeTasks = tasks.filter(t => !t.isCompleted);
  const todayTasks = activeTasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate).toDateString() === today.toDateString();
  });
  const urgentTasks = activeTasks.filter(t => t.priority === 'high');
  const completedToday = tasks.filter(t => {
    if (!t.completedAt) return false;
    return new Date(t.completedAt).toDateString() === today.toDateString();
  });

  // Build task list for context
  const taskList = activeTasks.slice(0, 10).map(t => {
    const priority = t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢';
    const due = t.dueDate ? ` (határidő: ${new Date(t.dueDate).toLocaleDateString('hu-HU')})` : '';
    return `- ${priority} ${t.title}${due}`;
  }).join('\n');

  // Build notes summary
  const recentNotes = notes.slice(0, 5).map(n => {
    const preview = n.content?.substring(0, 50) || n.title || 'Üres jegyzet';
    return `- ${preview}${n.content?.length > 50 ? '...' : ''}`;
  }).join('\n');

  // Build events for today
  const todayEvents = events.filter(e => {
    const eventDate = new Date(e.date || e.startTime);
    return eventDate.toDateString() === today.toDateString();
  });
  const eventList = todayEvents.map(e => {
    const time = e.startTime ? new Date(e.startTime).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }) : '';
    return `- ${time ? time + ' ' : ''}${e.title}`;
  }).join('\n');

  return `Te vagy Tessa, egy személyes AI asszisztens. Barátságos, segítőkész és hatékony vagy.

FONTOS SZABÁLYOK:
- Mindig magyarul válaszolj, kivéve ha a felhasználó más nyelven ír
- Legyél tömör és lényegre törő (max 2-3 mondat, hacsak nem kérnek részletesebb választ)
- Használj megfelelő érzelmeket és empátiát
- Ha a felhasználó feladatot, jegyzetet vagy eseményt szeretne létrehozni, kérdezz rá a részletekre
- NE találj ki adatokat! Csak azt mondd, amit valóban tudsz

JELENLEGI KONTEXTUS:
- Mai dátum: ${todayStr}
- Napszak: ${hour < 12 ? 'délelőtt' : hour < 18 ? 'délután' : 'este'}
- Felhasználó neve: ${userName || 'Felhasználó'}

FELHASZNÁLÓ ADATAI:
📋 Feladatok (${activeTasks.length} aktív, ${urgentTasks.length} sürgős, ${completedToday.length} ma teljesített):
${taskList || 'Nincsenek aktív feladatok'}

📝 Legutóbbi jegyzetei (${notes.length} összesen):
${recentNotes || 'Nincsenek jegyzetei'}

📅 Mai események:
${eventList || 'Nincsenek mai események'}

KÉPESSÉGEID:
- Feladatok áttekintése, tanácsadás a prioritásokról
- Napi összefoglalók készítése
- Jegyzetekkel kapcsolatos segítség
- Naptár és események áttekintése
- Motiváció és produktivitási tanácsok
- Általános beszélgetés

Ha a felhasználó valamit szeretne LÉTREHOZNI (feladat, jegyzet, esemény), jelezd, hogy ezt az alkalmazásban tudja megtenni, de segíts megfogalmazni a részleteket.`;
};

/**
 * Send a message to Gemini API and get a response
 */
export const sendMessage = async (userMessage, conversationHistory, context) => {
  try {
    const systemPrompt = buildSystemPrompt(context);

    // Build conversation contents for Gemini
    const contents = [];

    // Add conversation history
    conversationHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.message }]
      });
    });

    // Add the new user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();

    // Extract the response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('No response from API');
    }

    return {
      success: true,
      message: responseText,
      type: 'ai_response',
    };
  } catch (error) {
    console.error('AIService error:', error);

    // Fallback response in case of error
    return {
      success: false,
      message: 'Sajnálom, jelenleg nem tudok válaszolni. Kérlek, próbáld újra később!',
      type: 'error',
      error: error.message,
    };
  }
};

/**
 * Generate a greeting based on time of day
 */
export const generateGreeting = (userName) => {
  const hour = new Date().getHours();
  const name = userName || 'itt';

  if (hour < 12) {
    return `Jó reggelt, ${name}! Miben segíthetek ma?`;
  } else if (hour < 18) {
    return `Szép napot, ${name}! Hogyan segíthetek?`;
  } else {
    return `Jó estét, ${name}! Miben lehetek a segítségedre?`;
  }
};

export default {
  sendMessage,
  generateGreeting,
};
