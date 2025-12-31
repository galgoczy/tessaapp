/**
 * useVoiceAgent Hook
 *
 * React hook for managing voice agent connections and interactions.
 * Provides a simple interface to swap between different voice providers.
 *
 * Usage:
 *   const { connect, disconnect, sendText, startListening, stopListening, state } = useVoiceAgent({
 *     provider: 'deepgram', // or 'basic'
 *     language: 'en',
 *   });
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceAgentFactory, VoiceAgentProviders } from '../services/VoiceAgentService';
// Import agents to register them
import '../services/agents';

export function useVoiceAgent(options = {}) {
  const {
    provider = VoiceAgentProviders.BASIC,
    language = 'en',
    systemPrompt = null,
    autoConnect = false,
    onTranscript = null,
    onResponse = null,
    onError = null,
  } = options;

  const agentRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [error, setError] = useState(null);
  const [agentState, setAgentState] = useState('idle'); // idle, listening, thinking, speaking

  // Create and configure agent
  useEffect(() => {
    const agent = VoiceAgentFactory.createAgent(provider, {
      language,
      systemPrompt,
    });

    agent.setCallbacks({
      onTranscript: (data) => {
        if (data.isFinal) {
          setTranscript(data.text);
          setInterimTranscript('');
          if (onTranscript) onTranscript(data.text, true);
        } else {
          setInterimTranscript(data.text);
          if (onTranscript) onTranscript(data.text, false);
        }
      },
      onResponse: (data) => {
        setLastResponse(data.text);
        if (onResponse) onResponse(data.text, data.isFinal);
      },
      onError: (err) => {
        setError(err);
        if (onError) onError(err);
      },
      onStateChange: (state) => {
        setIsConnected(state.connected);
        if (state.state) {
          setAgentState(state.state);
          setIsListening(state.state === 'listening');
          setIsSpeaking(state.state === 'speaking');
          setIsProcessing(state.state === 'thinking');
        }
      },
    });

    agentRef.current = agent;

    // Auto-connect if enabled
    if (autoConnect) {
      agent.connect();
    }

    // Cleanup on unmount
    return () => {
      if (agentRef.current) {
        agentRef.current.disconnect();
      }
    };
  }, [provider, language, systemPrompt, autoConnect]);

  // Connect to agent
  const connect = useCallback(async () => {
    if (agentRef.current && !isConnected) {
      setError(null);
      return await agentRef.current.connect();
    }
    return false;
  }, [isConnected]);

  // Disconnect from agent
  const disconnect = useCallback(async () => {
    if (agentRef.current && isConnected) {
      await agentRef.current.disconnect();
    }
  }, [isConnected]);

  // Send text message
  const sendText = useCallback(async (text) => {
    if (agentRef.current && isConnected) {
      setIsProcessing(true);
      setError(null);
      try {
        await agentRef.current.sendText(text);
      } finally {
        setIsProcessing(false);
      }
    } else if (agentRef.current) {
      // Auto-connect and send
      await agentRef.current.connect();
      setIsProcessing(true);
      try {
        await agentRef.current.sendText(text);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [isConnected]);

  // Start listening (for BasicAgent)
  const startListening = useCallback(async () => {
    if (agentRef.current) {
      if (!isConnected) {
        await agentRef.current.connect();
      }
      if (agentRef.current.startListening) {
        await agentRef.current.startListening();
      }
    }
  }, [isConnected]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (agentRef.current && agentRef.current.stopListening) {
      agentRef.current.stopListening();
    }
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (agentRef.current && agentRef.current.stopSpeaking) {
      agentRef.current.stopSpeaking();
    }
  }, []);

  // Get capabilities
  const getCapabilities = useCallback(() => {
    if (agentRef.current) {
      return agentRef.current.getCapabilities();
    }
    return {
      streaming: false,
      textInput: false,
      audioInput: false,
      audioOutput: false,
      interruptible: false,
    };
  }, []);

  // Change provider
  const setProvider = useCallback(async (newProvider) => {
    if (agentRef.current) {
      await agentRef.current.disconnect();
    }

    const agent = VoiceAgentFactory.createAgent(newProvider, {
      language,
      systemPrompt,
    });

    agent.setCallbacks({
      onTranscript: (data) => {
        if (data.isFinal) {
          setTranscript(data.text);
          setInterimTranscript('');
        } else {
          setInterimTranscript(data.text);
        }
      },
      onResponse: (data) => {
        setLastResponse(data.text);
      },
      onError: (err) => {
        setError(err);
      },
      onStateChange: (state) => {
        setIsConnected(state.connected);
        if (state.state) {
          setAgentState(state.state);
          setIsListening(state.state === 'listening');
          setIsSpeaking(state.state === 'speaking');
          setIsProcessing(state.state === 'thinking');
        }
      },
    });

    agentRef.current = agent;
    await agent.connect();
  }, [language, systemPrompt]);

  return {
    // State
    isConnected,
    isListening,
    isSpeaking,
    isProcessing,
    transcript,
    interimTranscript,
    lastResponse,
    error,
    agentState,

    // Actions
    connect,
    disconnect,
    sendText,
    startListening,
    stopListening,
    stopSpeaking,
    setProvider,

    // Info
    getCapabilities,
    provider,
  };
}

export default useVoiceAgent;
