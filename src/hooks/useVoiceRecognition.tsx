import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface VoiceCommand {
  action: string;
  element: string;
  description: string;
  alternatives?: string[];
}

interface UseVoiceRecognitionProps {
  commands: VoiceCommand[];
  onCommand?: (command: string) => void;
  autoStart?: boolean;
}

export const useVoiceRecognition = ({ 
  commands, 
  onCommand,
  autoStart = true 
}: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech Recognition API not supported');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Voice recognition started');
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Voice recognition ended');
      
      // Auto-restart if listening was active
      if (hasUserInteracted && autoStart) {
        restartTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && !isListening) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.log('Recognition restart failed:', error);
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to use voice commands.",
          variant: "destructive",
        });
      } else if (event.error === 'no-speech') {
        // Silent error for no speech detected
      } else {
        console.warn('Voice recognition error:', event.error);
      }
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
          finalTranscript += transcript;
          maxConfidence = Math.max(maxConfidence, result[0].confidence);
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
      setConfidence(maxConfidence);

      if (finalTranscript.trim()) {
        handleVoiceCommand(finalTranscript.trim().toLowerCase());
      }
    };

    return recognition;
  }, [hasUserInteracted, autoStart, isListening]);

  // Handle voice commands
  const handleVoiceCommand = useCallback((command: string) => {
    console.log('Processing voice command:', command);
    
    // Find matching command
    const matchedCommand = commands.find(cmd => {
      const mainMatch = command.includes(cmd.action.toLowerCase());
      const altMatch = cmd.alternatives?.some(alt => command.includes(alt.toLowerCase()));
      return mainMatch || altMatch;
    });

    if (matchedCommand) {
      console.log('Matched command:', matchedCommand.action);
      
      if (onCommand) {
        onCommand(matchedCommand.action);
      }

      // Execute the command
      executeCommand(matchedCommand);
      
      // Provide feedback
      speak(`Executing ${matchedCommand.description}`);
    } else {
      console.log('No matching command found for:', command);
      if (command.includes('help') || command.includes('commands')) {
        showAvailableCommands();
      }
    }
  }, [commands, onCommand]);

  // Execute DOM actions
  const executeCommand = useCallback((command: VoiceCommand) => {
    if (!command.element) {
      // Handle special commands
      switch (command.action) {
        case 'help':
          showAvailableCommands();
          break;
        case 'scroll up':
          window.scrollBy(0, -300);
          break;
        case 'scroll down':
          window.scrollBy(0, 300);
          break;
        case 'go back':
          window.history.back();
          break;
      }
      return;
    }

    // Find and click element
    const element = document.querySelector(command.element) as HTMLElement;
    if (element) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.focus();
      } else {
        element.click();
      }
      
      toast({
        title: "Voice Command Executed",
        description: command.description,
      });
    } else {
      console.warn('Element not found:', command.element);
      toast({
        title: "Command Failed",
        description: "Could not find the target element.",
        variant: "destructive",
      });
    }
  }, []);

  // Text-to-speech feedback
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // Show available commands
  const showAvailableCommands = useCallback(() => {
    const commandList = commands
      .filter(cmd => cmd.description)
      .map(cmd => `"${cmd.action}" - ${cmd.description}`)
      .join('\n');
    
    console.log('Available voice commands:\n', commandList);
    speak('Available commands listed in console');
    
    toast({
      title: "Voice Commands",
      description: "Available commands have been logged to the console.",
    });
  }, [commands]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      const recognition = initRecognition();
      if (!recognition) {
        setIsSupported(false);
        return;
      }
      recognitionRef.current = recognition;
      setIsSupported(true);
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log('Failed to start recognition:', error);
    }
  }, [initRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Setup user interaction detection
  useEffect(() => {
    if (hasUserInteracted) return;

    const handleUserInteraction = () => {
      setHasUserInteracted(true);
      if (autoStart) {
        setTimeout(startListening, 500);
      }
    };

    const events = ['click', 'keydown', 'touchstart', 'mousedown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [hasUserInteracted, autoStart, startListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    hasUserInteracted,
    transcript,
    confidence,
    startListening,
    stopListening,
    toggleListening,
    speak,
    showAvailableCommands,
  };
};