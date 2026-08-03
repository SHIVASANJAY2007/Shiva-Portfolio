import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Projects.module.css';
import { resumeData } from '../../data/resume';

gsap.registerPlugin(ScrollTrigger);

const iconThemes = [
  {
    color: '#FF2E54', // Crimson Red (Fitlee)
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
      </svg>
    )
  },
  {
    color: '#A855F7', // Purple (Zyvox AI)
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <rect x="7" y="7" width="3" height="3"></rect>
        <rect x="14" y="7" width="3" height="3"></rect>
        <rect x="7" y="14" width="3" height="3"></rect>
        <rect x="14" y="14" width="3" height="3"></rect>
      </svg>
    )
  },
  {
    color: '#00F5D4', // Cyan (FADE)
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16 12 12 8 8 12 12 16 16 12"></polygon>
      </svg>
    )
  },
  {
    color: '#3B82F6', // Electric Blue (VeriShield)
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 12 11 14 15 10"></polyline>
      </svg>
    )
  },
  {
    color: '#F59E0B', // Warm Amber (StudyMate)
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    )
  },
  {
    color: '#EC4899', // Neon Pink (GOJO SNAPCHAT LENS)
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    )
  },
  {
    color: '#10B981', // Emerald (INGRES)
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    )
  }
];

export const Projects = () => {
  const sectionRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const projects = resumeData.projects || [];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Kinetic scale & glow reveal on projects heading
      const headingEl = sectionRef.current.querySelector(`.${styles.sectionTitle}`);
      if (headingEl) {
        gsap.fromTo(
          headingEl,
          { scale: 0.95, y: 20 },
          {
            scale: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className={styles.missionsSection} ref={sectionRef}>
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.redSlash}>/</span> Featured Projects
        </h2>

        <div className={styles.stackContainer}>
          <div className={styles.stackDeck}>
            {projects.map((project, index) => {
              const total = projects.length;
              const offset = (index - selectedIndex + total) % total;
              const theme = iconThemes[index % iconThemes.length];

              return (
                <motion.div
                  key={project.id || index}
                  className={`${styles.projectCard} ${offset === 0 ? styles.activeCard : ''}`}
                  data-stacked={offset !== 0}
                  style={{
                    zIndex: offset === 0 ? total + 10 : total - offset + 1,
                    left: '50%',
                  }}
                  initial={false}
                  animate={{
                    x: '-50%',
                    y: offset === 0 ? 0 : -offset * 56,
                    width: offset === 0 ? '100%' : `calc(100% - ${offset * 20}px)`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 30,
                    mass: 0.8,
                  }}
                >
                  {/* Clickable Card Header Tab */}
                  <div
                    className={styles.cardHeader}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <div className={styles.headerLeft}>
                      <div
                        className={styles.iconBadge}
                        style={{
                          color: theme.color,
                          borderColor: `${theme.color}45`,
                          background: `${theme.color}15`,
                        }}
                      >
                        {theme.icon}
                      </div>
                      <h3 className={styles.headerTitle}>{project.name}</h3>
                    </div>
                    <span className={styles.headerYear}>{project.year || '2025'}</span>
                  </div>

                  {/* Expanded Content Body (Active Foreground Card Only) */}
                  <AnimatePresence>
                    {offset === 0 && (
                      <motion.div
                        className={styles.cardBody}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                      >
                        <div className={styles.infoColumn}>
                          <div>
                            <h2 className={styles.projectTitleDisplay}>{project.name}</h2>
                            <p className={styles.projectDescription}>{project.description}</p>

                            {project.highlights && project.highlights.length > 0 && (
                              <div className={styles.highlightsWrapper}>
                                {project.highlights.map((highlight, idx) => (
                                  <span key={idx} className={styles.highlightPill}>
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className={styles.actionRow}>
                            <a
                              href={project.link || '#'}
                              target={project.link ? '_blank' : '_self'}
                              rel="noopener noreferrer"
                              className={styles.viewButton}
                            >
                              View Project
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                              </svg>
                            </a>
                          </div>
                        </div>

                        <div className={styles.previewColumn}>
                          <div className={styles.imageFrame}>
                            <img
                              src={project.image || `https://picsum.photos/600/350?v=${index}`}
                              alt={project.name}
                              className={styles.previewImage}
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;

