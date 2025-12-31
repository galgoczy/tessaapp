/**
 * Tessa AI Service
 *
 * Handles communication with Google Gemini AI API
 * Uses environment variables for secure API key storage
 */

// API Configuration - uses Vite environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Multi-language system prompts
const systemPrompts = {
  en: `You are Tessa, a friendly and helpful AI personal assistant. You help users manage their day, tasks, emails, and calendar. Be concise, warm, and proactive. Keep responses brief and actionable.`,
  hu: `Te vagy Tessa, egy barátságos és segítőkész AI személyi asszisztens. Segítesz a felhasználóknak a napjuk, feladataik, emailjeik és naptáruk kezelésében. Légy tömör, kedves és proaktív. Tartsd a válaszokat rövidnek és cselekvésre ösztönzőnek.`,
  de: `Du bist Tessa, eine freundliche und hilfreiche KI-Assistentin. Du hilfst Benutzern bei der Verwaltung ihres Tages, ihrer Aufgaben, E-Mails und Kalender. Sei prägnant, warmherzig und proaktiv. Halte die Antworten kurz und umsetzbar.`,
  es: `Eres Tessa, una asistente personal de IA amigable y útil. Ayudas a los usuarios a gestionar su día, tareas, correos y calendario. Sé concisa, cálida y proactiva. Mantén las respuestas breves y prácticas.`,
  fr: `Tu es Tessa, une assistante personnelle IA amicale et serviable. Tu aides les utilisateurs à gérer leur journée, tâches, emails et calendrier. Sois concise, chaleureuse et proactive. Garde les réponses brèves et actionnables.`,
};

/**
 * Sends a message to Gemini AI and returns the response
 * @param {string} message - User's message
 * @param {string} language - Language code (en, hu, de, es, fr)
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} AI response text
 */
export async function sendMessage(message, language = 'en', conversationHistory = []) {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env file.');
    return 'API key not configured. Please check the .env file.';
  }

  const systemPrompt = systemPrompts[language] || systemPrompts.en;

  // Build conversation contents
  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    {
      role: 'model',
      parts: [{ text: language === 'hu'
        ? 'Értettem! Tessa vagyok, és készen állok segíteni. Miben segíthetek ma?'
        : 'Understood! I\'m Tessa, and I\'m ready to help. What can I assist you with today?'
      }]
    },
    // Add conversation history
    ...conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })),
    // Add current message
    {
      role: 'user',
      parts: [{ text: message }]
    }
  ];

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();

    // Extract text from response
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      console.error('Unexpected API response format:', data);
      return 'Sorry, I couldn\'t process that. Please try again.';
    }

    return aiResponse;
  } catch (error) {
    console.error('AI Service Error:', error);
    return `Sorry, something went wrong: ${error.message}`;
  }
}

/**
 * Checks if the AI service is properly configured
 * @returns {boolean} True if API key is set
 */
export function isConfigured() {
  return Boolean(GEMINI_API_KEY);
}

/**
 * Get available languages
 * @returns {Array} List of supported language objects
 */
export function getAvailableLanguages() {
  return [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];
}

export default {
  sendMessage,
  isConfigured,
  getAvailableLanguages,
};
