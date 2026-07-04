import React, { useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Float, Html } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Hero.module.css';
import { resumeData } from '../../data/resume';
import { useModelLoader, preloadModel, useModelProgress } from '../../hooks/useModelLoader';

gsap.registerPlugin(ScrollTrigger);

// ── Preload immediately on module import so the model is ready by the time Hero mounts
preloadModel('knight');

// ─────────────────────────────────────────────────────────────────────────────
// KnightModel
// Loads the GLB, positions it at the exact world-space transform that the
// Theatre.js CameraRig was calibrated against, applies head-tracking and a
// GSAP material fade-in.
// ─────────────────────────────────────────────────────────────────────────────
function KnightModel() {
  // Use the shared architecture hook to load the model (handles Draco, caching, etc.)
  const { gltf } = useModelLoader('knight');
  const scene = gltf.scene;
  const meshRef = useRef();

  // ── Position model exactly where CameraRig expects it ──────────────
  // (Bounds/Center components fail on SkinnedMeshes due to GPU bone transforms)
  useEffect(() => {
    if (!scene) return;
    // Shifted x to 1.2 to push it right, shifted y to -1.8 to lower it slightly
    scene.position.set(1.2, -1.8, 0);
    scene.scale.setScalar(1.8);
  }, [scene]);

  // ── HEAD TRACKING refs ─────────────────────────────────────────────────────
  const headBoneRef = useRef(null);
  const initialHeadRotation = useRef(new THREE.Euler());
  const isPointerActive = useRef(false);
  const globalMouse = useRef({ x: 0, y: 0 });

  // ── Step 2: Traverse to find head bone and set shadows ─────────────────────
  useEffect(() => {
    if (!scene) return;
    let found = false;
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
      if (!found && child.isBone) {
        const name = child.name.toLowerCase();
        if (name.includes('head') || name.includes('neck')) {
          headBoneRef.current = child;
          initialHeadRotation.current.copy(child.rotation);
          found = true;
        }
      }
    });
    // We intentionally removed the aggressive disposal here because useGLTF caches 
    // the scene globally. Disposing it here corrupts the cache on React strict-mode 
    // re-mounts or page reloads.
  }, [scene]);

  // ── Step 3: Single global mouse/leave listener — no per-frame allocations ──
  const { invalidate } = useThree();
  useEffect(() => {
    const onMouseMove = (e) => {
      isPointerActive.current = true;
      globalMouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      globalMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      invalidate();
    };
    const onMouseLeave = () => {
      isPointerActive.current = false;
      invalidate();
    };
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    // Non-touch devices: treat as always active so head doesn't freeze
    if (navigator.maxTouchPoints === 0) isPointerActive.current = true;
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [invalidate]);

  // ── Step 4: GSAP material fade-in once model is in the scene ─────────────
  useEffect(() => {
    if (!meshRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    meshRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = 0;
        gsap.to(child.material, {
          opacity: 1,
          duration: 1.4,
          ease: 'power2.out',
          delay: 0.4,
          onUpdate: invalidate, // Trigger R3F to render the frame during animation!
        });
      }
    });
  }, [invalidate]);

  // ── Step 5: Per-frame head lerp — ±20° yaw, ±10° pitch ───────────────────
  useFrame(() => {
    if (!headBoneRef.current) return;

    let targetYaw   = 0;
    let targetPitch = 0;

    if (isPointerActive.current) {
      targetYaw   = globalMouse.current.x *  (20 * Math.PI / 180);
      targetPitch = -globalMouse.current.y * (10 * Math.PI / 180);
    }

    const head = headBoneRef.current;
    const init = initialHeadRotation.current;
    const finalYaw   = init.y + targetYaw;
    const finalPitch = init.x + targetPitch;

    // 0.05 lerp → heavy armour inertia, no snapping
    head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, finalYaw,   0.05);
    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, finalPitch, 0.05);

    // Keep invalidating while the head is still moving toward its target
    if (
      Math.abs(head.rotation.y - finalYaw)   > 0.001 ||
      Math.abs(head.rotation.x - finalPitch) > 0.001
    ) {
      invalidate();
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
    />
  );
}

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
      3.8,   // Zoomed in
      1.6859880574265205,   // phi
      7.225663103256566     // theta
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

// Lightweight wireframe — shown while the remote GLB is being downloaded
function ModelFallback() {
  const { progress } = useModelProgress();
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ff005522" wireframe />
      <Html center>
        <div style={{ color: '#FF0055', fontFamily: 'monospace', fontWeight: 'bold' }}>
          {progress.toFixed(0)}%
        </div>
      </Html>
    </mesh>
  );
}

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
          frameloop="demand" + invalidate() = only renders when something changes
          PerspectiveCamera makeDefault = CameraRig can set it imperatively     */}
      <div ref={canvasWrapRef} className={styles.canvasContainer} aria-hidden="true">
        <HeroErrorBoundary>
          <Canvas
            gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
            frameloop="demand"
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

            <Suspense fallback={<ModelFallback />}>
              <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.4}>
                <KnightModel />
              </Float>
            </Suspense>
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