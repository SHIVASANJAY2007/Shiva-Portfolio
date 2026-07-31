import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Projects.module.css';
import { resumeData } from '../../data/resume';
import { EmojiBackground } from '../common';
import EmblaCarousel from '../common/EmblaCarousel/EmblaCarousel';

gsap.registerPlugin(ScrollTrigger);

export const Projects = () => {
  const sectionRef = useRef(null);
  const [emblaApi, setEmblaApi] = useState(null);

  const carouselWrapperRef = useRef(null);

  useEffect(() => {
    if (!emblaApi || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        // The pinning duration should be proportional to the number of slides
        end: () => `+=${resumeData.projects.length * window.innerWidth * 0.8}`,
        pin: true,
        scrub: 1, // Smooth scrubbing
        onUpdate: (self) => {
          if (!emblaApi) return;
          const scrollSnaps = emblaApi.scrollSnapList();
          if (scrollSnaps && scrollSnaps.length > 0) {
            // Map GSAP progress (0 to 1) to Embla slide index
            const index = Math.round(self.progress * (scrollSnaps.length - 1));
            emblaApi.scrollTo(index);
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [emblaApi]);

  return (
    <section id="projects" className={styles.missionsSection} ref={sectionRef}>
      <div className={styles.backgroundContainer}>
        <EmojiBackground />
      </div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.redSlash}>/</span> Featured Projects
        </h2>

        <div className={styles.carouselWrapper} ref={carouselWrapperRef}>
          <EmblaCarousel 
            slides={resumeData.projects} 
            options={{ loop: false, watchDrag: false }} 
            setApi={setEmblaApi}
          />
        </div>
      </div>
    </section>
  );
};

export default Projects;
