import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Hero.module.css';
import { resumeData } from '../../data/resume';

export const Hero = () => {
  const containerRef = useRef(null);
  const kanjiRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleCharsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Slice in the main title
      tl.from(titleCharsRef.current, {
        y: '100%',
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: 'power4.out',
      }, '-=1.5')
      // Reveal subtitle
      .from(subtitleRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
      }, '-=0.5');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split name for animation
  const nameChars = resumeData.personal.name.split('').map((char, i) => (
    <span key={i} className={styles.charWrap}>
      <span 
        className={styles.char}
        ref={(el) => (titleCharsRef.current[i] = el)}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    </span>
  ));

  return (
    <section id="hero" className={styles.heroSection} ref={containerRef}>
      
      
      <div className={styles.content}>
        <h1 className={styles.brutalistTitle}>
          {nameChars}
        </h1>
        <p ref={subtitleRef} className={styles.subtitle}>
          <span className={styles.redDot}>•</span> {resumeData.personal.title} <span className={styles.redDot}>•</span> Developer <span className={styles.redDot}>•</span> Leader
        </p>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}></div>
        <span>DESCEND</span>
      </div>
    </section>
  );
};

export default Hero;