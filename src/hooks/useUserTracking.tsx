import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface UserAction {
  id: string;
  timestamp: number;
  action: string;
  page: string;
  element?: string;
  data?: any;
  isCorrect?: boolean;
  efficiency?: number;
  helpUsed?: boolean;
  timeSpent?: number;
}

export interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  actions: UserAction[];
  totalActions: number;
  correctActions: number;
  efficiency: number;
  helpRequests: number;
  completedTasks: string[];
  learningProgress: number;
}

export interface UserAnalytics {
  totalSessions: number;
  totalTimeSpent: number;
  averageSessionDuration: number;
  overallEfficiency: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  completionRates: {
    eventCreation: number;
    bookingManagement: number;
    calendarUsage: number;
    settingsConfiguration: number;
  };
  commonMistakes: string[];
  improvementAreas: string[];
  lastActive: number;
}

const EXPECTED_FLOWS = {
  'create-event': ['navigate-events', 'click-new-event', 'fill-form', 'save-event'],
  'manage-booking': ['navigate-bookings', 'select-booking', 'update-status'],
  'view-calendar': ['navigate-calendar', 'interact-calendar'],
  'configure-settings': ['navigate-settings', 'update-settings', 'save-settings']
};

export const useUserTracking = () => {
  const [currentSession, setCurrentSession] = useLocalStorage<UserSession | null>('currentSession', null);
  const [allSessions, setAllSessions] = useLocalStorage<UserSession[]>('userSessions', []);
  const [analytics, setAnalytics] = useLocalStorage<UserAnalytics>('userAnalytics', {
    totalSessions: 0,
    totalTimeSpent: 0,
    averageSessionDuration: 0,
    overallEfficiency: 0,
    skillLevel: 'Beginner',
    completionRates: {
      eventCreation: 0,
      bookingManagement: 0,
      calendarUsage: 0,
      settingsConfiguration: 0
    },
    commonMistakes: [],
    improvementAreas: [],
    lastActive: Date.now()
  });

  // Cleanup old sessions to prevent localStorage quota issues
  useEffect(() => {
    if (allSessions.length > 20) {
      setAllSessions(allSessions.slice(-20)); // Keep only last 20 sessions
    }
  }, [allSessions, setAllSessions]);

  const [actionStartTime, setActionStartTime] = useState<number>(Date.now());
  const [currentFlow, setCurrentFlow] = useState<string[]>([]);

  // Start new session
  const startSession = useCallback(() => {
    const newSession: UserSession = {
      id: `session_${Date.now()}`,
      startTime: Date.now(),
      actions: [],
      totalActions: 0,
      correctActions: 0,
      efficiency: 0,
      helpRequests: 0,
      completedTasks: [],
      learningProgress: 0
    };
    setCurrentSession(newSession);
    setActionStartTime(Date.now());
  }, [setCurrentSession]);

  // End current session
  const endSession = useCallback(() => {
    if (!currentSession) return;

    const endTime = Date.now();
    const duration = endTime - currentSession.startTime;
    
    const updatedSession: UserSession = {
      ...currentSession,
      endTime,
      efficiency: currentSession.totalActions > 0 ? (currentSession.correctActions / currentSession.totalActions) * 100 : 0,
      learningProgress: calculateLearningProgress(currentSession)
    };

    setAllSessions(prev => [...prev, updatedSession]);
    updateAnalytics(updatedSession);
    setCurrentSession(null);
  }, [currentSession, setAllSessions, setCurrentSession]);

  // Track user action
  const trackAction = useCallback((
    action: string,
    page: string,
    element?: string,
    data?: any,
    helpUsed: boolean = false
  ) => {
    if (!currentSession) {
      startSession();
      return;
    }

    const now = Date.now();
    const timeSpent = now - actionStartTime;
    const isCorrect = evaluateActionCorrectness(action, page, currentFlow);
    const efficiency = calculateActionEfficiency(timeSpent, action);

    const newAction: UserAction = {
      id: `action_${now}`,
      timestamp: now,
      action,
      page,
      element,
      data,
      isCorrect,
      efficiency,
      helpUsed,
      timeSpent
    };

    // Update current flow
    setCurrentFlow(prev => [...prev, action].slice(-10)); // Keep last 10 actions
    
    // Limit actions per session to prevent quota issues
    const actions = currentSession.actions.length > 100 
      ? [...currentSession.actions.slice(-100), newAction]
      : [...currentSession.actions, newAction];
    
    const updatedSession: UserSession = {
      ...currentSession,
      actions,
      totalActions: currentSession.totalActions + 1,
      correctActions: currentSession.correctActions + (isCorrect ? 1 : 0),
      helpRequests: currentSession.helpRequests + (helpUsed ? 1 : 0)
    };

    // Check for completed tasks
    checkCompletedTasks(updatedSession, action, page);
    
    setCurrentSession(updatedSession);
    setActionStartTime(now);
    
  }, [currentSession, actionStartTime, currentFlow, startSession, setCurrentSession]);

  // Evaluate if action is correct based on context
  const evaluateActionCorrectness = (action: string, page: string, flow: string[]): boolean => {
    // Define correct action patterns
    const correctPatterns: Record<string, boolean> = {
      // Navigation actions
      'navigate-events': page === '/events',
      'navigate-bookings': page === '/bookings',
      'navigate-calendar': page === '/calendar',
      'navigate-settings': page === '/settings',
      
      // Event creation flow
      'click-new-event': page === '/events' && action === 'create-new-event',
      'fill-event-form': action.includes('form') && page === '/events',
      'save-event': action === 'save-event' && page === '/events',
      
      // Booking management
      'select-booking': page === '/bookings' && action.includes('booking'),
      'update-booking-status': action.includes('status') && page === '/bookings',
      
      // General UI interactions
      'dashboard-interaction': page === '/' && action.includes('dashboard'),
    };

    return correctPatterns[action] !== false; // Default to true unless explicitly false
  };

  // Calculate action efficiency based on time and complexity
  const calculateActionEfficiency = (timeSpent: number, action: string): number => {
    const expectedTimes: Record<string, number> = {
      'click': 1000,
      'form-fill': 10000,
      'navigation': 2000,
      'save': 3000,
      'search': 5000
    };

    const actionType = Object.keys(expectedTimes).find(type => action.includes(type)) || 'click';
    const expectedTime = expectedTimes[actionType];
    
    if (timeSpent <= expectedTime) return 100;
    if (timeSpent <= expectedTime * 2) return 75;
    if (timeSpent <= expectedTime * 3) return 50;
    return 25;
  };

  // Calculate learning progress
  const calculateLearningProgress = (session: UserSession): number => {
    const completedTasksScore = session.completedTasks.length * 25;
    const efficiencyScore = session.efficiency * 0.5;
    const independenceScore = (1 - (session.helpRequests / Math.max(session.totalActions, 1))) * 25;
    
    return Math.min(100, completedTasksScore + efficiencyScore + independenceScore);
  };

  // Check for completed tasks
  const checkCompletedTasks = (session: UserSession, action: string, page: string) => {
    const taskPatterns = {
      'event-creation': ['create-new-event', 'save-event'],
      'booking-management': ['select-booking', 'update-booking-status'],
      'calendar-usage': ['navigate-calendar', 'interact-calendar'],
      'settings-config': ['navigate-settings', 'save-settings']
    };

    Object.entries(taskPatterns).forEach(([task, requiredActions]) => {
      const hasAllActions = requiredActions.every(requiredAction => 
        session.actions.some(a => a.action === requiredAction)
      );
      
      if (hasAllActions && !session.completedTasks.includes(task)) {
        session.completedTasks.push(task);
      }
    });
  };

  // Update analytics
  const updateAnalytics = (session: UserSession) => {
    const totalSessions = allSessions.length + 1;
    const totalTimeSpent = allSessions.reduce((sum, s) => 
      sum + (s.endTime ? s.endTime - s.startTime : 0), 0) + 
      (session.endTime! - session.startTime);
    
    const averageSessionDuration = totalTimeSpent / totalSessions;
    const overallEfficiency = allSessions.reduce((sum, s) => sum + s.efficiency, 0) / totalSessions;
    
    // Calculate skill level
    let skillLevel: UserAnalytics['skillLevel'] = 'Beginner';
    if (overallEfficiency > 90 && totalSessions > 10) skillLevel = 'Expert';
    else if (overallEfficiency > 75 && totalSessions > 5) skillLevel = 'Advanced';
    else if (overallEfficiency > 60 && totalSessions > 2) skillLevel = 'Intermediate';

    // Calculate completion rates
    const completionRates = {
      eventCreation: calculateCompletionRate('event-creation'),
      bookingManagement: calculateCompletionRate('booking-management'),
      calendarUsage: calculateCompletionRate('calendar-usage'),
      settingsConfiguration: calculateCompletionRate('settings-config')
    };

    setAnalytics({
      totalSessions,
      totalTimeSpent,
      averageSessionDuration,
      overallEfficiency,
      skillLevel,
      completionRates,
      commonMistakes: identifyCommonMistakes(),
      improvementAreas: identifyImprovementAreas(overallEfficiency, completionRates),
      lastActive: Date.now()
    });
  };

  const calculateCompletionRate = (task: string): number => {
    const sessionsWithTask = allSessions.filter(s => s.completedTasks.includes(task)).length;
    return allSessions.length > 0 ? (sessionsWithTask / allSessions.length) * 100 : 0;
  };

  const identifyCommonMistakes = (): string[] => {
    const incorrectActions = allSessions.flatMap(s => 
      s.actions.filter(a => !a.isCorrect).map(a => a.action)
    );
    
    const mistakeCounts = incorrectActions.reduce((acc, action) => {
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(mistakeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([action]) => action);
  };

  const identifyImprovementAreas = (efficiency: number, rates: any): string[] => {
    const areas: string[] = [];
    
    if (efficiency < 70) areas.push('Overall Efficiency');
    if (rates.eventCreation < 80) areas.push('Event Creation');
    if (rates.bookingManagement < 80) areas.push('Booking Management');
    if (rates.calendarUsage < 70) areas.push('Calendar Navigation');
    if (rates.settingsConfiguration < 60) areas.push('Settings Configuration');
    
    return areas;
  };

  // Start session on mount
  useEffect(() => {
    if (!currentSession) {
      startSession();
    }

    // End session on page unload
    const handleBeforeUnload = () => {
      endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentSession, startSession, endSession]);

  // Export data for external dashboard (compact version to prevent quota issues)
  const exportAnalyticsData = () => {
    return {
      currentSession: currentSession ? {
        id: currentSession.id,
        startTime: currentSession.startTime,
        totalActions: currentSession.totalActions,
        correctActions: currentSession.correctActions,
        efficiency: currentSession.efficiency,
        completedTasks: currentSession.completedTasks
      } : null,
      recentSessions: allSessions.slice(-5).map(s => ({ // Only last 5 sessions
        id: s.id,
        duration: s.endTime ? s.endTime - s.startTime : 0,
        efficiency: s.efficiency,
        completedTasks: s.completedTasks
      })),
      analytics,
      realtimeMetrics: {
        sessionProgress: currentSession?.actions.length || 0,
        lastActionTime: actionStartTime
      }
    };
  };

  return {
    trackAction,
    startSession,
    endSession,
    currentSession,
    analytics,
    exportAnalyticsData
  };
};