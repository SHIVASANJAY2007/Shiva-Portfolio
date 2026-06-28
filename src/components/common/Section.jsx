/**
 * Section Container
 * Provides consistent spacing and layout for portfolio sections
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ScrambleHeader } from './ScrambleHeader';
import styles from './Section.module.css';

export const Section = ({
  children,
  id,
  title,
  subtitle,
  fullHeight = false,
  className = '',
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2,
        ease: [0.215, 0.61, 0.355, 1] // Dogstudio-like easing
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
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className={styles.subtitle}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
        <motion.div
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};
