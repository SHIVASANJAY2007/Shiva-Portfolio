/**
 * Section Container
 * Provides consistent spacing and layout for portfolio sections
 */
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ScrambleHeader } from './ScrambleHeader';
import styles from './Section.module.css';

// ease-out-cubic (same curve as previous but documented)
const easeOutCubic = [0.215, 0.61, 0.355, 1];

export const Section = ({
  children,
  id,
  title,
  subtitle,
  fullHeight = false,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1,
        ease: easeOutCubic 
      } 
    }
  };

  return (
    <section
      id={id}
      className={`${styles.section} ${fullHeight ? styles.fullHeight : ''} ${className}`}
    >
      <div className={styles.container}>
        {title && (
          <div className={styles.header}>
            <ScrambleHeader text={title} className={styles.title} />
            {subtitle && (
              <motion.p 
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2, ease: easeOutCubic }}
                className={styles.subtitle}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
        <motion.div
           variants={shouldReduceMotion ? {} : containerVariants}
           initial={shouldReduceMotion ? false : "hidden"}
           whileInView="visible"
           viewport={{ once: true, margin: "-50px" }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};
