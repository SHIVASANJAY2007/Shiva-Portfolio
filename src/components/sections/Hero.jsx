import React, { useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { resumeData } from '../../data/resume';
import { MODEL_URLS } from '../../constants/models';

gsap.registerPlugin(ScrollTrigger);

const MODEL_URL = MODEL_URLS.knight;

// ─── Head-tracking knight model ───────────────────────
function KnightModel() {
  const { scene } = useGLTF(MODEL_URL);

  // Refs — no re-renders needed; all mutation happens inside useFrame
  const headBoneRef = useRef(null);
  const initialHeadRot = useRef(new THREE.Euler());
  const mouse = useRef({ x: 0, y: 0 });
  const isPointerActive = useRef(false);

  // Step 1 + 2: traverse scene once after load to find head/neck bone
  useEffect(() => {
    if (!scene) return;

    // Position & scale the model for the right-side split layout
    scene.position.set(0, -1.5, 0);
    scene.scale.setScalar(1.8);

    // Step 2: find head bone (never hardcoded)
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

  // Step 4: single global mouse listener — normalized coords, no allocations
  useEffect(() => {
    const onMove = (e) => {
      isPointerActive.current = true;
      // Map to [-1, +1]; Y is inverted (top = +1)
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    // Step 7: return to neutral when cursor leaves
    const onLeave = () => {
      isPointerActive.current = false;
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Step 5 + 6: render-loop — lerp head toward target, clamp within limits
  useFrame(() => {
    if (!headBoneRef.current) return;

    // When cursor is away, target returns to [0,0] = neutral pose
    const targetYaw = isPointerActive.current
      ? mouse.current.x * (20 * Math.PI / 180)   // ±20°
      : 0;
    const targetPitch = isPointerActive.current
      ? -mouse.current.y * (10 * Math.PI / 180)  // ±10°
      : 0;

    const head = headBoneRef.current;
    const init = initialHeadRot.current;

    const finalYaw = init.y + targetYaw;
    const finalPitch = init.x + targetPitch;

    // Step 6: smooth lerp — 0.05 gives "heavy armour" inertia feel
    head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, finalYaw, 0.05);
    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, finalPitch, 0.05);
  });

  return <primitive object={scene} />;
}

// ─── Camera: exact spherical position saved from theatre.js session ─────────
function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    const target = new THREE.Vector3(
      0.026311563721417866,
      1.9530481113475282,
      0.41684588599902234
    );
    const spherical = new THREE.Spherical(
      3.6397344714996964,
      1.6859880574265205,
      7.225663103256566
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

// Preload as soon as module is imported — fastest possible load
useGLTF.preload(MODEL_URL);

// Lightweight wireframe fallback shown while GLB is fetched
function ModelFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 0.6]} />
      <meshBasicMaterial color="#ff005522" wireframe />
    </mesh>
  );
}

// ─── Hero Section ─────────────────────────────────────
export const Hero = () => {
  const containerRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const titleCharsRef = useRef([]);
  const lineRef = useRef(null);
  const taglineRef = useRef(null);
  const blobLeftRef = useRef(null);
  const blobRightRef = useRef(null);
  const gridRef = useRef(null);
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
        .from(
          titleCharsRef.current,
          { y: '105%', opacity: 0, duration: 0.75, stagger: 0.035 },
          '-=0.2'
        )
        .from(
          lineRef.current,
          {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.5,
            ease: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
          },
          '-=0.3'
        )
        .from(subtitleRef.current, { opacity: 0, y: 20, duration: 0.6 }, '-=0.2')
        .from(ctaRef.current, { opacity: 0, y: 16, duration: 0.5 }, '-=0.3');

      // Canvas fades as hero exits viewport
      gsap.to(canvasWrapRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      // Blob parallax
      gsap.to(blobLeftRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to(blobRightRef.current, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.8,
        },
      });

      // Grid fade on scroll
      gsap.to(gridRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '40% top',
          scrub: true,
        },
      });

      // Content drifts up on exit
      gsap.to(containerRef.current.querySelector(`.${styles.content}`), {
        y: -60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: '20% top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const nameChars = resumeData.personal.name.split('').map((char, i) => (
    <span key={i} className={styles.charWrap}>
      <span
        className={styles.char}
        ref={(el) => (titleCharsRef.current[i] = el)}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    </span>
  ));

  return (
    <section id="hero" className={styles.heroSection} ref={containerRef}>

      {/* ── Background decorative layers */}
      <div ref={gridRef} className={styles.grid} aria-hidden="true" />
      <div ref={blobLeftRef} className={styles.blobLeft} aria-hidden="true" />
      <div ref={blobRightRef} className={styles.blobRight} aria-hidden="true" />

      {/* ── 3D canvas — right side, behind UI, transparent bg */}
      <div ref={canvasWrapRef} className={styles.canvasContainer} aria-hidden="true">
        <Canvas
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          frameloop="always"
        >
          {/* Exact camera from previous working state */}
          <CameraRig />

          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <Environment preset="city" />

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