/**
 * BasicAgent - Fallback Voice Agent using Web Speech API + LLM
 *
 * Uses browser's built-in speech recognition and synthesis
 * combined with a text-based LLM (Gemini) for responses.
 *
 * This is the default fallback when:
 * - No premium voice agent is configured
 * - WebSocket connection fails
 * - User prefers browser-based solution
 */

import { VoiceAgentBase, VoiceAgentProviders, VoiceAgentFactory } from '../VoiceAgentService';
import speechService from '../SpeechService';
import aiService from '../AIService';

class BasicAgent extends VoiceAgentBase {
  constructor(config = {}) {
    super(config);
    this.language = config.language || 'en';
    this.isListening = false;
    this.currentTranscript = '';
    this.systemPrompt = config.systemPrompt || null;
  }

  getCapabilities() {
    return {
      streaming: false,
      textInput: true,
      audioInput: speechService.recognition.isAvailable(),
      audioOutput: speechService.synthesis.isAvailable(),
      interruptible: true,
    };
  }

  supportsStreaming() {
    return false;
  }

  /**
   * Initialize the basic agent
   */
  async connect() {
    try {
      console.log('BasicAgent: Connecting...');

      // Initialize speech services
      speechService.init({ language: this.language });

      // Set up speech recognition callbacks
      speechService.setCallbacks({
        onSpeechResult: (result) => {
          this.currentTranscript = result.transcript;
          if (this.onTranscript) {
            this.onTranscript({
              text: result.transcript,
              isFinal: result.isFinal,
            });
          }

          // Process final transcript
          if (result.isFinal && result.transcript.trim()) {
            this.processInput(result.transcript);
          }
        },
        onSpeechError: (error) => {
          console.error('BasicAgent: Speech error:', error);
          if (this.onError) this.onError(error);
        },
        onSpeechStart: () => {
          this.isListening = true;
          if (this.onStateChange) {
            this.onStateChange({ connected: true, state: 'listening' });
          }
        },
        onSpeechEnd: () => {
          this.isListening = false;
          if (this.onStateChange) {
            this.onStateChange({ connected: true, state: 'idle' });
          }
        },
        onSilenceTimeout: () => {
          // Process any pending transcript on silence
          if (this.currentTranscript.trim()) {
            this.processInput(this.currentTranscript);
            this.currentTranscript = '';
          }
        },
        onSpeakStart: () => {
          if (this.onStateChange) {
            this.onStateChange({ connected: true, state: 'speaking' });
          }
        },
        onSpeakEnd: () => {
          if (this.onStateChange) {
            this.onStateChange({ connected: true, state: 'idle' });
          }
        },
      });

      this.setConnectionState(true);
      console.log('BasicAgent: Connected');
      return true;
    } catch (error) {
      console.error('BasicAgent: Connection failed:', error);
      if (this.onError) this.onError(error);
      return false;
    }
  }

  /**
   * Process user input and generate response
   */
  async processInput(text) {
    try {
      if (this.onStateChange) {
        this.onStateChange({ connected: true, state: 'thinking' });
      }

      console.log('BasicAgent: Processing input:', text);

      // Get AI response
      const response = await aiService.chat(text);

      if (response.success) {
        // Send text response
        if (this.onResponse) {
          this.onResponse({
            text: response.message,
            isFinal: true,
          });
        }

        // Speak the response
        await this.speakResponse(response.message);
      } else {
        throw new Error(response.message || 'AI response failed');
      }
    } catch (error) {
      console.error('BasicAgent: Processing error:', error);
      if (this.onError) this.onError(error);

      // Speak error message
      const errorMessage = "I'm sorry, I had trouble processing that. Please try again.";
      if (this.onResponse) {
        this.onResponse({ text: errorMessage, isFinal: true });
      }
      await this.speakResponse(errorMessage);
    }
  }

  /**
   * Speak response using TTS
   */
  async speakResponse(text) {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      if (!synth) {
        console.log('BasicAgent: TTS not available');
        resolve();
        return;
      }

      const originalOnEnd = speechService.synthesis.onEnd;
      speechService.synthesis.onEnd = () => {
        if (originalOnEnd) originalOnEnd();
        resolve();
      };

      speechService.speak(text, { language: this.language });
    });
  }

  /**
   * Start listening for voice input
   */
  async startListening() {
    console.log('BasicAgent: Starting listening...');
    this.currentTranscript = '';
    speechService.startListening();
  }

  /**
   * Stop listening
   */
  stopListening() {
    console.log('BasicAgent: Stopping listening...');
    speechService.stopListening();
  }

  /**
   * Send audio data (not used in basic mode, uses Web Speech API directly)
   */
  async sendAudio(audioData) {
    console.warn('BasicAgent: sendAudio not supported, use startListening() instead');
  }

  /**
   * Send text message
   */
  async sendText(text) {
    console.log('BasicAgent: Sending text:', text);
    await this.processInput(text);
  }

  /**
   * Stop speaking
   */
  stopSpeaking() {
    speechService.stopSpeaking();
  }

  /**
   * Disconnect
   */
  async disconnect() {
    console.log('BasicAgent: Disconnecting...');
    this.stopListening();
    this.stopSpeaking();
    this.setConnectionState(false);
    console.log('BasicAgent: Disconnected');
  }

  /**
   * Set language
   */
  setLanguage(lang) {
    this.language = lang;
    speechService.setLanguage(lang);
  }
}

// Register with factory
VoiceAgentFactory.registerAgent(VoiceAgentProviders.BASIC, BasicAgent);

export default BasicAgent;
