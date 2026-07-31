import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';
import { resumeData } from '../../data/resume';
import montageNature from '../../assets/videos/montage_nature_opt.mp4';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.aboutText span', 
        { opacity: 0.2, color: '#888' },
        {
          opacity: 1,
          color: '#fff',
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            end: 'center center',
            scrub: true,
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const textLines = resumeData.personal.summary.split('. ').map((line, i, arr) => (
    <span key={i} style={{ display: 'inline-block' }}>
      {line}{i !== arr.length - 1 ? '. ' : ''}
    </span>
  ));

  return (
    <section id="about" className={styles.originSection} ref={containerRef}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.bgVideo}
      >
        <source src={montageNature} type="video/mp4" />
      </video>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.redSlash}>/</span> About Me
        </h2>
        
        <div className={styles.textContent}>
          <p className={`${styles.summaryText} aboutText`}>
            {textLines}
          </p>
        </div>

        <div className={styles.educationBox}>
          <h3 className={styles.eduTitle}>Education</h3>
          {resumeData.education.map((edu, idx) => (
            <div key={idx} className={styles.eduItem}>
              <span className={styles.eduInstitution}>{edu.institution}</span>
              <span className={styles.eduDetails}>{edu.degree || edu.program} // {edu.score}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
