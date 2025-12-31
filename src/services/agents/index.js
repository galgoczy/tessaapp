/**
 * Voice Agents Index
 *
 * Exports all available voice agent implementations.
 * Import this file to register all agents with the factory.
 */

// Import agents to register them with the factory
import './DeepgramAgent';
import './BasicAgent';

// Re-export from VoiceAgentService
export {
  VoiceAgentBase,
  VoiceAgentProviders,
  VoiceAgentFactory,
} from '../VoiceAgentService';
