import React, { useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Bounds, Center } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { resumeData } from '../../data/resume';
import { MODEL_URLS } from '../../constants/models';

gsap.registerPlugin(ScrollTrigger);

const MODEL_URL = MODEL_URLS.knight;

// Preload the moment this module is imported
useGLTF.preload(MODEL_URL);

// ─── Knight model with head tracking ──────────────────────────────────────────
function KnightModel() {
  const { scene } = useGLTF(MODEL_URL);

  // All state in refs — zero re-renders, max performance
  const headBoneRef    = useRef(null);
  const initialHeadRot = useRef(new THREE.Euler());
  const mouse          = useRef({ x: 0, y: 0 });
  const isActive       = useRef(false);

  // Find head/neck bone once after model loads
  useEffect(() => {
    if (!scene) return;
    let found = false;
    scene.traverse((child) => {
      if (!found && child.isBone) {
        const n = child.name.toLowerCase();
        if (n.includes('head') || n.includes('neck')) {
          headBoneRef.current = child;
          initialHeadRot.current.copy(child.rotation);
          found = true;
        }
      }
    });
  }, [scene]);

  // Single global mouse listener
  useEffect(() => {
    const onMove  = (e) => {
      isActive.current = true;
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onLeave = () => { isActive.current = false; };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Per-frame head lerp — ±20° yaw, ±10° pitch, 0.05 factor = heavy armour inertia
  useFrame(() => {
    if (!headBoneRef.current) return;
    const yaw   = isActive.current ? mouse.current.x *  (20 * Math.PI / 180) : 0;
    const pitch = isActive.current ? -mouse.current.y * (10 * Math.PI / 180) : 0;
    const h = headBoneRef.current;
    const i = initialHeadRot.current;
    h.rotation.y = THREE.MathUtils.lerp(h.rotation.y, i.y + yaw,   0.05);
    h.rotation.x = THREE.MathUtils.lerp(h.rotation.x, i.x + pitch, 0.05);
  });

  return <primitive object={scene} />;
}

// Thin wireframe shown while GLB is fetching — page never blocks
function ModelFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.6, 1.8, 0.4]} />
      <meshBasicMaterial color="#ff005522" wireframe />
    </mesh>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
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
      const tl = gsap.timeline({ defaults: { ease: 'cubic-bezier(0.215, 0.61, 0.355, 1)' } });

      tl.from(taglineRef.current,    { opacity: 0, y: 16, duration: 0.6 })
        .from(titleCharsRef.current, { y: '105%', opacity: 0, duration: 0.75, stagger: 0.035 }, '-=0.2')
        .from(lineRef.current,       { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'cubic-bezier(0.165, 0.84, 0.44, 1)' }, '-=0.3')
        .from(subtitleRef.current,   { opacity: 0, y: 20, duration: 0.6 }, '-=0.2')
        .from(ctaRef.current,        { opacity: 0, y: 16, duration: 0.5 }, '-=0.3');

      // Canvas fades on scroll-out
      gsap.to(canvasWrapRef.current, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.2 },
      });

      gsap.to(blobLeftRef.current,  { y: -80, ease: 'none', scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.2 } });
      gsap.to(blobRightRef.current, { y: -50, ease: 'none', scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.8 } });
      gsap.to(gridRef.current,      { opacity: 0, ease: 'none', scrollTrigger: { trigger: containerRef.current, start: 'top top', end: '40% top', scrub: true } });

      gsap.to(containerRef.current.querySelector(`.${styles.contentCol}`), {
        y: -60, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: '20% top', end: 'bottom top', scrub: 1 },
      });
    }, containerRef);

    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((st) => st.kill()); };
  }, []);

  const nameChars = resumeData.personal.name.split('').map((char, i) => (
    <span key={i} className={styles.charWrap}>
      <span className={styles.char} ref={(el) => (titleCharsRef.current[i] = el)}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    </span>
  ));

  return (
    <section id="hero" className={styles.heroSection} ref={containerRef}>

      {/* Background layers */}
      <div ref={gridRef}      className={styles.grid}      aria-hidden="true" />
      <div ref={blobLeftRef}  className={styles.blobLeft}  aria-hidden="true" />
      <div ref={blobRightRef} className={styles.blobRight} aria-hidden="true" />

      {/* ── LEFT: text content ─────────────────────────────── */}
      <div className={styles.contentCol}>

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

      {/* ── RIGHT: 3D model — Bounds auto-frames model regardless of scale */}
      <div ref={canvasWrapRef} className={styles.canvasCol} aria-hidden="true">
        <Canvas
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          frameloop="always"
          camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]}  intensity={1.4} castShadow />
          <directionalLight position={[-4, 2, -4]} intensity={0.6} />
          <Environment preset="city" />

          <Suspense fallback={<ModelFallback />}>
            {/* Bounds auto-fits camera to model — no hardcoded scale/position needed */}
            <Bounds fit clip observe margin={1.1}>
              <Center>
                <KnightModel />
              </Center>
            </Bounds>
          </Suspense>
        </Canvas>
      </div>

    </section>
  );
};

export default Hero;