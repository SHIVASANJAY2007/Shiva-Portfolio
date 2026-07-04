import React, { useEffect, useRef, Suspense, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { resumeData } from '../../data/resume';

gsap.registerPlugin(ScrollTrigger);

// ── Step 1: Load GLB correctly (preload outside component per skill)
import { MODEL_URLS } from '../../constants/models';
const MODEL_URL = MODEL_URLS.knight;

function KnightModel({ scaleRef }) {
  const { scene } = useGLTF(MODEL_URL);
  const meshRef = useRef();

  // ── HEAD TRACKING IMPLEMENTATION ──
  const headBoneRef = useRef(null);
  const initialHeadRotation = useRef(new THREE.Euler());
  const isPointerActive = useRef(false);
  const globalMouse = useRef({ x: 0, y: 0 });

  // Traverse scene to find the head bone
  useEffect(() => {
    if (!scene) return;
    let found = false;
    scene.traverse((child) => {
      if (!found && child.isBone) {
        const name = child.name.toLowerCase();
        if (name.includes('head') || name.includes('neck')) {
          headBoneRef.current = child;
          initialHeadRotation.current.copy(child.rotation);
          found = true;
        }
      }
    });
  }, [scene]);

  // Track global mouse position across the whole window
  const { invalidate } = useThree();
  useEffect(() => {
    const onMouseMove = (e) => {
      isPointerActive.current = true;
      // Normalize to -1 to +1 relative to window
      globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      // Y is inverted: +1 at top, -1 at bottom
      globalMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      invalidate(); // Trigger a render frame on demand
    };

    const onMouseLeave = () => {
      isPointerActive.current = false;
      invalidate(); // Render one last frame so the head stays where it left off
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    if (navigator.maxTouchPoints === 0) isPointerActive.current = true;

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [invalidate]);

  // Smoothly interpolate head bone
  useFrame(() => {
    if (!headBoneRef.current) return;

    let targetYaw = 0;
    let targetPitch = 0;

    if (isPointerActive.current) {
      // If head rotates opposite, invert the mapping multipliers
      targetYaw = globalMouse.current.x * (20 * Math.PI / 180);
      targetPitch = -globalMouse.current.y * (10 * Math.PI / 180);
    }

    const head = headBoneRef.current;
    const initial = initialHeadRotation.current;

    const finalYaw = initial.y + targetYaw;
    const finalPitch = initial.x + targetPitch;

    // Use smooth lerp to animate towards target rotation
    // Decreased speed slightly from 0.15 to 0.10
    head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, finalYaw, 0.05);
    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, finalPitch, 0.05);

    // In frameloop="demand", useFrame doesn't run continuously unless invalidated.
    // If we want the smooth lerp to finish its interpolation even after the mouse stops,
    // we must keep invalidating until it reaches the target.
    if (Math.abs(head.rotation.y - finalYaw) > 0.001 || Math.abs(head.rotation.x - finalPitch) > 0.001) {
      invalidate();
    }
  });

  // ── Step 4: GSAP entrance animation (Opacity only to prevent position bugs on huge models)
  useEffect(() => {
    if (!meshRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Fade in from 0
    meshRef.current.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = 0;
        gsap.to(child.material, {
          opacity: 1,
          duration: 1.4,
          ease: 'power2.out',
          delay: 0.4,
        });
      }
    });
  }, []);

  return (
    <primitive
      ref={meshRef}
      object={scene}
    />
  );
}

// Component to handle exact camera positioning
function CameraRig() {
  const { camera } = useThree();

  useEffect(() => {
    const target = new THREE.Vector3(0.026311563721417866, 1.9530481113475282, 0.41684588599902234);

    const radius = 3.6397344714996964;
    const phi = 1.6859880574265205;
    const theta = 7.225663103256566;

    const spherical = new THREE.Spherical(radius, phi, theta);
    const position = new THREE.Vector3().setFromSpherical(spherical).add(target);

    camera.position.copy(position);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

// ── Step 1: Call preload outside component so it starts immediately on import
useGLTF.preload(MODEL_URL);

// Lightweight fallback (wireframe box) while GLB loads — page never blocks
function ModelFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ff005522" wireframe />
    </mesh>
  );
}

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
      // ── UI entrance timeline
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

      // ── Step 4: ScrollTrigger — canvas fades as hero exits
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

      {/* ── Step 2: 3D canvas — behind everything, transparent, no pointer interception on wrapper */}
      {/* ── Step 6: dpr capped, frameloop=demand for massive performance win */}
      <div ref={canvasWrapRef} className={styles.canvasContainer} aria-hidden="true">
        <Canvas
          gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
          dpr={[1, 2]}
          frameloop="demand"
        >
          <PerspectiveCamera
            makeDefault
            fov={20.793308254689492}
            near={0.1}
            far={1000}
          />
          <CameraRig />

          {/* ── Step 5: Standard lighting + Environment */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <Environment preset="city" />

          <Suspense fallback={<ModelFallback />}>
            <KnightModel />
          </Suspense>
        </Canvas>
      </div>

      {/* ── UI content sits on top (z-index: 1) */}
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