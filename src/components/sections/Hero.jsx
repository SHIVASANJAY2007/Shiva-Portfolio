import React, { useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Bounds, Center } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { resumeData } from '../../data/resume';
import { MODEL_URLS } from '../../constants/models';

gsap.registerPlugin(ScrollTrigger);

const MODEL_URL = MODEL_URLS.knight;

// ─── Step 1: Preload immediately on module import ─────
useGLTF.preload(MODEL_URL);

// ─── Head-tracking knight model ───────────────────────
// Per glb-3d-web-integration.md Step 1 + Step 4 (cursor-follow)
// Per 3D_HEAD_TRACKING.md full spec
function KnightModel() {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef();

  // HEAD TRACKING — all in refs, zero re-renders
  const headBoneRef = useRef(null);
  const initialHeadRot = useRef(new THREE.Euler());
  const mouse = useRef({ x: 0, y: 0 });
  const isPointerActive = useRef(false);

  // Step 2: traverse once after load — find head/neck bone, never hardcoded
  useEffect(() => {
    if (!scene) return;
    let found = false;
    scene.traverse((child) => {
      if (!found && child.isBone) {
        const name = child.name.toLowerCase();
        if (name.includes('head') || name.includes('neck')) {
          headBoneRef.current = child;
          initialHeadRot.current.copy(child.rotation);
          found = true;
        }
      }
    });
  }, [scene]);

  // Step 4: single global mouse listener — no per-frame allocations
  useEffect(() => {
    const onMove = (e) => {
      isPointerActive.current = true;
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;   // [-1, +1]
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1; // [-1, +1], top=+1
    };
    // Step 7: on cursor leave → target snaps back to neutral via lerp
    const onLeave = () => { isPointerActive.current = false; };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Entrance fade-in: per glb-3d-web-integration.md Step 4 (triggered — load-in)
  useEffect(() => {
    if (!groupRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Fade in via scale — no material opacity juggling
    gsap.from(groupRef.current.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.4,
      ease: 'back.out(1.4)',
      delay: 0.3,
    });
    gsap.from(groupRef.current.position, {
      y: groupRef.current.position.y - 1.5,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.3,
    });
  }, []);

  // Steps 5 + 6: render loop — lerp head toward target ±20°/±10° limits
  useFrame(() => {
    if (!headBoneRef.current) return;

    const targetYaw   = isPointerActive.current ? mouse.current.x * (20 * Math.PI / 180) : 0;
    const targetPitch = isPointerActive.current ? -mouse.current.y * (10 * Math.PI / 180) : 0;

    const head = headBoneRef.current;
    const init = initialHeadRot.current;

    // 0.05 lerp factor → heavy armour inertia; no snapping
    head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, init.y + targetYaw, 0.05);
    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, init.x + targetPitch, 0.05);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Camera: spherical position from previous working session ────────────────
function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    // Exact framing that shows the knight upper-body from the right side
    const target = new THREE.Vector3(0.026311563721417866, 1.9530481113475282, 0.41684588599902234);
    const spherical = new THREE.Spherical(3.6397344714996964, 1.6859880574265205, 7.225663103256566);
    const position = new THREE.Vector3().setFromSpherical(spherical).add(target);
    camera.position.copy(position);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

// ─── Wireframe placeholder while GLB fetches ─────────────────────────────────
// Per Step 1: page never blocks on 3D load
function ModelFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.8, 2, 0.5]} />
      <meshBasicMaterial color="#ff005511" wireframe />
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
      // UI entrance timeline
      const tl = gsap.timeline({
        defaults: { ease: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
      });

      tl.from(taglineRef.current, { opacity: 0, y: 16, duration: 0.6 })
        .from(titleCharsRef.current, { y: '105%', opacity: 0, duration: 0.75, stagger: 0.035 }, '-=0.2')
        .from(lineRef.current, { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'cubic-bezier(0.165, 0.84, 0.44, 1)' }, '-=0.3')
        .from(subtitleRef.current, { opacity: 0, y: 20, duration: 0.6 }, '-=0.2')
        .from(ctaRef.current, { opacity: 0, y: 16, duration: 0.5 }, '-=0.3');

      // Canvas fades as hero scrolls out — per Step 4 scroll animation
      gsap.to(canvasWrapRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.2 },
      });

      gsap.to(blobLeftRef.current, {
        y: -80, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.2 },
      });

      gsap.to(blobRightRef.current, {
        y: -50, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: 1.8 },
      });

      gsap.to(gridRef.current, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: '40% top', scrub: true },
      });

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

  const nameChars = resumeData.personal.name.split('').map((char, i) => (
    <span key={i} className={styles.charWrap}>
      <span className={styles.char} ref={(el) => (titleCharsRef.current[i] = el)}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    </span>
  ));

  return (
    <section id="hero" className={styles.heroSection} ref={containerRef}>

      {/* ── Background decorative layers */}
      <div ref={gridRef}      className={styles.grid}      aria-hidden="true" />
      <div ref={blobLeftRef}  className={styles.blobLeft}  aria-hidden="true" />
      <div ref={blobRightRef} className={styles.blobRight} aria-hidden="true" />

      {/* ── 3D canvas — right side, behind UI, transparent bg
           Step 2 (placement): hero-right column, pointer-events none on wrapper
           Step 3 (size): min(1000px, 55vw) from CSS — large/full-column
           Step 6: dpr capped [1,2]; frameloop=always for head tracking lerp    */}
      <div ref={canvasWrapRef} className={styles.canvasContainer} aria-hidden="true">
        <Canvas
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          frameloop="always"
          camera={{ fov: 20.8, near: 0.1, far: 1000 }}
        >
          <CameraRig />

          {/* Step 5 lighting defaults */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <Environment preset="city" />

          {/* Step 1: Suspense — page never blocks */}
          <Suspense fallback={<ModelFallback />}>
            <KnightModel />
          </Suspense>
        </Canvas>
      </div>

      {/* ── UI content — left side, z-index: 1 */}
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