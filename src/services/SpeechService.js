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
    this.onSilenceTimeout = null;
    this.language = 'en';
    this.silenceTimer = null;
    this.silenceTimeout = 3000; // 3 seconds of silence
    this.lastSpeechTime = null;
    this.hasReceivedSpeech = false;
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
    this.recognition.continuous = true; // Keep listening until stopped
    this.recognition.interimResults = true;
    this.language = options.language || 'en';
    this.recognition.lang = LANGUAGE_CODES[this.language] || 'en-US';
    this.silenceTimeout = options.silenceTimeout || 3000;

    this.recognition.onresult = (event) => {
      // Reset silence timer on any result
      this.resetSilenceTimer();
      this.hasReceivedSpeech = true;
      this.lastSpeechTime = Date.now();

      const results = Array.from(event.results);
      // Get only the latest result
      const latestResult = results[results.length - 1];
      const transcript = latestResult[0].transcript;
      const isFinal = latestResult.isFinal;

      if (this.onResult) {
        this.onResult({ transcript, isFinal });
      }

      // If we got a final result, start silence timer for auto-stop
      if (isFinal) {
        this.startSilenceTimer();
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.clearSilenceTimer();
      this.isListening = false;
      this.hasReceivedSpeech = false;
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      this.hasReceivedSpeech = false;
      this.lastSpeechTime = null;
      // Start initial silence timer (stop if no speech detected)
      this.startSilenceTimer();
      if (this.onStart) {
        this.onStart();
      }
    };

    this.recognition.onend = () => {
      this.clearSilenceTimer();
      this.isListening = false;
      this.hasReceivedSpeech = false;
      if (this.onEnd) {
        this.onEnd();
      }
    };

    // Handle speech end event for continuous mode
    this.recognition.onspeechend = () => {
      // Speech ended, start silence timer
      this.startSilenceTimer();
    };

    return true;
  }

  /**
   * Start silence timer
   */
  startSilenceTimer() {
    this.clearSilenceTimer();
    this.silenceTimer = setTimeout(() => {
      if (this.isListening) {
        // Auto-stop after silence
        if (this.onSilenceTimeout) {
          this.onSilenceTimeout();
        }
        this.stop();
      }
    }, this.silenceTimeout);
  }

  /**
   * Reset silence timer (called when speech is detected)
   */
  resetSilenceTimer() {
    this.clearSilenceTimer();
  }

  /**
   * Clear silence timer
   */
  clearSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  /**
   * Start listening
   */
  start() {
    if (!this.recognition) {
      if (!this.init()) return false;
    }

    // If already listening, don't restart
    if (this.isListening) {
      return true;
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
    this.clearSilenceTimer();
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
 * Uses Google Cloud TTS API for high quality, falls back to browser TTS
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
    this.audioElement = null;
    this.useCloudTTS = true; // Try cloud TTS first
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
   * Speak text - tries Google Cloud TTS first, falls back to browser
   */
  speak(text, options = {}) {
    const language = options.language || this.language;

    // Try cloud TTS first for better quality
    if (this.useCloudTTS) {
      this.speakWithCloudTTS(text, language);
      return true;
    }

    // Fallback to browser TTS
    return this.speakWithBrowserTTS(text, options);
  }

  /**
   * Speak using Google Cloud TTS API
   */
  async speakWithCloudTTS(text, language) {
    try {
      console.log('TTS: Trying Google Cloud TTS...');
      if (this.onStart) this.onStart();

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });

      const data = await response.json();

      if (!response.ok || data.fallback) {
        console.log('TTS: Cloud TTS not available, falling back to browser');
        this.speakWithBrowserTTS(text, { language });
        return;
      }

      if (data.audio) {
        await this.playAudioBase64(data.audio, data.format || 'mp3');
      }
    } catch (error) {
      console.error('TTS: Cloud TTS error:', error);
      // Fallback to browser TTS
      this.speakWithBrowserTTS(text, { language });
    }
  }

  /**
   * Play base64 encoded audio
   */
  async playAudioBase64(base64Audio, format = 'mp3') {
    return new Promise((resolve, reject) => {
      // Stop any currently playing audio
      this.stopAudio();

      // Create audio element
      this.audioElement = new Audio();
      this.audioElement.src = `data:audio/${format};base64,${base64Audio}`;

      this.audioElement.onended = () => {
        console.log('TTS: Audio playback ended');
        if (this.onEnd) this.onEnd();
        resolve();
      };

      this.audioElement.onerror = (error) => {
        console.error('TTS: Audio playback error:', error);
        if (this.onError) this.onError(error);
        reject(error);
      };

      this.audioElement.play()
        .then(() => console.log('TTS: Playing Google Cloud audio'))
        .catch(reject);
    });
  }

  /**
   * Stop audio playback
   */
  stopAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;
    }
  }

  /**
   * Speak using browser's built-in TTS (fallback)
   */
  speakWithBrowserTTS(text, options = {}) {
    // Safari fix: always get fresh reference to speechSynthesis
    this.synth = window.speechSynthesis;

    if (!this.synth) {
      console.error('TTS: speechSynthesis not available');
      return false;
    }

    console.log('TTS: Using browser TTS...');

    // Cancel any ongoing speech
    this.stopBrowserTTS();

    // Safari workaround: voices may not be loaded yet
    if (this.voices.length === 0) {
      this.loadVoices();
      console.log('TTS: Loaded voices:', this.voices.length);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = options.voice || this.selectedVoice;
    utterance.lang = LANGUAGE_CODES[options.language || this.language] || 'en-US';
    utterance.rate = options.rate || this.rate;
    utterance.pitch = options.pitch || this.pitch;
    utterance.volume = options.volume || 1.0;

    console.log('TTS: Using voice:', utterance.voice?.name || 'default', 'lang:', utterance.lang);

    utterance.onstart = () => {
      console.log('TTS: Browser speech started');
      if (this.onStart) this.onStart();
    };

    utterance.onend = () => {
      console.log('TTS: Browser speech ended');
      if (this.onEnd) this.onEnd();
    };

    utterance.onerror = (event) => {
      console.error('TTS: Browser speech error:', event.error);
      if (this.onError) this.onError(event.error);
    };

    // Safari workaround: speechSynthesis can get stuck, use resume trick
    if (this.synth.paused) {
      this.synth.resume();
    }

    this.synth.speak(utterance);

    // Safari workaround: keep synthesis active with periodic resume
    const safariResumeInterval = setInterval(() => {
      if (!this.synth.speaking) {
        clearInterval(safariResumeInterval);
      } else if (this.synth.paused) {
        this.synth.resume();
      }
    }, 100);

    // Clear interval after max 30 seconds
    setTimeout(() => clearInterval(safariResumeInterval), 30000);

    return true;
  }

  /**
   * Stop browser TTS
   */
  stopBrowserTTS() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Stop speaking (both cloud audio and browser TTS)
   */
  stop() {
    this.stopAudio();
    this.stopBrowserTTS();
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
    // Check both cloud audio and browser TTS
    const audioPlaying = this.audioElement && !this.audioElement.paused;
    const browserSpeaking = this.synth ? this.synth.speaking : false;
    return audioPlaying || browserSpeaking;
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
    onSilenceTimeout,
    onSpeakStart,
    onSpeakEnd,
    onSpeakError,
  }) {
    this.recognition.onResult = onSpeechResult;
    this.recognition.onError = onSpeechError;
    this.recognition.onStart = onSpeechStart;
    this.recognition.onEnd = onSpeechEnd;
    this.recognition.onSilenceTimeout = onSilenceTimeout;
    this.synthesis.onStart = onSpeakStart;
    this.synthesis.onEnd = onSpeakEnd;
    this.synthesis.onError = onSpeakError;
  }

  /**
   * Check if currently listening
   */
  isCurrentlyListening() {
    return this.recognition.isListening;
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
