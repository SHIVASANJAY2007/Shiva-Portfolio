/**
 * Experience Section
 * Professional experience and awards
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '../common';
import styles from './Experience.module.css';
import { resumeData } from '../../data/resume';

export const Experience = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <Section id="experience" title="Experience & Awards" subtitle="Achievements and recognition">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Experience Timeline */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Professional Experience</h3>
          <div className={styles.timeline}>
            {resumeData.experience.map((exp, idx) => (
              <motion.div key={idx} variants={itemVariants} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <h4>{exp.title}</h4>
                  <p className={styles.organization}>{exp.organization}</p>
                  <p className={styles.focus}>{exp.focus}</p>
                  {exp.achievements && (
                    <ul className={styles.achievements}>
                      {exp.achievements.map((achievement, aidx) => (
                        <li key={aidx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Awards Grid */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Awards & Recognition</h3>
          <motion.div
            className={styles.awardsGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {resumeData.awards.map((award, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={styles.awardCard}
                whileHover={{ scale: 1.03 }}
              >
                <div className={styles.awardBadge}>🏆</div>
                <h4>{award.title}</h4>
                <p className={styles.awardOrg}>{award.organization}</p>
                {award.project && <p className={styles.awardProject}>{award.project}</p>}
                {award.achievement && (
                  <p className={styles.awardAchievement}>{award.achievement}</p>
                )}
                {award.date && <p className={styles.awardDate}>{award.date}</p>}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
};

export default Experience;
