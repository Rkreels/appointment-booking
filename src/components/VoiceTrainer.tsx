
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrainingAction {
  id: string;
  element: string;
  instruction: string;
  trigger: 'click' | 'hover' | 'focus';
}

export const VoiceTrainer: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
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
          setCurrentAction(action.id);
          speak(action.instruction);
        }
      }
    };

    // Add event listeners for training
    document.addEventListener('mouseover', handleElementInteraction);
    document.addEventListener('focus', handleElementInteraction, true);

    return () => {
      document.removeEventListener('mouseover', handleElementInteraction);
      document.removeEventListener('focus', handleElementInteraction, true);
    };
  }, [isActive, speechSupported, currentAction]);

  const speak = (text: string) => {
    if (!speechSupported) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const toggleTraining = () => {
    if (isActive) {
      stopSpeech();
      setIsActive(false);
      setCurrentAction(null);
    } else {
      setIsActive(true);
      speak('Voice training activated. Hover over any element to hear instructions about how to use it.');
    }
  };

  const resetTraining = () => {
    stopSpeech();
    setCurrentAction(null);
    if (isActive) {
      speak('Training reset. Continue hovering over elements to learn about VoiceCal features.');
    }
  };

  if (!speechSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2">
      <Button
        onClick={toggleTraining}
        variant={isActive ? "default" : "outline"}
        size="sm"
        className="flex items-center space-x-2 shadow-lg"
      >
        {isActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        <span>{isActive ? 'Voice On' : 'Voice Off'}</span>
      </Button>
      
      {isActive && (
        <>
          <Button
            onClick={isPlaying ? stopSpeech : () => speak('Voice training is active. Hover over elements to learn about them.')}
            variant="outline"
            size="sm"
            aria-label={isPlaying ? 'Stop speech' : 'Play instructions'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={resetTraining}
            variant="outline"
            size="sm"
            aria-label="Reset training"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
