/**
 * Chat API Route
 *
 * Secure backend proxy for Gemini AI chat.
 * Keeps GEMINI_API_KEY server-side (not exposed in browser).
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    const { message, history, context, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(context, language);

    // Build conversation contents
    const contents = buildContents(systemPrompt, history, message);

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
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
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from Gemini');
    }

    return res.status(200).json({
      success: true,
      message: text,
      type: 'response',
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process message',
    });
  }
}

function buildSystemPrompt(context, language = 'en') {
  const userName = context?.userName || 'User';
  const tasks = context?.tasks || [];
  const notes = context?.notes || [];
  const events = context?.events || [];

  const langInstructions = {
    en: 'Respond in English.',
    hu: 'Válaszolj magyarul.',
    de: 'Antworte auf Deutsch.',
    es: 'Responde en español.',
    fr: 'Réponds en français.',
  };

  const activeTasks = tasks.filter(t => !t.isCompleted).slice(0, 5);
  const recentNotes = notes.slice(0, 3);
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).slice(0, 3);

  return `You are Tessa, a friendly and helpful AI personal assistant.
You help ${userName} manage their tasks, calendar, notes, and daily activities.
Be concise, warm, and proactive. ${langInstructions[language] || langInstructions.en}

Current context:
- Active tasks: ${activeTasks.length > 0 ? activeTasks.map(t => t.title).join(', ') : 'None'}
- Recent notes: ${recentNotes.length > 0 ? recentNotes.map(n => n.title).join(', ') : 'None'}
- Upcoming events: ${upcomingEvents.length > 0 ? upcomingEvents.map(e => e.title).join(', ') : 'None'}

Keep responses brief and helpful.`;
}

function buildContents(systemPrompt, history, message) {
  const contents = [];

  // Add system prompt as first user message
  contents.push({
    role: 'user',
    parts: [{ text: systemPrompt }],
  });
  contents.push({
    role: 'model',
    parts: [{ text: 'Understood. I\'m Tessa, ready to help!' }],
  });

  // Add conversation history
  if (history && history.length > 0) {
    for (const msg of history.slice(-10)) { // Keep last 10 messages
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.message }],
      });
    }
  }

  // Add current message
  contents.push({
    role: 'user',
    parts: [{ text: message }],
  });

  return contents;
}
