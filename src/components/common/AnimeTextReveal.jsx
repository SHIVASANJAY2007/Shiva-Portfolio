import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export const AnimeTextReveal = ({ text, className, delay = 0 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Split text into characters wrapped in spans
    const chars = text.split('').map((char) => {
      const span = document.createElement('span');
      span.style.display = char === ' ' ? 'inline' : 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(1.2em)';
      span.style.transformOrigin = 'bottom center';
      span.textContent = char === ' ' ? '\u00A0' : char;
      return span;
    });

    containerRef.current.innerHTML = '';
    chars.forEach((span) => containerRef.current.appendChild(span));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(containerRef.current.children, {
            y: [40, 0],
            rotate: [5, 0],
            opacity: [0, 1],
            delay: stagger(20, { start: delay }),
            duration: 1000,
            ease: 'easeOutElastic(1, 0.75)',
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
