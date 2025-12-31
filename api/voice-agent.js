/**
 * Voice Agent API Route
 *
 * Secure backend proxy for voice agent services.
 * Keeps API keys server-side for security.
 *
 * Supports:
 * - Deepgram Voice Agent API
 * - Future: OpenAI Realtime, Gemini Live, etc.
 */

// Deepgram API configuration
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const DEEPGRAM_API_URL = 'https://api.deepgram.com/v1';

/**
 * Main handler for Vercel serverless function
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, text, language, systemPrompt, sessionId } = req.body;

    switch (action) {
      case 'connect':
        return handleConnect(req, res, { language, systemPrompt });

      case 'message':
        return handleMessage(req, res, { text, language, systemPrompt, sessionId });

      case 'transcribe':
        return handleTranscribe(req, res);

      case 'speak':
        return handleSpeak(req, res, { text, language });

      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (error) {
    console.error('Voice agent error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

/**
 * Handle connection request
 * Returns session info for the voice agent
 */
async function handleConnect(req, res, { language, systemPrompt }) {
  if (!DEEPGRAM_API_KEY) {
    return res.status(500).json({ error: 'Deepgram API key not configured' });
  }

  // For Deepgram Voice Agent, we create a session ID
  // The actual WebSocket connection happens client-side with a temporary token
  const sessionId = generateSessionId();

  // Store session config (in production, use Redis or similar)
  // For now, we'll pass config in each request
  return res.status(200).json({
    success: true,
    sessionId,
    // Note: For full WebSocket support, you'd generate a temporary token
    // Deepgram's Voice Agent API requires direct WebSocket connection
    // For Vercel (no WebSocket), we use REST API mode
    mode: 'rest',
    language,
  });
}

/**
 * Handle text message to voice agent
 * Uses Deepgram's conversational AI endpoint
 */
async function handleMessage(req, res, { text, language, systemPrompt }) {
  if (!DEEPGRAM_API_KEY) {
    return res.status(500).json({ error: 'Deepgram API key not configured' });
  }

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Use Deepgram's text-to-speech for response
    // Note: For full conversational AI, you'd use their Agent API
    // This is a simplified version using STT + TTS

    // For now, return a simple response
    // In production, integrate with your preferred LLM
    const response = await generateResponse(text, systemPrompt, language);

    // Generate speech from response
    const audioBase64 = await textToSpeech(response, language);

    return res.status(200).json({
      success: true,
      response,
      audio: audioBase64,
    });
  } catch (error) {
    console.error('Message handling error:', error);
    return res.status(500).json({
      error: 'Failed to process message',
      message: error.message,
    });
  }
}

/**
 * Handle audio transcription
 */
async function handleTranscribe(req, res) {
  if (!DEEPGRAM_API_KEY) {
    return res.status(500).json({ error: 'Deepgram API key not configured' });
  }

  try {
    // Get audio data from request body
    const audioData = req.body;

    const response = await fetch(`${DEEPGRAM_API_URL}/listen?model=nova-2&smart_format=true`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'audio/raw',
      },
      body: audioData,
    });

    if (!response.ok) {
      throw new Error(`Deepgram API error: ${response.status}`);
    }

    const data = await response.json();
    const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';

    return res.status(200).json({
      success: true,
      transcript,
      confidence: data.results?.channels?.[0]?.alternatives?.[0]?.confidence,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({
      error: 'Failed to transcribe audio',
      message: error.message,
    });
  }
}

/**
 * Handle text-to-speech request
 */
async function handleSpeak(req, res, { text, language }) {
  if (!DEEPGRAM_API_KEY) {
    return res.status(500).json({ error: 'Deepgram API key not configured' });
  }

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const audioBase64 = await textToSpeech(text, language);

    return res.status(200).json({
      success: true,
      audio: audioBase64,
    });
  } catch (error) {
    console.error('TTS error:', error);
    return res.status(500).json({
      error: 'Failed to generate speech',
      message: error.message,
    });
  }
}

/**
 * Generate response using Gemini (or fallback)
 * This integrates with existing AIService logic
 */
async function generateResponse(text, systemPrompt, language) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    // Fallback response if no LLM configured
    return "I'm sorry, I'm having trouble connecting right now. Please try again.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt || 'You are Tessa, a helpful AI assistant.'}\n\nUser: ${text}\n\nRespond briefly and naturally for a voice conversation.`,
            }],
          }],
          generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
  } catch (error) {
    console.error('LLM error:', error);
    return "I'm having trouble thinking right now. Please try again.";
  }
}

/**
 * Convert text to speech using Deepgram
 */
async function textToSpeech(text, language = 'en') {
  // Select voice based on language
  const voices = {
    en: 'aura-asteria-en', // Female English voice
    hu: 'aura-asteria-en', // Fallback to English (Deepgram has limited language support)
    de: 'aura-asteria-en',
    es: 'aura-asteria-en',
    fr: 'aura-asteria-en',
  };

  const voice = voices[language] || 'aura-asteria-en';

  const response = await fetch(`${DEEPGRAM_API_URL}/speak?model=${voice}`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${DEEPGRAM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`Deepgram TTS error: ${response.status}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(audioBuffer).toString('base64');

  return base64;
}

/**
 * Generate a unique session ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
