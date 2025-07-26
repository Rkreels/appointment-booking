import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { toast } from '@/hooks/use-toast';

const voiceCommands = [
  { action: 'help', element: '', description: 'Show voice commands' },
  { action: 'dashboard', element: '[data-action="dashboard"]', description: 'Go to dashboard' },
  { action: 'calendar', element: '[data-action="calendar"]', description: 'Open calendar' },
  { action: 'events', element: '[data-action="events"]', description: 'Manage events' },
];

export const VoiceControls: React.FC = () => {
  const {
    isListening,
    isSupported,
    hasUserInteracted,
    transcript,
    confidence,
    toggleListening,
    speak,
    showAvailableCommands,
  } = useVoiceRecognition({
    commands: voiceCommands,
    autoStart: false,
  });

  const handleTestVoice = () => {
    speak('Voice system test successful. You can now use voice commands.');
    toast({
      title: "Voice Test",
      description: "Voice output is working correctly.",
    });
  };

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <VolumeX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Voice Not Supported</h3>
          <p className="text-sm text-gray-600">
            Your browser doesn't support voice recognition. Try using Chrome or Edge.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${isListening ? 'bg-red-100' : 'bg-green-100'}`}>
                {isListening ? (
                  <Mic className="h-5 w-5 text-red-600" />
                ) : (
                  <MicOff className="h-5 w-5 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">Voice Training</h3>
                <p className="text-sm text-gray-600">
                  Status: {isListening ? 'Listening' : 'Stopped'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={isListening ? 'destructive' : 'secondary'}>
                {isListening ? 'Active' : 'Inactive'}
              </Badge>
              {confidence > 0 && (
                <Badge variant="outline">
                  {Math.round(confidence * 100)}% confidence
                </Badge>
              )}
            </div>
          </div>

          {transcript && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Last heard:</strong> "{transcript}"
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={toggleListening}
              variant={isListening ? 'destructive' : 'default'}
              size="sm"
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Listening
                </>
              )}
            </Button>

            <Button onClick={handleTestVoice} variant="outline" size="sm">
              <Volume2 className="h-4 w-4 mr-2" />
              Test Voice
            </Button>

            <Button onClick={showAvailableCommands} variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Show Commands
            </Button>
          </div>

          {!hasUserInteracted && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Click anywhere on the page to enable voice commands.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            Quick Commands
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <strong>"Help"</strong> - Show all commands
            </div>
            <div>
              <strong>"Dashboard"</strong> - Go to dashboard
            </div>
            <div>
              <strong>"Calendar"</strong> - Open calendar
            </div>
            <div>
              <strong>"Events"</strong> - Manage events
            </div>
            <div>
              <strong>"Settings"</strong> - Open settings
            </div>
            <div>
              <strong>"Search"</strong> - Focus search
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};