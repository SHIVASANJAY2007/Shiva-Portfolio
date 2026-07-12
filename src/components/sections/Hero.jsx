import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { resumeData } from '../../data/resume';
import { useModelProvider } from '../../providers/ModelProvider';

gsap.registerPlugin(ScrollTrigger);


gsap.registerPlugin(ScrollTrigger);

// ── Preload immediately on module import so the model is ready by the time Hero mounts
// preloadModel('knight'); // removed as logic is now handled in Provider


// Hero
// ─────────────────────────────────────────────────────────────────────────────
export const Hero = () => {
  const containerRef  = useRef(null);
  const taglineRef    = useRef(null);
  const subtitleRef   = useRef(null);
  const blobLeftRef   = useRef(null);
  const blobRightRef  = useRef(null);
  const gridRef       = useRef(null);
  const canvasWrapRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // UI entrance stagger
      const tl = gsap.timeline({
        defaults: { ease: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
      });
      tl.from(taglineRef.current, { opacity: 0, x: -30, duration: 0.8 })
        .from(subtitleRef.current, { opacity: 0, x: 30, duration: 0.8 }, '-=0.6');


      // Blob parallax
      gsap.to(blobLeftRef.current, {
        y: -80, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.2 },
      });
      gsap.to(blobRightRef.current, {
        y: -50, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.8 },
      });

      // Grid fades faster
      gsap.to(gridRef.current, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: '40% top', scrub: true },
      });

      // Content drifts up
      gsap.to(containerRef.current.querySelector(`.${styles.content}`), {
        y: -60, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: '20% top', end: 'bottom top', scrub: 1 },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);


  return (
    <section id="hero" className={styles.heroSection} ref={containerRef}>

      {/* Background decorative layers */}
      <div ref={gridRef}      className={styles.grid}      aria-hidden="true" />
      <div ref={blobLeftRef}  className={styles.blobLeft}  aria-hidden="true" />
      <div ref={blobRightRef} className={styles.blobRight} aria-hidden="true" />



      <div className={styles.content}>
        
        {/* Left Side */}
        <div className={styles.leftContent} ref={taglineRef}>
          <span className={styles.greeting}>Hello! I'm</span>
          <h1 className={styles.nameTitle}>
            SHIVA SANJAY<br />
            N D
          </h1>
        </div>

        {/* Right Side */}
        <div className={styles.rightContent} ref={subtitleRef}>
          <span className={styles.prefix}>An</span>
          <div className={styles.jobTitles}>
            <span className={styles.bgTitle}>AI ENGINEER</span>
            <h2 className={styles.roleTitle}>FULL-STACK DEV</h2>
          </div>
        </div>

      </div>

    </section>
  );
};

export default Hero;