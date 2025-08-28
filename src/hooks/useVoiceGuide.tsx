import { useCallback } from 'react';

export const useVoiceGuide = () => {
  // Text-to-speech for guidance only
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.7;
      utterance.lang = 'en-US';
      
      speechSynthesis.speak(utterance);
    }
  }, []);

  const announcePageNavigation = useCallback((pageName: string) => {
    speak(`Navigated to ${pageName} page. Welcome!`);
    // Dispatch event for tracking
    window.dispatchEvent(new CustomEvent('voice-guide-activated'));
  }, [speak]);

  const announceAction = useCallback((action: string) => {
    speak(action);
    // Dispatch event for tracking
    window.dispatchEvent(new CustomEvent('voice-guide-activated'));
  }, [speak]);

  const provideGuidance = useCallback((guidance: string) => {
    speak(guidance);
    // Dispatch event for tracking
    window.dispatchEvent(new CustomEvent('voice-guide-activated'));
  }, [speak]);

  const isSupported = 'speechSynthesis' in window;

  return {
    speak,
    announcePageNavigation,
    announceAction,
    provideGuidance,
    isSupported,
  };
};