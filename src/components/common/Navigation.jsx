import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Navigation.module.css';

export const Navigation = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If top of section is near the middle of viewport
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '#hero', kanji: '序', text: 'HERO' },
    { href: '#about', kanji: '', text: 'ABOUT' },
    { href: '#skills', kanji: '', text: 'SKILLS' },
    { href: '#projects', kanji: '', text: 'PROJECTS' },
    { href: '#experience', kanji: '', text: 'EXPERIENCE' },
    { href: '#contact', kanji: '', text: 'CONTACT' },
  ];

  return (
    <nav className={styles.sideNav}>
      <div className={styles.navLine}></div>
      {links.map((link) => {
        const isActive = activeSection === link.href.slice(1);
        return (
          <a
            key={link.href}
            href={link.href}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <div className={styles.navContent}>
              <span className={styles.navText}>{link.text}</span>
              <span className={styles.navKanji}>{link.kanji}</span>
            </div>
            <div className={styles.navIndicator}></div>
          </a>
        );
      })}
    </nav>
  );
};

export default Navigation;
