import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Skills.module.css';
import { resumeData } from '../../data/resume';

gsap.registerPlugin(ScrollTrigger);

export const Skills = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      

      // Stagger in the skill runes
      gsap.from('.rune', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className={styles.arsenalSection} ref={containerRef}>
      
      
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.redSlash}>/</span> Skills & Expertise
        </h2>
        
        <div className={styles.runeGrid}>
          {resumeData.skills.programming.map((skill, index) => (
            <div key={index} className={`${styles.rune} rune`}>
              <span className={styles.runeName}>{skill.name}</span>
              <div className={styles.masteryBar}>
                <div 
                  className={styles.masteryFill} 
                  style={{ width: `${(skill.level / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
          
          {resumeData.skills.other.map((skill, index) => (
            <div key={`other-${index}`} className={`${styles.rune} rune`}>
              <span className={styles.runeName}>{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
