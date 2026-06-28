/**
 * Navigation Component
 * Sticky navigation bar with section links
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Navigation.module.css';
import { Magnetic } from './Magnetic';

export const Navigation = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className={styles.container}>
        <Magnetic strength={0.8}>
          <motion.a href="#hero" className={styles.logo} whileHover={{ scale: 1.05 }}>
            <span className={styles.logoText}>S.</span>
          </motion.a>
        </Magnetic>

        <div className={styles.links}>
          {links.map((link) => (
            <Magnetic key={link.href} strength={0.4}>
              <motion.a
                href={link.href}
                className={`${styles.link} ${
                  activeSection === link.href.slice(1) ? styles.active : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <motion.span
                    className={styles.underline}
                    layoutId="underline"
                    initial={false}
                    transition={{
                      duration: 0.3,
                    }}
                  />
                )}
              </motion.a>
            </Magnetic>
          ))}
        </div>

        <Magnetic strength={0.6}>
          <motion.a
            href="https://github.com/Shiva_Sanjay"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.social}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            GitHub
          </motion.a>
        </Magnetic>
      </div>
    </motion.nav>
  );
};
