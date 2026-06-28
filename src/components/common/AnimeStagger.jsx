import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export const AnimeStagger = ({ children, className, delay = 0, duration = 1000, stagger: staggerTime = 80 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.children;
    for (let item of items) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(40px) scale(0.95)';
      item.style.transition = 'none'; // prevent conflicts with other transitions
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(items, {
            opacity: [0, 1],
            y: [40, 0],
            scale: [0.95, 1],
            delay: stagger(staggerTime, { start: delay }),
            duration: duration,
            ease: 'easeOutElastic(1, 0.85)',
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
