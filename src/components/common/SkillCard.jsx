/**
 * Skill Card Component
 * Display individual skills with visual level indicators
 */
import React from 'react';
import { motion } from 'framer-motion';
import styles from './SkillCard.module.css';

export const SkillCard = ({ name, level, category }) => {
  return (
    <motion.div
      className={styles.card}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
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
