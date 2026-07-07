import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

export const Loader = () => {
  const { progress: actualProgress } = useProgress();
  const [show, setShow] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Smoothly interpolate display progress
    let animationFrame;
    const updateProgress = () => {
      setDisplayProgress(prev => {
        const next = prev + (actualProgress - prev) * 0.1;
        if (actualProgress === 100 && next >= 99.9) return 100;
        return next;
      });
      animationFrame = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    return () => cancelAnimationFrame(animationFrame);
  }, [actualProgress]);

  useEffect(() => {
    if (displayProgress >= 100) {
      setIsLoaded(true);
      // Wait for the flash-to-white transition before unmounting
      const timer = setTimeout(() => setShow(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [displayProgress]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000000',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* White flash overlay for cinematic transition to Hero */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeIn" }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#ffffff',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          />

          {/* Text Container */}
          <motion.div
            initial={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
            animate={isLoaded ? { scale: 1.2, filter: 'blur(10px)', opacity: 0, letterSpacing: '0.1em' } : { scale: 1, filter: 'blur(0px)', opacity: 1, letterSpacing: '0.02em' }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              position: 'relative',
              fontSize: '20vw',
              fontWeight: '900',
              lineHeight: 1,
              fontFamily: 'sans-serif',
              transformOrigin: 'center center',
              zIndex: 2,
            }}
          >
            {/* Base Gray Text */}
            <div style={{ color: '#222222', whiteSpace: 'nowrap' }}>
              SHIVA
            </div>
            
            {/* Top White Text Overlay (Fills based on progress) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                color: '#ffffff',
                whiteSpace: 'nowrap',
                clipPath: `inset(0 ${100 - displayProgress}% 0 0)`,
                textShadow: '0 0 30px rgba(255, 255, 255, 0.4)',
              }}
            >
              SHIVA
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
