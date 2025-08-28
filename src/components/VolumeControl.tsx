import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VolumeControlProps {
  onVolumeToggle: (enabled: boolean) => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({ onVolumeToggle }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onVolumeToggle(newState);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="shadow-lg">
        <Button
          variant={isEnabled ? "default" : "outline"}
          size="lg"
          onClick={handleToggle}
          className="w-12 h-12 p-0 rounded-full"
        >
          {isEnabled ? (
            <Volume2 className="h-6 w-6" />
          ) : (
            <VolumeX className="h-6 w-6" />
          )}
        </Button>
      </Card>
    </div>
  );
};