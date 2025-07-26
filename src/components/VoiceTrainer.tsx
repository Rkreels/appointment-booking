import React from 'react';
import { useLocation } from 'react-router-dom';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { toast } from '@/hooks/use-toast';

interface VoiceCommand {
  action: string;
  element: string;
  description: string;
  alternatives?: string[];
}

const VoiceTrainer: React.FC = () => {
  const location = useLocation();

  // Helper function to get page name from pathname
  const getPageName = (pathname: string) => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/calendar': return 'Calendar';
      case '/events': return 'Event Types';
      case '/bookings': return 'Bookings';
      case '/analytics': return 'Analytics';
      case '/settings': return 'Settings';
      case '/book': return 'Public Booking';
      default: return 'Page';
    }
  };

  // Comprehensive voice commands for all functionalities
  const voiceCommands: VoiceCommand[] = [
    // Navigation
    { action: 'dashboard', element: '[data-action="dashboard"]', description: 'Go to dashboard', alternatives: ['home', 'main'] },
    { action: 'calendar', element: '[data-action="calendar"]', description: 'Open calendar', alternatives: ['schedule', 'appointments'] },
    { action: 'events', element: '[data-action="events"]', description: 'Manage event types', alternatives: ['event types', 'meeting types'] },
    { action: 'bookings', element: '[data-action="bookings"]', description: 'View bookings', alternatives: ['appointments', 'meetings'] },
    { action: 'analytics', element: '[data-action="analytics"]', description: 'Show analytics', alternatives: ['reports', 'statistics', 'data'] },
    { action: 'settings', element: '[data-action="settings"]', description: 'Open settings', alternatives: ['preferences', 'configuration'] },
    
    // Sidebar
    { action: 'toggle sidebar', element: '[data-action="toggle-sidebar"]', description: 'Toggle sidebar visibility', alternatives: ['show sidebar', 'hide sidebar', 'menu'] },
    { action: 'new event', element: '[data-action="new-event"]', description: 'Create new event type', alternatives: ['create event', 'add event'] },
    
    // Header actions
    { action: 'search', element: '[data-action="global-search"]', description: 'Open search', alternatives: ['find', 'look for', 'search for'] },
    { action: 'notifications', element: '[data-action="notifications"]', description: 'View notifications', alternatives: ['alerts', 'messages'] },
    { action: 'user menu', element: '[data-action="user-menu"]', description: 'Open user menu', alternatives: ['profile menu', 'account menu'] },
    
    // Voice training specific
    { action: 'start voice training', element: '', description: 'Start voice recognition training' },
    { action: 'stop voice training', element: '', description: 'Stop voice recognition training' },
    { action: 'voice status', element: '', description: 'Check voice recognition status' },
    { action: 'microphone test', element: '', description: 'Test microphone functionality' },
    { action: 'voice calibration', element: '', description: 'Calibrate voice recognition' },
    { action: 'pronunciation practice', element: '', description: 'Practice command pronunciation' },
    { action: 'accuracy check', element: '', description: 'Check recognition accuracy' },
    
    // Enhanced navigation
    { action: 'quick booking', element: '[data-action="view-public-booking"]', description: 'Open public booking page' },
    { action: 'share link', element: '[data-action="share-booking-link"]', description: 'Share booking link' },
    { action: 'new booking', element: '[data-action="new-booking"]', description: 'Create new booking' },
    
    // Form and UI interactions
    { action: 'save', element: 'button[type="submit"]', description: 'Save current form', alternatives: ['submit', 'confirm'] },
    { action: 'cancel', element: 'button:contains("Cancel")', description: 'Cancel current action', alternatives: ['close', 'dismiss'] },
    { action: 'edit', element: 'button:contains("Edit")', description: 'Edit selected item', alternatives: ['modify', 'change'] },
    { action: 'delete', element: 'button:contains("Delete")', description: 'Delete selected item', alternatives: ['remove', 'trash'] },
    { action: 'duplicate', element: 'button:contains("Copy")', description: 'Duplicate selected item', alternatives: ['copy', 'clone'] },
    
    // System commands
    { action: 'help', element: '', description: 'Show available voice commands', alternatives: ['commands', 'what can I say', 'voice help'] },
    { action: 'scroll up', element: '', description: 'Scroll page up', alternatives: ['page up', 'move up'] },
    { action: 'scroll down', element: '', description: 'Scroll page down', alternatives: ['page down', 'move down'] },
    { action: 'go back', element: '', description: 'Navigate back', alternatives: ['back', 'previous', 'return'] },
    { action: 'refresh', element: '', description: 'Refresh the page', alternatives: ['reload', 'update'] },
    { action: 'focus search', element: 'input[type="search"], input[placeholder*="search" i]', description: 'Focus on search input' },
  ];

  // Enhanced command handler with training features
  const handleVoiceCommand = (action: string) => {
    console.log('Voice command received:', action);

    // Handle special training commands
    switch (action) {
      case 'start voice training':
        if (!isListening) {
          startListening();
          speak('Voice training started. You can now use voice commands.');
          toast({
            title: "Voice Training Started",
            description: "Voice recognition is now active. Try saying 'help' for available commands.",
          });
        }
        break;
      
      case 'stop voice training':
        if (isListening) {
          stopListening();
          speak('Voice training stopped.');
          toast({
            title: "Voice Training Stopped",
            description: "Voice recognition has been deactivated.",
          });
        }
        break;
      
      case 'voice status':
        const status = isListening ? 'active' : 'inactive';
        const support = isSupported ? 'supported' : 'not supported';
        speak(`Voice recognition is ${status} and ${support}`);
        toast({
          title: "Voice Status",
          description: `Voice recognition: ${status}, Browser support: ${support}`,
        });
        break;
      
      case 'microphone test':
        speak('Microphone test: If you can hear this, audio output is working. Please say something to test voice input.');
        toast({
          title: "Microphone Test",
          description: "Audio output tested. Please speak to test voice input.",
        });
        break;
      
      case 'voice calibration':
        speak('Voice calibration started. Please speak clearly and try different command phrases.');
        toast({
          title: "Voice Calibration",
          description: "Speak clearly and try various commands to improve recognition accuracy.",
        });
        break;
      
      case 'pronunciation practice':
        const practiceCommands = [
          'dashboard', 'calendar', 'events', 'bookings', 'analytics', 'settings',
          'new event', 'help', 'save', 'cancel', 'search'
        ];
        const randomCommand = practiceCommands[Math.floor(Math.random() * practiceCommands.length)];
        speak(`Practice saying: ${randomCommand}`);
        toast({
          title: "Pronunciation Practice",
          description: `Try saying: "${randomCommand}"`,
        });
        break;
      
      case 'accuracy check':
        speak(`Last command confidence: ${Math.round(confidence * 100)}%. Recognition accuracy is ${confidence > 0.7 ? 'good' : 'needs improvement'}.`);
        toast({
          title: "Accuracy Check",
          description: `Recognition confidence: ${Math.round(confidence * 100)}%`,
        });
        break;
      
      case 'refresh':
        window.location.reload();
        break;
      
      default:
        // Handle regular commands through the voice recognition hook
        break;
    }
  };

  // Initialize voice recognition with enhanced error handling
  const {
    isListening,
    isSupported,
    hasUserInteracted,
    transcript,
    confidence,
    startListening,
    stopListening,
    toggleListening,
    speak,
    showAvailableCommands,
  } = useVoiceRecognition({
    commands: voiceCommands,
    onCommand: handleVoiceCommand,
    autoStart: true,
  });

  // Page load announcement with enhanced features
  React.useEffect(() => {
    const announcePageLoad = () => {
      const pageName = getPageName(location.pathname);
      speak(`${pageName} page loaded. Voice training is ${isListening ? 'active' : 'ready'}. Say help for commands.`);
    };

    if (hasUserInteracted && isSupported) {
      setTimeout(announcePageLoad, 1000);
    }
  }, [location.pathname, hasUserInteracted, isSupported, isListening, speak]);

  // Voice training status logging
  React.useEffect(() => {
    const status = {
      supported: isSupported,
      listening: isListening,
      userInteracted: hasUserInteracted,
      confidence: confidence,
      currentPage: location.pathname
    };
    
    console.log('Voice Training Status:', status);
  }, [isSupported, isListening, hasUserInteracted, confidence, location.pathname]);

  return null; // This component doesn't render anything visible
};

export default VoiceTrainer;