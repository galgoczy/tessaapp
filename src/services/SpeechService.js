/**
 * SpeechService - Voice Recognition and Text-to-Speech
 *
 * Abstraction layer for speech services.
 * Currently uses Web Speech API for browser testing.
 * Can be swapped for native mobile APIs (iOS/Android) later.
 *
 * Modes:
 * - basic: Simple STT + TTS (all users)
 * - live: Real-time streaming with Gemini Live API (Pro users)
 */

// Language codes for speech recognition/synthesis
const LANGUAGE_CODES = {
  en: 'en-US',
  hu: 'hu-HU',
  de: 'de-DE',
  es: 'es-ES',
  fr: 'fr-FR',
};

// Check browser support
const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

const getSpeechSynthesis = () => {
  if (typeof window === 'undefined') return null;
  return window.speechSynthesis || null;
};

/**
 * Speech Recognition (Speech-to-Text)
 */
class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;
    this.language = 'en';
  }

  /**
   * Check if speech recognition is available
   */
  isAvailable() {
    return getSpeechRecognition() !== null;
  }

  /**
   * Initialize speech recognition
   */
  init(options = {}) {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      console.warn('Speech recognition not available');
      return false;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = options.continuous || false;
    this.recognition.interimResults = options.interimResults || true;
    this.language = options.language || 'en';
    this.recognition.lang = LANGUAGE_CODES[this.language] || 'en-US';

    this.recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const transcript = results
        .map(result => result[0].transcript)
        .join('');
      const isFinal = results.some(result => result.isFinal);

      if (this.onResult) {
        this.onResult({ transcript, isFinal });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStart) {
        this.onStart();
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEnd) {
        this.onEnd();
      }
    };

    return true;
  }

  /**
   * Start listening
   */
  start() {
    if (!this.recognition) {
      if (!this.init()) return false;
    }

    try {
      this.recognition.lang = LANGUAGE_CODES[this.language] || 'en-US';
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }

  /**
   * Stop listening
   */
  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Set language
   */
  setLanguage(lang) {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = LANGUAGE_CODES[lang] || 'en-US';
    }
  }
}

/**
 * Speech Synthesis (Text-to-Speech)
 */
class SpeechSynthesisService {
  constructor() {
    this.synth = null;
    this.voices = [];
    this.selectedVoice = null;
    this.language = 'en';
    this.rate = 1.0;
    this.pitch = 1.0;
    this.onStart = null;
    this.onEnd = null;
    this.onError = null;
  }

  /**
   * Check if speech synthesis is available
   */
  isAvailable() {
    return getSpeechSynthesis() !== null;
  }

  /**
   * Initialize speech synthesis
   */
  init(options = {}) {
    this.synth = getSpeechSynthesis();
    if (!this.synth) {
      console.warn('Speech synthesis not available');
      return false;
    }

    this.language = options.language || 'en';
    this.rate = options.rate || 1.0;
    this.pitch = options.pitch || 1.0;

    // Load voices
    this.loadVoices();

    // Chrome loads voices asynchronously
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }

    return true;
  }

  /**
   * Load available voices
   */
  loadVoices() {
    if (!this.synth) return;

    this.voices = this.synth.getVoices();

    // Try to select a voice for the current language
    this.selectVoiceForLanguage(this.language);
  }

  /**
   * Get voices for a language
   */
  getVoicesForLanguage(lang) {
    const langCode = LANGUAGE_CODES[lang] || 'en-US';
    const langPrefix = langCode.split('-')[0];

    return this.voices.filter(voice =>
      voice.lang.startsWith(langPrefix) || voice.lang.startsWith(langCode)
    );
  }

  /**
   * Select best voice for language
   */
  selectVoiceForLanguage(lang) {
    const voices = this.getVoicesForLanguage(lang);

    if (voices.length > 0) {
      // Prefer female voices for Tessa (usually contain "female" or common female names)
      const femaleVoice = voices.find(v =>
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('victoria') ||
        v.name.toLowerCase().includes('karen') ||
        v.name.toLowerCase().includes('moira') ||
        v.name.toLowerCase().includes('tessa')
      );

      this.selectedVoice = femaleVoice || voices[0];
    } else {
      this.selectedVoice = this.voices[0] || null;
    }
  }

  /**
   * Speak text
   */
  speak(text, options = {}) {
    if (!this.synth) {
      if (!this.init()) return false;
    }

    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = options.voice || this.selectedVoice;
    utterance.lang = LANGUAGE_CODES[options.language || this.language] || 'en-US';
    utterance.rate = options.rate || this.rate;
    utterance.pitch = options.pitch || this.pitch;
    utterance.volume = options.volume || 1.0;

    utterance.onstart = () => {
      if (this.onStart) this.onStart();
    };

    utterance.onend = () => {
      if (this.onEnd) this.onEnd();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      if (this.onError) this.onError(event.error);
    };

    this.synth.speak(utterance);
    return true;
  }

  /**
   * Stop speaking
   */
  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Pause speaking
   */
  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  /**
   * Resume speaking
   */
  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking() {
    return this.synth ? this.synth.speaking : false;
  }

  /**
   * Set language
   */
  setLanguage(lang) {
    this.language = lang;
    this.selectVoiceForLanguage(lang);
  }

  /**
   * Get all available voices
   */
  getAllVoices() {
    return this.voices;
  }
}

/**
 * Combined Speech Service
 */
class SpeechService {
  constructor() {
    this.recognition = new SpeechRecognitionService();
    this.synthesis = new SpeechSynthesisService();
    this.mode = 'basic'; // 'basic' or 'live'
    this.isInitialized = false;
  }

  /**
   * Initialize both services
   */
  init(options = {}) {
    const language = options.language || 'en';

    this.recognition.init({
      language,
      continuous: options.continuous || false,
      interimResults: true,
    });

    this.synthesis.init({
      language,
      rate: options.rate || 1.0,
      pitch: options.pitch || 1.0,
    });

    this.isInitialized = true;
    return true;
  }

  /**
   * Set language for both services
   */
  setLanguage(lang) {
    this.recognition.setLanguage(lang);
    this.synthesis.setLanguage(lang);
  }

  /**
   * Check availability
   */
  getCapabilities() {
    return {
      speechToText: this.recognition.isAvailable(),
      textToSpeech: this.synthesis.isAvailable(),
      liveMode: false, // TODO: Implement Gemini Live API check
    };
  }

  /**
   * Start listening (STT)
   */
  startListening() {
    return this.recognition.start();
  }

  /**
   * Stop listening
   */
  stopListening() {
    this.recognition.stop();
  }

  /**
   * Speak text (TTS)
   */
  speak(text, options = {}) {
    return this.synthesis.speak(text, options);
  }

  /**
   * Stop speaking
   */
  stopSpeaking() {
    this.synthesis.stop();
  }

  /**
   * Set callbacks
   */
  setCallbacks({
    onSpeechResult,
    onSpeechError,
    onSpeechStart,
    onSpeechEnd,
    onSpeakStart,
    onSpeakEnd,
    onSpeakError,
  }) {
    this.recognition.onResult = onSpeechResult;
    this.recognition.onError = onSpeechError;
    this.recognition.onStart = onSpeechStart;
    this.recognition.onEnd = onSpeechEnd;
    this.synthesis.onStart = onSpeakStart;
    this.synthesis.onEnd = onSpeakEnd;
    this.synthesis.onError = onSpeakError;
  }
}

// Export singleton instance
const speechService = new SpeechService();

export {
  speechService,
  SpeechService,
  SpeechRecognitionService,
  SpeechSynthesisService,
  LANGUAGE_CODES,
};

export default speechService;
