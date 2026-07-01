import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export const AnimeTextReveal = ({ text, className, delay = 0 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Split text into characters wrapped in spans
    const chars = text.split('').map((char) => {
      const span = document.createElement('span');
      span.style.display = char === ' ' ? 'inline' : 'inline-block';
      if (prefersReducedMotion) {
        span.style.opacity = '1';
        span.style.transform = 'none';
      } else {
        span.style.opacity = '0';
        span.style.transform = 'translateY(1em)';
        span.style.transformOrigin = 'bottom center';
      }
      span.textContent = char === ' ' ? '\u00A0' : char;
      return span;
    });

    containerRef.current.innerHTML = '';
    chars.forEach((span) => containerRef.current.appendChild(span));

    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(containerRef.current.children, {
            y: ['1em', 0],
            opacity: [0, 1],
            delay: stagger(10, { start: delay }),
            duration: 300,
            easing: 'cubicBezier(0.165, 0.84, 0.44, 1)', // easeOutQuart
          });
          observer.unobserve(containerRef.current);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [text, delay]);

  return (
    <span
      ref={containerRef}
      className={className}
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        lineHeight: '1.2'
      }}
    >
      {text}
    </span>
  );
};

export default AnimeTextReveal;
