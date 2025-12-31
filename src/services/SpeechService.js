/**
 * Tessa Speech Service
 *
 * Handles Speech-to-Text (STT) and Text-to-Speech (TTS)
 * Uses Web Speech API (browser-based, can be swapped for native mobile later)
 */

// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechSynthesis = window.speechSynthesis;

// Service state
let recognition = null;
let isListening = false;
let silenceTimeout = null;
const SILENCE_DURATION = 3000; // 3 seconds of silence = auto-stop

/**
 * Initialize Speech Recognition
 * @param {Object} options - Configuration options
 * @param {string} options.language - BCP 47 language code (e.g., 'en-US', 'hu-HU')
 * @param {function} options.onResult - Callback for final results
 * @param {function} options.onInterimResult - Callback for interim results
 * @param {function} options.onEnd - Callback when recognition ends
 * @param {function} options.onError - Callback for errors
 */
export function initSpeechRecognition({
  language = 'en-US',
  onResult,
  onInterimResult,
  onEnd,
  onError,
}) {
  if (!SpeechRecognition) {
    console.error('Speech Recognition not supported in this browser');
    onError?.({ error: 'not-supported', message: 'Speech recognition not supported' });
    return false;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = language;

  recognition.onresult = (event) => {
    // Reset silence timer on any speech
    resetSilenceTimer();

    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    if (interimTranscript) {
      onInterimResult?.(interimTranscript);
    }

    if (finalTranscript) {
      onResult?.(finalTranscript);
    }
  };

  recognition.onend = () => {
    isListening = false;
    clearSilenceTimer();
    onEnd?.();

    // Safari workaround - auto-restart if we're still supposed to be listening
    // This helps with Safari's tendency to stop recognition unexpectedly
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isListening = false;
    clearSilenceTimer();

    // Handle specific errors
    if (event.error === 'not-allowed') {
      onError?.({ error: event.error, message: 'Microphone access denied. Please allow microphone access.' });
    } else if (event.error === 'no-speech') {
      onError?.({ error: event.error, message: 'No speech detected. Please try again.' });
    } else {
      onError?.({ error: event.error, message: `Speech recognition error: ${event.error}` });
    }
  };

  return true;
}

/**
 * Start listening for speech
 */
export function startListening() {
  if (!recognition) {
    console.error('Speech recognition not initialized');
    return false;
  }

  if (isListening) {
    return true; // Already listening
  }

  try {
    recognition.start();
    isListening = true;
    startSilenceTimer();
    return true;
  } catch (error) {
    console.error('Failed to start speech recognition:', error);
    return false;
  }
}

/**
 * Stop listening for speech
 */
export function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
    clearSilenceTimer();
  }
}

/**
 * Check if currently listening
 */
export function getIsListening() {
  return isListening;
}

/**
 * Set recognition language
 * @param {string} language - BCP 47 language code
 */
export function setLanguage(language) {
  if (recognition) {
    recognition.lang = language;
  }
}

// Silence timer functions
function startSilenceTimer() {
  silenceTimeout = setTimeout(() => {
    console.log('Silence detected, stopping recognition');
    stopListening();
  }, SILENCE_DURATION);
}

function resetSilenceTimer() {
  clearSilenceTimer();
  startSilenceTimer();
}

function clearSilenceTimer() {
  if (silenceTimeout) {
    clearTimeout(silenceTimeout);
    silenceTimeout = null;
  }
}

/**
 * Speak text using TTS
 * @param {string} text - Text to speak
 * @param {string} language - BCP 47 language code
 * @param {Object} options - TTS options
 * @returns {Promise} Resolves when speech ends
 */
export function speak(text, language = 'en-US', options = {}) {
  return new Promise((resolve, reject) => {
    if (!SpeechSynthesis) {
      console.error('Speech Synthesis not supported');
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    SpeechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    // Try to find a voice for the language
    const voices = SpeechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      console.error('TTS Error:', event);
      reject(event);
    };

    // Safari workaround - sometimes needs a small delay
    setTimeout(() => {
      SpeechSynthesis.speak(utterance);
    }, 50);
  });
}

/**
 * Stop any ongoing TTS
 */
export function stopSpeaking() {
  if (SpeechSynthesis) {
    SpeechSynthesis.cancel();
  }
}

/**
 * Check if TTS is currently speaking
 */
export function isSpeaking() {
  return SpeechSynthesis?.speaking || false;
}

/**
 * Get available TTS voices
 */
export function getVoices() {
  return SpeechSynthesis?.getVoices() || [];
}

/**
 * Check browser support
 */
export function checkSupport() {
  return {
    stt: Boolean(SpeechRecognition),
    tts: Boolean(SpeechSynthesis),
  };
}

/**
 * Language code mapping for speech APIs
 */
export const languageCodes = {
  en: 'en-US',
  hu: 'hu-HU',
  de: 'de-DE',
  es: 'es-ES',
  fr: 'fr-FR',
};

export default {
  initSpeechRecognition,
  startListening,
  stopListening,
  getIsListening,
  setLanguage,
  speak,
  stopSpeaking,
  isSpeaking,
  getVoices,
  checkSupport,
  languageCodes,
};
