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
      const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
        const entries = list.getEntries() as PerformanceEntry[];
        const lastEntry = entries[entries.length - 1];
        metricsRef.current.fcp = lastEntry?.startTime ?? null;
        console.log('FCP:', lastEntry?.startTime ?? null);
      });
      try {
        observer.observe({ entryTypes: ['paint'] });
      } catch {
        // ignore environments that don't support this observer option
      }
    };

    // Largest Contentful Paint
    const observeLCP = () => {
      const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
        const entries = list.getEntries() as PerformanceEntry[];
        const lastEntry = entries[entries.length - 1];
        metricsRef.current.lcp = lastEntry?.startTime ?? null;
        console.log('LCP:', lastEntry?.startTime ?? null);
      });
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch {
        // ignore environments that don't support this observer option
      }
    };

    // First Input Delay
    const observeFID = () => {
      const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
        const entries = list.getEntries() as PerformanceEventTiming[];
        entries.forEach((entry) => {
          const processingStart = entry.processingStart ?? 0;
          metricsRef.current.fid = processingStart - entry.startTime;
          console.log('FID:', processingStart - entry.startTime);
        });
      });
      try {
        // preferred shape when available
        observer.observe({ type: 'first-input', buffered: true } as PerformanceObserverInit);
      } catch {
        // fallback for environments expecting entryTypes
        try {
          observer.observe({ entryTypes: ['first-input'] } as PerformanceObserverInit);
        } catch {
          // ignore
        }
      }
    };

    // Cumulative Layout Shift
    const observeCLS = () => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
        const entries = list.getEntries() as Array<LayoutShift & { value?: number; hadRecentInput?: boolean }>;
        entries.forEach((entry) => {
          if (entry.hadRecentInput === false) {
            clsValue += entry.value || 0;
          }
        });
        metricsRef.current.cls = clsValue;
        console.log('CLS:', clsValue);
      });
      try {
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch {
        // ignore
      }
    };

    // Time to First Byte
    const observeTTFB = () => {
      const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
        const entries = list.getEntries() as PerformanceNavigationTiming[];
        entries.forEach((entry) => {
          const responseStart = entry.responseStart ?? 0;
          const requestStart = entry.requestStart ?? 0;
          if (responseStart > 0 && requestStart >= 0) {
            metricsRef.current.ttfb = responseStart - requestStart;
            console.log('TTFB:', responseStart - requestStart);
          }
        });
      });
      try {
        observer.observe({ entryTypes: ['navigation'] });
      } catch {
        // ignore
      }
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