import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Skills.module.css';
import skillsData from '../../data/skills.json';
import { scrollToSection } from '../../lib/scrollToSection';
import ScrollVelocity from '../ui/ScrollVelocity';

gsap.registerPlugin(ScrollTrigger);

const iconMap = import.meta.glob('../../assets/icons/*.svg', { eager: true, import: 'default' });

const SkillIcon = React.memo(({ skill, className, size = 56 }) => {
  const localIcon = iconMap[`../../assets/icons/${skill.slug}.svg`];
  return <img src={localIcon || skill.logo} alt={skill.name} className={className} loading="lazy" decoding="async" />;
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
          { x: -35 },
          {
            x: 0,
            stagger: 0.15, duration: 1.0, ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
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

      {/* Infinite running kinetic typography background for the active skill, smoothly fading out as it reaches the left big logo */}
      <div className={styles.velocityBackground}>
        <ScrollVelocity 
          texts={Array(5).fill(activeSkill.name)} 
          velocity={40} 
          numCopies={3} 
        />
      </div>

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

        {/* Right Column: Orbit System */}
        <div className={styles.rightColumn}>
          <div className={styles.orbitContainer}>
            {/* The Orbit Ring and Items inside the rotating wrapper */}
            <div className={styles.orbitRotatingWrapper}>
              <div className={styles.orbitRing} />

              {/* Inactive Skills on the Orbit */}
              {inactiveSkills.map((skill) => (
                <div
                  key={skill.name}
                  className={styles.orbitItem}
                  style={{
                    transform: `translate3d(${skill.x}px, ${skill.y}px, 0)`
                  }}
                  onClick={() => setActiveIndex(skill.originalIndex)}
                  title={skill.name}
                >
                  <div className="iconWrapper" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SkillIcon skill={skill} className={styles.rotatingIcon} size={46} />
                  </div>
                </div>
              ))}
            </div>

            {/* Active Skill in the Center */}
            <div
              key={activeSkill.name}
              className={styles.centerSkill}
            >
              <SkillIcon skill={activeSkill} size={100} />
              <div className={styles.activeLabel}>{activeSkill.name}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
