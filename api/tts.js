/**
 * TTS API Route - Google Cloud Text-to-Speech
 *
 * Converts text to natural-sounding speech using Google Cloud TTS.
 * Uses WaveNet voices for best quality.
 *
 * Free tier: 1 million characters/month (standard), 1M WaveNet first year
 */

const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;
const GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

// Voice configuration per language
const VOICES = {
  hu: {
    languageCode: 'hu-HU',
    name: 'hu-HU-Wavenet-A', // Female Hungarian WaveNet
    ssmlGender: 'FEMALE',
  },
  en: {
    languageCode: 'en-US',
    name: 'en-US-Wavenet-F', // Female US English WaveNet
    ssmlGender: 'FEMALE',
  },
  de: {
    languageCode: 'de-DE',
    name: 'de-DE-Wavenet-F', // Female German WaveNet
    ssmlGender: 'FEMALE',
  },
  es: {
    languageCode: 'es-ES',
    name: 'es-ES-Wavenet-C', // Female Spanish WaveNet
    ssmlGender: 'FEMALE',
  },
  fr: {
    languageCode: 'fr-FR',
    name: 'fr-FR-Wavenet-C', // Female French WaveNet
    ssmlGender: 'FEMALE',
  },
};

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

  if (!GOOGLE_TTS_API_KEY) {
    return res.status(500).json({
      error: 'GOOGLE_TTS_API_KEY not configured',
      fallback: true // Signal client to use browser TTS
    });
  }

  try {
    const { text, language = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Limit text length to avoid excessive costs
    const maxLength = 5000;
    const truncatedText = text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;

    // Get voice config for language
    const voice = VOICES[language] || VOICES.en;

    // Call Google Cloud TTS API
    const response = await fetch(`${GOOGLE_TTS_URL}?key=${GOOGLE_TTS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: truncatedText },
        voice: {
          languageCode: voice.languageCode,
          name: voice.name,
          ssmlGender: voice.ssmlGender,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0,
          volumeGainDb: 0,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google TTS error:', errorData);
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.audioContent) {
      throw new Error('No audio content in response');
    }

    // Return base64 audio
    return res.status(200).json({
      success: true,
      audio: data.audioContent, // Base64 encoded MP3
      format: 'mp3',
      voice: voice.name, // Debug: show which voice was used
      provider: 'google-cloud',
    });

  } catch (error) {
    console.error('TTS error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate speech',
      fallback: true, // Signal client to use browser TTS
    });
  }
}
