
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface VoiceInstruction {
  trigger: string;
  action: string;
  description: string;
  element?: string;
}

export const VoiceTrainer: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [currentInstruction, setCurrentInstruction] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const location = useLocation();

  const voiceInstructions: VoiceInstruction[] = [
    // Navigation commands
    { trigger: 'go to dashboard', action: 'dashboard', description: 'Navigate to dashboard', element: '[data-action="dashboard"]' },
    { trigger: 'go to calendar', action: 'calendar', description: 'Navigate to calendar', element: '[data-action="calendar"]' },
    { trigger: 'go to events', action: 'events', description: 'Navigate to event types', element: '[data-action="events"]' },
    { trigger: 'go to bookings', action: 'bookings', description: 'Navigate to bookings', element: '[data-action="bookings"]' },
    { trigger: 'go to analytics', action: 'analytics', description: 'Navigate to analytics', element: '[data-action="analytics"]' },
    { trigger: 'go to settings', action: 'settings', description: 'Navigate to settings', element: '[data-action="settings"]' },

    // Dashboard actions
    { trigger: 'create new event', action: 'create-new-event', description: 'Create a new event type', element: '[data-action="create-new-event"]' },
    { trigger: 'view public booking', action: 'view-public-booking', description: 'View public booking page', element: '[data-action="view-public-booking"]' },
    { trigger: 'view today bookings', action: 'view-today-bookings', description: 'View today\'s bookings', element: '[data-action="view-today-bookings"]' },
    { trigger: 'view this week', action: 'view-this-week', description: 'View this week\'s bookings', element: '[data-action="view-this-week"]' },
    { trigger: 'view total clients', action: 'view-total-clients', description: 'View total clients', element: '[data-action="view-total-clients"]' },
    { trigger: 'view revenue', action: 'view-revenue', description: 'View revenue stats', element: '[data-action="view-revenue"]' },

    // Calendar actions
    { trigger: 'previous month', action: 'calendar-prev', description: 'Go to previous month', element: '[data-action="calendar-prev"]' },
    { trigger: 'next month', action: 'calendar-next', description: 'Go to next month', element: '[data-action="calendar-next"]' },
    { trigger: 'today', action: 'calendar-today', description: 'Go to today', element: '[data-action="calendar-today"]' },
    { trigger: 'week view', action: 'calendar-week', description: 'Switch to week view', element: '[data-action="calendar-week"]' },
    { trigger: 'month view', action: 'calendar-month', description: 'Switch to month view', element: '[data-action="calendar-month"]' },
    { trigger: 'day view', action: 'calendar-day', description: 'Switch to day view', element: '[data-action="calendar-day"]' },

    // Event type actions
    { trigger: 'create event type', action: 'create-event-type', description: 'Create new event type', element: '[data-action="create-event-type"]' },
    { trigger: 'edit event', action: 'edit-event', description: 'Edit event type', element: '[data-action="edit-event"]' },
    { trigger: 'duplicate event', action: 'duplicate-event', description: 'Duplicate event type', element: '[data-action="duplicate-event"]' },
    { trigger: 'delete event', action: 'delete-event', description: 'Delete event type', element: '[data-action="delete-event"]' },

    // Booking actions
    { trigger: 'filter upcoming', action: 'filter-upcoming', description: 'Filter upcoming bookings', element: '[data-action="filter-upcoming"]' },
    { trigger: 'filter past', action: 'filter-past', description: 'Filter past bookings', element: '[data-action="filter-past"]' },
    { trigger: 'filter cancelled', action: 'filter-cancelled', description: 'Filter cancelled bookings', element: '[data-action="filter-cancelled"]' },
    { trigger: 'reschedule booking', action: 'reschedule-booking', description: 'Reschedule a booking', element: '[data-action="reschedule-booking"]' },
    { trigger: 'cancel booking', action: 'cancel-booking', description: 'Cancel a booking', element: '[data-action="cancel-booking"]' },

    // Analytics actions
    { trigger: 'export analytics', action: 'export-analytics', description: 'Export analytics data', element: '[data-action="export-analytics"]' },
    { trigger: 'change time range', action: 'analytics-timerange', description: 'Change analytics time range', element: '[data-action="analytics-timerange"]' },

    // Settings actions
    { trigger: 'profile settings', action: 'profile-settings', description: 'Open profile settings', element: '[data-action="profile-settings"]' },
    { trigger: 'availability settings', action: 'availability-settings', description: 'Open availability settings', element: '[data-action="availability-settings"]' },
    { trigger: 'notification settings', action: 'notification-settings', description: 'Open notification settings', element: '[data-action="notification-settings"]' },
    { trigger: 'integration settings', action: 'integration-settings', description: 'Open integration settings', element: '[data-action="integration-settings"]' },
    { trigger: 'security settings', action: 'security-settings', description: 'Open security settings', element: '[data-action="security-settings"]' },
    { trigger: 'appearance settings', action: 'appearance-settings', description: 'Open appearance settings', element: '[data-action="appearance-settings"]' },

    // Availability settings
    { trigger: 'add working hours', action: 'add-working-hours', description: 'Add working hours', element: '[data-action="add-working-hours"]' },
    { trigger: 'save availability', action: 'save-availability', description: 'Save availability settings', element: '[data-action="save-availability"]' },
    { trigger: 'add date override', action: 'add-date-override', description: 'Add date override', element: '[data-action="add-date-override"]' },

    // Integration settings
    { trigger: 'connect google calendar', action: 'connect-google-calendar', description: 'Connect Google Calendar', element: '[data-action="connect-google-calendar"]' },
    { trigger: 'connect outlook', action: 'connect-outlook', description: 'Connect Outlook', element: '[data-action="connect-outlook"]' },
    { trigger: 'connect zoom', action: 'connect-zoom', description: 'Connect Zoom', element: '[data-action="connect-zoom"]' },
    { trigger: 'connect slack', action: 'connect-slack', description: 'Connect Slack', element: '[data-action="connect-slack"]' },

    // Booking form actions
    { trigger: 'select time slot', action: 'select-time-slot', description: 'Select a time slot', element: '[data-action="select-time-slot"]' },
    { trigger: 'book appointment', action: 'book-appointment', description: 'Book the appointment', element: '[data-action="book-appointment"]' },
    { trigger: 'previous date', action: 'prev-date', description: 'Go to previous date', element: '[data-action="prev-date"]' },
    { trigger: 'next date', action: 'next-date', description: 'Go to next date', element: '[data-action="next-date"]' },

    // General actions
    { trigger: 'toggle sidebar', action: 'toggle-sidebar', description: 'Toggle sidebar', element: '[data-action="toggle-sidebar"]' },
    { trigger: 'start training', action: 'start-training', description: 'Start voice training', element: '[data-action="start-training"]' },
    { trigger: 'help', action: 'help', description: 'Show available voice commands', element: null },
  ];

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const speak = (text: string) => {
    stopSpeech();
    
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        setCurrentInstruction(transcript);
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    // Auto-start listening
    startListening();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopSpeech();
    };
  }, []);

  const handleVoiceCommand = (command: string) => {
    const instruction = voiceInstructions.find(instr => 
      command.includes(instr.trigger.toLowerCase())
    );

    if (instruction) {
      if (instruction.action === 'help') {
        const helpText = `Available voice commands: ${voiceInstructions.slice(0, 10).map(i => i.trigger).join(', ')} and many more. Say "help" to hear this again.`;
        speak(helpText);
        return;
      }

      if (instruction.element) {
        const element = document.querySelector(instruction.element) as HTMLElement;
        if (element) {
          element.click();
          speak(`${instruction.description} activated`);
        } else {
          speak(`Sorry, ${instruction.description} is not available on this page`);
        }
      } else {
        speak(instruction.description);
      }
    } else {
      const availableCommands = voiceInstructions
        .filter(instr => {
          if (!instr.element) return true;
          return document.querySelector(instr.element) !== null;
        })
        .slice(0, 5)
        .map(instr => instr.trigger)
        .join(', ');
      
      speak(`Command not recognized. Try: ${availableCommands}`);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      stopSpeech();
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const getPageSpecificInstructions = () => {
    const path = location.pathname;
    const pageInstructions = voiceInstructions.filter(instr => {
      if (!instr.element) return false;
      return document.querySelector(instr.element) !== null;
    });

    return pageInstructions.slice(0, 5);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm">Voice Control</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-2 rounded-full transition-colors ${
              isListening
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
            data-action="toggle-voice-listening"
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </button>
          
          <button
            onClick={stopSpeech}
            className={`p-2 rounded-full transition-colors ${
              isSpeaking
                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            data-action="stop-voice-speech"
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          
          <div className="flex-1">
            <div className={`text-xs px-2 py-1 rounded ${
              isListening ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {isListening ? '🎤 Listening...' : '🔇 Not listening'}
            </div>
          </div>
        </div>

        {currentInstruction && (
          <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
            Last: "{currentInstruction}"
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs text-gray-600 font-medium">Try saying:</p>
          {getPageSpecificInstructions().map((instr, index) => (
            <p key={index} className="text-xs text-gray-500">
              "{instr.trigger}"
            </p>
          ))}
          <p className="text-xs text-blue-600 cursor-pointer" onClick={() => speak('Available commands: ' + voiceInstructions.slice(0, 10).map(i => i.trigger).join(', '))}>
            Say "help" for more commands
          </p>
        </div>
      </div>
    </div>
  );
};
