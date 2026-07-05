import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

export const Loader = () => {
  const { progress: actualProgress } = useProgress();
  const [show, setShow] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Sync display progress with actual progress, but don't let it jump backwards
    setDisplayProgress(prev => Math.max(prev, actualProgress));
  }, [actualProgress]);

  useEffect(() => {
    // Only fade out if actualProgress truly hits 100
    if (displayProgress >= 100 && actualProgress === 100) {
      const timer = setTimeout(() => setShow(false), 1200); // Wait a bit to let the canvas render
      return () => clearTimeout(timer);
    }
  }, [displayProgress, actualProgress]);

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
            width: '100%',
            height: '100vh',
            background: '#000000',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Minimalist Logo/Letter */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            style={{
              fontSize: '4rem',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '2rem',
              letterSpacing: '0.2em',
            }}
          >
            SHIVA
          </motion.div>

          {/* Progress Bar Container */}
          <div style={{
            width: '200px',
            height: '2px',
            background: 'rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <motion.div
              style={{
                width: `${displayProgress}%`,
                height: '100%',
                background: '#ffffff',
                position: 'absolute',
                left: 0,
                top: 0,
              }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>

          {/* Percentage */}
          <div style={{
            marginTop: '1rem',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'monospace',
            letterSpacing: '0.1em'
          }}>
            {Math.round(displayProgress)}%
          </div>

          <div style={{
            position: 'absolute',
            bottom: '2rem',
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.3em'
          }}>
            Crafting Experience
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
