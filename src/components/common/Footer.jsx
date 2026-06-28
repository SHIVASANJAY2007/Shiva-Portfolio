/**
 * Footer Component
 * Professional footer with contact and social links
 */
import React from 'react';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';
import { resumeData } from '../../data/resume';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className={styles.section}>
            <h3>Let's Connect</h3>
            <p>
              Interested in collaboration or have a question? Reach out and let's create
              something amazing together.
            </p>
            <div className={styles.links}>
              <a href={`mailto:${resumeData.personal.email}`} className={styles.link}>
                Email
              </a>
              <a
                href={resumeData.profiles.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                GitHub
              </a>
              <a
                href={resumeData.profiles.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.bottom}>
            <p className={styles.copyright}>
              © {currentYear} Shiva Sanjay N D. All rights reserved.
            </p>
            <p className={styles.designed}>Crafted with precision and elegance.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
