/**
 * Project Card Component
 * Showcase individual projects with descriptions and highlights
 */
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import styles from './ProjectCard.module.css';

// ease-out-quart
const easeOutQuart = [0.165, 0.84, 0.44, 1];

export const ProjectCard = ({ name, year, description, highlights }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.card}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02, transition: { duration: 0.15, ease: "easeOut" } }}
      transition={{ duration: 0.2, ease: easeOutQuart }}
    >
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{name}</h3>
          <p className={styles.year}>{year}</p>
        </div>
        <motion.span
          className={styles.toggle}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2, ease: easeOutQuart }}
        >
          ↓
        </motion.span>
      </div>

      <p className={styles.description}>{description}</p>

      <AnimatePresence>
        {isExpanded && highlights && highlights.length > 0 && (
          <motion.div
            className={styles.highlights}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: easeOutQuart }}
          >
            <div className={styles.highlightsList}>
              {highlights.map((highlight, idx) => (
                <div key={idx} className={styles.highlight}>
                  <span className={styles.bullet}>•</span>
                  {highlight}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
