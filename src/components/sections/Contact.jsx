import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Contact.module.css';
import { resumeData } from '../../data/resume';

gsap.registerPlugin(ScrollTrigger);

export const Contact = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      

      gsap.from('.contactItem', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className={styles.summonSection} ref={containerRef}>
      

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.redSlash}>/</span> Get in Touch
        </h2>

        <div className={styles.contactGrid}>
          <a href={`mailto:${resumeData.personal.email}`} className={`${styles.contactItem} contactItem`}>
            <span className={styles.contactLabel}>COMMS</span>
            <span className={styles.contactValue}>{resumeData.personal.email}</span>
          </a>
          
          <a href={resumeData.profiles.linkedin} target="_blank" rel="noreferrer" className={`${styles.contactItem} contactItem`}>
            <span className={styles.contactLabel}>NETWORK</span>
            <span className={styles.contactValue}>LinkedIn Profile</span>
          </a>
          
          <a href={resumeData.profiles.github} target="_blank" rel="noreferrer" className={`${styles.contactItem} contactItem`}>
            <span className={styles.contactLabel}>CODEBASE</span>
            <span className={styles.contactValue}>GitHub Profile</span>
          </a>
          
          <div className={`${styles.contactItem} contactItem`}>
            <span className={styles.contactLabel}>BASE</span>
            <span className={styles.contactValue}>{resumeData.personal.location}</span>
          </div>
        </div>

        <div className={`${styles.footerEnd} contactItem`}>
          <p>SHIVA SANJAY © 2025 // NO CLAYMORPHISM ALLOWED.</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
