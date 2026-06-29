/**
 * Skill Card Component
 * Display individual skills with visual level indicators
 */
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './SkillCard.module.css';

export const SkillCard = ({ name, level, category }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.card}
      whileHover={shouldReduceMotion ? {} : { scale: 1.05, transition: { duration: 0.15, ease: "easeOut" } }}
    >
      <div className={styles.content}>
        <h4 className={styles.name}>{name}</h4>
        {level && (
          <div className={styles.level}>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i < level ? styles.active : ''}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
