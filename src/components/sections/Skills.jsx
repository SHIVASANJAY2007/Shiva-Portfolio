import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Skills.module.css';
import skillsData from '../../data/skills.json';

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef(null);

  const activeSkill = useMemo(() => allSkills[activeIndex], [activeIndex]);
  const activeGlowColor = useMemo(() => glowColors[activeIndex % glowColors.length], [activeIndex]);

  // Calculate permanent positions for all skills so they don't re-arrange on click
  const allSkillsWithPositions = useMemo(() => {
    const radius = window.innerWidth < 768 ? 160 : 250;
    const angleStep = (2 * Math.PI) / allSkills.length;

    return allSkills.map((skill, i) => {
      const angle = i * angleStep - Math.PI / 2;
      return {
        ...skill,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        originalIndex: i
      };
    });
  }, []);

  const inactiveSkills = useMemo(() => allSkillsWithPositions.filter((_, i) => i !== activeIndex), [allSkillsWithPositions, activeIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Rotate the entire wrapper on scroll
      gsap.to(`.${styles.orbitRotatingWrapper}`, {
        rotation: 180,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
      // Counter-rotate the inner icons to keep them upright
      gsap.to('.iconWrapper', {
        rotation: -180,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className={styles.skillsSection} ref={sectionRef}>
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
            {/* The Orbit Ring and Items inside the rotating wrapper */}
            <div className={styles.orbitRotatingWrapper}>
              <div className={styles.orbitRing} />

              {/* Inactive Skills on the Orbit */}
              {inactiveSkills.map((skill) => (
                <motion.div
                  key={skill.name}
                  layoutId={`skill-${skill.name}`}
                  className={styles.orbitItem}
                  initial={false}
                  animate={{ x: skill.x, y: skill.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onClick={() => setActiveIndex(skill.originalIndex)}
                  whileHover={{ scale: 1.2 }}
                  title={skill.name}
                >
                  <div className="iconWrapper" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={skill.logo} alt={skill.name} className={styles.rotatingIcon} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Active Skill in the Center */}
            <motion.div
              key={activeSkill.name}
              layoutId={`skill-${activeSkill.name}`}
              className={styles.centerSkill}
              initial={false}
              animate={{ x: 0, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
