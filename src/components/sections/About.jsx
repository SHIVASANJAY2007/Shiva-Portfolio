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
      // Kinetic text highlight reveal
      gsap.fromTo('.aboutText span', 
        { opacity: 0.2, color: '#666666' },
        {
          opacity: 1,
          color: '#ffffff',
          textShadow: '0 0 14px rgba(255, 255, 255, 0.45)',
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 65%',
            end: 'center 65%',
            scrub: 1.2,
          }
        }
      );

      // Section title magnetic parallax glide
      const titleEl = containerRef.current.querySelector(`.${styles.sectionTitle}`);
      if (titleEl) {
        gsap.fromTo(titleEl, 
          { y: 40, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0, opacity: 1, filter: 'blur(0px)',
            duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
          }
        );
      }

      // 3D perspective kinetic entrance stagger for education history rows
      const eduItems = containerRef.current.querySelectorAll(`.${styles.eduItem}`);
      if (eduItems.length > 0) {
        gsap.fromTo(eduItems,
          { y: 45, opacity: 0, rotationX: -15, transformPerspective: 600 },
          {
            y: 0, opacity: 1, rotationX: 0,
            stagger: 0.2, duration: 0.9, ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current.querySelector(`.${styles.educationBox}`),
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
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
