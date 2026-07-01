// vitals.js
// Core Web Vitals tracking

function sendToAnalytics({ metric, value }) {
  // In a real application, replace this with your analytics backend endpoint
  console.log(`[Web Vitals] ${metric}: ${value}`);
}

export function reportWebVitals() {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          sendToAnalytics({ metric: 'LCP', value: entry.startTime });
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('LCP monitoring not supported', e);
    }

    // Cumulative Layout Shift (CLS)
    try {
      new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) cls += entry.value;
        }
        sendToAnalytics({ metric: 'CLS', value: cls });
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('CLS monitoring not supported', e);
    }

    // Interaction to Next Paint (INP)
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const inp = entry.processingEnd - entry.processingStart;
          sendToAnalytics({ metric: 'INP', value: inp });
        }
      }).observe({ type: 'event', buffered: true });
    } catch (e) {
      console.warn('INP monitoring not supported', e);
    }
  }
}
