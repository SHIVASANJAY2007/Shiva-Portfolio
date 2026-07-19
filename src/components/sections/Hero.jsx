import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { resumeData } from '../../data/resume';
import { useModelProvider } from '../../providers/ModelProvider';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useState } from 'react';
import { Knight } from '../3D/Knight';
import { HeroLoader } from '../3D/HeroLoader';

// Simplified CameraRig for Hero
function HeroCameraRig() {
  return (
    <PerspectiveCamera
      makeDefault
      fov={21.676747862747334}
      near={0.1}
      far={1000}
      position={[
        0.03506215468457707 + 3.705 * Math.sin(1.602) * Math.sin(-0.002), // simplified spherical pos
        2.0473513037249234 + 3.705 * Math.cos(1.602),
        0.1572685070081812 + 3.705 * Math.sin(1.602) * Math.cos(-0.002)
      ]}
    />
  );
}

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

  const canvasWrapRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // UI entrance stagger
      const tl = gsap.timeline({
        defaults: { ease: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
        delay: 1.5 // Wait for loader overlay to finish
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

      // Content drifts up
      gsap.to(containerRef.current.querySelector(`.${styles.content}`), {
        y: -60, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: '20% top', end: 'bottom top', scrub: 1 },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const { progress } = useModelProvider() || { progress: 0 };
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setModelReady(true), 1500);
    }
  }, [progress]);


  return (
    <section id="hero" className={styles.heroSection} ref={containerRef}>

      {/* Background decorative layers */}
      <div ref={blobLeftRef}  className={styles.blobLeft}  aria-hidden="true" />
      <div ref={blobRightRef} className={styles.blobRight} aria-hidden="true" />

      {/* Embedded 3D Canvas explicitly restricted to Hero */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <Canvas
          shadows
          gl={{ 
            alpha: true, 
            antialias: true, 
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1
          }}
          dpr={[1, 1.5]}
          frameloop="demand"
        >
          <HeroCameraRig />
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.2} 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
            shadow-bias={-0.0001} 
          />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <Environment preset="city" resolution={256} />

          <HeroLoader />
          <Suspense fallback={null}>
            <group>
              <Knight />
            </group>
          </Suspense>
        </Canvas>
      </div>
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