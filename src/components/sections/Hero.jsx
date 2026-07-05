import React, { useEffect, useRef, Suspense, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Html } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Hero.module.css';
import { resumeData } from '../../data/resume';
import { useModelProvider } from '../../providers/ModelProvider';
import { HeroLoader } from '../3D/HeroLoader';
import { Knight } from '../3D/Knight';

gsap.registerPlugin(ScrollTrigger);

// ── Preload immediately on module import so the model is ready by the time Hero mounts
// preloadModel('knight'); // removed as logic is now handled in Provider

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

class HeroErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Hero 3D Canvas Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ position: 'absolute', top: '50%', right: '10%', color: '#FF0055', fontFamily: 'monospace' }}>
          Failed to load 3D model. Please refresh.
        </div>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CameraRig
// Restores the exact camera position saved from the Theatre.js session.
// The target point is the knight's upper torso/head area.
// ─────────────────────────────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    const target = new THREE.Vector3(
      0.026311563721417866,
      1.9530481113475282,
      0.41684588599902234
    );
    const spherical = new THREE.Spherical(
      4.8,   // Zoomed in
      1.68,   // phi
      7.22     // theta
    );
    const position = new THREE.Vector3()
      .setFromSpherical(spherical)
      .add(target);
    camera.position.copy(position);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────
export const Hero = () => {
  const containerRef  = useRef(null);
  const subtitleRef   = useRef(null);
  const ctaRef        = useRef(null);
  const titleCharsRef = useRef([]);
  const lineRef       = useRef(null);
  const taglineRef    = useRef(null);
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
      tl.from(taglineRef.current, { opacity: 0, y: 16, duration: 0.6 })
        .from(titleCharsRef.current, { y: '105%', opacity: 0, duration: 0.75, stagger: 0.035 }, '-=0.2')
        .from(lineRef.current, { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'cubic-bezier(0.165, 0.84, 0.44, 1)' }, '-=0.3')
        .from(subtitleRef.current, { opacity: 0, y: 20, duration: 0.6 }, '-=0.2')
        .from(ctaRef.current, { opacity: 0, y: 16, duration: 0.5 }, '-=0.3');

      // 3D canvas fades as hero scrolls out of view
      gsap.to(canvasWrapRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.2 },
      });

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

  const { progress } = useModelProvider() || { progress: 0 };
  const [modelReady, setModelReady] = useState(false);
  const [mountModel, setMountModel] = useState(false);

  useEffect(() => {
    // Defer the mounting of KnightModel to the next tick.
    // This prevents React 18 Suspense from blocking the initial Canvas WebGL commit!
    setMountModel(true);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setModelReady(true), 1500); // Wait for fade-in animation
    }
  }, [progress]);

  const nameChars = resumeData.personal.name.split('').map((char, i) => (
    <span key={i} className={styles.charWrap}>
      <span className={styles.char} ref={(el) => (titleCharsRef.current[i] = el)}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    </span>
  ));

  return (
    <section id="hero" className={styles.heroSection} ref={containerRef}>

      {/* Background decorative layers */}
      <div ref={gridRef}      className={styles.grid}      aria-hidden="true" />
      <div ref={blobLeftRef}  className={styles.blobLeft}  aria-hidden="true" />
      <div ref={blobRightRef} className={styles.blobRight} aria-hidden="true" />

      {/* 3D canvas — absolute, right-aligned, transparent bg, no pointer blocking
          frameloop="always" during load to prevent R3F suspense freeze, then "demand" to save battery
          PerspectiveCamera makeDefault = CameraRig can set it imperatively     */}
      <div ref={canvasWrapRef} className={styles.canvasContainer} aria-hidden="true">
        <HeroErrorBoundary>
          <Canvas
            gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
            frameloop={modelReady ? "demand" : "always"}
          >
            {/* Restored FOV to 25 to zoom the model in */}
            <PerspectiveCamera
              makeDefault
              fov={25}
              near={0.1}
              far={1000}
            />
            <CameraRig />

            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
            <directionalLight position={[-5, 3, -5]} intensity={0.5} />
            <Environment preset="city" />

            <HeroLoader />
            {mountModel && (
              <Suspense fallback={null}>
                <Knight />
              </Suspense>
            )}
          </Canvas>
        </HeroErrorBoundary>
      </div>

      {/* UI content — left-side, above canvas via z-index */}
      <div className={styles.content}>

        <span ref={taglineRef} className={styles.tagline}>
          <span className={styles.taglineDot} />
          Portfolio
        </span>

        <h1 className={styles.brutalistTitle}>
          {nameChars}
        </h1>

        <div ref={lineRef} className={styles.accentLine} />

        <p ref={subtitleRef} className={styles.subtitle}>
          <span className={styles.pill}>{resumeData.personal.title}</span>
          <span className={styles.pill}>Developer</span>
          <span className={styles.pill}>Leader</span>
        </p>

        <a ref={ctaRef} href="#projects" className={styles.cta} id="hero-cta">
          View Work
          <span className={styles.ctaArrow}>↓</span>
        </a>

      </div>

    </section>
  );
};

export default Hero;