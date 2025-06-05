
import React, { useState, useEffect } from 'react';
import { Mic, Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TrainingStep {
  id: string;
  title: string;
  instruction: string;
  target?: string;
  completed: boolean;
}

export const VoiceTrainer: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);

  const trainingSteps: TrainingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to VoiceCal',
      instruction: 'Welcome to VoiceCal! I will guide you through creating your first event type. This voice-guided system will help you master every feature.',
      completed: false
    },
    {
      id: 'create-event',
      title: 'Create Event Type',
      instruction: 'Click the "New Event Type" button in the sidebar to create your first scheduling event.',
      target: 'new-event-button',
      completed: false
    },
    {
      id: 'event-details',
      title: 'Set Event Details',
      instruction: 'Give your event a name like "30-minute consultation" and set the duration using the dropdown menu.',
      completed: false
    },
    {
      id: 'availability',
      title: 'Set Availability',
      instruction: 'Configure your working hours and buffer times between meetings. This ensures you have breaks between appointments.',
      completed: false
    },
    {
      id: 'share-link',
      title: 'Share Your Link',
      instruction: 'Your event type is ready! Copy the booking link to share with clients, or embed it on your website.',
      completed: false
    }
  ];

  useEffect(() => {
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const speak = (text: string) => {
    if (!speechSupported) return;
    
    // Cancel any ongoing speech
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

  const nextStep = () => {
    if (currentStep < trainingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      speak(trainingSteps[currentStep + 1].instruction);
    }
  };

  const resetTraining = () => {
    setCurrentStep(0);
    stopSpeech();
  };

  const toggleTraining = () => {
    if (isActive) {
      stopSpeech();
      setIsActive(false);
    } else {
      setIsActive(true);
      speak(trainingSteps[currentStep].instruction);
    }
  };

  if (!speechSupported) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80 bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-800">
              Voice training requires a modern browser with speech synthesis support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 transition-all duration-300 ${isActive ? 'shadow-lg' : 'shadow-md'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Mic className="h-5 w-5 text-blue-600" />
              <span>Voice Trainer</span>
            </CardTitle>
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isActive && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Step {currentStep + 1} of {trainingSteps.length}</span>
                  <span className="text-gray-500">
                    {Math.round(((currentStep + 1) / trainingSteps.length) * 100)}%
                  </span>
                </div>
                <Progress value={((currentStep + 1) / trainingSteps.length) * 100} />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">
                  {trainingSteps[currentStep].title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {trainingSteps[currentStep].instruction}
                </p>
              </div>
            </>
          )}
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleTraining}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className="flex-1"
            >
              {isActive ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span className="ml-2">{isActive ? 'Stop Training' : 'Start Training'}</span>
            </Button>
            
            {isActive && (
              <>
                <Button
                  onClick={isPlaying ? stopSpeech : () => speak(trainingSteps[currentStep].instruction)}
                  variant="outline"
                  size="sm"
                  aria-label={isPlaying ? 'Pause speech' : 'Play speech'}
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
          
          {isActive && currentStep < trainingSteps.length - 1 && (
            <Button onClick={nextStep} variant="outline" size="sm" className="w-full">
              Next Step
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
