import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { VolumeControl } from './VolumeControl';
import { toast } from '@/hooks/use-toast';

const VoiceTrainer: React.FC = () => {
  const location = useLocation();
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const { speak, announcePageNavigation, announceAction, provideGuidance, isSupported } = useVoiceGuide();

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

  // Handle volume control toggle
  const handleVolumeToggle = (enabled: boolean) => {
    setIsVoiceEnabled(enabled);
    
    if (enabled) {
      announceAction('Voice guidance activated. I will now guide you through the application.');
      toast({
        title: "Voice Guide Activated",
        description: "Voice guidance is now active and will help you navigate.",
      });
    } else {
      announceAction('Voice guidance deactivated.');
      toast({
        title: "Voice Guide Deactivated",
        description: "Voice guidance has been turned off.",
      });
    }
  };

  // Provide contextual guidance based on page
  const providePageGuidance = (pageName: string) => {
    if (!isVoiceEnabled) return;
    
    const guidance = {
      'Dashboard': 'You are on the Dashboard. Here you can view your overview, recent bookings, and quick stats.',
      'Calendar': 'You are on the Calendar page. Here you can view and manage your scheduled appointments.',
      'Event Types': 'You are on the Event Types page. Here you can create and manage different types of meetings you offer.',
      'Bookings': 'You are on the Bookings page. Here you can view all your appointments and manage booking requests.',
      'Analytics': 'You are on the Analytics page. Here you can view detailed statistics about your bookings and performance.',
      'Settings': 'You are on the Settings page. Here you can configure your preferences and account settings.',
      'Public Booking': 'You are on the Public Booking page. This is where clients can book appointments with you.'
    };
    
    const message = guidance[pageName as keyof typeof guidance] || `You are on the ${pageName} page.`;
    provideGuidance(message);
  };

  // Page load announcement with voice guidance
  React.useEffect(() => {
    if (isVoiceEnabled && isSupported) {
      const pageName = getPageName(location.pathname);
      setTimeout(() => {
        announcePageNavigation(pageName);
        setTimeout(() => providePageGuidance(pageName), 2000);
      }, 1000);
    }
  }, [location.pathname, isVoiceEnabled, isSupported, announcePageNavigation]);

  return (
    <>
      <VolumeControl onVolumeToggle={handleVolumeToggle} />
    </>
  );
};

export default VoiceTrainer;