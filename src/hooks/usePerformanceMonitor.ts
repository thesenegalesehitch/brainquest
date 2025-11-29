import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

export const usePerformanceMonitor = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  useEffect(() => {
    // First Contentful Paint
    const observeFCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metricsRef.current.fcp = lastEntry.startTime;
        console.log('FCP:', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['paint'] });
    };

    // Largest Contentful Paint
    const observeLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metricsRef.current.lcp = lastEntry.startTime;
        console.log('LCP:', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    };

    // First Input Delay
    const observeFID = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEventTiming) => {
          metricsRef.current.fid = entry.processingStart - entry.startTime;
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    };

    // Cumulative Layout Shift
    const observeCLS = () => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (layoutShiftEntry.hadRecentInput === false) {
            clsValue += layoutShiftEntry.value || 0;
          }
        });
        metricsRef.current.cls = clsValue;
        console.log('CLS:', clsValue);
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    };

    // Time to First Byte
    const observeTTFB = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          const navigationEntry = entry as PerformanceEntry & { responseStart?: number; requestStart?: number };
          if (navigationEntry.responseStart && navigationEntry.responseStart > 0) {
            metricsRef.current.ttfb = navigationEntry.responseStart - (navigationEntry.requestStart || 0);
            console.log('TTFB:', navigationEntry.responseStart - (navigationEntry.requestStart || 0));
          }
        });
      });
      observer.observe({ entryTypes: ['navigation'] });
    };

    // Initialize observers
    observeFCP();
    observeLCP();
    observeFID();
    observeCLS();
    observeTTFB();

    // Send metrics to analytics service (in production)
    const sendMetrics = () => {
      if (process.env.NODE_ENV === 'production') {
        // Example: sendToAnalytics(metricsRef.current);
        console.log('Performance metrics:', metricsRef.current);
      }
    };

    // Send metrics after page load
    window.addEventListener('load', () => {
      setTimeout(sendMetrics, 1000);
    });

    return () => {
      // Cleanup observers
      const observers = performance.getEntriesByType('navigation');
      observers.forEach(() => {
        // PerformanceObserver cleanup is automatic
      });
    };
  }, []);

  const getMetrics = () => metricsRef.current;

  const logCustomMetric = (name: string, value: number) => {
    console.log(`Custom metric - ${name}:`, value);
    // In production, send to analytics
  };

  return {
    getMetrics,
    logCustomMetric,
  };
};