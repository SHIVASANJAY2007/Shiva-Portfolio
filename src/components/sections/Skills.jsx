import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './Skills.module.css';
import skillsData from '../skills.json';

// Flatten the skills.json into a single array
const allSkills = [
  ...skillsData.languages,
  ...skillsData.codeEditors,
  ...skillsData.aiTools,
  ...skillsData.frontend,
  ...skillsData.backend,
  ...skillsData.databases,
  ...skillsData.tools,
];

// Predefined soft pastel glow colors for the background
const glowColors = [
  'rgba(255, 224, 130, 0.4)', // Pastel Yellow
  'rgba(129, 212, 250, 0.4)', // Pastel Light Blue
  'rgba(144, 202, 249, 0.4)', // Pastel Blue
  'rgba(206, 147, 216, 0.4)', // Pastel Purple
  'rgba(165, 214, 167, 0.4)', // Pastel Green
  'rgba(255, 171, 145, 0.4)', // Pastel Orange
  'rgba(244, 143, 177, 0.4)'  // Pastel Pink
];

export const Skills = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSkill = allSkills[activeIndex];
  const activeGlowColor = glowColors[activeIndex % glowColors.length];

  // Calculate positions for inactive skills
  const inactiveSkills = useMemo(() => {
    const filtered = allSkills.filter((_, i) => i !== activeIndex);
    const radius = window.innerWidth < 768 ? 160 : 250;
    const angleStep = (2 * Math.PI) / filtered.length;

    return filtered.map((skill, i) => {
      // Offset by -PI/2 to start at the top
      const angle = i * angleStep - Math.PI / 2;
      return {
        ...skill,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        originalIndex: allSkills.findIndex((s) => s.name === skill.name)
      };
    });
  }, [activeIndex]);

  return (
    <section id="skills" className={styles.skillsSection}>
      {/* Dynamic radial glow background */}
      <div 
        className={styles.backgroundGlow}
        style={{
          background: `radial-gradient(circle at 75% 50%, ${activeGlowColor} 0%, rgba(255,255,255,0) 60%)`
        }}
      />

      <div className={styles.container}>
        {/* Left Column: Text & Info */}
        <div className={styles.leftColumn}>
          <h2 className={styles.sectionTitle}>My Skills</h2>
          <p className={styles.description}>
            I leverage a diverse set of modern tools and technologies to build scalable, high-performance applications. My expertise spans across frontend frameworks, robust backend systems, and cutting-edge AI tools to deliver exceptional digital experiences.
          </p>
          <a href="#contact" className={styles.contactBtn}>Contact Me</a>
        </div>

        {/* Right Column: Orbit */}
        <div className={styles.rightColumn}>
          <div className={styles.orbitContainer}>
            {/* The Orbit Ring */}
            <div className={styles.orbitRing} />

            {/* Inactive Skills on the Orbit */}
            {inactiveSkills.map((skill) => (
              <motion.div
                key={skill.name}
                layoutId={`skill-${skill.name}`}
                className={styles.orbitItem}
                initial={false}
                animate={{ x: skill.x, y: skill.y }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                onClick={() => setActiveIndex(skill.originalIndex)}
                whileHover={{ scale: 1.2 }}
                title={skill.name}
              >
                <img src={skill.logo} alt={skill.name} />
              </motion.div>
            ))}

            {/* Active Skill in the Center */}
            <motion.div
              key={activeSkill.name}
              layoutId={`skill-${activeSkill.name}`}
              className={styles.centerSkill}
              initial={false}
              animate={{ x: 0, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            >
              <img src={activeSkill.logo} alt={activeSkill.name} />
              <div className={styles.activeLabel}>{activeSkill.name}</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
