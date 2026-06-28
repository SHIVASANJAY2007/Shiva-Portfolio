import React from 'react';
import { motion } from 'framer-motion';
import { AnimeStagger } from '../common';
import styles from './About.module.css';
import { resumeData } from '../../data/resume';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export const About = () => (
  <section id="about" className={styles.skeuSection}>
    <div className={styles.sectionInner}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>About</h2>
        <p className={styles.sectionSubtitle}>Who I am and what drives me</p>
      </div>

      {/* Summary Panel */}
      <motion.div
        className={styles.summaryPanel}
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className={styles.summaryRibbon}>Profile</div>
        <p className={styles.summaryText}>{resumeData.personal.summary}</p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <AnimeStagger className={styles.grid} stagger={120}>
          {/* Education */}
          <motion.div variants={itemVariants} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🎓</span>
              <h3>Education</h3>
            </div>
            <div className={styles.cardBody}>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className={styles.item}>
                  <h4 className={styles.itemTitle}>{edu.institution}</h4>
                  <p className={styles.itemMeta}>
                    {edu.degree || edu.program}
                    {edu.score && ` · ${edu.score}`}
                  </p>
                  {edu.status && <span className={styles.badge}>{edu.status}</span>}
                  {edu.date && <p className={styles.itemDate}>{edu.date}</p>}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interests */}
          <motion.div variants={itemVariants} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>⚡</span>
              <h3>Interests</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.tags}>
                {resumeData.interests.map((interest, idx) => (
                  <motion.span key={idx} className={styles.tag} whileHover={{ scale: 1.05, y: -2 }}>
                    {interest}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div variants={itemVariants} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🌐</span>
              <h3>Languages</h3>
            </div>
            <div className={styles.cardBody}>
              {resumeData.languages.map((lang, idx) => (
                <div key={idx} className={styles.langItem}>
                  <h4 className={styles.itemTitle}>{lang.name}</h4>
                  <div className={styles.levelBar}>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`${styles.levelDot} ${i < lang.level ? styles.filled : ''}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Highlights */}
          <motion.div variants={itemVariants} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🏆</span>
              <h3>Highlights</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>4</span>
                  <p>Awards</p>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>2+</span>
                  <p>Languages</p>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>2</span>
                  <p>Projects</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimeStagger>
      </motion.div>
    </div>
  </section>
);

export default About;
