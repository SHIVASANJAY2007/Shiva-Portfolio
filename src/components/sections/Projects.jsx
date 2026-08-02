import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Projects.module.css';
import { resumeData } from '../../data/resume';
import { Carousel as EmblaCarousel } from '../common/Carousel';

gsap.registerPlugin(ScrollTrigger);

export const Projects = () => {
  const sectionRef = useRef(null);
  const [emblaApi, setEmblaApi] = useState(null);
  const targetIndexRef = useRef(0);

  const carouselWrapperRef = useRef(null);

  useEffect(() => {
    if (!emblaApi || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Kinetic scale & glow reveal on projects heading
      const headingEl = sectionRef.current.querySelector(`.${styles.sectionTitle}`);
      if (headingEl) {
        gsap.fromTo(headingEl,
          { scale: 0.85, opacity: 0, y: 40, filter: 'blur(10px)' },
          {
            scale: 1, opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
          }
        );
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        // The pinning duration should be proportional to the number of slides
        end: () => `+=${resumeData.projects.length * window.innerWidth * 0.8}`,
        pin: true,
        scrub: 1.2, // Smooth scrubbing
        onUpdate: (self) => {
          if (!emblaApi) return;
          const scrollSnaps = emblaApi.scrollSnapList();
          if (scrollSnaps && scrollSnaps.length > 0) {
            // Map GSAP progress (0 to 1) to Embla slide index
            const index = Math.round(self.progress * (scrollSnaps.length - 1));
            if (targetIndexRef.current !== index) {
              targetIndexRef.current = index;
              emblaApi.scrollTo(index);
            }
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [emblaApi]);

  return (
    <section id="projects" className={styles.missionsSection} ref={sectionRef}>
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.redSlash}>/</span> Featured Projects
        </h2>

        <div className={styles.carouselWrapper} ref={carouselWrapperRef}>
          <EmblaCarousel 
            slides={resumeData.projects} 
            options={{ loop: false, watchDrag: true, duration: 35 }} 
            setApi={setEmblaApi}
          />
        </div>
      </div>
    </section>
  );
};

export default Projects;
