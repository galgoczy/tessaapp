/**
 * VoiceAgentService - Abstract Voice Agent Interface
 *
 * Provides a swappable abstraction for voice AI providers.
 * Currently supports: Deepgram Voice Agent API
 * Future: OpenAI Realtime, Gemini Live, ElevenLabs, etc.
 */

/**
 * Base Voice Agent Interface
 * All voice agent implementations must extend this class
 */
class VoiceAgentBase {
  constructor(config = {}) {
    this.config = config;
    this.isConnected = false;
    this.onTranscript = null;
    this.onResponse = null;
    this.onAudioOutput = null;
    this.onError = null;
    this.onStateChange = null;
  }

  /**
   * Connect to the voice agent service
   * @returns {Promise<boolean>}
   */
  async connect() {
    throw new Error('connect() must be implemented by subclass');
  }

  /**
   * Disconnect from the voice agent service
   */
  async disconnect() {
    throw new Error('disconnect() must be implemented by subclass');
  }

  /**
   * Send audio data to the agent
   * @param {ArrayBuffer|Blob} audioData - Audio data to send
   */
  async sendAudio(audioData) {
    throw new Error('sendAudio() must be implemented by subclass');
  }

  /**
   * Send text message to the agent (for text-based fallback)
   * @param {string} text - Text message
   */
  async sendText(text) {
    throw new Error('sendText() must be implemented by subclass');
  }

  /**
   * Check if the agent supports real-time streaming
   * @returns {boolean}
   */
  supportsStreaming() {
    return false;
  }

  /**
   * Get the agent's capabilities
   * @returns {Object}
   */
  getCapabilities() {
    return {
      streaming: false,
      textInput: false,
      audioInput: false,
      audioOutput: false,
      interruptible: false,
    };
  }

  /**
   * Set callbacks for events
   */
  setCallbacks({ onTranscript, onResponse, onAudioOutput, onError, onStateChange }) {
    if (onTranscript) this.onTranscript = onTranscript;
    if (onResponse) this.onResponse = onResponse;
    if (onAudioOutput) this.onAudioOutput = onAudioOutput;
    if (onError) this.onError = onError;
    if (onStateChange) this.onStateChange = onStateChange;
  }

  /**
   * Update connection state and notify listeners
   */
  setConnectionState(connected) {
    this.isConnected = connected;
    if (this.onStateChange) {
      this.onStateChange({ connected });
    }
  }
}

/**
 * Voice Agent Provider Types
 */
const VoiceAgentProviders = {
  DEEPGRAM: 'deepgram',
  OPENAI_REALTIME: 'openai-realtime',
  GEMINI_LIVE: 'gemini-live',
  ELEVENLABS: 'elevenlabs',
  BASIC: 'basic', // Fallback: Web Speech API + text LLM
};

/**
 * Voice Agent Factory
 * Creates the appropriate agent based on provider type
 */
class VoiceAgentFactory {
  static agents = new Map();

  /**
   * Register an agent implementation
   */
  static registerAgent(provider, AgentClass) {
    this.agents.set(provider, AgentClass);
  }

  /**
   * Create an agent instance
   * @param {string} provider - Provider type from VoiceAgentProviders
   * @param {Object} config - Provider-specific configuration
   * @returns {VoiceAgentBase}
   */
  static createAgent(provider, config = {}) {
    const AgentClass = this.agents.get(provider);
    if (!AgentClass) {
      console.warn(`Unknown voice agent provider: ${provider}, falling back to basic`);
      const BasicAgent = this.agents.get(VoiceAgentProviders.BASIC);
      if (BasicAgent) {
        return new BasicAgent(config);
      }
      throw new Error(`No agent implementation found for provider: ${provider}`);
    }
    return new AgentClass(config);
  }

  /**
   * Get list of available providers
   */
  static getAvailableProviders() {
    return Array.from(this.agents.keys());
  }
}

export {
  VoiceAgentBase,
  VoiceAgentProviders,
  VoiceAgentFactory,
};
