import { useCallback, useEffect } from 'react';
import { logger } from '@/utils/logger';

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  customData?: Record<string, unknown>;
}

interface UserProperties {
  userId?: string;
  level?: number;
  totalXP?: number;
  streak?: number;
  categoriesCompleted?: number;
}

export const useAnalytics = () => {
  const trackEvent = useCallback((eventData: AnalyticsEvent) => {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventData);
      return;
    }

    // In production, send to analytics service
    try {
      // Example implementations:
      // Google Analytics 4
      // gtag('event', eventData.action, {
      //   event_category: eventData.category,
      //   event_label: eventData.label,
      //   value: eventData.value,
      //   custom_parameters: eventData.customData
      // });

      // Mixpanel
      // mixpanel.track(eventData.event, {
      //   category: eventData.category,
      //   ...eventData.customData
      // });

      // Custom analytics endpoint
      // fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(eventData)
      // });

      console.log('Analytics Event Tracked:', eventData);
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }, []);

  const trackError = useCallback((error: Error, context?: string) => {
    // Log to our logger first
    logger.error('Analytics Error', error, { context });

    trackEvent({
      event: 'error',
      category: 'error',
      action: 'error_occurred',
      label: error.name,
      customData: {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    });
  }, [trackEvent]);
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), 'global_error_handler');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(event.reason), 'unhandled_promise_rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackError]);



  const trackPuzzleStart = useCallback((puzzleId: string, categoryId: string, level: number) => {
    trackEvent({
      event: 'puzzle_start',
      category: 'engagement',
      action: 'puzzle_started',
      label: `${categoryId}_${level}_${puzzleId}`,
      customData: {
        puzzleId,
        categoryId,
        level,
        timestamp: Date.now()
      }
    });
  }, [trackEvent]);

  const trackPuzzleComplete = useCallback((
    puzzleId: string,
    categoryId: string,
    level: number,
    score: number,
    timeSpent: number,
    isCorrect: boolean
  ) => {
    trackEvent({
      event: 'puzzle_complete',
      category: 'engagement',
      action: 'puzzle_completed',
      label: `${categoryId}_${level}_${puzzleId}`,
      value: score,
      customData: {
        puzzleId,
        categoryId,
        level,
        score,
        timeSpent,
        isCorrect,
        timestamp: Date.now()
      }
    });
  }, [trackEvent]);

  const trackSessionStart = useCallback((categoryId: string, level: number) => {
    trackEvent({
      event: 'session_start',
      category: 'engagement',
      action: 'session_started',
      label: `${categoryId}_${level}`,
      customData: {
        categoryId,
        level,
        timestamp: Date.now()
      }
    });
  }, [trackEvent]);

  const trackSessionComplete = useCallback((
    categoryId: string,
    level: number,
    finalScore: number,
    totalTime: number,
    puzzlesCompleted: number
  ) => {
    trackEvent({
      event: 'session_complete',
      category: 'engagement',
      action: 'session_completed',
      label: `${categoryId}_${level}`,
      value: finalScore,
      customData: {
        categoryId,
        level,
        finalScore,
        totalTime,
        puzzlesCompleted,
        timestamp: Date.now()
      }
    });
  }, [trackEvent]);

  const trackUserProgress = useCallback((userProperties: UserProperties) => {
    trackEvent({
      event: 'user_progress',
      category: 'progress',
      action: 'progress_updated',
      customData: {
        ...userProperties,
        timestamp: Date.now()
      }
    });
  }, [trackEvent]);



  const setUserProperties = useCallback((properties: UserProperties) => {
    // Set user properties for future events
    if (process.env.NODE_ENV === 'development') {
      console.log('User Properties Set:', properties);
      return;
    }

    try {
      // Example: Mixpanel people.set(properties);
      // Example: gtag('config', 'GA_MEASUREMENT_ID', { user_properties: properties });
      console.log('User Properties Set:', properties);
    } catch (error) {
      console.error('Setting user properties failed:', error);
    }
  }, []);

  return {
    trackEvent,
    trackPuzzleStart,
    trackPuzzleComplete,
    trackSessionStart,
    trackSessionComplete,
    trackUserProgress,
    trackError,
    setUserProperties,
  };
};