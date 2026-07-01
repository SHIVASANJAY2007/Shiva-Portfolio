import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export const AnimeStagger = ({ children, className, delay = 0, duration = 250, stagger: staggerTime = 50 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = containerRef.current.children;

    if (prefersReducedMotion) {
      for (let item of items) {
        item.style.opacity = '1';
        item.style.transform = 'none';
      }
      return;
    }

    for (let item of items) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'none';
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(items, {
            opacity: [0, 1],
            y: [20, 0],
            delay: stagger(staggerTime, { start: delay }),
            duration: duration,
            easing: 'cubicBezier(0.165, 0.84, 0.44, 1)', // easeOutQuart
          });
          observer.unobserve(containerRef.current);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [delay, duration, staggerTime, children]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default AnimeStagger;
