import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button, Magnetic, AnimeTextReveal } from '../common';
import styles from './Hero.module.css';
import { resumeData } from '../../data/resume';
import { useScramble } from '../../hooks/useScramble';
import vantaBirds from '../../utils/vanta/vanta.birds.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export const Hero = () => {
  const { output: displayedText } = useScramble(resumeData.personal.name, 500, 1500);
  const vantaRef = useRef(null);

  useEffect(() => {
    let effect = null;
    if (vantaRef.current && window.THREE) {
      try {
        effect = vantaBirds({
          el: vantaRef.current,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x0,
          backgroundAlpha: 0.0, // transparent canvas to show gradient behind
          color1: 0xffe500, // yellow
          color2: 0xff0d00, // pink
          colorMode: "lerp",
          birdSize: 1.50,
          wingSpan: 25.0,
          separation: 30.0,
          alignment: 30.0,
          cohesion: 30.0,
          quantity: 4.0,
        });
      } catch (err) {
        console.error("Vanta Birds initialization error:", err);
      }
    } else {
      console.warn("Vanta Birds could not initialize: vantaRef.current or window.THREE is missing", {
        vantaRef: vantaRef.current,
        THREE: window.THREE
      });
    }
    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <section id="hero" className={styles.hero}>
      <div ref={vantaRef} className={styles.heroVanta} aria-hidden="true" />
      {/* Left — text content */}

      <motion.div
        className={styles.text}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className={styles.greeting}>
          <span className={styles.wave}>👋</span>
          <AnimeTextReveal text="Welcome" />
        </motion.div>

        <motion.h1 variants={itemVariants} className={styles.title}>
          <span className={styles.name}>{displayedText}</span>
          <span className={styles.cursor}>|</span>
        </motion.h1>

        <motion.p variants={itemVariants} className={styles.subtitle}>
          <AnimeTextReveal text={`${resumeData.personal.title} · Full-Stack Developer & Creative Technologist`} delay={100} />
        </motion.p>

        <motion.p variants={itemVariants} className={styles.description}>
          Crafting elite digital experiences with React, 3D technologies, and precision
          design. Merging innovation with tradition through Japanese aesthetic principles.
        </motion.p>

        <motion.div variants={itemVariants} className={styles.cta}>
          <Magnetic>
            <Button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore My Work
            </Button>
          </Magnetic>
          <Magnetic>
            <Button variant="secondary" href={resumeData.profiles.github} target="_blank">
              GitHub Profile
            </Button>
          </Magnetic>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.contact}>
          <a href={`mailto:${resumeData.personal.email}`} className={styles.email}>
            {resumeData.personal.email}
          </a>
          <span className={styles.divider}>•</span>
          <span className={styles.location}>{resumeData.personal.location}</span>
        </motion.div>
      </motion.div>


      {/* Scroll indicator */}
      <motion.div
        className={styles.scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className={styles.scrollIcon}>
          ↓
        </motion.div>
        <p>Scroll to explore</p>
      </motion.div>
    </section>
  );
};

export default Hero;