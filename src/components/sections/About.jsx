import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';
import { resumeData } from '../../data/resume';
import montageNature from '../../assets/videos/montage_nature_opt.mp4';
import { Resume3DCard } from '../ui/Resume3DCard';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Kinetic text highlight reveal - start with bright visible opacity so it is never hidden
      gsap.fromTo('.aboutText span', 
        { opacity: 0.75, color: '#cccccc' },
        {
          opacity: 1,
          color: '#ffffff',
          textShadow: '0 0 14px rgba(255, 255, 255, 0.45)',
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'center 65%',
            scrub: 0.5,
          }
        }
      );

      // Section title magnetic parallax glide
      const titleEl = containerRef.current.querySelector(`.${styles.sectionTitle}`);
      if (titleEl) {
        gsap.fromTo(titleEl, 
          { y: 25, opacity: 0.4 },
          {
            y: 0, opacity: 1,
            duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 90%' }
          }
        );
      }

      // 3D perspective kinetic entrance stagger for education history rows
      const eduItems = containerRef.current.querySelectorAll(`.${styles.eduItem}`);
      if (eduItems.length > 0) {
        gsap.fromTo(eduItems,
          { y: 25, opacity: 0.3, rotationX: -5, transformPerspective: 600 },
          {
            y: 0, opacity: 1, rotationX: 0,
            stagger: 0.15, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current.querySelector(`.${styles.educationBox}`),
              start: 'top 95%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, containerRef);

    let observer;
    const video = videoRef.current;
    if (video && containerRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(containerRef.current);
    }

    return () => {
      ctx.revert();
      if (observer) observer.disconnect();
    };
  }, []);

  const textLines = resumeData.personal.summary.split('. ').map((line, i, arr) => (
    <span key={i} style={{ display: 'inline-block' }}>
      {line}{i !== arr.length - 1 ? '. ' : ''}
    </span>
  ));

  return (
    <section id="about" className={styles.originSection} ref={containerRef}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className={styles.bgVideo}
      >
        <source src={montageNature} type="video/mp4" />
      </video>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.redSlash}>/</span> About Me
        </h2>
        
        <div className={styles.gridContainer}>
          {/* Left Column: Summary & Education History */}
          <div className={styles.leftCol}>
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

          {/* Right Column: Interactive 3D Holographic Resume Card */}
          <div className={styles.rightCol}>
            <Resume3DCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
