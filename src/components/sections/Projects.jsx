import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Projects.module.css';
import { resumeData } from '../../data/resume';
import { EmojiBackground } from '../common';

gsap.registerPlugin(ScrollTrigger);

export const Projects = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;
      if (!cards || cards.length === 0) return;

      const cardsContainer = containerRef.current.querySelector(`.${styles.cards}`);
      cardsContainer.style.setProperty('--cards-count', cards.length);
      
      // Wait for layout to calculate height
      setTimeout(() => {
        if (cards[0]) {
          cardsContainer.style.setProperty('--card-height', `${cards[0].clientHeight}px`);
        }
      }, 100);

      cards.forEach((card, index) => {
        const offsetTop = 20 + index * 20;
        card.style.paddingTop = `${offsetTop}px`;
        
        if (index === cards.length - 1) return;

        const toScale = 1 - (cards.length - 1 - index) * 0.1;
        const nextCard = cards[index + 1];
        const cardInner = card.querySelector(`.${styles.card__inner}`);

        gsap.to(cardInner, {
          scale: toScale,
          filter: 'brightness(0.6)',
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: `top bottom-=${offsetTop}`,
            end: `top top+=${Math.max(0, window.innerHeight - card.clientHeight)}`,
            scrub: true,
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className={styles.missionsSection} ref={containerRef}>
      <div className={styles.backgroundContainer}>
        <EmojiBackground />
      </div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.redSlash}>/</span> Featured Projects
        </h2>

        <div className={styles.spaceSmall}></div>
        
        <div className={styles.cards}>
          {resumeData.projects.map((project, index) => (
            <div 
              key={project.id} 
              className={styles.card} 
              ref={(el) => (cardsRef.current[index] = el)}
              data-index={index}
            >
              <div className={styles.card__inner}>
                <div className={styles.card__imageContainer}>
                  <img
                    className={styles.card__image}
                    src="https://images.unsplash.com/photo-1620207418302-439b387441b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=100"
                    alt={project.name}
                  />
                </div>
                <div className={styles.card__content}>
                  <h1 className={styles.card__title}>{project.name}</h1>
                  <p className={styles.card__description}>
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.space}></div>
      </div>
    </section>
  );
};

export default Projects;
