import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Projects.module.css';
import { resumeData } from '../../data/resume';

gsap.registerPlugin(ScrollTrigger);

export const Projects = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      

      const projects = gsap.utils.toArray('.missionDossier');
      projects.forEach((proj, i) => {
        gsap.from(proj, {
          scrollTrigger: {
            trigger: proj,
            start: 'top 75%',
          },
          x: i % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className={styles.missionsSection} ref={containerRef}>
      

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.redSlash}>/</span> Featured Projects
        </h2>

        <div className={styles.dossierList}>
          {resumeData.projects.map((project, index) => (
            <div key={project.id} className={`${styles.missionDossier} missionDossier`}>
              <div className={styles.dossierHeader}>
                <span className={styles.dossierYear}>[{project.year}]</span>
                <h3 className={styles.dossierName}>{project.name}</h3>
              </div>
              
              <div className={styles.dossierBody}>
                <p className={styles.dossierDescription}>{project.description}</p>
                <div className={styles.dossierHighlights}>
                  {project.highlights.map((highlight, idx) => (
                    <span key={idx} className={styles.highlightToken}>
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
