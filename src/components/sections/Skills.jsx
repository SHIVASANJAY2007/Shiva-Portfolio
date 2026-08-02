import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export const Skills = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);

  const activeSkill = useMemo(() => allSkills[activeIndex], [activeIndex]);

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
          scrub: 1.2
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
          scrub: 1.2
        }
      });

      // Zero-gravity continuous atmospheric levitation on the skills orbit system
      const orbitEl = sectionRef.current.querySelector(`.${styles.orbitContainer}`);
      if (orbitEl) {
        gsap.to(orbitEl, {
          y: -14,
          duration: 3.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
        });
      }

      // Kinetic entrance stagger for descriptive typography & CTA button
      const leftChildren = sectionRef.current.querySelectorAll(`.${styles.sectionTitle}, .${styles.description}, .${styles.contactBtn}`);
      if (leftChildren.length > 0) {
        gsap.fromTo(leftChildren,
          { x: -55, opacity: 0 },
          {
            x: 0, opacity: 1,
            stagger: 0.18, duration: 1.1, ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className={styles.skillsSection} ref={sectionRef}>
      {/* Very thin, elegant radial shade of #FF2E54 behind the component */}
      <div 
        className={styles.backgroundGlow}
        style={{
          background: `radial-gradient(circle at 75% 50%, rgba(255, 46, 84, 0.05) 0%, rgba(255,255,255,0) 65%), radial-gradient(circle at 25% 50%, rgba(255, 46, 84, 0.035) 0%, rgba(255,255,255,0) 65%)`
        }}
      />

      <div className={styles.container}>
        {/* Left Column: Text & Info */}
        <div className={styles.leftColumn}>
          {/* Giant Ultra-Crisp 4K Vector Watermark Logo Behind My Skills Content */}
          <div className={styles.watermarkLogoWrap}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSkill.name}
                className={styles.watermarkMotion}
                initial={{ opacity: 0, scale: 0.88, rotate: -8 }}
                animate={{ opacity: 0.22, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.08, rotate: 6, transition: { duration: 0.25, ease: "easeInOut" } }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={activeSkill.logo} alt={activeSkill.name} loading="eager" decoding="async" />
              </motion.div>
            </AnimatePresence>
          </div>

          <h2 className={styles.sectionTitle}>
            <span className={styles.redSlash}>/</span> My Skills
          </h2>
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
                    <img src={skill.logo} alt={skill.name} className={styles.rotatingIcon} loading="eager" decoding="async" />
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
              <img src={activeSkill.logo} alt={activeSkill.name} loading="eager" decoding="async" />
              <div className={styles.activeLabel}>{activeSkill.name}</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
