import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

export const AnimeProgress = ({ label, targetPercentage }) => {
  const [percent, setPercent] = useState(0);
  const barRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      barRef.current.style.width = `${targetPercentage}%`;
      setPercent(targetPercentage);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate the bar width with snappier feel
          animate(barRef.current, {
            width: ['0%', `${targetPercentage}%`],
            duration: 800,
            easing: 'cubicBezier(0.165, 0.84, 0.44, 1)', // easeOutQuart
          });

          // Animate the text percentage value counter
          const counter = { val: 0 };
          animate(counter, {
            val: targetPercentage,
            duration: 800,
            easing: 'cubicBezier(0.165, 0.84, 0.44, 1)',
            update: () => {
              setPercent(Math.round(counter.val));
            },
          });

          observer.unobserve(containerRef.current);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [targetPercentage]);

  return (
    <div ref={containerRef} style={{ width: '100%', marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.6rem',
        color: 'var(--progress-text-color, #ffffff)',
        fontSize: '0.95rem',
        fontWeight: 500,
        letterSpacing: '0.5px'
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: 'monospace', opacity: 0.85 }}>{percent}%</span>
      </div>
      <div style={{
        width: '100%',
        height: 'var(--progress-bar-height, 4px)',
        background: 'var(--progress-track-bg, rgba(255, 255, 255, 0.08))',
        borderRadius: 'var(--progress-bar-radius, 2px)',
        overflow: 'hidden',
        boxShadow: 'var(--progress-track-shadow, none)'
      }}>
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: '0%',
            background: 'var(--progress-fill-bg, linear-gradient(90deg, #fff000 0%, #f70000 100%))',
            borderRadius: 'var(--progress-bar-radius, 2px)',
            boxShadow: 'var(--progress-fill-shadow, 0 0 8px rgba(247, 0, 0, 0.5))'
          }}
        />
      </div>
    </div>
  );
};

export default AnimeProgress;
