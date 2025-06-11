import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface VoiceCommand {
  action: string;
  element: string;
  description: string;
  alternatives?: string[];
}

const VoiceTrainer: React.FC = () => {
  const location = useLocation();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Comprehensive voice commands for all functionalities
  const voiceCommands: VoiceCommand[] = [
    // Navigation
    { action: 'dashboard', element: '[data-action="dashboard"]', description: 'Go to dashboard' },
    { action: 'calendar', element: '[data-action="calendar"]', description: 'Open calendar' },
    { action: 'events', element: '[data-action="events"]', description: 'Manage event types' },
    { action: 'bookings', element: '[data-action="bookings"]', description: 'View bookings' },
    { action: 'analytics', element: '[data-action="analytics"]', description: 'Show analytics' },
    { action: 'settings', element: '[data-action="settings"]', description: 'Open settings' },
    
    // Sidebar
    { action: 'toggle sidebar', element: '[data-action="toggle-sidebar"]', description: 'Toggle sidebar visibility' },
    { action: 'new event', element: '[data-action="new-event"]', description: 'Create new event type' },
    
    // Header actions
    { action: 'search', element: '[data-action="global-search"]', description: 'Open search', alternatives: ['find', 'look for'] },
    { action: 'notifications', element: '[data-action="notifications"]', description: 'View notifications' },
    { action: 'user menu', element: '[data-action="user-menu"]', description: 'Open user menu' },
    
    // Dashboard quick actions
    { action: 'create new event', element: '[data-action="create-new-event"]', description: 'Create new event type' },
    { action: 'view public booking', element: '[data-action="view-public-booking"]', description: 'View public booking page' },
    { action: 'share booking link', element: '[data-action="share-booking-link"]', description: 'Share public booking link' },
    
    // Settings tabs
    { action: 'profile settings', element: '[data-action="profile-settings"]', description: 'Open profile settings' },
    { action: 'availability settings', element: '[data-action="availability-settings"]', description: 'Configure availability' },
    { action: 'notification settings', element: '[data-action="notification-settings"]', description: 'Manage notifications' },
    { action: 'integration settings', element: '[data-action="integration-settings"]', description: 'Setup integrations' },
    { action: 'security settings', element: '[data-action="security-settings"]', description: 'Security options' },
    { action: 'appearance settings', element: '[data-action="appearance-settings"]', description: 'Customize appearance' },
    { action: 'access control settings', element: '[data-action="access-control-settings"]', description: 'Manage user access' },
    { action: 'advanced settings', element: '[data-action="advanced-settings"]', description: 'Advanced configuration' },
    
    // Access control commands
    { action: 'add user', element: '[data-action="add-user"]', description: 'Add new user' },
    { action: 'save new user', element: '[data-action="save-new-user"]', description: 'Save new user' },
    { action: 'cancel add user', element: '[data-action="cancel-add-user"]', description: 'Cancel adding user' },
    
    // User menu actions
    { action: 'profile', element: '[data-action="profile"]', description: 'View profile' },
    { action: 'billing', element: '[data-action="billing"]', description: 'Manage billing' },
    { action: 'team', element: '[data-action="team"]', description: 'Team management' },
    { action: 'logout', element: '[data-action="logout"]', description: 'Sign out', alternatives: ['sign out', 'log out'] },
    
    // Form actions
    { action: 'save', element: 'button[type="submit"], button:contains("Save")', description: 'Save changes' },
    { action: 'cancel', element: 'button:contains("Cancel")', description: 'Cancel action' },
    { action: 'delete', element: 'button:contains("Delete")', description: 'Delete item' },
    { action: 'edit', element: 'button:contains("Edit")', description: 'Edit item' },
    
    // General commands
    { action: 'help', element: '', description: 'Show available voice commands', alternatives: ['commands', 'what can I say'] },
    { action: 'scroll up', element: '', description: 'Scroll page up' },
    { action: 'scroll down', element: '', description: 'Scroll page down' },
    { action: 'go back', element: '', description: 'Navigate back', alternatives: ['back', 'previous'] },
  ];

  // Setup user interaction listener
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
        console.log('User interaction detected, voice training will start');
      }
    };

    // Listen for various user interactions
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [hasUserInteracted]);

  useEffect(() => {
    if (!hasUserInteracted) return;

    // Check for speech recognition support
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionClass) {
      console.log('Speech recognition not supported in this browser');
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    const recognitionInstance = new SpeechRecognitionClass() as SpeechRecognition;
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      console.log('Voice recognition started');
      setIsListening(true);
    };

    recognitionInstance.onend = () => {
      console.log('Voice recognition ended');
      setIsListening(false);
      // Restart listening after a brief pause
      setTimeout(() => {
        if (recognitionInstance && isSupported) {
          try {
            recognitionInstance.start();
          } catch (error) {
            console.log('Cannot restart recognition:', error);
          }
        }
      }, 1000);
    };

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log('Voice command received:', command);
      handleVoiceCommand(command);
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log('Speech recognition error:', event.error);
      if (event.error !== 'no-speech' && event.error !== 'audio-capture') {
        setIsListening(false);
        setTimeout(() => {
          if (recognitionInstance && isSupported) {
            try {
              recognitionInstance.start();
            } catch (error) {
              console.log('Cannot restart after error:', error);
            }
          }
        }, 2000);
      }
    };

    setRecognition(recognitionInstance);
    
    // Start recognition
    try {
      recognitionInstance.start();
      console.log('Voice recognition initialized and started');
    } catch (error) {
      console.log('Error starting recognition:', error);
    }

    return () => {
      try {
        if (recognitionInstance) {
          recognitionInstance.stop();
        }
      } catch (error) {
        console.log('Error stopping recognition:', error);
      }
    };
  }, [hasUserInteracted]);

  const handleVoiceCommand = (command: string) => {
    console.log('Processing voice command:', command);

    // Handle special commands
    if (command.includes('help') || command.includes('commands') || command.includes('what can i say')) {
      showAvailableCommands();
      return;
    }

    if (command.includes('scroll up')) {
      window.scrollBy({ top: -300, behavior: 'smooth' });
      speak('Scrolling up');
      return;
    }

    if (command.includes('scroll down')) {
      window.scrollBy({ top: 300, behavior: 'smooth' });
      speak('Scrolling down');
      return;
    }

    if (command.includes('go back') || command.includes('back') || command.includes('previous')) {
      window.history.back();
      speak('Going back');
      return;
    }

    // Find matching command
    const matchedCommand = voiceCommands.find(cmd => {
      const mainMatch = command.includes(cmd.action.toLowerCase());
      const alternativeMatch = cmd.alternatives?.some(alt => command.includes(alt.toLowerCase()));
      return mainMatch || alternativeMatch;
    });

    if (matchedCommand && matchedCommand.element) {
      const element = document.querySelector(matchedCommand.element) as HTMLElement;
      if (element) {
        console.log(`Executing command: ${matchedCommand.action}`);
        
        // Handle different element types
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.focus();
          speak(`Focused on ${matchedCommand.action}`);
        } else if (element.tagName === 'A' || element.tagName === 'BUTTON') {
          element.click();
          speak(`${matchedCommand.description} activated`);
        } else {
          // Try to find a clickable child element
          const clickable = element.querySelector('a, button') as HTMLElement;
          if (clickable) {
            clickable.click();
            speak(`${matchedCommand.description} activated`);
          } else {
            element.click();
            speak(`${matchedCommand.description} activated`);
          }
        }
      } else {
        console.log(`Element not found for command: ${matchedCommand.action}`);
        speak(`Sorry, ${matchedCommand.action} is not available on this page`);
      }
    } else {
      console.log('Command not recognized:', command);
      speak('Command not recognized. Say "help" to see available commands.');
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any existing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const showAvailableCommands = () => {
    const pageSpecificCommands = voiceCommands.filter(cmd => {
      if (!cmd.element) return true;
      return document.querySelector(cmd.element) !== null;
    });

    console.log('Available voice commands:', pageSpecificCommands.map(cmd => cmd.action));
    const commandList = pageSpecificCommands.slice(0, 6).map(cmd => cmd.action).join(', ');
    speak(`Available commands include: ${commandList}, and more. Check the console for a full list.`);
  };

  // Auto-announce page changes and available commands
  useEffect(() => {
    if (!isSupported || !hasUserInteracted) return;

    const timer = setTimeout(() => {
      const pageName = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);
      speak(`${pageName} page loaded. Voice commands are active. Say "help" for available commands.`);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location, isSupported, hasUserInteracted]);

  // Show voice status indicator in console
  useEffect(() => {
    if (isSupported && hasUserInteracted) {
      console.log(`Voice Training Status: ${isListening ? 'Listening...' : 'Ready'}`);
    } else if (!hasUserInteracted) {
      console.log('Voice Training: Waiting for user interaction...');
    } else {
      console.log('Voice Training: Not supported in this browser');
    }
  }, [isListening, isSupported, hasUserInteracted]);

  return null; // This component doesn't render anything visible
};

export default VoiceTrainer;
