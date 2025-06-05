
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrainingAction {
  id: string;
  element: string;
  instruction: string;
  trigger: 'hover' | 'focus';
}

export const VoiceTrainer: React.FC = () => {
  const [isActive, setIsActive] = useState(true); // Always on by default
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const trainingActions: TrainingAction[] = [
    // Navigation actions
    {
      id: 'dashboard-link',
      element: '[data-action="dashboard"]',
      instruction: 'Navigate to your main dashboard. Here you can see an overview of your bookings, upcoming events, and quick statistics.',
      trigger: 'hover'
    },
    {
      id: 'calendar-link',
      element: '[data-action="calendar"]',
      instruction: 'Access your calendar view to see all your scheduled events in a traditional calendar format with day, week, and month views.',
      trigger: 'hover'
    },
    {
      id: 'events-link',
      element: '[data-action="events"]',
      instruction: 'Manage all your event types. Create, edit, duplicate, or delete different types of meetings and appointments.',
      trigger: 'hover'
    },
    {
      id: 'bookings-link',
      element: '[data-action="bookings"]',
      instruction: 'View and manage all your bookings. See who has booked time with you, when, and manage booking details.',
      trigger: 'hover'
    },
    {
      id: 'analytics-link',
      element: '[data-action="analytics"]',
      instruction: 'View detailed analytics about your scheduling patterns, popular time slots, booking trends, and revenue insights.',
      trigger: 'hover'
    },
    {
      id: 'settings-link',
      element: '[data-action="settings"]',
      instruction: 'Configure your account settings, availability, integrations, and preferences.',
      trigger: 'hover'
    },

    // Event management actions
    {
      id: 'new-event',
      element: '[data-action="new-event"]',
      instruction: 'Create a new event type. Set the duration, price, description, location, and availability preferences for this type of meeting.',
      trigger: 'hover'
    },
    {
      id: 'edit-event',
      element: '[data-action="edit-event"]',
      instruction: 'Edit this event type. Modify the duration, description, pricing, and availability settings.',
      trigger: 'hover'
    },
    {
      id: 'delete-event',
      element: '[data-action="delete-event"]',
      instruction: 'Delete this event type permanently. This action cannot be undone and will remove all associated settings.',
      trigger: 'hover'
    },
    {
      id: 'duplicate-event',
      element: '[data-action="duplicate-event"]',
      instruction: 'Create a copy of this event type. Useful for creating similar meeting types with slight variations.',
      trigger: 'hover'
    },

    // Booking management actions
    {
      id: 'new-booking',
      element: '[data-action="new-booking"]',
      instruction: 'Create a new booking manually. Enter attendee details, select date and time, and set up the meeting.',
      trigger: 'hover'
    },
    {
      id: 'edit-booking',
      element: '[data-action="edit-booking"]',
      instruction: 'Edit this booking. Modify attendee information, reschedule the meeting, or update booking details.',
      trigger: 'hover'
    },
    {
      id: 'view-booking',
      element: '[data-action="view-booking"]',
      instruction: 'View detailed information about this booking including attendee details, meeting information, and status.',
      trigger: 'hover'
    },
    {
      id: 'cancel-booking',
      element: '[data-action="cancel-booking"]',
      instruction: 'Cancel this booking. The attendee will be automatically notified about the cancellation.',
      trigger: 'hover'
    },
    {
      id: 'reschedule-booking',
      element: '[data-action="reschedule-booking"]',
      instruction: 'Reschedule this booking to a different date or time. The attendee will receive notification about the change.',
      trigger: 'hover'
    },

    // Public booking flow actions
    {
      id: 'select-event-type',
      element: '[data-action="select-event-type"]',
      instruction: 'Select this event type to proceed with booking. You will then choose a date and time for your meeting.',
      trigger: 'hover'
    },
    {
      id: 'select-date',
      element: '[data-action="select-date"]',
      instruction: 'Choose your preferred date from the calendar. Only available dates are shown.',
      trigger: 'hover'
    },
    {
      id: 'select-time-slot',
      element: '[data-action="select-time-slot"]',
      instruction: 'Select this available time slot for your meeting. Times are shown in your local timezone.',
      trigger: 'hover'
    },
    {
      id: 'enter-name',
      element: '[data-action="enter-name"]',
      instruction: 'Enter your full name. This is required for booking confirmation and will appear in calendar invites.',
      trigger: 'focus'
    },
    {
      id: 'enter-email',
      element: '[data-action="enter-email"]',
      instruction: 'Enter your email address. You will receive booking confirmations and meeting details at this address.',
      trigger: 'focus'
    },
    {
      id: 'enter-phone',
      element: '[data-action="enter-phone"]',
      instruction: 'Optionally enter your phone number for additional contact method and meeting reminders.',
      trigger: 'focus'
    },
    {
      id: 'enter-message',
      element: '[data-action="enter-message"]',
      instruction: 'Add any additional information or questions about the meeting. This helps prepare for your session.',
      trigger: 'focus'
    },
    {
      id: 'confirm-booking',
      element: '[data-action="confirm-booking"]',
      instruction: 'Confirm your booking. You will receive an email confirmation with meeting details and calendar invite.',
      trigger: 'hover'
    },

    // Settings and configuration actions
    {
      id: 'select-timezone',
      element: '[data-action="select-timezone"]',
      instruction: 'Select your timezone. This affects how times are displayed and when meetings are scheduled.',
      trigger: 'hover'
    },
    {
      id: 'toggle-availability',
      element: '[data-action*="toggle-"]',
      instruction: 'Toggle availability for this day. When enabled, you can set specific working hours.',
      trigger: 'hover'
    },
    {
      id: 'add-time-slot',
      element: '[data-action*="add-time-slot"]',
      instruction: 'Add additional working hours for this day. Useful if you have split schedules or breaks.',
      trigger: 'hover'
    },
    {
      id: 'save-settings',
      element: '[data-action*="save"]',
      instruction: 'Save your current settings and apply changes to your scheduling system.',
      trigger: 'hover'
    },

    // Analytics actions
    {
      id: 'export-analytics',
      element: '[data-action="export-analytics"]',
      instruction: 'Export your analytics data as a CSV file for further analysis or reporting.',
      trigger: 'hover'
    },
    {
      id: 'analytics-timerange',
      element: '[data-action="analytics-timerange"]',
      instruction: 'Select the time range for analytics data. Choose from last 7 days, 30 days, 90 days, or one year.',
      trigger: 'hover'
    },

    // Integration actions
    {
      id: 'toggle-integration',
      element: '[data-action*="toggle-"]',
      instruction: 'Enable or disable this integration. When enabled, this service will automatically sync with your bookings.',
      trigger: 'hover'
    },
    {
      id: 'test-webhook',
      element: '[data-action="test-webhook"]',
      instruction: 'Test your webhook configuration to ensure it is working correctly and receiving booking data.',
      trigger: 'hover'
    },

    // Navigation helper actions
    {
      id: 'back-to-events',
      element: '[data-action="back-to-events"]',
      instruction: 'Go back to the event type selection page to choose a different meeting type.',
      trigger: 'hover'
    },
    {
      id: 'back-to-time-selection',
      element: '[data-action="back-to-time-selection"]',
      instruction: 'Return to the date and time selection page to choose a different time slot.',
      trigger: 'hover'
    },
    {
      id: 'schedule-another',
      element: '[data-action="schedule-another"]',
      instruction: 'Schedule another meeting. This will restart the booking process from the beginning.',
      trigger: 'hover'
    }
  ];

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  useEffect(() => {
    if (!isActive || !speechSupported) return;

    const handleElementInteraction = (e: Event) => {
      const target = e.target as HTMLElement;
      const actionElement = target.closest('[data-action]');
      
      if (actionElement) {
        const actionId = actionElement.getAttribute('data-action');
        
        // Find matching action by exact match or partial match for dynamic actions
        const action = trainingActions.find(a => {
          if (a.element.includes(actionId!)) return true;
          // Handle dynamic actions like toggle-monday, add-time-slot-tuesday etc
          if (a.element.includes('*') && actionId!.includes(a.id.replace('toggle-integration', 'toggle-').replace('add-time-slot', 'add-time-slot-'))) return true;
          return false;
        });
        
        if (action && action.id !== currentAction) {
          // Stop any existing speech immediately
          window.speechSynthesis.cancel();
          setCurrentAction(action.id);
          speak(action.instruction);
        }
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      // Only stop if we're leaving an element with data-action
      if (!target.closest('[data-action]')) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setCurrentAction(null);
      }
    };

    document.addEventListener('mouseover', handleElementInteraction);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('focus', handleElementInteraction, true);

    return () => {
      document.removeEventListener('mouseover', handleElementInteraction);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('focus', handleElementInteraction, true);
    };
  }, [isActive, speechSupported, currentAction]);

  const speak = (text: string) => {
    if (!speechSupported) return;
    
    // Always cancel existing speech before starting new one
    window.speechSynthesis.cancel();
    
    // Small delay to ensure previous speech is stopped
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentAction(null);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentAction(null);
      };
      
      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentAction(null);
  };

  const toggleTraining = () => {
    if (isActive) {
      stopSpeech();
      setIsActive(false);
    } else {
      setIsActive(true);
      speak('Voice training activated. Hover over any element to hear instructions about how to use it.');
    }
  };

  if (!speechSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={toggleTraining}
        variant={isActive ? "default" : "outline"}
        size="sm"
        className="flex items-center space-x-2 shadow-lg"
        data-action="toggle-voice-training"
      >
        {isActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        <span className="hidden sm:inline">{isActive ? 'Voice On' : 'Voice Off'}</span>
        {isPlaying && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
      </Button>
    </div>
  );
};
