/**
 * Scroll Trigger Animation Component
 * Advanced animation triggers based on scroll position
 */
import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal = ({ children, direction = 'up', delay = 0 }) => {
  const directionOffset = {
    up: { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -60 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 } },
  };

  return (
    <motion.div
      initial={directionOffset[direction].initial}
      whileInView={directionOffset[direction].animate}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Parallax Scroll Component
 * Creates parallax effect on scroll
 */
export const ParallaxSection = ({ children, offset = 50 }) => {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      style={{ y: scrollY * (offset / 100) }}
      transition={{ type: 'spring', damping: 30, stiffness: 100 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stagger Container
 * Staggers child animations
 */
export const StaggerContainer = ({ children, staggerDelay = 0.1 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { variants: itemVariants })
      )}
    </motion.div>
  );
};

export default { ScrollReveal, ParallaxSection, StaggerContainer };
