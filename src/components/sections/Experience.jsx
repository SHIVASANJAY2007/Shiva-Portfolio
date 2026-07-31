import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Experience.module.css';
import { resumeData } from '../../data/resume';

gsap.registerPlugin(ScrollTrigger);

export const Experience = () => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate SVG line drawing down
      gsap.fromTo(lineRef.current, 
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: true,
          }
        }
      );

      const timelineItems = gsap.utils.toArray('.timelineItem');
      timelineItems.forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
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

        <div className={styles.timeline} ref={timelineRef}>
          <svg className={styles.svgRoadmap} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <line 
              ref={lineRef}
              className={styles.svgLine} 
              x1="50%" y1="0" 
              x2="50%" y2="100%" 
              pathLength="1"
            />
          </svg>

          {resumeData.experience.map((exp, index) => (
            <div key={index} className={`${styles.timelineItem} timelineItem ${index % 2 === 0 ? styles.left : styles.right}`}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <h3 className={styles.expTitle}>{exp.title}</h3>
                <h4 className={styles.expOrg}>{exp.organization}</h4>
                {exp.period && <p className={styles.expFocus}>{exp.period} {exp.location ? `| ${exp.location}` : ''}</p>}
                {exp.focus && <p className={styles.expFocus}>{exp.focus}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className={styles.achievements}>
                    {exp.achievements.map((ach, i) => (
                      <span key={i} className={styles.achievement}>{ach}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className={styles.awardsSection}>
            <h3 className={styles.awardsTitle}>Awards & Recognition</h3>
            <div className={styles.awardsGrid}>
              {resumeData.awards.map((award, index) => (
                <div key={`award-${index}`} className={styles.awardCard}>
                  <h4 className={styles.awardTitle}>{award.title}</h4>
                  {award.organization && <h5 className={styles.awardOrg}>{award.organization}</h5>}
                  <p className={styles.awardDesc}>{award.project || award.achievement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
