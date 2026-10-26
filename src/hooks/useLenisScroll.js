import { useEffect, useRef } from 'react';

/**
 * Shared hook to subscribe to Lenis scroll events as a single source of truth.
 * Guards against Lenis not being initialized immediately and cleans up on unmount.
 */
export function useLenisScroll(callback) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    const handler = (e) => {
      if (cbRef.current) {
        cbRef.current(e);
      }
    };

    if (typeof window === 'undefined') return;

    if (window.lenis) {
      window.lenis.on('scroll', handler);
      return () => {
        window.lenis?.off('scroll', handler);
      };
    }

    // Lenis might initialize asynchronously in App.jsx
    const intervalId = setInterval(() => {
      if (window.lenis) {
        window.lenis.on('scroll', handler);
        clearInterval(intervalId);
      }
    }, 50);

    return () => {
      clearInterval(intervalId);
      window.lenis?.off('scroll', handler);
    };
  }, []);
}

export default useLenisScroll;
