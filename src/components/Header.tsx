
import React from 'react';
import { Bell, Settings, User, Mic, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const Header: React.FC = () => {
  const [voiceMode, setVoiceMode] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">VoiceCal</h1>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Voice-Guided Scheduling
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant={voiceMode ? "default" : "outline"}
            size="sm"
            onClick={() => setVoiceMode(!voiceMode)}
            className="flex items-center space-x-2"
            aria-label="Toggle voice guidance mode"
          >
            {voiceMode ? <Volume2 className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            <span>{voiceMode ? 'Voice On' : 'Voice Off'}</span>
          </Button>
          
          <Button variant="ghost" size="sm" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
