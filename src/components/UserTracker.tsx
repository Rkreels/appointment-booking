import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserTracking } from '../hooks/useUserTracking';

interface UserTrackerProps {
  children: React.ReactNode;
}

export const UserTracker: React.FC<UserTrackerProps> = ({ children }) => {
  const { trackAction, exportAnalyticsData } = useUserTracking();
  const location = useLocation();

  useEffect(() => {
    // Track page navigation
    trackAction('page-navigation', location.pathname);
  }, [location.pathname, trackAction]);

  useEffect(() => {
    // Track clicks on interactive elements
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const element = target.closest('[data-action]') as HTMLElement;
      
      if (element) {
        const action = element.getAttribute('data-action') || 'click';
        const elementType = target.tagName.toLowerCase();
        const elementText = target.textContent?.slice(0, 50) || '';
        
        trackAction(action, location.pathname, elementType, {
          text: elementText,
          className: target.className
        });
      }
    };

    // Track form submissions
    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      const formName = form.getAttribute('name') || form.id || 'unnamed-form';
      
      trackAction('form-submission', location.pathname, 'form', {
        formName,
        formData: new FormData(form)
      });
    };

    // Track input interactions
    const handleInputChange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const inputName = input.name || input.id || 'unnamed-input';
      
      trackAction('input-interaction', location.pathname, 'input', {
        inputName,
        inputType: input.type,
        valueLength: input.value.length
      });
    };

    // Track button clicks specifically
    const handleButtonClick = (event: MouseEvent) => {
      const button = event.target as HTMLButtonElement;
      if (button.tagName === 'BUTTON') {
        const buttonText = button.textContent?.trim() || 'unnamed-button';
        
        trackAction('button-click', location.pathname, 'button', {
          buttonText,
          variant: button.className
        });
      }
    };

    // Track search actions
    const handleSearchInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.type === 'search' || input.placeholder?.toLowerCase().includes('search')) {
        trackAction('search-interaction', location.pathname, 'search', {
          searchTerm: input.value,
          searchContext: input.name || input.id
        });
      }
    };

    // Track help usage (when voice guide is activated)
    const handleHelpUsage = () => {
      trackAction('help-requested', location.pathname, 'voice-guide', {}, true);
    };

    // Add event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('click', handleButtonClick);
    document.addEventListener('submit', handleFormSubmit);
    document.addEventListener('change', handleInputChange);
    document.addEventListener('input', handleSearchInput);
    
    // Listen for voice guide activation
    window.addEventListener('voice-guide-activated', handleHelpUsage);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('click', handleButtonClick);
      document.removeEventListener('submit', handleFormSubmit);
      document.removeEventListener('change', handleInputChange);
      document.removeEventListener('input', handleSearchInput);
      window.removeEventListener('voice-guide-activated', handleHelpUsage);
    };
  }, [location.pathname, trackAction]);

  // Automatically export data every 5 minutes for external dashboard
  useEffect(() => {
    const exportData = () => {
      const data = exportAnalyticsData();
      // Expose on window for easy access (no localStorage)
      (window as any).getUserAnalytics = () => data;
    };

    const interval = setInterval(exportData, 300000); // Every 5 minutes
    exportData(); // Initial export

    return () => clearInterval(interval);
  }, [exportAnalyticsData]);

  return <>{children}</>;
};