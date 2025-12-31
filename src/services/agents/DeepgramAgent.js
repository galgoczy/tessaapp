/**
 * DeepgramAgent - Deepgram Voice Agent API Implementation
 *
 * Uses Deepgram's Voice Agent API for real-time voice conversations.
 * Features:
 * - Real-time speech-to-text
 * - LLM-powered responses
 * - Text-to-speech output
 * - Barge-in support (interrupt while speaking)
 *
 * Requires backend proxy for API key security.
 */

import { VoiceAgentBase, VoiceAgentProviders, VoiceAgentFactory } from '../VoiceAgentService';

class DeepgramAgent extends VoiceAgentBase {
  constructor(config = {}) {
    super(config);
    this.ws = null;
    this.audioContext = null;
    this.mediaStream = null;
    this.audioProcessor = null;
    this.isProcessing = false;
    this.apiEndpoint = config.apiEndpoint || '/api/voice-agent';
    this.language = config.language || 'en';
    this.systemPrompt = config.systemPrompt || this.getDefaultSystemPrompt();
  }

  getDefaultSystemPrompt() {
    return `You are Tessa, a friendly and helpful AI personal assistant.
You help users manage their tasks, calendar, notes, and daily activities.
Be concise, warm, and proactive. Keep responses brief for voice conversations.
If asked about capabilities, mention you can help with:
- Task management and reminders
- Calendar and scheduling
- Notes and quick capture
- Daily briefings and summaries`;
  }

  getCapabilities() {
    return {
      streaming: true,
      textInput: true,
      audioInput: true,
      audioOutput: true,
      interruptible: true,
    };
  }

  supportsStreaming() {
    return true;
  }

  /**
   * Connect to Deepgram Voice Agent via backend proxy
   */
  async connect() {
    try {
      console.log('DeepgramAgent: Connecting...');

      // Get WebSocket URL from backend
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'connect',
          language: this.language,
          systemPrompt: this.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get connection: ${response.status}`);
      }

      const data = await response.json();

      if (data.wsUrl) {
        // Direct WebSocket connection (with temporary token)
        await this.connectWebSocket(data.wsUrl);
      } else if (data.sessionId) {
        // Polling mode for environments without WebSocket support
        this.sessionId = data.sessionId;
        this.setConnectionState(true);
        console.log('DeepgramAgent: Connected in polling mode');
      }

      return true;
    } catch (error) {
      console.error('DeepgramAgent: Connection failed:', error);
      if (this.onError) this.onError(error);
      return false;
    }
  }

  /**
   * Connect via WebSocket for real-time streaming
   */
  async connectWebSocket(wsUrl) {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('DeepgramAgent: WebSocket connected');
        this.setConnectionState(true);
        resolve(true);
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error('DeepgramAgent: WebSocket error:', error);
        if (this.onError) this.onError(error);
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('DeepgramAgent: WebSocket closed');
        this.setConnectionState(false);
      };
    });
  }

  /**
   * Handle incoming messages from Deepgram
   */
  handleMessage(data) {
    try {
      // Check if it's binary audio data
      if (data instanceof Blob || data instanceof ArrayBuffer) {
        this.handleAudioOutput(data);
        return;
      }

      // Parse JSON messages
      const message = JSON.parse(data);

      switch (message.type) {
        case 'transcript':
          // User's speech transcribed
          if (this.onTranscript) {
            this.onTranscript({
              text: message.text,
              isFinal: message.is_final,
              confidence: message.confidence,
            });
          }
          break;

        case 'agent_response':
        case 'response':
          // Agent's text response
          if (this.onResponse) {
            this.onResponse({
              text: message.text,
              isFinal: message.is_final,
            });
          }
          break;

        case 'audio':
          // Agent's voice response (base64 encoded)
          if (message.audio) {
            const audioData = this.base64ToArrayBuffer(message.audio);
            this.handleAudioOutput(audioData);
          }
          break;

        case 'state':
          // Agent state change (listening, thinking, speaking)
          if (this.onStateChange) {
            this.onStateChange({
              connected: this.isConnected,
              state: message.state,
            });
          }
          break;

        case 'error':
          if (this.onError) {
            this.onError(new Error(message.message || 'Unknown error'));
          }
          break;

        default:
          console.log('DeepgramAgent: Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('DeepgramAgent: Failed to parse message:', error);
    }
  }

  /**
   * Handle audio output from the agent
   */
  async handleAudioOutput(audioData) {
    if (this.onAudioOutput) {
      this.onAudioOutput(audioData);
    }

    // Play audio if no custom handler
    await this.playAudio(audioData);
  }

  /**
   * Play audio data using Web Audio API
   */
  async playAudio(audioData) {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      // Resume if suspended (browser autoplay policy)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Decode and play
      const arrayBuffer = audioData instanceof ArrayBuffer
        ? audioData
        : await audioData.arrayBuffer();

      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('DeepgramAgent: Failed to play audio:', error);
    }
  }

  /**
   * Start capturing and sending audio
   */
  async startAudioCapture() {
    try {
      console.log('DeepgramAgent: Starting audio capture...');

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 16000,
        });
      }

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Use ScriptProcessorNode for audio processing (deprecated but widely supported)
      // TODO: Migrate to AudioWorklet for better performance
      this.audioProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.audioProcessor.onaudioprocess = (event) => {
        if (!this.isProcessing) return;

        const inputData = event.inputBuffer.getChannelData(0);
        const audioData = this.float32ToInt16(inputData);
        this.sendAudio(audioData.buffer);
      };

      source.connect(this.audioProcessor);
      this.audioProcessor.connect(this.audioContext.destination);

      this.isProcessing = true;
      console.log('DeepgramAgent: Audio capture started');
    } catch (error) {
      console.error('DeepgramAgent: Failed to start audio capture:', error);
      if (this.onError) this.onError(error);
    }
  }

  /**
   * Stop audio capture
   */
  stopAudioCapture() {
    this.isProcessing = false;

    if (this.audioProcessor) {
      this.audioProcessor.disconnect();
      this.audioProcessor = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    console.log('DeepgramAgent: Audio capture stopped');
  }

  /**
   * Send audio data to the agent
   */
  async sendAudio(audioData) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // Send via WebSocket
      this.ws.send(audioData);
    } else if (this.sessionId) {
      // Send via polling endpoint
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: audioData,
      });
    }
  }

  /**
   * Send text message to the agent
   */
  async sendText(text) {
    console.log('DeepgramAgent: Sending text:', text);

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'text', text }));
    } else {
      // Use REST API for text input
      try {
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'message',
            sessionId: this.sessionId,
            text,
            language: this.language,
            systemPrompt: this.systemPrompt,
          }),
        });

        const data = await response.json();

        if (data.response) {
          if (this.onResponse) {
            this.onResponse({ text: data.response, isFinal: true });
          }
        }

        if (data.audio) {
          const audioData = this.base64ToArrayBuffer(data.audio);
          await this.handleAudioOutput(audioData);
        }
      } catch (error) {
        console.error('DeepgramAgent: Failed to send text:', error);
        if (this.onError) this.onError(error);
      }
    }
  }

  /**
   * Disconnect from the agent
   */
  async disconnect() {
    console.log('DeepgramAgent: Disconnecting...');

    this.stopAudioCapture();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    this.sessionId = null;
    this.setConnectionState(false);
    console.log('DeepgramAgent: Disconnected');
  }

  /**
   * Convert Float32Array to Int16Array for audio transmission
   */
  float32ToInt16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Array;
  }

  /**
   * Convert base64 to ArrayBuffer
   */
  base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

// Register with factory
VoiceAgentFactory.registerAgent(VoiceAgentProviders.DEEPGRAM, DeepgramAgent);

export default DeepgramAgent;
