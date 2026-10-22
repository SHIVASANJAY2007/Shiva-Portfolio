# Hero Section - Technical Code & Resource Extraction Guide

> **Project Context:** High-performance, 60fps magazine-style Hero section built with React, GSAP, Three.js, React Three Fiber, and Drei. Featuring a dual-mode visual engine (Interactive 3D Sculpture vs. WebGL Hyperspeed Tunnel), X-Ray glass wireframe overlay typography, real-time mouse head-tracking, dynamic role rotation, and a custom Uiverse shutter toggle.

---

## 1. Overview & Architecture

The **Hero Section** (`Hero.jsx`) serves as the central visual centerpiece of the portfolio. It combines modern magazine typography with interactive 3D web graphics:

1. **Dual Visual Modes**:
   - **Mode A (Default 3D Sculpture)**: Renders a high-detail 3D metallic knight sculpture (`knight-hd-opt.glb`) using `@react-three/fiber` and `@react-three/drei`.
   - **Mode B (Hyperspeed Mode)**: Uses custom WebGL shaders (`Hyperspeed.jsx`) to create a high-speed light-trail tunnel effect with custom color palettes.
2. **X-Ray Glass Overlay**:
   - A dual-layer typography architecture where text sits **behind** the 3D model in pure white, while an **X-Ray translucent outline layer** sits in **front** of the 3D model (`-webkit-text-stroke` + semi-transparent fill), giving an illusion of depth without obscuring metal textures.
3. **Interactive 3D Head Tracking**:
   - In 3D mode, the knight's head bone dynamically tracks global mouse movements on the screen with silky-smooth frame-rate dampening (`THREE.MathUtils.lerp`).
4. **GSAP Entrance & Parallax Scrubbing**:
   - High-performance entrance animation stagger using `gsap.timeline()` combined with scrubbed parallax scrolling via `gsap.registerPlugin(ScrollTrigger)`.
5. **Uiverse Camera Shutter Switcher**:
   - Interactive camera shutter button at the bottom right that switches background modes with a realistic camera flash animation.

---

## 2. Dependencies & Technical Requirements

### NPM Packages
```bash
npm install react react-dom gsap three @react-three/fiber @react-three/drei
```

### Font Resources (Google Fonts)
Add the following URL to your `index.html` or `@import` in CSS:
```css
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap');
```

| Font Name | Weights | Used For |
|---|---|---|
| **Bricolage Grotesque** | 400 - 800 | Main Hero Title (`SHIVA SANJAY`) & Dynamic Rotating Roles |
| **Inter** | 400 - 800 | Bio text, Status Badge, CTA Buttons, Camera Shutter Toggle |
| **JetBrains Mono** | 400, 500 | Loading Overlay & WebGL Error Boundary Telemetry |

---

## 3. Media, 3D Assets & Design Tokens

### 1. 3D Model Asset
- **File Name**: `knight-hd-opt.glb`
- **Location**: `src/components/3D/knight-hd-opt.glb`
- **Compression**: Draco 3D Geometry Compression
- **Draco Decoder CDN**: `https://www.gstatic.com/draco/versioned/decoders/1.5.6/`

### 2. Lighting & Environment Setup
- **Lighting**: `ambientLight` (intensity 0.6), `directionalLight` (intensity 1.2, shadow map 1024x1024, bias -0.0001), secondary back directional light.
- **Environment Map**: Preset `"city"` with resolution `256`.
- **Camera Configuration**: Field of view `21.68°`, near `0.1`, far `1000`, positioned at `[0, 2.05, 3.86]`.

### 3. Color Palette & Design Tokens
```css
/* Background & Obsidian Surfaces */
--bg-dark: #060606;
--surface-dark: rgba(10, 10, 15, 0.65);

/* Custom Hyperspeed / Accent Color Palettes */
--left-cars-crimson: #FF2E54;
--left-cars-purple: #A855F7;
--left-cars-pink: #EC4899;

--right-cars-cyan: #00F5D4;
--right-cars-blue: #3B82F6;
--right-cars-emerald: #10B981;

/* Status Indicator */
--status-green: #22C55E;
```

---

## 4. Key Animation Systems

1. **Staggered Text Entrance (GSAP)**:
   - Timeline with `delay: 0.8s`, animating titles from `y: 40`, `opacity: 0`, `scale: 0.98` to `y: 0`, `opacity: 1`, `scale: 1`.
2. **Scroll Parallax Engine**:
   - `ScrollTrigger` scrubs title `y` position to `-170px` (or `-150px`) and opacity to `0.35` on page scroll.
3. **Dynamic Role Rotator**:
   - Changes role text every 2800ms using a two-stage GSAP animation (`y: -18` fade out, state update, `y: 18 -> 0` fade in).
4. **Interactive 3D Head Tracking**:
   - Frame loop lerp:
     $$\text{yaw} = \text{mouse.x} \times 22^\circ \times \frac{\pi}{180}$$
     $$\text{pitch} = -\text{mouse.y} \times 12^\circ \times \frac{\pi}{180}$$
   - Applied to the `head` bone of the skeleton with `THREE.MathUtils.lerp(..., 0.14)`.
5. **Camera Flash Effect**:
   - `@keyframes flashEffect`: Quick radial white blur expansion (`opacity: 1`, `filter: blur(80px)` decaying over `0.5s`).

---

## 5. Complete Source Code Extraction

### A. `Hero.jsx` (Main Hero Component)
```jsx
import React, { useEffect, useRef, useState, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { HeroLoader } from '../3D/HeroLoader';
import { scrollToSection } from '../../lib/scrollToSection';
import Hyperspeed from '../3D/Hyperspeed';

// Preserved preset configuration for Hyperspeed background
const HYPERSPEED_PRESET_OPTIONS = {
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 30,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [12, 80],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xff2e54, 0xa855f7, 0xec4899],
    rightCars: [0x00f5d4, 0x3b82f6, 0x10b981],
    sticks: 0xff2e54
  }
};

const Knight = React.lazy(() => import('../3D/Knight').then(module => ({ default: module.Knight })));

function HeroCameraRig() {
  return (
    <PerspectiveCamera
      makeDefault
      fov={21.676747862747334}
      near={0.1}
      far={1000}
      position={[
        0.03506215468457707 + 3.705 * Math.sin(1.602) * Math.sin(-0.002),
        2.0473513037249234 + 3.705 * Math.cos(1.602),
        0.1572685070081812 + 3.705 * Math.sin(1.602) * Math.cos(-0.002)
      ]}
    />
  );
}

class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("WebGL context interrupted:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B0B0C0', fontFamily: 'monospace' }}>
          <span>Reloading GPU shaders...</span>
        </div>
      );
    }
    return this.props.children;
  }
}

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const bioRef = useRef(null);
  const roleRef = useRef(null);
  const overlayTitleRef = useRef(null);
  const overlayRoleRef = useRef(null);

  const [roleIndex, setRoleIndex] = useState(0);
  const [showBackground, setShowBackground] = useState(false);

  const rotatingRoles = [
    { left: "WEB", right: "DEVELOPER" },
    { left: "AI AUTOMATION", right: "SPECIALIST" },
    { left: "TRAINER", right: "& MENTOR" },
    { left: "SPORTSMAN", right: "KHO KHO CAPTAIN" },
    { left: "FULL-STACK", right: "ENGINEER" },
    { left: "N8N WORKFLOW", right: "ARCHITECT" },
    { left: "ODOO & SALESFORCE", right: "DEVELOPER" },
    { left: "UI/UX & REACT", right: "DESIGNER" },
    { left: "ENTERPRISE CRM", right: "INTEGRATOR" },
    { left: "PYTHON & AI", right: "SOLUTIONS" }
  ];

  // Dynamic Role Switcher Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const targets = [
        ...(roleRef.current?.children || []),
        ...(overlayRoleRef.current?.children || [])
      ];
      if (!targets.length) return;

      gsap.to(targets, {
        y: -18,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setRoleIndex((prev) => (prev + 1) % rotatingRoles.length);
          gsap.fromTo(targets,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
          );
        }
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [rotatingRoles.length]);

  // GSAP Entrance
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const titleLeft = titleRef.current?.querySelector(`.${styles.titleLeft}`) || null;
      const titleRight = titleRef.current?.querySelector(`.${styles.titleRight}`) || null;
      const overlayLeft = overlayTitleRef.current?.querySelector(`.${styles.titleLeft}`) || null;
      const overlayRight = overlayTitleRef.current?.querySelector(`.${styles.titleRight}`) || null;
      const bioChildren = bioRef.current?.children || [];

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.8
      });

      const targets = [titleLeft, titleRight, overlayLeft, overlayRight].filter(Boolean);
      if (targets.length) {
        tl.fromTo(targets, 
          { y: 40, opacity: 0, scale: 0.98 }, 
          { y: 0, opacity: 1, scale: 1, duration: 1.1, stagger: 0.15 },
          0
        );
      }

      const roleTargets = [
        ...(roleRef.current?.children || []),
        ...(overlayRoleRef.current?.children || [])
      ];
      if (roleTargets.length) {
        tl.fromTo(roleTargets,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
          0.3
        );
      }

      tl.from(bioChildren, {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85
      }, 0.4);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Parallax ScrollTrigger
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const titleTargets = [titleRef.current, overlayTitleRef.current].filter(Boolean);
      if (titleTargets.length) {
        gsap.to(titleTargets, {
          y: !showBackground ? -170 : -150,
          opacity: 0.35,
          scale: !showBackground ? 0.94 : 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (bioRef.current) {
        gsap.to(bioRef.current, {
          y: !showBackground ? -90 : -80,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "15% top",
            end: "70% top",
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [showBackground]);

  const handleCardClick = (e, targetSection) => {
    e.preventDefault();
    scrollToSection(targetSection);
  };

  const currentRole = rotatingRoles[roleIndex];

  return (
    <section id="hero" className={styles.heroSection} ref={containerRef}>
      {/* Ambient Red Glow Blobs */}
      <div className={styles.blobLeft} aria-hidden="true" />
      <div className={styles.blobRight} aria-hidden="true" />

      {/* Hyperspeed Background Layer */}
      <div className={`${styles.bgContainer} ${showBackground ? styles.bgContainerActive : ''}`}>
        {showBackground && (
          <WebGLErrorBoundary key="hyperspeed-view">
            <Hyperspeed effectOptions={HYPERSPEED_PRESET_OPTIONS} />
          </WebGLErrorBoundary>
        )}
      </div>

      {/* Background Typography (Behind 3D Canvas) */}
      <div className={`${styles.bgTypography} ${showBackground ? styles.bgTypographyMagic : styles.bgTypography3D}`} ref={titleRef}>
        <div className={`${styles.splitTitle} ${showBackground ? styles.splitTitleCenter : ''}`}>
          <h1 className={styles.titleLeft}>SHIVA</h1>
          <h1 className={styles.titleRight}>SANJAY</h1>
        </div>
        <div className={`${styles.splitSubhead} ${showBackground ? styles.splitSubheadCenter : ''}`} ref={roleRef}>
          <span className={styles.subLeft}>{currentRole.left}</span>
          <span className={styles.subRight}>{currentRole.right}</span>
        </div>
      </div>

      {/* 3D Canvas Layer */}
      {!showBackground && (
        <div className={`canvas-container ${styles.modelContainer}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}>
          <WebGLErrorBoundary key="3d-sculpture-view">
            <Canvas
              shadows
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.1,
              }}
              dpr={[1, 1.35]}
            >
              <HeroCameraRig />
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001} />
              <directionalLight position={[-5, 3, -5]} intensity={0.5} />
              <Environment preset="city" resolution={256} />

              <HeroLoader />
              <Suspense fallback={null}>
                <group>
                  <Knight />
                </group>
              </Suspense>
            </Canvas>
          </WebGLErrorBoundary>
        </div>
      )}

      {/* X-Ray Overlay Typography (In Front of 3D Canvas) */}
      {!showBackground && (
        <div className={styles.xrayOverlay} ref={overlayTitleRef} aria-hidden="true">
          <div className={styles.splitTitle}>
            <h1 className={styles.titleLeft}>SHIVA</h1>
            <h1 className={styles.titleRight}>SANJAY</h1>
          </div>
          <div className={styles.splitSubhead} ref={overlayRoleRef}>
            <span className={styles.subLeft}>{currentRole.left}</span>
            <span className={styles.subRight}>{currentRole.right}</span>
          </div>
        </div>
      )}

      {/* Foreground Bio & CTA UI */}
      <div className={`${styles.foregroundUI} ${showBackground ? styles.foregroundUIMagic : styles.foregroundUI3D}`}>
        <div className={styles.bioWidget} ref={bioRef}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>Available for real-world solutions</span>
          </div>

          <p className={styles.bioText}>
            Hey there! I'm an <strong>AI Automation Specialist</strong> and <strong>Full-Stack Developer</strong> building practical, high-impact solutions with modern web stacks, n8n workflows, Odoo, and Salesforce CRM.
          </p>

          <div className={styles.btnRow}>
            <a href="#projects" onClick={(e) => handleCardClick(e, 'projects')} className={styles.ctaButton}>
              Explore Projects
            </a>
          </div>
        </div>
      </div>

      {/* Shutter Toggle Button */}
      <div className={styles.btnWrapper}>
        <input
          id="capture-toggle"
          className={styles.btnCbox}
          type="checkbox"
          checked={showBackground}
          onChange={() => setShowBackground(!showBackground)}
        />
        <label htmlFor="capture-toggle" className={styles.btn}>
          <span className={styles.letter}>CLICK NOW</span>
          <div className={styles.shutterWrapper}>
            <span className={`${styles.shutter} ${styles.s1}`}></span>
            <span className={`${styles.shutter} ${styles.s2}`}></span>
            <span className={`${styles.shutter} ${styles.s3}`}></span>
            <span className={`${styles.shutter} ${styles.s4}`}></span>
            <span className={`${styles.shutter} ${styles.s5}`}></span>
            <span className={`${styles.shutter} ${styles.s6}`}></span>
          </div>
        </label>
        <div className={styles.flash}></div>
      </div>
    </section>
  );
};

export default Hero;
```

---

### B. `Knight.jsx` (Interactive 3D Model & Head Tracker)
```jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import knightModelUrl from './knight-hd-opt.glb?url';

function KnightModel({ scene, invalidate }) {
  const meshRef = useRef();
  const headBoneRef = useRef(null);
  const initialHeadRotation = useRef(new THREE.Euler());
  const isPointerActive = useRef(false);
  const globalMouse = useRef({ x: 0, y: 0 });
  const smoothedMouse = useRef({ x: 0, y: 0 });

  // Locate Head Bone & Apply Shadows
  useEffect(() => {
    let foundHead = false;
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
      if (!foundHead && child.isBone) {
        const name = child.name.toLowerCase();
        if (name.includes('head') || name === 'head') {
          headBoneRef.current = child;
          if (!child.userData.initialRotation) {
            child.userData.initialRotation = child.rotation.clone();
          }
          initialHeadRotation.current.copy(child.userData.initialRotation);
          child.rotation.copy(child.userData.initialRotation);
          foundHead = true;
        }
      }
    });
  }, [scene]);

  // Global Pointer Events
  useEffect(() => {
    const onMouseMove = (e) => {
      if (window.scrollY > window.innerHeight) return;
      isPointerActive.current = true;
      globalMouse.current.x = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
      globalMouse.current.y = Math.max(-1, Math.min(1, -(e.clientY / window.innerHeight) * 2 + 1));
      invalidate();
    };
    const onMouseLeave = () => {
      isPointerActive.current = false;
      invalidate();
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });

    if (navigator.maxTouchPoints === 0) isPointerActive.current = true;
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [invalidate]);

  // Frame Loop Head Rotation Dampening
  useFrame(() => {
    if (!headBoneRef.current) return;

    smoothedMouse.current.x = THREE.MathUtils.lerp(smoothedMouse.current.x, globalMouse.current.x, 0.12);
    smoothedMouse.current.y = THREE.MathUtils.lerp(smoothedMouse.current.y, globalMouse.current.y, 0.12);

    let targetYaw = 0;
    let targetPitch = 0;

    if (isPointerActive.current) {
      targetYaw = smoothedMouse.current.x * (22 * Math.PI / 180);
      targetPitch = -smoothedMouse.current.y * (12 * Math.PI / 180);
    }

    const head = headBoneRef.current;
    const init = initialHeadRotation.current;
    const finalYaw = init.y + targetYaw;
    const finalPitch = init.x + targetPitch;

    head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, finalYaw, 0.14);
    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, finalPitch, 0.14);

    if (
      Math.abs(head.rotation.y - finalYaw) > 0.0001 ||
      Math.abs(head.rotation.x - finalPitch) > 0.0001
    ) {
      invalidate();
    }
  });

  return (
    <group ref={meshRef} position={[0, -1.56, 0]} scale={1.6} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

export function Knight() {
  const { invalidate } = useThree();
  const { scene } = useGLTF(knightModelUrl, 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  return <KnightModel scene={scene} invalidate={invalidate} />;
}

useGLTF.preload(knightModelUrl, 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
```

---

### C. `Hero.module.css` (Styles & Typography Engine)
```css
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap');

.heroSection {
  position: relative;
  height: 100vh;
  min-height: 700px;
  width: 100%;
  background-color: #060606;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Ambient Glow Blobs */
.blobLeft {
  position: absolute;
  top: 25%;
  left: 10%;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 46, 84, 0.12) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  animation: floatAmbient 10s ease-in-out infinite alternate;
}

.blobRight {
  position: absolute;
  top: 35%;
  right: 10%;
  width: 550px;
  height: 550px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 46, 84, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  animation: floatAmbient 12s ease-in-out infinite alternate-reverse;
}

@keyframes floatAmbient {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(20px, -20px, 0) scale(1.1); }
}

.bgTypography {
  position: absolute;
  top: 11vh;
  width: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  user-select: none;
  padding: 0 2vw;
}

.titleLeft, .titleRight {
  font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
  font-size: clamp(3.6rem, 10.5vw, 11.8rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  line-height: 0.92;
  margin: 0;
  white-space: nowrap;
}

.splitTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 76%;
  max-width: 1380px;
  margin: 0 auto;
}

.splitSubhead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 98%;
  max-width: 1840px;
  margin: 0.6rem auto 0;
  padding: 0 1vw;
  font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
  font-size: clamp(1.5rem, 4.8vw, 5.2rem);
  font-weight: 500;
  color: #FFFFFF;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* X-Ray Translucent Ghost Layer */
.xrayOverlay {
  position: absolute;
  top: 11vh;
  width: 100%;
  z-index: 6 !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  user-select: none;
  padding: 0 2vw;
}

.xrayOverlay .titleLeft,
.xrayOverlay .titleRight {
  color: rgba(255, 255, 255, 0.25) !important;
  -webkit-text-stroke: 1.2px rgba(255, 255, 255, 0.75) !important;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.2) !important;
}

.statusBadge {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.45rem 1.15rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50px;
  margin-bottom: 1.3rem;
}

.statusDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #22c55e;
  box-shadow: 0 0 10px #22c55e;
  animation: pulseGreen 2s infinite;
}

@keyframes pulseGreen {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.ctaButton {
  background: #FFFFFF;
  color: #060606;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.88rem 2.3rem;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 6px 25px rgba(255, 255, 255, 0.25);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-block;
  cursor: pointer;
}

.ctaButton:hover {
  background: #FF2E54;
  color: #FFFFFF;
  box-shadow: 0 8px 35px rgba(255, 46, 84, 0.65);
  transform: translateY(-3px) scale(1.03);
}

/* Flash Effect */
.flash {
  position: absolute;
  inset: 0;
  border-radius: 30px / 100px;
  background: rgb(255, 255, 255);
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.btnCbox:checked + .btn + .flash {
  opacity: 1;
  animation: flashEffect 0.5s ease-out forwards;
}

@keyframes flashEffect {
  0% { opacity: 0; }
  20% { opacity: 0.7; filter: blur(40px); }
  40% { opacity: 0.5; filter: blur(20px); }
  80% { opacity: 1; filter: blur(80px); }
  100% { opacity: 0; }
}
```

---

## 6. Summary Checklist for Integration

- [x] Install `gsap`, `three`, `@react-three/fiber`, `@react-three/drei`.
- [x] Load Google Fonts (`Bricolage Grotesque`, `Inter`, `JetBrains Mono`).
- [x] Place 3D model `knight-hd-opt.glb` into `src/components/3D/`.
- [x] Copy `Hero.jsx`, `Knight.jsx`, `Hero.module.css`, and `HeroLoader/index.jsx`.
- [x] Ensure Draco decoder URL is set to `https://www.gstatic.com/draco/versioned/decoders/1.5.6/`.
