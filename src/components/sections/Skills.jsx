import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Skills.module.css';
import skillsData from '../../data/skills.json';
import { scrollToSection } from '../../lib/scrollToSection';

gsap.registerPlugin(ScrollTrigger);

// Direct vector adaptation of NotebookLM from @lobehub/icons to eliminate Vite optimizer timeouts (504 Outdated Optimize Dep)
const NotebookLM = ({ size = 56, style, ...props }) => (
  <svg
    fill="currentColor"
    fillRule="evenodd"
    height={size}
    width={size}
    viewBox="0 0 24 24"
    style={{ flex: 'none', lineHeight: 1, ...style }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>NotebookLM</title>
    <path d="M11.999 3.14C5.372 3.14 0 8.588 0 15.312v5.828h2.212v-.58c0-2.728 2.178-4.938 4.866-4.938 2.688 0 4.866 2.21 4.866 4.937v.581h2.212v-.58c0-3.967-3.17-7.18-7.078-7.18a6.966 6.966 0 00-4.086 1.318C4.2 12.262 6.687 10.59 9.56 10.59c4.057 0 7.347 3.338 7.347 7.453v3.097h2.212v-3.097c0-5.355-4.28-9.698-9.56-9.698a9.438 9.438 0 00-6.217 2.332C4.984 7.528 8.244 5.383 12 5.383c5.406 0 9.788 4.446 9.788 9.93v5.827H24v-5.828C23.999 8.588 18.627 3.14 11.999 3.14z" />
  </svg>
);

const SkillIcon = React.memo(({ skill, className, size = 56 }) => {
  if (skill.slug === 'notebooklm' || skill.name === 'NotebookLM') {
    return (
      <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <NotebookLM size={size} />
      </span>
    );
  }
  return <img src={skill.logo} alt={skill.name} className={className} loading="lazy" decoding="async" />;
});
SkillIcon.displayName = 'SkillIcon';

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
          scrub: 0.6
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
          scrub: 0.6
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
                <SkillIcon skill={activeSkill} size={450} />
              </motion.div>
            </AnimatePresence>
          </div>

          <h2 className={styles.sectionTitle}>
            <span className={styles.redSlash}>/</span> My Skills
          </h2>
          <p className={styles.description}>
            I leverage a diverse set of modern tools and technologies to build scalable, high-performance applications. My expertise spans across frontend frameworks, robust backend systems, and cutting-edge AI tools to deliver exceptional digital experiences.
          </p>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className={styles.contactBtn}>Contact Me</a>
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
                    <SkillIcon skill={skill} className={styles.rotatingIcon} size={36} />
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
              <SkillIcon skill={activeSkill} size={84} />
              <div className={styles.activeLabel}>{activeSkill.name}</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
