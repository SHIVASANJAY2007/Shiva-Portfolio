/**
 * Button Component
 * Premium, accessible button with hover/focus states
 */
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './Button.module.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  disabled = false,
  className = '',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();
  const buttonClass = `${styles.button} ${styles[`variant-${variant}`]} ${styles[`size-${size}`]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={buttonClass}
        whileHover={shouldReduceMotion ? {} : { scale: 1.02, transition: { duration: 0.15, ease: "easeOut" } }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.98, transition: { duration: 0.1, ease: "easeOut" } }}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      whileHover={(!disabled && !shouldReduceMotion) ? { scale: 1.02, transition: { duration: 0.15, ease: "easeOut" } } : {}}
      whileTap={(!disabled && !shouldReduceMotion) ? { scale: 0.98, transition: { duration: 0.1, ease: "easeOut" } } : {}}
      {...props}
    >
      {children}
    </motion.button>
  );
};
