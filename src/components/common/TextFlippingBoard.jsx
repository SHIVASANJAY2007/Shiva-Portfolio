import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TextFlippingBoard.module.css';

export const TextFlippingBoard = ({ text, className }) => {
  // Support explicit line breaks
  const lines = typeof text === 'string' ? text.split('\n') : [];

  return (
    <div className={`${styles.boardContainer} ${className || ''}`}>
      {lines.map((line, rowIdx) => (
        <div key={rowIdx} className={styles.row}>
          {line.split('').map((char, colIdx) => (
            <FlipChar 
              key={`${rowIdx}-${colIdx}-${char}`} 
              char={char} 
              delay={(rowIdx * 0.05) + (colIdx * 0.02)} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const FlipChar = ({ char, delay }) => {
  const displayChar = char === ' ' ? '\u00A0' : char.toUpperCase();
  
  return (
    <div className={styles.flapContainer}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={char}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.3, delay, ease: 'easeOut' }}
          className={styles.flap}
        >
          {displayChar}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
