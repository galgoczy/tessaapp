import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import HomeScreen from './components/home/HomeScreen';
import SettingsScreen from './components/settings/SettingsScreen';
import NotesScreen from './components/notes/NotesScreen';
import TasksScreen from './components/tasks/TasksScreen';
import CalendarsScreen from './components/calendar/CalendarsScreen';
import MailScreen from './components/mail/MailScreen';
import ProjectsScreen from './components/projects/ProjectsScreen';
import AccountScreen from './components/account/AccountScreen';
import CategoryManager from './components/categories/CategoryManager';
import ContactsScreen from './components/contacts/ContactsScreen';
import TagsScreen from './components/tags/TagsScreen';
import HabitsScreen from './components/habits/HabitsScreen';
import FocusScreen from './components/focus/FocusScreen';
import VoiceOverlay from './components/voice/VoiceOverlay';
import BriefingOverlay from './components/briefing/BriefingOverlay';
import OnboardingFlow from './components/onboarding/OnboardingFlow';

/**
 * Main App Component
 *
 * Manages navigation and global overlays.
 * Wrapped in ThemeProvider for app-wide theming.
 */

const AppContent = () => {
  const { theme } = useTheme();
  const { settings, updateSettings } = useData();

  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('home');

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(!settings?.hasCompletedOnboarding);

  // Overlay states
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);

  // Voice overlay props for initial message and voice mode
  const [voiceInitialMessage, setVoiceInitialMessage] = useState(null);
  const [voiceMode, setVoiceMode] = useState(false);

  // Navigation handler
  const navigate = (screen) => {
    setCurrentScreen(screen);
  };

  // Open voice with optional initial message
  const openVoice = (initialMessage = null, enableVoiceMode = false) => {
    setVoiceInitialMessage(initialMessage);
    setVoiceMode(enableVoiceMode);
    setVoiceOpen(true);
  };

  // Close voice overlay and reset state
  const closeVoice = () => {
    setVoiceOpen(false);
    setVoiceInitialMessage(null);
    setVoiceMode(false);
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'settings':
        return <SettingsScreen onBack={() => navigate('home')} />;
      case 'notes':
        return <NotesScreen onBack={() => navigate('home')} />;
      case 'tasks':
        return <TasksScreen onBack={() => navigate('home')} />;
      case 'calendars':
        return <CalendarsScreen onBack={() => navigate('home')} />;
      case 'mail':
        return <MailScreen onBack={() => navigate('home')} />;
      case 'projects':
        return <ProjectsScreen onBack={() => navigate('home')} />;
      case 'account':
        return <AccountScreen onBack={() => navigate('home')} />;
      case 'categories':
        return <CategoryManager onBack={() => navigate('home')} />;
      case 'contacts':
        return <ContactsScreen onBack={() => navigate('home')} />;
      case 'tags':
        return <TagsScreen onBack={() => navigate('home')} />;
      case 'habits':
        return <HabitsScreen onBack={() => navigate('home')} />;
      case 'focus':
        return <FocusScreen onBack={() => navigate('home')} />;
      default:
        return (
          <HomeScreen
            onOpenVoice={() => openVoice()}
            onOpenBriefing={() => setBriefingOpen(true)}
            onNavigate={navigate}
          />
        );
    }
  };

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      maxWidth: 430,
      margin: '0 auto',
      background: theme.bg,
      minHeight: '100vh',
      transition: 'background 0.4s',
      position: 'relative',
    }}>
      {/* Ambient gradient background */}
      <div style={{
        position: 'fixed',
        top: '-20%',
        right: '-20%',
        width: '70%',
        height: '50%',
        background: `radial-gradient(circle, ${theme.tertiary}15 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        left: '-20%',
        width: '60%',
        height: '40%',
        background: `radial-gradient(circle, ${theme.accent}10 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Current Screen */}
      {renderScreen()}

      {/* Global Overlays */}
      <VoiceOverlay
        isOpen={voiceOpen}
        onClose={closeVoice}
        onNavigate={navigate}
        initialMessage={voiceInitialMessage}
        voiceMode={voiceMode}
      />
      <BriefingOverlay
        isOpen={briefingOpen}
        onClose={() => setBriefingOpen(false)}
        onAskTessa={(message, enableVoice) => {
          setBriefingOpen(false);
          openVoice(message, enableVoice);
        }}
      />

      {/* Global Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer {
          background: linear-gradient(90deg,
            ${theme.textSecondary} 0%,
            ${theme.textSecondary} 35%,
            ${theme.text} 50%,
            ${theme.textSecondary} 65%,
            ${theme.textSecondary} 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s ease-in-out infinite;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
      `}</style>

      {/* Onboarding Flow */}
      {showOnboarding && (
        <OnboardingFlow
          onComplete={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;
