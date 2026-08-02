import React, { useEffect, useState, useMemo } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Loader.module.css';

export const Loader = () => {
  const { progress: actualProgress } = useProgress();
  const [show, setShow] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Memoize static particle data so React never re-computes styles during rapid 60/120 FPS progress animation
  const warpParticles = useMemo(() => {
    return Array.from({ length: 35 }).map((_, idx) => {
      const colors = ['#FF2E54', '#FFFFFF', '#FF2E54', '#FFFFFF', '#000000'];
      return {
        color: colors[idx % colors.length],
        width: Math.floor(Math.random() * 90) + 12,
        top: Math.floor(Math.random() * 94) + 3,
        duration: (Math.random() * 0.55 + 0.35).toFixed(2),
        delay: -(Math.random() * 2).toFixed(2),
      };
    });
  }, []);

  useEffect(() => {
    let animationFrame;
    let startTime = performance.now();
    const totalDuration = 1500; // 1.5 seconds high-performance preloader speed

    const animate = (time) => {
      const elapsed = time - startTime;
      const raw = Math.min(1, elapsed / totalDuration);
      // Ease-out cubic calculation for responsive startup feel
      const eased = 100 * (1 - Math.pow(1 - raw, 3));

      setDisplayProgress(eased);
      if (raw < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayProgress(100);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    if (displayProgress >= 100 && !isLoaded) {
      setIsLoaded(true);
    }
  }, [displayProgress, isLoaded]);

  // Decoupled timer guarantees unmount execution without re-render cancellation
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShow(false), 550);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  const boundedProgress = Math.min(100, Math.max(0, displayProgress));
  // Exact alignment between energy bar width and floating counter
  const badgePosition = Math.min(94, Math.max(5, boundedProgress));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#050505',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Background High-Speed Streaks & Warp Particle Storm */}
          <div className={styles.longfazers}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            {warpParticles.map((particle, idx) => (
              <div
                key={idx}
                className={styles.warpParticle}
                style={{
                  top: `${particle.top}%`,
                  width: `${particle.width}px`,
                  background: `linear-gradient(90deg, transparent, ${particle.color}, #FFFFFF)`,
                  color: particle.color,
                  animationDuration: `${particle.duration}s`,
                  animationDelay: `${particle.delay}s`,
                }}
              />
            ))}
          </div>

          {/* Animated Jetpack Speeder Container */}
          <motion.div 
            className={styles.loaderContainer}
            animate={isLoaded ? { x: 600, scale: 1.25, opacity: 0 } : { x: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: "easeIn" }}
          >
            <div className={styles.loader}>
              <span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </span>
              <div className={styles.base}>
                <span></span>
                <div className={styles.face}></div>
              </div>
            </div>
          </motion.div>

          {/* High-Tech Tracking Telemetry HUD */}
          <motion.div 
            className={styles.progressContainer}
            animate={isLoaded ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className={styles.progressTrackWrapper}>
              <div 
                className={styles.floatingPercentage} 
                style={{ left: `${badgePosition}%` }}
              >
                {Math.round(boundedProgress)}%
              </div>
              <div className={styles.progressTrack}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${boundedProgress}%` }}
                />
              </div>
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
