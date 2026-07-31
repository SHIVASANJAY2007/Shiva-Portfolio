import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Experience.module.css';
import { resumeData } from '../../data/resume';

gsap.registerPlugin(ScrollTrigger);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 27.35 27.35 0 002.051.271v2.36l.206.024a.75.75 0 01.36.142l.536.536-1.542 3.855A5.253 5.253 0 007.414 20h.03a1.5 1.5 0 001.353.864h6.406a1.5 1.5 0 001.353-.864h.03a5.253 5.253 0 00-1.845-2.227l-1.542-3.855.536-.536a.75.75 0 01.36-.142l.206-.024v-2.36c.697-.085 1.38-.18 2.051-.271a6.753 6.753 0 006.138-5.6.75.75 0 00-.584-.859 42.776 42.776 0 00-3.071-.543V2.62a.75.75 0 00-.65-.743 43.197 43.197 0 00-11.668 0 .75.75 0 00-.65.743zm1.503 1.054v6.002a39.957 39.957 0 004.577.587v-6.58a41.677 41.677 0 00-4.577-.009zm6.077 6.589a39.956 39.956 0 004.577-.587V3.666a41.673 41.673 0 00-4.577.01v6.588zm8.683-5.06a5.253 5.253 0 01-4.733 4.316 41.34 41.34 0 00-1.127-.14v-4.63a44.298 44.298 0 015.86.454zM2.585 5.205a44.299 44.299 0 015.86-.454v4.63c-.383.053-.76.1-1.127.14a5.253 5.253 0 01-4.733-4.315z" clipRule="evenodd" />
  </svg>
);

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
            start: 'top 50%', // Starts when timeline hits center
            end: 'bottom 50%',
            scrub: 1,
          }
        }
      );

      const timelineItems = gsap.utils.toArray('.timelineItem');
      timelineItems.forEach((item) => {
        const marker = item.querySelector(`.${styles.timelineMarker}`);
        const content = item.querySelector(`.${styles.timelineContent}`);
        
        // Sync item entrance with the exact moment the line hits it (top 50%)
        const itemTl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 50%', // Exactly matches the line's progress
            toggleActions: 'play none none reverse'
          }
        });

        itemTl.fromTo(marker, 
          { scale: 0, backgroundColor: '#050505' }, 
          { scale: 1, backgroundColor: '#D500F9', duration: 0.3, ease: 'back.out(2)' }
        )
        .fromTo(content, 
          { x: item.classList.contains(styles.left) ? -50 : 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.1'
        );
      });
      
      gsap.from(`.${styles.awardCard}`, {
        scrollTrigger: {
          trigger: `.${styles.awardsGrid}`,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
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
            <defs>
              <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D500F9" stopOpacity="0" />
                <stop offset="20%" stopColor="#D500F9" stopOpacity="1" />
                <stop offset="80%" stopColor="#B388FF" stopOpacity="1" />
                <stop offset="100%" stopColor="#B388FF" stopOpacity="0" />
              </linearGradient>
            </defs>
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
                  <div className={styles.awardIcon}>
                    <TrophyIcon />
                  </div>
                  <h4 className={styles.awardName}>{award.title}</h4>
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
