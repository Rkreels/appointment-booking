
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
    {
      id: 'new-event',
      element: '[data-action="new-event"]',
      instruction: 'Click here to create a new event type. This will open the event creation form where you can set duration, availability, and other preferences.',
      trigger: 'hover'
    },
    {
      id: 'dashboard-link',
      element: '[data-action="dashboard"]',
      instruction: 'This is your dashboard. Here you can see an overview of your bookings, upcoming events, and quick statistics.',
      trigger: 'hover'
    },
    {
      id: 'calendar-link',
      element: '[data-action="calendar"]',
      instruction: 'Access your calendar view here to see all your scheduled events in a traditional calendar format.',
      trigger: 'hover'
    },
    {
      id: 'events-link',
      element: '[data-action="events"]',
      instruction: 'Manage all your event types here. You can create, edit, or delete different types of meetings.',
      trigger: 'hover'
    },
    {
      id: 'bookings-link',
      element: '[data-action="bookings"]',
      instruction: 'View and manage all your bookings. See who has booked time with you and when.',
      trigger: 'hover'
    },
    {
      id: 'analytics-link',
      element: '[data-action="analytics"]',
      instruction: 'View detailed analytics about your scheduling patterns, popular time slots, and booking trends.',
      trigger: 'hover'
    },
    {
      id: 'settings-link',
      element: '[data-action="settings"]',
      instruction: 'Configure your account settings, availability, and preferences.',
      trigger: 'hover'
    },
    {
      id: 'edit-event',
      element: '[data-action="edit-event"]',
      instruction: 'Click to edit this event type. You can modify the duration, description, and availability settings.',
      trigger: 'hover'
    },
    {
      id: 'delete-event',
      element: '[data-action="delete-event"]',
      instruction: 'Click to delete this event type. This action cannot be undone.',
      trigger: 'hover'
    },
    {
      id: 'view-booking',
      element: '[data-action="view-booking"]',
      instruction: 'Click to view detailed information about this booking.',
      trigger: 'hover'
    },
    {
      id: 'cancel-booking',
      element: '[data-action="cancel-booking"]',
      instruction: 'Click to cancel this booking. The attendee will be notified automatically.',
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
        const action = trainingActions.find(a => a.element.includes(actionId!));
        
        if (action && action.id !== currentAction) {
          // Stop any existing speech immediately
          window.speechSynthesis.cancel();
          setCurrentAction(action.id);
          speak(action.instruction);
        }
      }
    };

    const handleMouseLeave = () => {
      // Stop speech when mouse leaves the element
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentAction(null);
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
      >
        {isActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        <span className="hidden sm:inline">{isActive ? 'Voice On' : 'Voice Off'}</span>
      </Button>
    </div>
  );
};
