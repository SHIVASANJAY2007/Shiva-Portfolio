import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Experience.module.css';
import { resumeData } from '../../data/resume';

gsap.registerPlugin(ScrollTrigger);

export const Experience = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      

      const timelineItems = gsap.utils.toArray('.timelineItem');
      timelineItems.forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className={styles.pathSection} ref={containerRef}>
      

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.redSlash}>/</span> Experience
        </h2>

        <div className={styles.timeline}>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className={`${styles.timelineItem} timelineItem`}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <h3 className={styles.expTitle}>{exp.title}</h3>
                <h4 className={styles.expOrg}>{exp.organization}</h4>
                <p className={styles.expFocus}>{exp.focus}</p>
                <div className={styles.achievements}>
                  {exp.achievements.map((ach, i) => (
                    <span key={i} className={styles.achievement}>{ach}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Awards integrated into the timeline visually */}
          <div className={styles.timelineDivider}><span>Awards</span></div>
          
          {resumeData.awards.map((award, index) => (
            <div key={`award-${index}`} className={`${styles.timelineItem} timelineItem`}>
              <div className={styles.timelineMarker} style={{ borderColor: 'var(--color-primary)' }}></div>
              <div className={styles.timelineContent}>
                <h3 className={styles.expTitle}>{award.title}</h3>
                {award.organization && <h4 className={styles.expOrg}>{award.organization}</h4>}
                <p className={styles.expFocus}>{award.project || award.achievement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
